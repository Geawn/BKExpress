# Sử dụng image Python 3.9 slim làm base
FROM python:3.9-slim

# Đặt thư mục làm việc
WORKDIR /app

# Sao chép file requirements.txt và cài dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Sao chép toàn bộ mã nguồn
COPY . .

# Thiết lập biến môi trường (tùy chọn, có thể ghi đè bằng .env)
ENV PYTHONUNBUFFERED=1

# Chạy ứng dụng
CMD ["python", "run.py"]