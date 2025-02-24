import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, SafeAreaView, Platform, StatusBar } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import DetailScreen from './screens/DetailScreen';

const Stack = createStackNavigator();

export default function App() {

  // for no header in home screen
  const NoHeader = () => {
    return (
      <SafeAreaView style={{paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0}}>
      </SafeAreaView>
    );
  };

  return (
    <NavigationContainer style={{ backgroundColor: 'blue' }}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ header: () => <NoHeader /> }} />
        <Stack.Screen name="Detail" component={DetailScreen} options={{ title: 'Chi Tiết Bài Báo' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
