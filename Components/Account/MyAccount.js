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
import { Button } from 'react-native-paper'

const mapStateToProps = state => ({
    user: state.users
})

const mapDispatchToProps = dispatch => ({
    fetchUser: (userId) => dispatch(fetchUser(userId))
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
                    this.props.fetchUser(this.state.userId)
                    console.log(userinfo)
                }
                else this.setState({ userId: 0 })
            })
            .catch((err) => console.log('Cannot find user info' + err))
    }

    displayContent(isLogin) {
        if (isLogin)
            return (
                <Button
                    onPress={() => {
                        AsyncStorage.removeItem('userdata');
                        this.props.navigation.navigate('firstpage')
                    }}
                    mode='outlined' >LogOut
                </Button>
            )
        else
            return (
                <Button
                    onPress={() => {
                        this.props.navigation.navigate('firstpage')
                    }}
                    mode='outlined' >LogIn
                </Button>
            )
    }

    render() {
        let isLogin = false
        if (this.state.userId != 0)
            isLogin = true
        return (
            <SafeAreaView style={{ backgroundColor: 'white' }}>
                <ScrollView style={styles.container}  >
                    <View style={styles.header} >
                        <Image source={{ uri: baseUrl + 'boy.png' }} style={styles.image} />
                        <View style={styles.subHead} >
                            <Text style={styles.username} >{isLogin ? this.props.user.users[0].name : 'Username'}</Text>
                            <Text style={styles.username} >UserName</Text>
                        </View>
                    </View>
                    {this.displayContent(isLogin)}
                </ScrollView>
            </SafeAreaView >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        margin: 25,
        backgroundColor: 'white',
        height: '100%'
    },
    header: {
        flexDirection: 'row'
    },
    username: {
        marginLeft: 15,
        fontSize: 20,
        fontWeight: "bold"
    },
    subHead: {
        // justifyContent: ''
    },


    title: {
        fontSize: 22,
        fontWeight: 'bold'
    },
    heading: {
        fontSize: 16,
        marginTop: 40,
    },
    image: {
        margin: 10,
        width: 80,
        height: 80
    },
})


export default connect(mapStateToProps, mapDispatchToProps)(MyAccount)