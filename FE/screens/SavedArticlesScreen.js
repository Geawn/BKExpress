import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Button, ActivityIndicator } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';

import ArticleItem from "../components/ArticleItem";

import { getArticleDetailAPI } from '../api/article.js'

import { getArticleDetail } from "../cache/article";

import { useSelector } from "react-redux";

export default function SavedArticlesScreen({ navigation }) {
  const [savedArticlesRender, setSavedArticlesRender] = useState([]);
  const [loading, setLoading] = useState(false);

  const { savedArticles } = useSelector((state) => state.user)

  useEffect(() => {
    const loadArticles = async () => {
      setLoading(true);
      try {
        const articlesArray = Object.keys(savedArticles).map(_id => ({
          _id,
          category: savedArticles[_id].category,
          time: savedArticles[_id].time
        }));
        
        // Sort by time (newest first)
        articlesArray.sort((a, b) => {
          return new Date(b.time) - new Date(a.time);
        });

        const savedArticlesSorted = articlesArray;
        let acc = []
        for (const art of savedArticlesSorted) {
          const article = await getArticleDetail(art.category, art._id);
          if (article.title) {
            // the article is in cache
            article.category = art.category; // Add category to the article object
            acc.push(article)
          } else {
            // fetch the article from API
            try {
              const response = await getArticleDetailAPI(_id)
              response.data.category = art.category; // Add category to the article object
              acc.push(response.data)
            } catch (error) {
              console.error("Error fetching article detail:", error);
            }
          }
        }
        setSavedArticlesRender(acc);
        setLoading(false);
      } catch (error) {
        console.error("Error loading saved articles:", error);
        setLoading(false);
      }
    }
    loadArticles();
  }, [savedArticles]);

  return (
    <>
      <View style={styles.header}>
        {/* Back button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>Bài viết đã lưu</Text>
      </View>

      {/* Phần nội dung chính */}
      <View style={{ padding: 10, flex: 1 }}>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList
            data={savedArticlesRender}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <ArticleItem
                item={item}
                navigation={navigation} // Pass the navigation prop here
                selectedCategory={item.category} // Pass additional props if needed
              />
            )}
          />
        )}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'lightblue',
  },
  backButton: {
    position: 'absolute',
    left: 15,
  },
  title: {
    fontSize: 20,
    color: 'black',
  },
})