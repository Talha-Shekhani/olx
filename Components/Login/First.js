import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform, ScrollView, FlatList } from 'react-native';
import { SearchBar, Icon, Card, Image } from 'react-native-elements';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context'
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { connect } from 'react-redux';
import { baseUrl } from '../../shared/baseUrl';
import { Loading } from '../LoadingComponent';
import { postComment } from '../../redux/Actions'
import { ads } from '../../redux/ads'
import * as SecureStore from 'expo-secure-store'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button } from 'react-native-paper';

class FirstPage extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <SafeAreaView>
          <View>
            <Button onPress={() => this.props.navigation.navigate('root')} />
          </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  
})


export default connect()(FirstPage)