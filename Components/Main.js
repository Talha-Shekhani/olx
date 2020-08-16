import React, { Component } from 'react';
import { StyleSheet, Text, View, Alert, AsyncStorage } from 'react-native';
import { Icon } from 'react-native-elements';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import IconMat from 'react-native-vector-icons/MaterialCommunityIcons'
import FontIcon from 'react-native-vector-icons/FontAwesome'
import MatIcon from 'react-native-vector-icons/MaterialIcons'
import SimIcon from 'react-native-vector-icons/SimpleLineIcons'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Home from './Home/Home'
import Chat from './Chats/Chat';
import Categories from './Home/Categories';
import SubCategories from './Home/SubCategories';
import { fetchAds, fetchCategories, fetchLoc, fetchFav } from '../redux/Actions'
import { connect } from 'react-redux';
import productList from './Home/productList';
import adDetail from './Home/adDetail'
import Login from './Login/Login'
// import AsyncStorage from '@react-native-community/async-storage'
import Password from './Login/Password'
import SellCategories from './Sell/SellCategories'
import tabMyAds from './Ads/TabMyAds'
import MyAccount from './Account/MyAccount';

const mapStateToProps = state => {
  return {
  }
}

const mapDispatchToProps = dispatch => ({
  fetchAds: () => dispatch(fetchAds()),
  fetchCategories: () => dispatch(fetchCategories()),
  fetchLoc: () => dispatch(fetchLoc()),
})

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator()

const tabNavigation = () => {
  return (
    <Tab.Navigator initialRouteName="Explore"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconName1, iconName2, iconName3, iconName4, iconName5
          if (route.name === 'Explore') {
            iconName1 = focused ? 'home-variant' : 'home-outline'
          }
          else if (route.name === 'Chats') {
            iconName2 = focused ? 'chat-bubble' : 'chat-bubble-outline';
          }
          else if (route.name === 'Sell') {
            iconName3 = 'camera';
          }
          else if (route.name === 'MyAds') {
            iconName4 = focused ? 'newspaper-variant-multiple' : 'newspaper-variant-multiple-outline';
          }
          else if (route.name === 'MyAccount') {
            iconName5 = focused ? 'user' : 'user-o';
          }
          return (
            <Text>
              <IconMat name={iconName1} size={focused ? 26 : 24} color={focused ? 'black' : 'grey'} />
              <MatIcon name={iconName2} size={focused ? 26 : 24} color={focused ? 'black' : 'grey'} />
              <SimIcon name={iconName3} size={focused ? 26 : 24} color={'black'} />
              <IconMat name={iconName4} size={focused ? 26 : 24} color={focused ? 'black' : 'grey'} />
              <FontIcon name={iconName5} size={focused ? 26 : 24} color={focused ? 'black' : 'grey'} />
            </Text>
          )
        },
      })}
      tabBarOptions={{
        activeTintColor: 'white',
        inactiveTintColor: 'white',
      }}
      inactiveColor="grey"
      barStyle={{ backgroundColor: '#ddd' }}>
      <Tab.Screen name="Explore" component={Home} />
      <Tab.Screen name="Chats" component={Chat} />
      <Tab.Screen name="Sell" component={SellCategories} />
      <Tab.Screen name="MyAds" component={tabMyAds} />
      <Tab.Screen name="MyAccount" component={MyAccount} />
    </Tab.Navigator>
  )
}

class Main extends Component {

  constructor(props) {
    super(props)
    this.state = {
      userId: '',
    }
  }

  UNSAFE_componentWillMount() {
    async function retrieveData () {
        const userdata = await AsyncStorage.getItem('userdata')
        .then((userdata) => {
          // Alert.alert(JSON.stringify(userinfo))
          if (userdata) {
            let userinfo = JSON.parse(userdata)
            this.setState({ userId: userinfo.userId })
            Alert.alert(this.state.userId.toString())
          }
        })
        .catch((err) => console.log('Cannot find user info' + err))
    }
    retrieveData()
    // SecureStore.getItemAsync('userdata')
    //   .then((userdata) => {
    //     // Alert.alert(JSON.stringify(userinfo))
    //     if (userdata) {
    //       let userinfo = JSON.parse(userdata)
    //       this.setState({ userId: userinfo.userId })
    //       Alert.alert(this.state.userId.toString())
    //     }
    //   })
    //   .catch((err) => console.log('Cannot find user info' + err))
    this.props.fetchAds()
    this.props.fetchCategories()
    this.props.fetchLoc()
  }

  render() {
    return (
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="loginEmail" component={Login} options={{headerShown: false}} />
            <Stack.Screen name="password" component={Password} options={{headerShown: false}} />
            <Stack.Screen name="root" component={tabNavigation} options={{ headerShown: false }} />
            <Stack.Screen name='categories' component={Categories} />
            <Stack.Screen name='subcategories' component={SubCategories} />
            <Stack.Screen name="productlist" component={productList} options={{ headerShown: false }} />
            <Stack.Screen name="addetail" component={adDetail} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)