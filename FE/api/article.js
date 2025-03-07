import axios from 'axios';

async function getArticleListAPI(category) {
    const articles = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND_URL}/articles?category=${category}`)
    return articles
}

async function getArticleDetailAPI(id) {
    try {
        const article = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND_URL}/articles/article-detail`, {
            params: {id}
        })
        return article
    } catch (error) {
        console.log(error)
    }
}

export { getArticleListAPI, getArticleDetailAPI }