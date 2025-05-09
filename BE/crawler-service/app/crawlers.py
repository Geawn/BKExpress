import feedparser
import requests
from bs4 import BeautifulSoup
from abc import ABC, abstractmethod
from datetime import datetime, timedelta
import dateutil.parser
import pytz
import logging
from .config import CATEGORY_MAPPING, ICON_MAPPING, RSS_SOURCES
import os
logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')
logger = logging.getLogger(__name__)

CRAWL_INTERVAL_MINUTES = int(os.getenv("CRAWL_INTERVAL_MINUTES", 15))

class BaseCrawler(ABC):
    def __init__(self, rss_url, category, source_name, source_id, source_url):
        self.rss_url = rss_url
        self.raw_category = category
        self.category = CATEGORY_MAPPING.get(category, "General")
        self.source_name = source_name
        self.source_id = source_id
        self.source_url = source_url
        self.timezone = pytz.timezone("Asia/Ho_Chi_Minh")
        self.last_published_time = datetime.now(self.timezone) - timedelta(days=1) 

    def fetch_rss(self):
        feed = feedparser.parse(self.rss_url)
        return feed.entries

    @abstractmethod
    def parse_article(self, article):
        pass

    def crawl(self):
        articles = self.fetch_rss()
        articles = articles[:3]  # Chỉ lấy 5 bài mới nhất
        new_articles = []

        for article in articles:
            published_time = dateutil.parser.parse(article.published)
            if published_time > self.last_published_time:
                parsed_article = self.parse_article(article)
                if parsed_article:
                    new_articles.append(parsed_article)
        if new_articles:
            self.last_published_time = dateutil.parser.parse(new_articles[0]["pubDate"])

        return new_articles

class TuoiTreCrawler(BaseCrawler):
    def parse_article(self, article):
        try:
            response = requests.get(article.link)
            soup = BeautifulSoup(response.content, "html.parser")
            title = article.title
            
            # Xử lý image_url và description từ RSS
            image_url = article.get("media_content", [{}])[0].get("url", "")
            summary = article.get("summary", None)
            description = None
            if summary:
                soup_summary = BeautifulSoup(summary, "html.parser")
                img_tag = soup_summary.find("img")
                if img_tag and not image_url:
                    image_url = img_tag.get("src", "")
                description = soup_summary.get_text().strip()

            # Xử lý thời gian
            published_time = dateutil.parser.parse(article.published)
            
            # Đảm bảo timezone được xử lý đúng
            if published_time.tzinfo is None:
                published_time = pytz.timezone('Asia/Ho_Chi_Minh').localize(published_time)
            
            # Chuyển đổi sang UTC
            pub_date_utc = published_time - timedelta(hours=7)
            pub_date_iso = pub_date_utc.isoformat()

            print(f"Original published time: {article.published}")
            print(f"Converted published time (UTC): {pub_date_iso}")

            content_div = soup.select_one(".detail-content")
            content = None
            if content_div:
                content = []
                for elem in content_div.find_all(
                    ["p", "h1", "h2", "h3", "blockquote", "img", "video", "ul", "ol"]
                ):
                    if elem.name in ["p", "h1", "h2", "h3"]:
                        content.append({"type": "text", "value": elem.get_text().strip()})
                    elif elem.name == "blockquote":
                        content.append({"type": "quote", "value": elem.get_text().strip()})
                    elif elem.name == "img":
                        content.append({
                            "type": "image",
                            "value": elem.get("src", ""),
                            "original": elem.get("data-original", ""),
                            "caption": elem.get("alt", "")
                        })
                    elif elem.name == "video":
                        content.append({"type": "video", "value": elem.get("src", "")})
                    elif elem.name in ["ul", "ol"]:
                        items = [li.get_text().strip() for li in elem.find_all("li")]
                        content.append({"type": "list", "value": items})

            return {
                "title": title,
                "link": article.link,
                "keywords": None,
                "video_url": None,
                "description": description,
                "content": content,
                "pubDate": pub_date_iso,  # Định dạng ISO 8601
                "pubDateTZ": "UTC",
                "image_url": image_url,
                "source_id": "tuoitre",
                "source_name": self.source_name,
                "source_url": self.source_url,
                "source_icon": ICON_MAPPING.get("tuoitre", 0),
                "language": "vietnamese",
                "category": self.category
            }
        except Exception as e:
            print(f"Error parsing TuoiTre article: {e}")
            return None

class VnExpressCrawler(BaseCrawler):
    def parse_article(self, article):
        try:
            response = requests.get(article.link)
            soup = BeautifulSoup(response.content, "html.parser")
            title = article.title
            
            # Xử lý image_url và description từ RSS
            image_url = soup.select_one(".thumb-art img")["src"] if soup.select_one(".thumb-art img") else ""
            summary = article.get("summary", None)
            description = None
            if summary:
                soup_summary = BeautifulSoup(summary, "html.parser")
                img_tag = soup_summary.find("img")
                if img_tag and not image_url:
                    image_url = img_tag.get("src", "")
                description = soup_summary.get_text().strip()

            # Xử lý thời gian
            published_time = dateutil.parser.parse(article.published)
            current_time = datetime.now(pytz.UTC)
            
            # Nếu thời gian trong tương lai, sử dụng thời gian hiện tại
            if published_time > current_time:
                published_time = current_time
            
            # Đảm bảo timezone được xử lý đúng
            if published_time.tzinfo is None:
                published_time = pytz.timezone('Asia/Ho_Chi_Minh').localize(published_time)
            
            # Chuyển đổi sang UTC
            pub_date_utc = published_time - timedelta(hours=7)
            pub_date_iso = pub_date_utc.isoformat()

            print(f"Original published time: {article.published}")
            print(f"Converted published time (UTC): {pub_date_iso}")

            content_div = soup.select_one(".fck_detail")
            content = None
            if content_div:
                content = []
                for elem in content_div.find_all(
                    ["p", "h1", "h2", "h3", "blockquote", "img", "video", "ul", "ol"]
                ):
                    if elem.name in ["p", "h1", "h2", "h3"]:
                        content.append({"type": "text", "value": elem.get_text().strip()})
                    elif elem.name == "blockquote":
                        content.append({"type": "quote", "value": elem.get_text().strip()})
                    elif elem.name == "img":
                        content.append({
                            "type": "image",
                            "value": elem.get("src", ""),
                            "original": elem.get("data-original", ""),
                            "caption": elem.get("alt", "")
                        })
                    elif elem.name == "video":
                        content.append({"type": "video", "value": elem.get("src", "")})
                    elif elem.name in ["ul", "ol"]:
                        items = [li.get_text().strip() for li in elem.find_all("li")]
                        content.append({"type": "list", "value": items})

            return {
                "title": title,
                "link": article.link,
                "keywords": None,
                "video_url": None,
                "description": description,
                "content": content,
                "pubDate": pub_date_iso,  # Định dạng ISO 8601
                "pubDateTZ": "UTC",
                "image_url": image_url,
                "source_id": "vnexpress",
                "source_name": self.source_name,
                "source_url": self.source_url,
                "source_icon": ICON_MAPPING.get("vnexpress", 1),
                "language": "vietnamese",
                "category": self.category
            }
        except Exception as e:
            print(f"Error parsing VnExpress article: {e}")
            return None

def initialize_crawlers(crawlers):
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
            crawlers.append(crawler)
            
crawlers = []
initialize_crawlers(crawlers)
