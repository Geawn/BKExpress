import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import DetailScreen from './screens/DetailScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Báo Mới' }} />
        <Stack.Screen name="Detail" component={DetailScreen} options={{ title: 'Chi Tiết Bài Báo' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
