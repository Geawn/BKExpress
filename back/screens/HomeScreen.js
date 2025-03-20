import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Image, StyleSheet } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import axios from 'axios';
import { getArticleListAPI, getOlderArticlesAPI } from '../api/article.js';
import { CATEGORIES } from '../constants/article_category.js';
import { getArticlesList, addArticleToList, clearCache } from '../cache/article.js'
import {formatTimeDifferenceWithCustomTZToGMT7} from '../helper/time.js'
import BackendUrlModal from '../components/BackendUrlModal';
import { getBackendUrl } from '../config/backend';
import { useDevBackendUrl } from '../config/url';

const initialArticlesState = CATEGORIES.reduce((accumulator, category) => {
  accumulator[category[0]] = [];
  return accumulator;
}, {});

function pubDateAndTimeDiff(pubDate) {
  const [_, timediff] = formatTimeDifferenceWithCustomTZToGMT7(pubDate)
  return timediff
}

function getSourceIcon(imageUrl) {
  if (!imageUrl) return null;
  
  // Check if URL contains 'tuoitre'
  const isTuoiTre = imageUrl.toLowerCase().includes('tuoitre');
  
  // Map source to icon file
  const sourceIcons = {
    'vnexpress': require('../icon/vnexpress.jpg'),
    'tuoitre': require('../icon/tuoitre.jpg'),
  };
  
  return isTuoiTre ? sourceIcons.tuoitre : sourceIcons.vnexpress;
}

