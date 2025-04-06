# Sử dụng image Node.js 18 làm base
FROM node:18-alpine

# Đặt thư mục làm việc
WORKDIR /app

# Sao chép package.json và package-lock.json (nếu có)
COPY package*.json ./

# Cài dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn
COPY . .

# Build ứng dụng NestJS
RUN npm run build

# Chạy ứng dụng
CMD ["npm", "run", "start:prod"]