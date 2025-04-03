import * as SecureStorage from 'expo-secure-store';

async function loadUserInfo() {
  try {
    const userInfo = await SecureStorage.getItemAsync('userInfo');
    if (userInfo) {
      return JSON.parse(userInfo); // Parse dữ liệu thành đối tượng
    } else {
      return null; // Trả về null nếu không tìm thấy thông tin người dùng
    }
  } catch (error) {
    console.error("Error loading user info:", error);
  }
}

async function saveUserInfo(userInfo) {
  try {
    await SecureStorage.setItemAsync('userInfo', JSON.stringify(userInfo));
  } catch (error) {
    console.error("Error saving user info:", error);
  }
}

async function deleteUserInfo() {
  try {
    await SecureStorage.deleteItemAsync('userInfo');
  } catch (error) {
    console.error("Error deleting user info:", error);
  }
}

export { loadUserInfo, saveUserInfo };