export default function HomeScreen({ navigation }) {
  const [articles, setArticles] = useState(initialArticlesState);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0][0]);
  const [showBackendModal, setShowBackendModal] = useState(false);
  const [error, setError] = useState(null);
  const [backendUrl, setBackendUrl] = useState('');
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const isDevMode = useDevBackendUrl();

  useEffect(() => {
    loadNews();
  }, [selectedCategory]);

  const loadNews = async () => {
    setLoading(true);
    setHasMore(true);
    try {
      if (articles[selectedCategory].length === 0) {
        const response = await getArticleListAPI(selectedCategory);
        const updatedArticles = { ...articles };
        updatedArticles[selectedCategory] = response.data;
        setArticles(updatedArticles)
        setFilteredArticles(updatedArticles[selectedCategory])
        await addArticleToList(selectedCategory, response.data)
        setError(null);
      } else {
        setFilteredArticles(articles[selectedCategory])
      }
    } catch (error) {
      try {
        const cache = await getArticlesList(selectedCategory)
        const updatedArticles = { ...articles };
        updatedArticles[selectedCategory] = cache;
        setArticles(updatedArticles)
        setFilteredArticles(updatedArticles[selectedCategory])
        setError(null);
      } catch (cacheError) {
        setError('Lỗi mạng. Vui lòng kiểm tra lại kết nối và thử lại.');
        console.error(error);
      }
    }
    setLoading(false);
  };

  const loadMoreArticles = async () => {
    if (loadingMore || !hasMore || isLoadingMore) {
      console.log('Skip loadMoreArticles:', { loadingMore, hasMore, isLoadingMore });
      return;
    }
    
    console.log('Starting loadMoreArticles for category:', selectedCategory);
    setLoadingMore(true);
    setIsLoadingMore(true);
    try {
      const lastArticle = filteredArticles[filteredArticles.length - 1];
      console.log('Last article pubDate:', lastArticle.pubDate);
      
      // Add delay of 1 second
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Log API call information
      console.log('Making API call to:', `localhost:4000/articles?category=${selectedCategory}&limit=10&lastPubDate=${encodeURIComponent(lastArticle.pubDate)}&direction=older`);
      
      const response = await getOlderArticlesAPI(selectedCategory, lastArticle.pubDate);
      console.log('Received response with articles count:', response.data?.length || 0);
      
      if (response.data && response.data.length > 0) {
        const updatedArticles = { ...articles };
        updatedArticles[selectedCategory] = [...updatedArticles[selectedCategory], ...response.data];
        setArticles(updatedArticles);
        setFilteredArticles(updatedArticles[selectedCategory]);
        await addArticleToList(selectedCategory, response.data);
        console.log('Successfully added more articles. Total articles now:', updatedArticles[selectedCategory].length);
      } else {
        console.log('No more articles to load');
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more articles:', error);
      console.error('Error details:', {
        category: selectedCategory,
        lastArticleDate: filteredArticles[filteredArticles.length - 1]?.pubDate
      });
    } finally {
      setLoadingMore(false);
      setIsLoadingMore(false);
      console.log('Finished loadMoreArticles');
    }
  };

  const handleLoadMore = () => {
    console.log('handleLoadMore called for category:', selectedCategory);
    console.log('Current state:', { loadingMore, hasMore, isLoadingMore });
    if (!loadingMore && hasMore && !isLoadingMore) {
      console.log('Proceeding to loadMoreArticles');
      loadMoreArticles();
    }
  };

  const articleItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('Detail', { _id: item._id, category: selectedCategory, source_icon: item.source_icon })}
        style={styles.articleItem}>
        <Image 
          source={item.image_url ? { uri: item.image_url } : null}
          style={[styles.articleImage, !item.image_url && styles.noImage]}
        />
        <View style={styles.articleContent}>
          <Text style={styles.articleTitle} numberOfLines={3}>{item.title}</Text>
          <View style={styles.articleFooter}>
            <Image 
              source={getSourceIcon(item.image_url)} 
              style={styles.sourceIcon}
              resizeMode="contain"
            />
            <Text style={styles.timeText}>{pubDateAndTimeDiff(item.pubDate)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const handleRefresh = async () => {
    setLoading(true);
    const updatedArticles = { ...articles };
    updatedArticles[selectedCategory] = [];
    setArticles(updatedArticles)
    setSearchQuery('')
    await loadNews();
    setLoading(false)
  };

  const handleBackendUrlSave = async (url) => {
    setBackendUrl(url);
    await clearCache();
    const updatedArticles = { ...articles };
    updatedArticles[selectedCategory] = [];
    setArticles(updatedArticles);
    setError(null);
    await loadNews();
  };

  return (
    <>
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          {isDevMode && (
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={() => setShowBackendModal(true)}
            >
              <Text style={styles.retryButtonText}>Cấu hình URL</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <>
          {/* Header với menu, category, và các nút chức năng */}
          <View style={styles.header}>
            {/* Nút menu 3 gạch - luôn hiển thị */}
            <TouchableOpacity onPress={() => setShowBackendModal(true)}>
              <AntDesign name="bars" size={24} color="black" style={styles.icon} />
            </TouchableOpacity>

            {/* Thanh category */}
            <View style={styles.categoryContainer}>
              <FlatList
                horizontal
                data={CATEGORIES}
                keyExtractor={(item) => item[0]}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      console.log('Category changed to:', item[0]);
                      setHasMore(true);
                      setLoadingMore(false);
                      setIsLoadingMore(false);
                      setSelectedCategory(item[0]);
                    }}
                    style={[
                      styles.categoryItem,
                      selectedCategory === item[0] && styles.selectedCategoryItem
                    ]}>
                    <Text style={styles.categoryText}>{item[1]}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>

            {/* Các biểu tượng chức năng (tìm kiếm, thông báo) */}
            <View style={styles.headerIcons}>
              <TouchableOpacity onPress={() => navigation.navigate('Search')}>
                <AntDesign name="search1" size={24} color="black" style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => console.log('Notification pressed')}>
                <AntDesign name="bells" size={24} color="black" style={styles.icon} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Phần nội dung chính */}
          <View style={{ padding: 10, flex: 1 }}>
           {/*  <TextInput
              placeholder="Tìm kiếm bài báo..."
              value={searchQuery}
              onChangeText={handleSearch}
              style={{ borderWidth: 1, padding: 8, marginVertical: 10 }}
            />  */}
            
            {loading ? <ActivityIndicator size="large" /> : null}

            <FlatList
              data={filteredArticles}
              keyExtractor={(item) => item._id}
              onRefresh={handleRefresh}
              refreshing={loading}
              renderItem={articleItem}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.2}
              ListFooterComponent={() => 
                loadingMore ? (
                  <View style={styles.loadingMoreContainer}>
                    <ActivityIndicator size="small" />
                  </View>
                ) : null
              }
            />
          </View>

          <BackendUrlModal
            visible={showBackendModal}
            onClose={() => setShowBackendModal(false)}
            onSave={handleBackendUrlSave}
            isRequired={false}
            initialUrl={backendUrl}
          />
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'lightblue',
  },
  categoryContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  categoryItem: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 10,
    backgroundColor: '#007AFF',
  },
  selectedCategoryItem: {
    backgroundColor: 'blue',
  },
  categoryText: {
    color: 'white',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  icon: {
    marginHorizontal: 10,
  },
  articleItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    gap: 12,
    minHeight: 120,
  },
  articleImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  noImage: {
    backgroundColor: '#e0e0e0',
  },
  articleContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
    flex: 1,
  },
  articleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    justifyContent: 'space-between',
  },
  sourceIcon: {
    width: 60,
    height: 80,
    borderRadius: 4,
  },
  timeText: {
    color: '#666',
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ff3b30',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  loadingMoreContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});