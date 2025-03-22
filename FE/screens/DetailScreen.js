import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Image, Button, Linking, TouchableOpacity } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { getArticleDetail as getArticleDetailCache, setArticleDetail as setArticleDetailCache } from '../cache/article.js'
import { getArticleDetailAPI } from '../api/article.js'
import {formatTimeDifferenceWithCustomTZToGMT7} from '../helper/time.js'
import ErrorPopup from '../components/ErrorPopup';

function pubDateAndTimeDiff(pubDate) {
  const [_, timediff] = formatTimeDifferenceWithCustomTZToGMT7(pubDate)
  return timediff
} 

function stripHtmlTags(html) {
  if (!html) return '';
  return html.replace(/<\/?[^>]+(>|$)/g, '');
}

export default function DetailScreen({ route }) {
  // for back navigation
  const navigation = useNavigation();

  const { _id, source_icon, category } = route.params;
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    loadArticle();
  }, []);

  const loadArticle = async () => {
    setLoading(true);

    // First try to get from cache
    try {
      const cache = await getArticleDetailCache(category, _id)
      if (cache.content) {
        // If we have cache, use it first
        setArticle({...cache, source_icon: source_icon})
      }
      
      // Always try to get fresh data from API
      try {
        const response = await getArticleDetailAPI(_id)
        const articleWithSourceIcon = {...response.data, source_icon: source_icon}
        setArticle(articleWithSourceIcon)
        setArticleDetailCache(category, articleWithSourceIcon, _id)
        setShowError(false);
      } catch (apiError) {
        // Show error popup for API failure
        console.error('Error loading article from API:', apiError);
        setShowError(true);
      }
    } catch (cacheError) {
      // If cache fails, try API directly
      try {
        const response = await getArticleDetailAPI(_id)
        const articleWithSourceIcon = {...response.data, source_icon: source_icon}
        setArticle(articleWithSourceIcon)
        setArticleDetailCache(category, articleWithSourceIcon, _id)
        setShowError(false);
      } catch (apiError) {
        // Show error popup for API failure
        console.error('Error loading article from API:', apiError);
        setShowError(true);
      }
    }

    setLoading(false);
  };

  // Thêm useEffect để log khi article thay đổi
  useEffect(() => {
    console.log('DetailScreen - Current article source_icon:', article?.source_icon);
  }, [article]);

  const renderContent = (content) => {
    if (!content) return null;
    
    return content.map((item, index) => {
      if (item.type === 'text') {
        return (
          <Text key={index} style={{ 
            marginBottom: 15,
            fontSize: 16, 
            lineHeight: 24,
            color: '#333'
          }}>
            {item.value}
          </Text>
        );
      }
      // Add more content type handlers here if needed
    });
  };

  return (
    <>
      {/* <Button title='get cache' onPress={async () => {
        const cache = await getArticleDetailCache(category, _id)
        console.log(cache)
      }}/> */}
      {/* header */}
      <View style={{ 
        justifyContent: 'center', 
        backgroundColor: 'lightblue',
        paddingVertical: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      }}>
        <AntDesign name="arrowleft" size={30} color="black"
          onPress={() => { navigation.goBack(); }}
          style={{ padding: 10, position: 'absolute', left: 0, zIndex: 1 }}
        />
        <Image 
          source={
            (() => {
              if (article?.source_icon == 0) {
                print("dcm",article?.source_icon);
                return require('../icon/tuoitre.jpg');
              } else {
                return require('../icon/vnexpress.jpg');
              }
            })()
          }
          style={{width: 200, height: 50, alignSelf: 'center', resizeMode: 'contain'}} 
        />
      </View>

      <ScrollView style={{ padding: 15 }}>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : article ? (
          <>
            {/* Title */}
            <Text style={{ 
              fontSize: 26, 
              fontWeight: 'bold', 
              marginBottom: 20,
              color: '#1a1a1a',
              lineHeight: 32
            }}>
              {article.title}
            </Text>

            {/* Author and Date */}
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              marginBottom: 20,
              borderBottomWidth: 1,
              borderBottomColor: '#eee',
              paddingBottom: 10
            }}>
             {/* <Text style={{ fontStyle: 'italic', color: '#666' }}>
                  Tác giả: {article.author || 'Không xác định'}
                </Text>*/}
                <Text style={{ fontStyle: 'italic', color: '#666' }}>
                  {pubDateAndTimeDiff(article.pubDate)}
                </Text>
              </View>

              {/* Category and Tags */}
              <View style={{ 
                flexDirection: 'row', 
                flexWrap: 'wrap', 
                marginBottom: 20,
                backgroundColor: '#f5f5f5',
                padding: 10,
                borderRadius: 5
              }}>
                <Text style={{ fontWeight: 'bold', marginRight: 10 }}>Chuyên mục:</Text>
                <Text style={{ color: '#444' }}>{article.category?.name}</Text>
                {article.keywords && (
                  <>
                    <Text style={{ fontWeight: 'bold', marginRight: 10, marginLeft: 10 }}>Tags:</Text>
                    <Text style={{ color: '#444' }}>{article.keywords.join(', ')}</Text>
                  </>
                )}
              </View>

              {/* Description */}
              {article.description && (
                <Text style={{ 
                  fontSize: 18, 
                  fontWeight: '500',
                  marginBottom: 20, 
                  color: '#333',
                  lineHeight: 26,
                  borderLeftWidth: 3,
                  borderLeftColor: '#007AFF',
                  paddingLeft: 15,
                }}>
                  {stripHtmlTags(article.description)}
                </Text>
              )}

              {/* Main Image */}
              {article.image_url && (
                <View style={{ marginBottom: 20 }}>
                  <Image 
                    source={{ uri: article.image_url }}
                    style={{ 
                      width: '100%', 
                      height: 200, 
                      resizeMode: 'cover',
                      borderRadius: 8
                    }}
                  />
                </View>
              )}

              {/* Video */}
              {article.video_url && (
                <View style={{ marginBottom: 20 }}>
                  <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Video:</Text>
                  <TouchableOpacity 
                    onPress={() => Linking.openURL(article.video_url)}
                    style={{ 
                      backgroundColor: '#007AFF', 
                      padding: 12,
                      borderRadius: 8
                    }}
                  >
                    <Text style={{ color: 'white', textAlign: 'center', fontWeight: '500' }}>
                      Xem Video
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Content */}
              <View style={{ marginBottom: 30 }}>
                {renderContent(article.content)}
              </View>

              {/* Source Link */}
              <View style={{ 
                borderTopWidth: 1, 
                borderTopColor: '#eee',
                paddingTop: 20,
                marginTop: 10
              }}>
                <TouchableOpacity 
                  onPress={() => Linking.openURL(article.link)}
                  style={{ 
                    backgroundColor: '#f8f8f8',
                    padding: 15,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: '#ddd'
                  }}
                >
                  <Text style={{ 
                    color: '#007AFF', 
                    textAlign: 'center',
                    fontWeight: '500'
                  }}>
                    Đọc bài viết gốc tại {article.source_name} →
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <Text>Lỗi tải dữ liệu</Text>
          )}
      </ScrollView>

      {showError && (
        <ErrorPopup 
          onRetry={loadArticle}
          onClose={() => setShowError(false)}
        />
      )}
    </>
  );
}
