import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform, ScrollView } from 'react-native';
import { SearchBar, Icon, Image, ListItem, Avatar } from 'react-native-elements';
import { Card, List } from 'react-native-paper';
import { NavigationContainer, TabActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context'
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import AsyncStorage from '@react-native-community/async-storage'
import { connect } from 'react-redux';
import { baseUrl } from '../../shared/baseUrl';
import NumberFormat from 'react-number-format';
import { Loading } from '../LoadingComponent';
import { fetchChatUser, fetchUser } from '../../redux/Actions'
import { InteractionManager } from 'react-native';

const mapStateToProps = state => ({
    loc: state.loc,
    chatUser: state.users.chatUser,
    user: state.users
})

const mapDispatchToProps = dispatch => ({
    fetchChatUser: (userId) => dispatch(fetchChatUser(userId)),
    fetchUser: (userId) => dispatch(fetchUser(userId))
})

class ChatList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            search: '',
            userId: 0
        }
    }

    renderChatList() {
        // if (this.props.ads.isLoading) {
        //     return (
        //         <Loading />
        //     )
        // }
        // else 
        // console.log(this.props.user.users)
        if (this.props.user.errMess) {
            return (<Text>Network Error</Text>)
        }
        else
            if (Array.isArray(this.props.chatUser) != false)
                return (
                    // <View></View>
                    this.props.user.users
                        // .filter(item => item.id == this.props.chatUser.map((itm, indx) => itm.to_user_id))
                        .map((item, index) => {
                            let toUserId
                            {
                                for (let i in this.props.chatUser)
                                    if (item.id == this.props.chatUser[i].to_user_id)
                                        toUserId = item.id
                                console.log(toUserId)
                            }
                            // console.log(item)
                            let subtitle = '', dat = new Date()
                            this.props.chatUser
                                .filter(itm => itm.to_user_id == item.id)
                                .map((itm, indx) => {
                                    subtitle = itm.text
                                    dat = new Date(itm.createdAt)
                                })
                            if (toUserId != undefined)
                                return (
                                    <ListItem key={index} bottomDivider onPress={() => this.props.navigation.navigate('chat', { userId: item.id, title: item.name })}
                                        title={item.name}
                                        subtitle={subtitle}
                                        containerStyle={{ height: 74 }}
                                        // chevron={true}
                                        rightSubtitleStyle={{ fontSize: 10, marginTop: 40 }}
                                        rightSubtitle={dat.toUTCString().slice(5, 12) + '' + dat.toUTCString().slice(16, 22)}
                                        leftAvatar={<Avatar source={{ uri: baseUrl + 'boy.png' }} style={{ width: 40, height: 40, borderRadius: 50 }}

                                        />} >
                                    </ListItem>
                                )
                        })
                )
    }

    componentDidUpdate() {
        if (this.state.userId == 0) {
            this.props.navigation.navigate('firstpage')
        }
        // console.log(this.state.userId)
    }

    UNSAFE_componentWillMount() {
        InteractionManager.runAfterInteractions(() => {
            AsyncStorage.getItem('userdata')
                .then((userdata) => {
                    if (userdata) {
                        let userinfo = JSON.parse(userdata)
                        this.setState({ userId: userinfo.userId })
                    }
                    else this.setState({ userId: 0 })
                    this.props.navigation.addListener('focus', () => {
                        if (this.state.userId == 0) {
                            this.props.navigation.navigate('firstpage')
                        }
                        // console.log(this.state.userId)
                    })
                })
                .then(() => {
                    this.props.fetchUser('')
                    this.props.fetchChatUser(this.state.userId)
                })
                .catch((err) => console.log('Cannot find user info' + err))
        })
    }
    shouldComponentUpdate() {
        return true
    }

    render() {
        // console.log(this.props.chatUser)
        if (this.state.userId != '')
            return (
                <SafeAreaView >
                    <ScrollView >
                        <View style={styles.container}>
                            <SearchBar containerStyle={styles.searchBar}
                                inputContainerStyle={styles.inputContainerStyle}
                                inputStyle={styles.inputStyle}
                                placeholder=""
                                value={this.state.search}
                                onChangeText={(val) => this.setState({ search: val })}
                                platform='default' />
                            <View style={styles.cardContainer} >
                                {this.renderChatList()}
                            </View>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            )
        else return (<View></View>)
    }
}

const styles = StyleSheet.create({
    container: {
    },
    inputContainerStyle: {
        height: 24,
        backgroundColor: 'white',
        height: 35,
    },
    inputStyle: {
        minHeight: 24,
        fontSize: 16,
        backgroundColor: 'white',
        height: 60,
    },
    searchBar: {
        // height: 40,
        margin: 5,
        padding: 0,
        borderColor: 'black',
        borderStyle: 'solid',
        backgroundColor: 'white',
        borderRadius: 5,
        borderWidth: 1,
        marginBottom: 5,
        marginHorizontal: 5
    },
    cardContainer: {
        backgroundColor: 'white',
        marginTop: 5,
    },
})


export default connect(mapStateToProps, mapDispatchToProps)(ChatList)