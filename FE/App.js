import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { Text, SafeAreaView, Platform, StatusBar } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import DetailScreen from './screens/DetailScreen';
import SearchScreen from './screens/SearchScreen';
import SplashScreen from './components/SplashScreen';
import CategoryScreen from './screens/CategoryScreen';
import AddCateScreen from './screens/AddCateScreen';

import { store } from './store/store'
import { Provider } from 'react-redux'

const Stack = createStackNavigator();

export default function App() {

  // for no header in home screen
  const NoHeader = () => {
    return (
      <SafeAreaView style={{ paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }}>
      </SafeAreaView>
    );
  };

  return (
    <Provider store={store}>
      <NavigationContainer style={{ backgroundColor: 'blue' }}>
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen name="Splash" component={SplashScreen} options={{ header: () => <NoHeader /> }} />
          <Stack.Screen name="Home" component={HomeScreen} options={{ header: () => <NoHeader /> }} />
          <Stack.Screen name="Detail" component={DetailScreen} options={{ header: () => <NoHeader /> }} />
          <Stack.Screen name="Search" component={SearchScreen} options={{ header: () => <NoHeader /> }} />
          <Stack.Screen
            name="Category"
            component={CategoryScreen}
            options={{
              header: () => <NoHeader />,
              gestureDirection: 'horizontal-inverted', // Inverts the gesture direction
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, // Uses horizontal transition
            }}
          />
          <Stack.Screen name="AddCate" component={AddCateScreen} options={{ header: () => <NoHeader /> }} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}