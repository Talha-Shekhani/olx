import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import IconMat from 'react-native-vector-icons/MaterialCommunityIcons'
import MatIcon from 'react-native-vector-icons/MaterialIcons'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { fetchAds, fetchCategories, fetchLoc } from '../../redux/Actions'
import AsyncStorage from '@react-native-community/async-storage'
import { connect } from 'react-redux';
import { baseUrl } from '../../shared/baseUrl';
import MyAds from './MyAds';
import Favorites from './Favorites';

const Tab = createMaterialTopTabNavigator()

function tabMyAds () {
  return (
    <Tab.Navigator initialRouteName="myAds"
      tabBarOptions={{
        labelStyle: {
          color: 'black',
          fontWeight: 'bold',
          fontSize: 18,
        },
        indicatorStyle: {
          borderBottomColor: 'black'
        },
      }}>
      <Tab.Screen name="myAds" component={MyAds} options={{ title: 'ADS' }} />
      <Tab.Screen name="favorite" component={Favorites} options={{ title: 'FAVORITES' }} />
    </Tab.Navigator>
  )
}


export default connect()(tabMyAds)