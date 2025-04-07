import { Injectable, Inject } from "@nestjs/common";
import { Cache } from "cache-manager";

@Injectable()
export class RedisService {
  constructor(@Inject("CACHE_MANAGER") private cacheManager: Cache) {}

  // Lấy dữ liệu từ cache
  async get<T>(key: string): Promise<T | null> {
    return await this.cacheManager.get<T>(key);
  }

  // Lưu dữ liệu vào cache (mặc định 5 phút)
  async set<T>(key: string, value: T, ttl = 300): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  // Xóa cache
  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  // // Xóa nhiều cache theo pattern (không hỗ trợ trực tiếp trong cache-manager)
  // async flushPrefix(prefix: string): Promise<void> {
  //   // Cần triển khai thêm nếu Redis hỗ trợ scan keys
  //   console.warn(`flushPrefix chưa được triển khai!`);
  // }
}
