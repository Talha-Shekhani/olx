import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform, ScrollView, FlatList, BackHandler } from 'react-native';
import { SearchBar, Icon, Card, Image } from 'react-native-elements';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context'
import FontIcon from 'react-native-vector-icons/FontAwesome'
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import FeatIcon from 'react-native-vector-icons/Feather'
import { connect } from 'react-redux';
import { baseUrl } from '../../shared/baseUrl';
import { Loading } from '../LoadingComponent';
import { postComment } from '../../redux/Actions'
import { ads } from '../../redux/ads'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button } from 'react-native-paper';

class FirstPage extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View>
          <TouchableOpacity onPress={() =>
            this.props.navigation.dispatch(StackActions.replace('root'))} style={styles.cancelBtn} >
            <FeatIcon name='x' size={20} />
          </TouchableOpacity>
        </View>
        <View style={{ height: '60%' }} >
          <Image source={{ uri: baseUrl + 'OLX_BLUE_LOGO.png' }} resizeMode='contain' style={styles.img} />
        </View>
        <View style={styles.bottomContainer}>
          <View style={styles.btnContainer}>
            <Button style={styles.btns} labelStyle={styles.btnText} contentStyle={styles.btnCont} mode="outlined" color='black' ><MatIcon style={styles.icon} name='cellphone-iphone' size={18} />  Continue With Phone</Button>
            <Button style={styles.btns} labelStyle={styles.btnText} contentStyle={styles.btnCont} mode="outlined" color='black' ><MatIcon style={styles.icon} name='google' size={16} />   Continue with Google</Button>
            <Button style={styles.btns} labelStyle={styles.btnText} contentStyle={styles.btnCont} mode="outlined" color='black' ><FontIcon style={styles.icon} name='facebook' size={16} />    Continue with Facebook</Button>
            <Button onPress={() => this.props.navigation.navigate('loginEmail')} style={styles.btns} labelStyle={styles.btnText} contentStyle={styles.btnCont} mode="outlined" color='black' ><FontIcon style={styles.icon} name='envelope-o' size={16} />   Continue with Email</Button>
          </View>
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#b5ceff',
    height: '100%'
  },
  cancelBtn: {
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    marginHorizontal: 8,
    marginTop: 5
  },
  img: {
    width: '100%',
    height: '100%'
  },
  bottomContainer: {
    backgroundColor: '#387eff',
    height: '40%'
  },
  btnContainer: {
    margin: 10,
    height: '100%'
  },
  btns: {
    backgroundColor: 'white',
    margin: 4,
    marginHorizontal: 15,
  },
  btnText: {
    fontSize: 14,
  },
  btnCont: {
    alignSelf: 'flex-start'
  },
  icon: {
    marginHorizontal: 5,

  }
})


export default connect()(FirstPage)