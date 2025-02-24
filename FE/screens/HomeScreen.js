import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const CATEGORIES = ['Tin nóng', 'Thể thao', 'Giáo dục', 'Công nghệ', 'Giải trí', 'Xe', 'Đời sống', 'Ẩm thực'];

export default function HomeScreen({ navigation }) {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    setLoading(true);
    const cache = await AsyncStorage.getItem('news');
    if (cache) {
      setArticles(JSON.parse(cache));
      setFilteredArticles(JSON.parse(cache));
      setLoading(false);
    } else {
      try {
        const response = await axios.get('http://192.168.1.5:3000/news');
        setArticles(response.data);
        setFilteredArticles(response.data);
        await AsyncStorage.setItem('news', JSON.stringify(response.data));
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    }
  };

  const handleSearch = async (text) => {
    setSearchQuery(text);
    if (text.length > 0) {
      try {
        const response = await axios.get(`https://api.example.com/search?q=${text}`);
        setFilteredArticles(response.data);
      } catch (error) {
        console.error(error);
      }
    } else {
      setFilteredArticles(articles);
    }
  };

  const handleRefresh = async () => {
    await AsyncStorage.removeItem('news');
    loadNews();
  };

  return (
    <>
      {/* header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'lightblue' }}>
        <AntDesign name="bars" size={30} color="black"
          onPress={() => { console.log('sidebar open') }}
          style={{ padding: 10 }}
        />
        <FlatList
          horizontal
          data={CATEGORIES}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedCategory(item)}
              style={{ padding: 10, backgroundColor: selectedCategory === item ? 'blue' : 'gray', marginRight: 5, flex: 1, justifyContent: 'center', alignItems: 'center', minWidth: 50 }}>
              <Text style={{ color: 'white' }}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={{ padding: 10, flex: 1 }}>
        <TextInput
          placeholder="Tìm kiếm bài báo..."
          value={searchQuery}
          onChangeText={handleSearch}
          style={{ borderWidth: 1, padding: 8, marginVertical: 10 }}
        />
        {loading ? <ActivityIndicator size="large" /> : null}

        <FlatList
          data={filteredArticles}
          keyExtractor={(item) => item.id.toString()}
          onRefresh={handleRefresh}
          refreshing={loading}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Detail', { id: item.id })}
              style={{ padding: 10, borderBottomWidth: 1 }}>
              <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
              <Text>{item.author}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </>
  );
}
