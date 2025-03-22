import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Image, StyleSheet } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import axios from 'axios';
import { getArticleListSearchAPI } from '../api/article.js';
import { getArticlesList, addArticleToList } from '../cache/article.js'
import {formatTimeDifferenceWithCustomTZToGMT7} from '../helper/time.js'
import ErrorPopup from '../components/ErrorPopup';

function pubDateAndTimeDiff(pubDate) {
  const [_, timediff] = formatTimeDifferenceWithCustomTZToGMT7(pubDate)
  return timediff
}

function getSourceIcon(source_icon) {
  const sourceIcons = {
    '0': require('../icon/tuoitre.jpg'),
    '1': require('../icon/vnexpress.jpg'),
  };
  
  return sourceIcons[source_icon] || sourceIcons['1']; // Default to vnexpress if unknown
}

function getDefaultImage(source_icon) {
  const defaultImages = {
    '0': require('../iconnothumb/vnexpressnothumb.jpg'),
    '1': require('../iconnothumb/vnexpressnothumb.jpg'),
  };
  
  return defaultImages[source_icon] || defaultImages['1']; // Default to vnexpress if unknown
}

export default function SearchScreen({ navigation }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);

  const articleItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('Detail', { _id: item._id, category: 'search', source_icon: item.source_icon })}
        style={styles.articleItem}>
        <Image 
          source={item.image_url ? { uri: item.image_url } : getDefaultImage(item.source_icon)}
          style={[styles.articleImage, !item.image_url && styles.noImage]}
        />
        <View style={styles.articleContent}>
          <Text style={styles.articleTitle} numberOfLines={3}>{item.title}</Text>
          <View style={styles.articleFooter}>
            <Image 
              source={getSourceIcon(item.source_icon)} 
              style={styles.sourceIcon}
              resizeMode="contain"
            />
            <Text style={styles.timeText}>{pubDateAndTimeDiff(item.pubDate)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const handleInputChange = (text) => {
    setInputText(text);
  };

  const handleSearch = async () => {
    if (inputText.length > 0) {
      setSearchQuery(inputText);
      setLoading(true);
      try {
        const response = await getArticleListSearchAPI(inputText);
        setArticles(response.data);
        setError(null);
        setShowError(false);
      } catch (error) {
        console.error('Search error:', error);
        setError('network_error');
        setShowError(true);
      }
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setInputText('');
    setSearchQuery('');
    setArticles([]);
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
        setError('network_error');
      }
      setLoading(false);
    }
  };

  return (
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
              value={inputText}
              onChangeText={handleInputChange}
              style={styles.searchInput}
            />
            {inputText.length > 0 && (
              <>
                <TouchableOpacity 
                  onPress={clearSearch}
                  style={styles.clearButton}
                >
                  <AntDesign name="close" size={20} color="gray" />
                </TouchableOpacity>
                <View style={styles.separator} />
                <TouchableOpacity 
                  onPress={handleSearch}
                  style={styles.searchButton}
                >
                  <AntDesign name="search1" size={20} color="gray" />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>

      {/* Phần nội dung chính */}
      <View style={{ padding: 10, flex: 1 }}>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : searchQuery.length > 0 && articles.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>Không có kết quả phù hợp</Text>
          </View>
        ) : (
          <FlatList
            data={articles}
            keyExtractor={(item) => item._id}
            onRefresh={handleRefresh}
            refreshing={loading}
            renderItem={articleItem}
          />
        )}
      </View>

      {showError && (
        <ErrorPopup 
          onRetry={handleSearch}
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
  },
  separator: {
    width: 1,
    height: 20,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 8,
  },
  searchButton: {
    padding: 8,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
}); 