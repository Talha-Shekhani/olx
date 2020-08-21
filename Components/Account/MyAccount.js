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
import AsyncStorage from '@react-native-community/async-storage'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Appbar, Button } from 'react-native-paper'

const mapStateToProps = state => ({
    ads: state.ads.ads,
    cat: state.categories,
    loc: state.loc
})

class MyAccount extends Component {
    constructor(props) {
        super(props)
        this.state = {
            search: '',
            userId: '',
        }
    }

    componentDidMount() {
        AsyncStorage.getItem('userdata')
            .then((userdata) => {
                // Alert.alert(JSON.stringify(userinfo))
                if (userdata) {
                    let userinfo = JSON.parse(userdata)
                    this.setState({ userId: userinfo.userId })
                }
                else this.setState({ userId: 0 })
            })
            .catch((err) => console.log('Cannot find user info' + err))
    }

    displayContent(isLogin) {
        if (isLogin)
            return (
                <Button onPress={() => { AsyncStorage.removeItem('userdata'); this.props.navigation.navigate('firstpage') }} >LogOut</Button>
            )
        else return (<View></View>)
    }

    render() {
        let isLogin = false
        if (this.state.userId != 0)
            isLogin = true
        return (
            <SafeAreaView>
                <Appbar.Header>
                    <Appbar.BackAction />
                    <Appbar.Content title="Title" subtitle="Subtitle" />
                    <Appbar.Action icon="magnify" />
                    <Appbar.Action icon="dots-vertical" />
                </Appbar.Header>
                <ScrollView>
                    <View><Text>MyAccount</Text></View>
                    {this.displayContent(isLogin)}
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
})


export default connect(mapStateToProps)(MyAccount)