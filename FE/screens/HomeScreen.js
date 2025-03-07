import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Image, Button } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import axios from 'axios';
import { getArticleListAPI } from '../api/article.js';
import { CATEGORIES } from '../constants/article_category.js';
import { getArticlesList, addArticleToList, clearCache } from '../cache/article.js'

// Khởi tạo state articles bằng reduce()
const initialArticlesState = CATEGORIES.reduce((accumulator, category) => {
  accumulator[category[0]] = []; // Gán mảng rỗng cho mỗi category
  return accumulator;
}, {}); // Giá trị khởi tạo của accumulator là một object rỗng {}

function formatTimeDifferenceWithCustomTZToGMT7(pubDate, pubDateTZ) {
  /**
   * Converts a given publication date and timezone to a human-readable time difference string,
   * converting the time to GMT+7 (Vietnam time).
   *
   * @param {string} pubDate The publication date and time in ISO 8601 format (e.g., "2025-02-23T03:46:00.000Z").
   * @param {string} pubDateTZ The timezone of the publication date (e.g., "UTC", "+03:00", "-05:00").
   * @returns {string} A string representing the time difference in a human-readable format.
   * e.g., "hh:mm:ss-dd-mm-yyyy 17 seconds ago", "hh:mm:ss-dd-mm-yyyy 20 minutes ago".
   */

  const pubDateObj = new Date(pubDate);
  const now = new Date();

  // Parse pubDateTZ to get the offset in hours
  let pubDateOffsetHours = 0;
  if (pubDateTZ === "UTC" || pubDateTZ === "Z") {
    pubDateOffsetHours = 0;
  } else {
    const sign = pubDateTZ[0] === "+" ? 1 : -1;
    const hours = parseInt(pubDateTZ.substring(1, 3));
    const minutes = parseInt(pubDateTZ.substring(4, 6));
    pubDateOffsetHours = sign * (hours + minutes / 60);
  }

  // Convert pubDate to GMT+7
  const pubDateGMT7 = new Date(pubDateObj.getTime() + (7 - pubDateOffsetHours) * 60 * 60 * 1000);

  // Convert 'now' to GMT+7
  const nowGMT7 = new Date(now.getTime() + 7 * 60 * 60 * 1000);

  const timeDiff = nowGMT7 - pubDateGMT7;

  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  const pubDateStr = pubDateGMT7.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }) + ' ' + pubDateGMT7.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }) + '\n';

  if (seconds < 60) {
    return `${pubDateStr} ${seconds} giây trước`;
  } else if (minutes < 60) {
    return `${pubDateStr} ${minutes} minutes ago`;
  } else if (hours < 24) {
    return `${pubDateStr} ${hours} hours ago`;
  } else if (days < 7) {
    return `${pubDateStr} ${days} ngày trước`;
  } else if (weeks < 4) {
    return `${pubDateStr} ${weeks} weeks ago`;
  } else if (months < 12) {
    return `${pubDateStr} ${months} months ago`;
  } else {
    return `${pubDateStr} ${years} years ago`;
  }
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
              {/* <Text
                style={{ color: 'gray' }}
              >{formatTimeDifferenceWithCustomTZToGMT7(item.pubDate, item.pubDateTZ)}</Text> */}
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
      <Button title='clear cache' onPress={clearCache} style={{
        alignItems: 'flex-start', width: '100'
      }}/>
      <Button title='get cache' onPress={async () => {
        const cache = await getArticlesList(selectedCategory)
        console.log(cache)
      }}/>
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
