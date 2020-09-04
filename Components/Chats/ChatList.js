import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform, ScrollView } from 'react-native';
import { SearchBar, Icon, Image, ListItem, Avatar } from 'react-native-elements';
import { Card, List } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context'
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import AsyncStorage from '@react-native-community/async-storage'
import { connect } from 'react-redux';
import { baseUrl } from '../../shared/baseUrl';
import NumberFormat from 'react-number-format';
import { Loading } from '../LoadingComponent';
import { fetchChatUser, fetchUser } from '../../redux/Actions'

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
            userId: ''
        }
    }

    renderChatList() {
        // if (this.props.ads.isLoading) {
        //     return (
        //         <Loading />
        //     )
        // }
        // else if (this.props.ads.errMess) {
        //     return (<Text>Network Error</Text>)
        // }
        // else
        return (
            // <View></View>
            this.props.user.users
                .filter(item => item.id == this.props.chatUser.map((itm, indx) => itm.to_user_id))
                .map((item, index) => {
                    console.log(item.name)
                    return (
                        // <Text>{item.name}</Text>
                        // <Card>
                        // <ListItem.Item key={index} bottomDivider
                        //     onPress={() => console.log('object')}
                        //     title='TITLE' description='description'
                        //     left={() => <Avatar.Image source={{ uri: baseUrl + item.img }} style={{ width: 40, height: 40, alignSelf: 'center', backgroundColor: '#eee' }} />} />
                        // </Card>
                        <ListItem key={index} bottomDivider onPress={() => this.props.navigation.navigate('chat', {userId: item.id})}
                            title={item.name}
                            subtitle='subtitle'
                            chevron={true}
                            leftAvatar={<Avatar source={{ uri: baseUrl + 'boy.png' }} style={{width: 40, height: 40, borderRadius: 50 }} />} >
                        </ListItem>
                    )
                })
        )
    }

    UNSAFE_componentWillMount() {
        AsyncStorage.getItem('userdata')
            .then((userdata) => {
                if (userdata) {
                    let userinfo = JSON.parse(userdata)
                    this.setState({ userId: userinfo.userId })
                    this.props.fetchChatUser(this.state.userId)
                    this.props.fetchUser('')

                }
                else this.setState({ userId: 0 })
            })
            // .then(() => this.props.fetchFav(this.state.userId))
            .catch((err) => console.log('Cannot find user info' + err))
    }

    render() {
        // const { catId, subcatId } = this.props.route.params
        // console.log(this.state)
        console.log(this.props.chatUser)
        if (this.state.userId != '')
            return (
                <SafeAreaView >
                    <ScrollView >
                        {/* <Text>{JSON.stringify(this.props)}</Text> */}
                        {/* <Text>{catId + ' ' + subcatId}</Text> */}
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
        padding: 10,
        paddingBottom: 15
    },
})


export default connect(mapStateToProps, mapDispatchToProps)(ChatList)