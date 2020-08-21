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
import tabNavigation from '../Main';
import FirstPage from './First'

const Tab = createMaterialTopTabNavigator()

function tabLogin () {
  return (
    <Tab.Navigator initialRouteName="myAds" >
      <Tab.Screen name="firstpage" component={FirstPage}  />
      <Tab.Screen name="root" component={tabNavigation} />
    </Tab.Navigator>
  )
}


export default connect()(tabLogin)