import React, { useEffect, useState, useRef, use } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Image, StyleSheet } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import axios from 'axios';
import { getArticleListAPI, getOlderArticlesAPI } from '../api/article.js';
import { CATEGORIES } from '../constants/article_category.js';
import { getArticlesList, addArticleToList, clearCache } from '../cache/article.js'
import { formatTimeDifferenceWithCustomTZToGMT7 } from '../helper/time.js'
import BackendUrlModal from '../components/BackendUrlModal';
import { getBackendUrl } from '../config/backend';
import { useDevBackendUrl } from '../config/url';
import ErrorPopup from '../components/ErrorPopup.js';
import ArticleItem from '../components/ArticleItem.js';

import { useSelector, useDispatch } from "react-redux";
import { setupStartApp } from '../store/userAction';

const initialArticlesState = CATEGORIES.reduce((accumulator, category) => {
  accumulator[category[0]] = [];
  return accumulator;
}, {});

export default function HomeScreen({ navigation, route }) {
  const { categoryList } = useSelector((state) => state.user)
  const dispatch = useDispatch();

  const [articles, setArticles] = useState(initialArticlesState);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const categoryListRef = useRef(null); // Reference to the FlatList for the category bar
  const [showBackendModal, setShowBackendModal] = useState(false);
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  const [backendUrl, setBackendUrl] = useState('');
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const isDevMode = useDevBackendUrl();

  useEffect(() => {
    setLoading(true);
    // Dispatch the setupStartApp action when the app starts
    dispatch(setupStartApp(setLoading));
  }, []);

  // update selectedCategory from CategoryScreen
  useEffect(() => {
    if (route.params?.selectedCategory) {
      setSelectedCategory(route.params.selectedCategory);

      // Find the index of the selected category
      const selectedIndex = CATEGORIES.findIndex((category) => category[0] === route.params.selectedCategory);

      // Scroll to the selected category
      if (selectedIndex !== -1 && categoryListRef.current) {
        categoryListRef.current.scrollToIndex({ index: selectedIndex, animated: true });
      }
    }
  }, [route.params?.selectedCategory]);

  useEffect(() => {
    if (categoryList.length) {
      // update selectedCategory
      let selectedCategoryAvailable = false;
      for (const cate of categoryList) {
        if (cate[0] === selectedCategory) {
          selectedCategoryAvailable = cate[2];
          break;
        }
      }
      if (!selectedCategory || !selectedCategoryAvailable) {
        // Tìm category đầu tiên có checked === true
        let firstCheckedCategory = ''
        for (const cate of categoryList) {
          if (cate[2] === true) {
            firstCheckedCategory = cate[0]
            break
          }
        }

        if (firstCheckedCategory) {
          setSelectedCategory(firstCheckedCategory);

          const selectedIndex = CATEGORIES.findIndex((category) => category[0] === firstCheckedCategory);
          categoryListRef.current.scrollToIndex({ index: selectedIndex, animated: true })
        } else {
          console.log('No category with checked === true found.');
        }
      }
    } else {
      console.log('categoryList is not available yet. Waiting for it to load.');
    }
  }, [categoryList]);

  useEffect(() => {
    if (selectedCategory) loadNews();
  }, [selectedCategory]);

  const loadNews = async () => {
    setLoading(true);
    setHasMore(true);

    try {
      // Kiểm tra cache trước
      const cache = await getArticlesList(selectedCategory);
      if (cache && cache.length > 0) {
        const updatedArticles = { ...articles };
        updatedArticles[selectedCategory] = cache;
        setArticles(updatedArticles);
        setFilteredArticles(updatedArticles[selectedCategory]);
      }

      // Gọi API để cập nhật
      const response = await getArticleListAPI(selectedCategory);
      const updatedArticles = { ...articles };
      updatedArticles[selectedCategory] = response.data;
      setArticles(updatedArticles);
      setFilteredArticles(updatedArticles[selectedCategory]);
      await addArticleToList(selectedCategory, response.data);
      setShowError(false);
    } catch (error) {
      setShowError(true);
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const loadMoreArticles = async () => {
    if (loadingMore || !hasMore || isLoadingMore) {
      return;
    }

    setLoadingMore(true);
    setIsLoadingMore(true);

    try {
      const lastArticle = filteredArticles[filteredArticles.length - 1];
      await new Promise(resolve => setTimeout(resolve, 1000));

      const response = await getOlderArticlesAPI(selectedCategory, lastArticle.pubDate);

      if (response.data && response.data.length > 0) {
        const updatedArticles = { ...articles };
        updatedArticles[selectedCategory] = [...updatedArticles[selectedCategory], ...response.data];
        setArticles(updatedArticles);
        setFilteredArticles(updatedArticles[selectedCategory]);
        await addArticleToList(selectedCategory, response.data);
        setShowError(false);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      // Show error popup only for API failure
      setShowError(true);
      console.error('Error loading more articles:', error);
    } finally {
      setLoadingMore(false);
      setIsLoadingMore(false);
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
      {/* Header với menu, category, và các nút chức năng */}
      <View style={styles.header}>
        {/* Nút menu 3 gạch - luôn hiển thị */}
        <TouchableOpacity onPress={() => navigation.push("Category")}>
          <AntDesign name="bars" size={24} color="black" style={styles.icon} />
        </TouchableOpacity>

        {/* Thanh category */}
        <View style={styles.categoryContainer}>
          <FlatList
            ref={categoryListRef} // Attach the ref to the FlatList
            horizontal
            data={categoryList}
            keyExtractor={(item) => item[0]}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              (item[2] === true) && // Check if the category is checked
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
          <TouchableOpacity onPress={
            // () => console.log('Notification pressed')
            () => { setShowBackendModal(true) }
          }>
            <AntDesign name="bells" size={24} color="black" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Phần nội dung chính */}
      <View style={{ padding: 10, flex: 1 }}>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList
            data={filteredArticles}
            keyExtractor={(item) => item._id}
            onRefresh={handleRefresh}
            refreshing={loading}
            renderItem={({ item }) => (
              <ArticleItem
                item={item}
                navigation={navigation} // Pass the navigation prop here
                selectedCategory={selectedCategory} // Pass additional props if needed
              />
            )}
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
        )}
      </View>

      <BackendUrlModal
        visible={showBackendModal}
        onClose={() => setShowBackendModal(false)}
        onSave={handleBackendUrlSave}
        isRequired={false}
        initialUrl={backendUrl}
      />

      {showError && (
        <ErrorPopup
          onRetry={loadNews}
          onClose={() => setShowError(false)}
        />
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