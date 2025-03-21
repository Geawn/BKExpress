import AsyncStorage from '@react-native-async-storage/async-storage';
import { CATEGORIES } from '../constants/article_category'

async function getArticlesList(category) {
  return AsyncStorage.getItem(`article_${category}`)
    .then((data) => {
      if (data) {
        const articleObject = JSON.parse(data); // Parse dữ liệu thành đối tượng
        // Chuyển đổi object thành array và sắp xếp
        const articleList = Object.values(articleObject);

        // Sắp xếp array theo pubDate từ mới nhất đến cũ nhất
        articleList.sort((a, b) => {
          // Giả sử pubDate là timestamp hoặc ISO string có thể so sánh trực tiếp
          // Nếu pubDate là string, cần parse ra Date object để so sánh chính xác
          const dateA = new Date(a.pubDate);
          const dateB = new Date(b.pubDate);
          return dateB - dateA; // Sắp xếp giảm dần (mới nhất đến cũ nhất)
        });

        // Chỉ trả về thông tin cơ bản cho danh sách hiển thị
        const basicArticleList = articleList.map(article => ({
          _id: article._id, // Giả sử mỗi article có thuộc tính 'id'
          title: article.title, // Lấy title
          pubDate: article.pubDate, // Lấy pubDate
          pubDateTZ: article.pubDateTZ, // Lấy pubDateTZ
          image_url: article.image_url, // Lấy ảnh đại diện
          source_icon: article.source_icon, // Lấy icon của nguồn tin
          // Thêm các thông tin cơ bản khác bạn muốn hiển thị ở list (ví dụ: summary, author, ...)
        }));

        return basicArticleList; // Trả về danh sách bài viết với thông tin cơ bản
      }
      return [];
    })
    .catch((error) => {
      console.error(error);
      return [];
    });
}

async function addArticleToList(category, newArticleList) {
  currentArticles = await AsyncStorage.getItem(`article_${category}`) // Lấy cache hiện tại (là một đối tượng {})

  if (currentArticles) {
    currentArticles = JSON.parse(currentArticles)
  } else {
    currentArticles = {}
  }

  newArticleList.forEach((article) => {
    if (currentArticles[article._id]) {
      if (!currentArticles[article._id].content) { // the article is not in full version
        currentArticles[article._id] = article; // Thêm hoặc cập nhật bài viết theo ID
      }
    } else {
      currentArticles[article._id] = article
    }
  })


  await AsyncStorage.setItem(`article_${category}`, JSON.stringify(currentArticles)); // Lưu lại cache đã cập nhật
}

async function getArticleDetail(category, id) {
  return AsyncStorage.getItem(`article_${category}`)
    .then((data) => {
      if (data) {
        return JSON.parse(data)[id]; // Trả về thông tin chi tiết của bài viết theo ID
      }
      return {};
    })
    .catch((error) => {
      console.error(error);
      return {};
    });
}

async function setArticleDetail(category, newArticleDetail, id) {
  return AsyncStorage.getItem(`article_${category}`)
    .then((data) => {
      if (data) {
        targetedArticle = JSON.parse(data); // Trả về thông tin chi tiết của bài viết theo ID
        targetedArticle[id] = newArticleDetail
        return AsyncStorage.setItem(`article_${category}`, JSON.stringify(targetedArticle));
      }
      return {};
    })
    .catch((error) => {
      console.error(error);
      return {};
    });
}

async function clearCache() {
  CATEGORIES.forEach(async (category) => {
    await AsyncStorage.setItem(`article_${category[0]}`, '')
  })

}

export { getArticlesList, addArticleToList, getArticleDetail, setArticleDetail, clearCache };