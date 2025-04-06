from pymongo import MongoClient
import os
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
DB_NAME = os.getenv("DB_NAME", "crawler_db")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
crawl_logs = db.crawl_logs
crawl_logs.create_index("link", unique=True)  # link là khóa chính

def log_crawl_result(link, source, status="success", error_message=None):
    """
    Ghi log crawl (dù thành công hay thất bại)
    """
    doc = {
        "link": link,
        "source": source,
        "status": status,
        "crawled_at": datetime.utcnow().isoformat()
    }

    if error_message:
        doc["error_message"] = error_message

    try:
        crawl_logs.update_one(
            {"link": link},
            {"$set": doc},
            upsert=True
        )
        logger.info(f"[{status.upper()}] {link}")
    except Exception as e:
        logger.error(f"Error logging crawl result: {str(e)}")

def is_already_crawled(link):
    """
    Kiểm tra bài viết đã từng crawl chưa
    """
    try:
        return crawl_logs.count_documents({"link": link}) > 0
    except Exception as e:
        logger.error(f"Error checking duplicate for {link}: {str(e)}")
        return False

def get_recent_logs(since=None):
    """
    Lấy danh sách log crawl gần đây
    """
    try:
        query = {}
        if since:
            query["crawled_at"] = {"$gte": since}
        return list(crawl_logs.find(query).sort("crawled_at", -1))
    except Exception as e:
        logger.error(f"Error fetching logs: {str(e)}")
        return []
