import axios from 'axios';
import { getBackendUrl } from '../config/backend';

const getBaseUrl = () => getBackendUrl();

// Tạo instance axios với cấu hình mặc định
const axiosInstance = axios.create({
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export const getArticleListAPI = async (category) => {
  try {
    const baseUrl = await getBaseUrl();
    console.log('Making API call to:', `${baseUrl}/articles?category=${category}`);
    const response = await axiosInstance.get(`${baseUrl}/articles?category=${category}`);
    return response;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getOlderArticlesAPI = async (category, lastPubDate) => {
  try {
    const baseUrl = await getBaseUrl();
    const encodedLastPubDate = encodeURIComponent(lastPubDate);
    const response = await axiosInstance.get(
      `${baseUrl}/articles?category=${category}&limit=10&lastPubDate=${encodedLastPubDate}&direction=older`
    );
    return response;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getArticleListSearchAPI = async (searchQuery) => {
  try {
    const baseUrl = await getBaseUrl();
    const response = await axiosInstance.get(`${baseUrl}/articles/search?search=${searchQuery}`);
    return response;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getArticleDetailAPI = async (id) => {
  try {
    const baseUrl = await getBaseUrl();
    const response = await axiosInstance.get(`${baseUrl}/articles/article-detail`, {
      params: { id }
    });
    return response;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
