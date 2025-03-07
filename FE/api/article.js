import axios from 'axios';

async function getArticleListAPI(category) {
    const articles = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND_URL}/articles?category=${category}`)
    return articles
}

async function getArticleDetailAPI() {

}

export { getArticleListAPI, getArticleDetailAPI }