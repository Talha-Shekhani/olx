import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform, ScrollView, FlatList, AsyncStorage } from 'react-native';
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
// import * as SecureStore from 'expo-secure-store'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Appbar } from 'react-native-paper'

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
        async function retrieveData() {
            const userdata = await AsyncStorage.getItem('userdata')
                .then((userdata) => {
                    // Alert.alert(JSON.stringify(userinfo))
                    if (userdata) {
                        let userinfo = JSON.parse(userdata)
                        this.setState({ userId: userinfo.userId })
                    }
                })
                .catch((err) => console.log('Cannot find user info' + err))
        }
        retrieveData()
    }

    render() {
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
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
})


export default connect(mapStateToProps)(MyAccount)