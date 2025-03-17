# main.py
import threading
import time
from crawler import TuoiTreCrawler, VnExpressCrawler
from config import RSS_SOURCES, REFRESH_INTERVAL, API_ENDPOINT
from utils import send_to_server

def run_crawler(crawler):
    while True:
        try:
            articles = crawler.crawl()
            if articles:
                send_to_server(articles, API_ENDPOINT)
            time.sleep(REFRESH_INTERVAL)
        except Exception as e:
            print(f"Error in crawler thread: {e}")
            break

def main():
    threads = []
    for source_name, source_config in RSS_SOURCES.items():
        for category, rss_feed in source_config["feeds"].items():
            rss_url = source_config["base_url"] + rss_feed
            if source_name == "tuoitre":
                crawler = TuoiTreCrawler(
                    rss_url, category, "Báo Tuổi Trẻ", "tuoitre", "https://tuoitre.vn"
                )
            elif source_name == "vnexpress":
                crawler = VnExpressCrawler(
                    rss_url, category, "VnExpress", "vnexpress", "https://vnexpress.net"
                )
            thread = threading.Thread(target=run_crawler, args=(crawler,))
            thread.daemon = True  # Đặt thread là daemon
            threads.append(thread)
            thread.start()

    # Giữ chương trình chính chạy
    try:
        while True:
            time.sleep(1)  # Giữ main thread sống
    except KeyboardInterrupt:
        print("Stopping program...")

if __name__ == "__main__":
    main()