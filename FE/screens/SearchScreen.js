import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Image, StyleSheet } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import axios from 'axios';
import { getArticleListSearchAPI } from '../api/article.js';
import { getArticlesList, addArticleToList } from '../cache/article.js'
import {formatTimeDifferenceWithCustomTZToGMT7} from '../helper/time.js'

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

export default function SearchScreen({ navigation }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  const articleItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('Detail', { _id: item._id, category: 'search', source_icon: item.source_icon })}
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

  const handleSearch = async (text) => {
    console.log('Starting search with query:', text);
    setSearchQuery(text);
    if (text.length > 0) {
      setLoading(true);
      try {
        console.log('Making API call for search query:', text);
        const response = await getArticleListSearchAPI(text);
        console.log('Received search results:', response.data.length, 'articles');
        setArticles(response.data);
        setError(null);
      } catch (error) {
        console.error('Search error:', error);
        setError('Lỗi mạng. Vui lòng kiểm tra lại kết nối và thử lại.');
      }
      setLoading(false);
    } else {
      console.log('Clearing search results');
      setArticles([]);
    }
  };

  const handleRefresh = async () => {
    if (searchQuery.length > 0) {
      setLoading(true);
      try {
        const response = await getArticleListSearchAPI(searchQuery);
        setArticles(response.data);
        setError(null);
      } catch (error) {
        console.error(error);
        setError('Lỗi mạng. Vui lòng kiểm tra lại kết nối và thử lại.');
      }
      setLoading(false);
    }
  };

  return (
    <>
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <>
          {/* Header với search bar */}
          <View style={styles.header}>
            {/* Nút back */}
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <AntDesign name="arrowleft" size={24} color="black" style={styles.icon} />
            </TouchableOpacity>

            {/* Search bar */}
            <View style={styles.searchContainer}>
              <View style={styles.searchInputContainer}>
                <TextInput
                  placeholder="Tìm kiếm bài báo..."
                  value={searchQuery}
                  onChangeText={handleSearch}
                  style={styles.searchInput}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity 
                    onPress={() => handleSearch('')}
                    style={styles.clearButton}
                  >
                    <AntDesign name="close" size={20} color="gray" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          {/* Phần nội dung chính */}
          <View style={{ padding: 10, flex: 1 }}>
            {loading ? <ActivityIndicator size="large" /> : null}

            <FlatList
              data={articles}
              keyExtractor={(item) => item._id}
              onRefresh={handleRefresh}
              refreshing={loading}
              renderItem={articleItem}
            />
          </View>
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
  searchContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    padding: 8,
    fontSize: 16,
  },
  clearButton: {
    padding: 8,
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
  }
}); 