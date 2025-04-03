import { View, Text, StyleSheet, TouchableOpacity, Button } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';

import { deleteCategoryList } from '../cache/category'

export default function AddCateScreen({ navigation }) {
  return (
    <View>{/* Header */}
      <View style={styles.header}>
        {/* Back button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>Thêm / xóa chủ đề</Text>
      </View>
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
})