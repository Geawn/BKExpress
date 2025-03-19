# config.py
RSS_SOURCES = {
    "tuoitre": {
        "base_url": "https://tuoitre.vn/rss/",
        "feeds": {
            "tong-hop": "tin-moi-nhat.rss",
            "thoi-su": "thoi-su.rss",
            "the-gioi": "the-gioi.rss",
            "kinh-te": "kinh-doanh.rss",
            "phap-luat": "phap-luat.rss",
            # Thêm các danh mục khác nếu cần
        }
    },
    "vnexpress": {
        "base_url": "https://vnexpress.net/rss/",
        "feeds": {
            "tong-hop": "tin-moi.rss",
            "thoi-su": "thoi-su.rss",
            "the-gioi": "the-gioi.rss",
            "kinh-te": "kinh-doanh.rss",
            "phap-luat": "phap-luat.rss",
            # Thêm các danh mục khác nếu cần
        }
    }
}

CATEGORY_MAPPING = {
    "tong-hop": "General",
    "tin-moi": "News",
    "thoi-su": "News",  # Hoặc "Politics" tùy ngữ cảnh
    "the-gioi": "World",
    "kinh-doanh": "Economy",
    "kinh-te": "Economy",
    "phap-luat": "Politics",  # Có thể là "Law" nếu muốn thêm
    # Thêm các ánh xạ khác nếu cần
}

ICON_MAPPING = {
    "tuoitre": 0,
    "vnexpress": 1,
    # Thêm các icon khác nếu cần
}

# config.py
API_ENDPOINT = "http://localhost:3000/articles"  # Điều chỉnh port nếu NestJS dùng port khác (thường là 3000)
REFRESH_INTERVAL = 15 * 60  # 15 phút (tính bằng giây)