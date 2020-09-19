import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform, ScrollView, FlatList } from 'react-native';
import { SearchBar, Icon, Card, Image, ListItem, Rating } from 'react-native-elements';
import { NavigationContainer, NavigationAction, StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context'
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { connect } from 'react-redux';
import { baseUrl } from '../../shared/baseUrl';
import { Loading } from '../LoadingComponent';
import { fetchUser, getOverallReview } from '../../redux/Actions'
import { ads } from '../../redux/ads'
import AsyncStorage from '@react-native-community/async-storage'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button, Divider } from 'react-native-paper'

const mapStateToProps = state => ({
    user: state.users
})

const mapDispatchToProps = dispatch => ({
    fetchUser: (userId) => dispatch(fetchUser(userId)),
    getReview: (userId) => dispatch(getOverallReview(userId))
})

class MyAccount extends Component {
    constructor(props) {
        super(props)
        this.state = {
            search: '',
            userId: '',
            rating: 0,
        }
    }

    UNSAFE_componentWillMount() {
        AsyncStorage.getItem('userdata')
            .then((userdata) => {
                // Alert.alert(JSON.stringify(userinfo))
                if (userdata) {
                    let userinfo = JSON.parse(userdata)
                    this.setState({ userId: userinfo.userId })
                    console.log(userinfo)
                }
                else this.setState({ userId: 0 })
                this.props.fetchUser(this.state.userId)
                this.props.getReview(this.state.userId)
                    .then((res) => {
                        if (res != undefined)
                            this.setState({ rating: res.result[0].rating })
                    })
            })
            .catch((err) => console.log('Cannot find user info' + err))
    }

    displayContent(isLogin) {
        if (isLogin)
            return (
                <View>
                    <Divider style={{ height: 2 }} />
                    <ListItem title='Review' chevron onPress={() => {
                        this.props.navigation.navigate('reviews', { userId: this.state.userId })
                    }} />
                    <Divider style={{ height: 2 }} />
                    <ListItem title='LogOut' chevron onPress={() => {
                        AsyncStorage.removeItem('userdata');
                        this.props.navigation.navigate('firstpage')
                    }} />
                    <Divider style={{ height: 2 }} />
                </View>

            )
        else
            return (
                <View>
                    <Divider style={{ height: 2 }} />
                    <ListItem title='LogIn' chevron onPress={() => {
                        this.props.navigation.dispatch(StackActions.replace('firstpage'))
                    }} />
                    <Divider style={{ height: 2 }} />
                </View>
            )
    }

    render() {
        console.log(this.props.user)
        let isLogin = false
        if (this.state.userId != 0)
            isLogin = true
        console.log(isLogin)
        if (this.props.user.users[0].name != undefined)
            return (
                <SafeAreaView style={{ backgroundColor: 'white' }}>
                    <ScrollView style={styles.container}  >
                        <View style={styles.header} >
                            <Image source={{ uri: baseUrl + 'boy.png' }} style={styles.image} />
                            <View style={styles.subHead} >
                                <Text style={styles.username} >
                                    {isLogin == true ? this.props.user.users[0].name : 'Username'}
                                </Text>
                                <Text style={styles.username} >UserName</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Rating startingValue={this.state.rating} readonly count={5} imageSize={18}
                                        style={{ marginHorizontal: 15 }}
                                    />
                                    <Text style={{ color: '#f1c400', fontWeight: 'bold' }} >{this.state.rating} / 5 </Text>
                                </View>
                            </View>
                        </View>
                        {this.displayContent(isLogin)}
                    </ScrollView>
                </SafeAreaView >
            )
        else return (<></>)
    }
}

const styles = StyleSheet.create({
    container: {
        // margin: 25,
        backgroundColor: 'white',
        height: '100%'
    },
    header: {
        margin: 25,
        flexDirection: 'row'
    },
    username: {
        marginLeft: 15,
        fontSize: 20,
        fontWeight: "bold"
    },
    subHead: {
        justifyContent: 'center'
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