from flask import Flask
from apscheduler.schedulers.background import BackgroundScheduler
from dotenv import load_dotenv
import os
import logging

load_dotenv()

app = Flask(__name__)
scheduler = BackgroundScheduler()

logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')
logger = logging.getLogger(__name__)

from .crawlers import crawlers
from .db import is_already_crawled, log_crawl_result
from .kafka_producer import send_article_to_kafka

CRAWL_INTERVAL_MINUTES = int(os.getenv("CRAWL_INTERVAL_MINUTES", 15))

def crawl_and_store():
    for crawler in crawlers:
        logger.info(f"Crawling {crawler.source_name}")
        articles = crawler.crawl()
        success, fail = 0, 0

        for article in articles:
            try:
                if is_already_crawled(article["link"]):
                    logger.info(f"Skipped (duplicate): {article['link']}")
                    continue

                # Gửi bài viết sang Kafka
                send_article_to_kafka(article)

                # Log kết quả crawl
                log_crawl_result(
                    link=article["link"],
                    source=article.get("source", crawler.source_name),
                    status="success"
                )
                success += 1

            except Exception as e:
                logger.error(f"Failed to process {article['link']}: {str(e)}")
                log_crawl_result(
                    link=article["link"],
                    source=article.get("source", crawler.source_name),
                    status="fail",
                    error_message=str(e)
                )
                fail += 1

        logger.info(f"[{crawler.source_name}] Crawl done. Success: {success}, Fail: {fail}")

def start_crawling():
    scheduler.add_job(
        crawl_and_store,
        'interval',
        minutes=CRAWL_INTERVAL_MINUTES,
        id='crawl_job',
        max_instances=1,
        misfire_grace_time=900
    )
    scheduler.start()
    crawl_and_store()  # Run once immediately
    logger.info(f"Crawling scheduled every {CRAWL_INTERVAL_MINUTES} minutes")

def create_app():
    start_crawling()
    return app
