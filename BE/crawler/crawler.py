# crawler.py
import feedparser
import requests
from bs4 import BeautifulSoup
from abc import ABC, abstractmethod
from datetime import datetime, timedelta
import dateutil.parser
import pytz
from config import CATEGORY_MAPPING

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
        articles = articles[:2]  # Chỉ lấy 5 bài báo mới nhất
        new_articles = []

        for article in articles:
            published_time = dateutil.parser.parse(article.published)
            if published_time > self.last_published_time:
                parsed_article = self.parse_article(article)
                if parsed_article:
                    new_articles.append(parsed_article)
                    if published_time > self.last_published_time:
                        self.last_published_time = published_time

        return new_articles

class TuoiTreCrawler(BaseCrawler):
    def parse_article(self, article):
        try:
            response = requests.get(article.link)
            soup = BeautifulSoup(response.content, "html.parser")
            title = article.title
            image_url = article.get("media_content", [{}])[0].get("url", "")
            content_div = soup.select_one(".detail-content")
            content = None
            if content_div:
                content = []
                for elem in content_div.find_all(["p", "img"], recursive=False):
                    if elem.name == "p":
                        content.append({"type": "text", "value": elem.get_text().strip()})
                    elif elem.name == "img":
                        content.append({"type": "image", "value": elem["src"]})
            description = article.get("summary", None)
            return {
                "title": title,
                "link": article.link,
                "keywords": None,
                "video_url": None,
                "description": description,
                "content": content,
                "pubDate": article.published,
                "pubDateTZ": "UTC",
                "image_url": image_url,
                "source_id": "tuoitre",
                "source_name": self.source_name,
                "source_url": self.source_url,
                "source_icon": None,
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
            image_url = soup.select_one(".thumb-art img")["src"] if soup.select_one(".thumb-art img") else ""
            content_div = soup.select_one(".fck_detail")
            content = None
            if content_div:
                content = []
                for elem in content_div.find_all(["p", "img"], recursive=False):
                    if elem.name == "p":
                        content.append({"type": "text", "value": elem.get_text().strip()})
                    elif elem.name == "img":
                        content.append({"type": "image", "value": elem["src"]})
            description = article.get("summary", None)
            return {
                "title": title,
                "link": article.link,
                "keywords": None,
                "video_url": None,
                "description": description,
                "content": content,
                "pubDate": article.published,
                "pubDateTZ": "UTC",
                "image_url": image_url,
                "source_id": "vnexpress",
                "source_name": self.source_name,
                "source_url": self.source_url,
                "source_icon": None,
                "language": "vietnamese",
                "category": self.category
            }
        except Exception as e:
            print(f"Error parsing VnExpress article: {e}")
            return None