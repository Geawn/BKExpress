import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function DetailScreen({ route }) {
  const { id } = route.params;
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadArticle();
  }, []);

  const loadArticle = async () => {
    setLoading(true);
    const cache = await AsyncStorage.getItem(`news_${id}`);
    if (cache) {
      setArticle(JSON.parse(cache));
      setLoading(false);
    } else {
      try {
        const response = await axios.get(`http://192.168.1.5:3000/news/${id}`);
        setArticle(response.data);
        await AsyncStorage.setItem(`news_${id}`, JSON.stringify(response.data));
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ padding: 10 }}>
      {loading ? <ActivityIndicator size="large" /> : article ? (
        <>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{article.title}</Text>
          <Text style={{ fontStyle: 'italic', marginBottom: 10 }}>Tác giả: {article.author}</Text>
          <Text>{article.content}</Text>
        </>
      ) : <Text>Lỗi tải dữ liệu</Text>}
    </ScrollView>
  );
}
