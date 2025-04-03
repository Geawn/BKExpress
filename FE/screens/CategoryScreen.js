import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { CATEGORIES } from '../constants/article_category';
import { BrandID } from '../constants/Brand';

export default function CategoryScreen({ navigation }) {
  const renderCategoryItem = (item) => (
    <TouchableOpacity style={styles.categoryItem} 
      key={item[0]} 
      onPress={() => {
        // Set the selected category as a parameter in the previous screen
        navigation.popTo('Home', { selectedCategory: item[0]});
      }}>
      <Image
        source={{ uri: 'https://s3-alpha-sig.figma.com/img/f621/241e/a383579065047f36fb54c1376d50b90f?Expires=1744588800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=hGyjA~zXKAZwJbinwqdGiFMchq7J19w5MPxiwx~K81yXPNpIZh52ujF6evlkM1aXIvq6Zz14GLUzW9IduG8OVHB2tQoc6hCTip6epWAEgCMlqFJo0j4KCwIlJO9jZBdV~WaHJzJoPpRGYTTV~VIxqV0phbF4aiinjCYGtsDr6DZTMt7tUOYccJ9prXL6Aw91DCi-A0cmkj0fIICu8RyFyRiWMFsE4BMULbtsFLG7ARQHjxa5QLm4BfoJfDtDCdz00kPaBpapyYiHeDlXbnBY9jDzOGTlXpmFgWXDdaLh4tn5lsgVrkYLr6vA1L75Nx3N5~Lm7W9XHB4VQPiJtzrTMA__' }} // Replace with actual image URL
        style={styles.categoryImage}
      />
      <View style={styles.overlay}>
        <Text style={styles.categoryText}>{item[1]}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderAddCategoryItem = () => (
    <TouchableOpacity style={styles.categoryItem} 
      onPress={() =>  navigation.navigate('AddCate') }>
      <Image
        style={styles.categoryImage}
      />
      <View style={styles.overlay}>
        <Text style={styles.categoryText}>Thêm / xóa chủ đề</Text>
      </View>
    </TouchableOpacity>
  )

  const renderSourceItem = (brand) => (
    <TouchableOpacity style={styles.sourceItem} key={brand[0]}>
      {brand[0] === '1' ? (
        <Image
          source={require('../icon/tuoitre.jpg')} // Replace with actual image URL for brand 0
          style={styles.sourceImage}
        />
      ) : (
        <Image
          source={require('../icon/vnexpress.jpg')} // Replace with actual image URL for brand 1
          style={styles.sourceImage}
        />
      )}
      <Text style={styles.sourceText}>{brand[1]}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.header}>
        {/* Title */}
        <Text style={styles.title}>Chuyên mục</Text>

        {/* Right icon */}
        <TouchableOpacity style={styles.iconRight} onPress={() => navigation.goBack()}>
          <AntDesign name="arrowright" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Main content */}
      <View style={styles.content}>
        {/* Categories */}
        <Text style={styles.sectionTitle}>Chủ đề</Text>
        <View style={styles.categoryList}>
          {CATEGORIES.map(renderCategoryItem)}
          {renderAddCategoryItem()}
        </View>

        {/* Sources */}
        <Text style={styles.sectionTitle}>Nguồn báo nổi bật</Text>
        <View style={styles.sourceList}>
          {BrandID.map((brand) => renderSourceItem(brand))}
        </View>

        {/* Saved news */}
        <TouchableOpacity style={styles.savedNewsButton}>
          <AntDesign name="book" size={20} color="black" />
          <Text style={styles.savedNewsText}>Tin tức đã lưu</Text>
        </TouchableOpacity>
      </View>
        
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'lightblue',
  },
  iconRight: {
    position: 'absolute',
    right: 15,
  },
  title: {
    fontSize: 20,
    color: 'black',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#3890B0',
  },
  categoryList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  categoryItem: {
    width: '48%',
    aspectRatio: 1.5,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
    position: 'relative',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sourceList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    marginBottom: 20,
  },
  sourceItem: {
    width: '22%',
    alignItems: 'center',
    marginBottom: 10,
    // backgroundColor: 'green',
  },
  sourceImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
  },
  sourceText: {
    fontSize: 12,
    textAlign: 'center',
  },
  savedNewsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  savedNewsText: {
    marginLeft: 10,
    fontSize: 16,
  },
});