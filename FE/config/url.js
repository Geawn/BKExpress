// Chế độ development: true - URL ban đầu trống, false - lấy URL từ .env
const isDevelopment = false;

export const useDevBackendUrl = () => isDevelopment;

export const getBackendUrl = () => {
  if (isDevelopment) {
    return ''; // Trả về URL rỗng trong chế độ development
  }
  return process.env.EXPO_PUBLIC_BACKEND_URL || ''; // Lấy URL từ .env trong production
};

// Khi chuyển sang production, chỉ cần set isDevelopment = false
// và đặt EXPO_PUBLIC_BACKEND_URL trong file .env 