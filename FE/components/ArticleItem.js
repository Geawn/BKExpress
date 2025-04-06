import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

import { formatTimeDifferenceWithCustomTZToGMT7 } from '../helper/time.js'

function getSourceIcon(source_icon) {
  const sourceIcons = {
    '0': require('../icon/tuoitre.jpg'),
    '1': require('../icon/vnexpress.jpg'),
  };

  return sourceIcons[source_icon] || sourceIcons['1']; // Default to vnexpress if unknown
}

function pubDateAndTimeDiff(pubDate) {
  const [_, timediff] = formatTimeDifferenceWithCustomTZToGMT7(pubDate)
  return timediff
}

function getDefaultImage(source_icon) {
  const defaultImages = {
    '0': require('../iconnothumb/vnexpressnothumb.jpg'),
    '1': require('../iconnothumb/vnexpressnothumb.jpg'),
  };

  return defaultImages[source_icon] || defaultImages['1']; // Default to vnexpress if unknown
}

const ArticleItem = ({ navigation, item, selectedCategory }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        console.log('HomeScreen - Navigating to Detail with source_icon:', item.source_icon);
        navigation.navigate('Detail', { _id: item._id, category: selectedCategory, source_icon: item.source_icon })
      }}
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

export default ArticleItem

const styles = StyleSheet.create({
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
})