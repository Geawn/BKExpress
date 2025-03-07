import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Image, Button } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { getArticleDetail as getArticleDetailCache, setArticleDetail as setArticleDetailCache } from '../cache/article.js'
import { getArticleDetailAPI } from '../api/article.js'
import {formatTimeDifferenceWithCustomTZToGMT7} from '../helper/time.js'

function pubDateAndTimeDiff(pubDate) {
  const [pubDateStr, timediff] = formatTimeDifferenceWithCustomTZToGMT7(pubDate)
  return pubDateStr + ' - ' + timediff
} 

export default function DetailScreen({ route }) {
  // for back navigation
  const navigation = useNavigation();

  const { _id, source_icon, category } = route.params;
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadArticle();
  }, []);

  const loadArticle = async () => {
    setLoading(true);

    const cache = await getArticleDetailCache(category, _id)
    if (cache.content) {
      setArticle(cache)
    } else {
      const response = await getArticleDetailAPI(_id)
      setArticle(response.data)
      setArticleDetailCache(category, response.data, _id)
    }

    setLoading(false);
  };

  return (
    <>
      {/* <Button title='get cache' onPress={async () => {
        const cache = await getArticleDetailCache(category, _id)
        console.log(cache)
      }}/> */}
      {/* header */}
      <View style={{ justifyContent: 'center', backgroundColor: 'lightblue' }}>
        <AntDesign name="arrowleft" size={30} color="black"
          onPress={() => { navigation.goBack(); }}
          style={{ padding: 10, position: 'absolute', left: 0, zIndex: 1 }}
        />
        <Image source={{uri: source_icon}} style={{width: 200, height: 50, alignSelf: 'center'}} />
      </View>

      <ScrollView style={{ padding: 10}}>
        {loading ? <ActivityIndicator size="large" /> : article ? (
          <>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{article.title}</Text>
            <Text style={{ fontStyle: 'italic', marginBottom: 10 }}>Tác giả: {article.author}</Text>
            <Text style={{ fontStyle: 'italic', marginBottom: 10 }}>Ngày đăng: {pubDateAndTimeDiff(article.pubDate)}</Text>
            <Text>{article.content}</Text>
          </>
        ) : <Text>Lỗi tải dữ liệu</Text>}
      </ScrollView>
    </>
  );
}
