import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform, ScrollView } from 'react-native';
import { SearchBar, Icon, Card, Image, ListItem } from 'react-native-elements';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context'
import AntIcon from 'react-native-vector-icons/AntDesign'
import SimIcon from 'react-native-vector-icons/SimpleLineIcons'
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import SubCategories from '../Home/SubCategories'
import { connect } from 'react-redux'
import AsyncStorage from '@react-native-community/async-storage'
import { baseUrl } from '../../shared/baseUrl'
import { Loading } from '../LoadingComponent'

const mapStateToProps = state => {
  return {
    cat: state.categories
  }
}
var userId = ''
class SellCategories extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userId: ''
    }
  }

  UNSAFE_componentWillMount() {
    AsyncStorage.getItem('userdata')
      .then((userdata) => {
        if (userdata) {
          let userinfo = JSON.parse(userdata)
          this.setState({ userId: userinfo.userId })
        }
        else this.setState({ userId: 0 })
      })
      // .then(() => this.props.fetchFav(this.state.userId))
      .catch((err) => console.log('Cannot find user info' + err))
  }

  renderItem() {
    if (this.props.cat.isLoading) {
      return (
        <Loading />
      )
    }
    else if (this.props.cat.errMess) {
      return (<Text>Network Error</Text>)
    }
    else
      if (this.state.userId == 0) { return (<View><Text>You are not Login</Text></View>) }
      else
        return (
          // <Text>{JSON.stringify(props.props)}</Text>
          this.props.cat.categories.map((item, index) => {
            return (
              <ListItem containerStyle={styles.navLink} onPress={() => this.props.navigation.navigate('subcategories', { catId: item.cat_id, catName: item.title, sell: true })}
                key={index}
                title={item.title}
                leftAvatar={{ source: { uri: baseUrl + item.img } }}
                rightIcon={<Icon style={styles.arrowIcon} name='angle-right' type='font-awesome' size={24} />} >
              </ListItem>
            )
          })
        )
  }

  render() {
    console.log(this.state)
    // if (this.state.userId == 0)
    //   data = this.props.navigation.navigate('firstpage')
    // else data = this.renderItem()
    if (this.state.userId != '')
      return (
        <SafeAreaView>
          <ScrollView>
            <View style={styles.container}>
              {this.renderItem()}
            </View>
          </ScrollView>
        </SafeAreaView>
      )
    else return (<View></View>)
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  navLink: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginVertical: 6,
    paddingVertical: 6,
  },
  iconBack: {
    borderRadius: 50,
    width: 30,
    height: 30,
    alignSelf: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center'
  },
  productText: {
    alignSelf: 'center',
    textAlign: 'center',
    marginHorizontal: 5
  },
  arrowIcon: {
    alignContent: 'flex-end',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
    margin: 5,
    marginRight: 20,
    color: 'grey'
  }
})


export default connect(mapStateToProps)(SellCategories)