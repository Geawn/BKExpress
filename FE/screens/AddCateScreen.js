import { useState, useEffect, use } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Button } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';

import { useSelector, useDispatch } from "react-redux";
import { updateCaegoryListRedux } from "../store/userReducer";

import { updateCategoryList, deleteCategoryList } from '../cache/category'

export default function AddCateScreen({ navigation }) {
  const { userInfo, categoryList } = useSelector((state) => state.user)
  const dispatch = useDispatch();

  const [isChanging, setIsChanging] = useState(false)

  const updateCateList = async (engName) => {
    if (isChanging) return

    setIsChanging(true)
    if (userInfo) {
      try {
        // Call API to change category list

        // change categoryList
        await updateCategoryList(engName)

        dispatch(updateCaegoryListRedux(engName))

        setIsChanging(false)
        return
      } catch (error) {
        console.error("Error updating category list:", error);
        setIsChanging(false)
      }
    }

    try {
      await updateCategoryList(engName)
      dispatch(updateCaegoryListRedux({ engName }))
      setIsChanging(false)
    } catch (error) {
      console.error("Error updating category list:", error);
      setIsChanging(false)
    }
  }

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        item[2] && styles.selectedCategoryItem, // Highlight selected items
      ]}
      onPress={() => updateCateList(item[0])}
    >
      <Text style={styles.categoryText}>{item[1]}</Text>
      {item[2] ? (
        <AntDesign name="checksquareo" size={24} color="green" />
      ) : (
        <Feather name="square" size={24} color="gray" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={{flex: 1}}>{/* Header */}
      <View style={styles.header}>
        {/* Back button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>Thêm / xóa chủ đề</Text>
      </View>

      {/* Category Checklist */}
      <FlatList
        data={categoryList.slice(2)}
        keyExtractor={(item) => item[0]}
        renderItem={renderCategoryItem}
        contentContainerStyle={styles.list}
      />

      <Button title="Xóa danh sách chủ đề" onPress={() => {
        deleteCategoryList()
      }} />
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'lightblue',
  },
  backButton: {
    position: 'absolute',
    left: 15,
  },
  title: {
    fontSize: 20,
    color: 'black',
  },
  list: {
    padding: 10,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedCategoryItem: {
    backgroundColor: "#e6f7e6", // Light green background for selected items
    borderColor: "green",
  },
  categoryText: {
    fontSize: 16,
    color: "#333",
  },
})