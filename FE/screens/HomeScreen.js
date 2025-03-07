import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Image, Button } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import axios from 'axios';
import { getArticleListAPI } from '../api/article.js';
import { CATEGORIES } from '../constants/article_category.js';
import { getArticlesList, addArticleToList, clearCache } from '../cache/article.js'
import {formatTimeDifferenceWithCustomTZToGMT7} from '../helper/time.js'

// Khởi tạo state articles bằng reduce()
const initialArticlesState = CATEGORIES.reduce((accumulator, category) => {
  accumulator[category[0]] = []; // Gán mảng rỗng cho mỗi category
  return accumulator;
}, {}); // Giá trị khởi tạo của accumulator là một object rỗng {}

function pubDateAndTimeDiff(pubDate) {
  const [pubDateStr, timediff] = formatTimeDifferenceWithCustomTZToGMT7(pubDate)
  return pubDateStr + '\n' + timediff
}

// "_id": "67bc2f4ac9c0f77ccf87ae81",
// "title": "Người dùng tháo chạy, Bybit thiệt hại 5 tỉ USD sau vụ hack lớn nhất lịch sử",
// "description": "Vụ hack hơn 1,4 tỉ USD đã giáng đòn nặng nề vào Bybit khi người dùng ồ ạt rút tiền khiến mức thiệt hại của sàn lên đến 5,3 tỉ USD.",
// "pubDate": "2025-02-23T03:46:00.000Z",
// "image_url": "https://images2.thanhnien.vn/zoom/600_315/528068263637045248/2025/2/23/bybit-bi-hack-lon-nhat-lich-su-crypto-1740274816813652651336-80-0-1354-2038-crop-17402748269181606889994.png",
// "source_icon": "https://i.bytvi.com/domain_icons/thanhnien_vn.png"

export default function HomeScreen({ navigation }) {
  const [articles, setArticles] = useState(initialArticlesState);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0][0]);

  useEffect(() => {
    loadNews();
  }, [selectedCategory]);

  const articleItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('Detail', { _id: item._id, category: selectedCategory, source_icon: item.source_icon })}
        style={{ padding: 10, borderBottomWidth: 1, flex: 1, flexDirection: 'row', height: 120, gap: 10 }}>
        <Image source={{ uri: item.image_url }}
          style={{ aspectRatio: 1, width: 100 }}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ flex: 6, fontSize: 16 }}>{item.title}</Text>
          <View style={{ flex: 4, flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Image source={{ uri: item.source_icon }} style={{ aspectRatio: 4, flex: 2 }} />
            <View style={{ flex: 3 }}>
              <Text
                style={{ color: 'gray' }}
              >{pubDateAndTimeDiff(item.pubDate)}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const loadNews = async () => {
    setLoading(true);

    if (articles[selectedCategory].length === 0) {
      try {
        const response = await getArticleListAPI(selectedCategory);

        // update articles to 'articles' state
        const updatedArticles = { ...articles };
        updatedArticles[selectedCategory] = response.data;
        setArticles(updatedArticles)

        // set 'filteredArticles' state
        setFilteredArticles(updatedArticles[selectedCategory])

        // update cache
        await addArticleToList(selectedCategory, response.data)
      } catch (error) {
        const cache = await getArticlesList(selectedCategory)

        // update articles to 'articles' state
        const updatedArticles = { ...articles };
        updatedArticles[selectedCategory] = cache;
        setArticles(updatedArticles)

        // set 'filteredArticles' state
        setFilteredArticles(updatedArticles[selectedCategory])

        console.error(error);
      }
    } else {
      // set 'filteredArticles' state
      setFilteredArticles(articles[selectedCategory])
    }

    // setSearchQuery('')

    setLoading(false);
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
    setLoading(true);

    // clear articles of 'articles' state
    const updatedArticles = { ...articles };
    updatedArticles[selectedCategory] = [];
    setArticles(updatedArticles)

    setSearchQuery('')
    await loadNews();
    setLoading(false)
  };

  return (
    <>
      {/* <Button title='clear cache' onPress={clearCache} style={{
        alignItems: 'flex-start', width: '100'
      }}/>
      <Button title='get cache' onPress={async () => {
        const cache = await getArticlesList(selectedCategory)
        console.log(cache)
      }}/> */}
      {/* header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'lightblue' }}>
        <AntDesign name="bars" size={30} color="black"
          onPress={() => {
            console.log('sidebar open')
          }}
          style={{ padding: 10 }}
        />
        <FlatList
          horizontal
          data={CATEGORIES}
          keyExtractor={(item) => item[0]}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedCategory(item[0])}
              style={{ padding: 10, backgroundColor: selectedCategory === item[0] ? 'blue' : 'gray', marginRight: 5, flex: 1, justifyContent: 'center', alignItems: 'center', minWidth: 50 }}>
              <Text style={{ color: 'white' }}>{item[1]}</Text>
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
          keyExtractor={(item) => item._id}
          onRefresh={handleRefresh}
          refreshing={loading}
          renderItem={articleItem}
        />
      </View>
    </>
  );
}
