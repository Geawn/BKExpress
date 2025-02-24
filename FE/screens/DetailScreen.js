import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function DetailScreen({ route }) {
  // for back navigation
  const navigation = useNavigation();

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
    <>
      {/* header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'lightblue' }}>
        <AntDesign name="arrowleft" size={30} color="black"
          onPress={() => { navigation.goBack(); }}
          style={{ padding: 10 }}
        />
        {/* logo here */}
        
      </View>

      <ScrollView style={{ padding: 10 }}>
        {loading ? <ActivityIndicator size="large" /> : article ? (
          <>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{article.title}</Text>
            <Text style={{ fontStyle: 'italic', marginBottom: 10 }}>Tác giả: {article.author}</Text>
            <Text>{article.content}</Text>
          </>
        ) : <Text>Lỗi tải dữ liệu</Text>}
      </ScrollView>
    </>
  );
}
