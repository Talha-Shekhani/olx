import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform, ScrollView, FlatList } from 'react-native';
import { SearchBar, Icon, Card, Image, ListItem, Rating } from 'react-native-elements';
import { NavigationContainer, NavigationAction, StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context'
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { connect } from 'react-redux';
import { baseUrl, imageUrl } from '../../shared/baseUrl';
import { Loading } from '../LoadingComponent';
import { getOverallReview, fetchUser } from '../../redux/Actions'
import { ads } from '../../redux/ads'
import AsyncStorage from '@react-native-community/async-storage'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button, Divider } from 'react-native-paper'

const mapStateToProps = state => ({
    users: state.users,
    ads: state.ads,
    loc: state.loc
})

const mapDispatchToProps = dispatch => ({
    fetchUser: (userId) => dispatch(fetchUser(userId)),
    getReview: (userId) => dispatch(getOverallReview(userId))
})

class UserAccount extends Component {
    constructor(props) {
        super(props)
        this.state = {
            search: '',
            userId: '',
        }
    }

    UNSAFE_componentWillMount() {
        this.props.getReview(this.props.route.params.userId)
            .then((res) => {
                this.setState({ rating: res.result[0].rating })
            })
    }

    componentDidMount() {
        // AsyncStorage.getItem('userdata')
        //     .then((userdata) => {
        //         // Alert.alert(JSON.stringify(userinfo))
        //         if (userdata) {
        //             let userinfo = JSON.parse(userdata)
        //             this.setState({ userId: userinfo.userId })
        //             console.log(userinfo)
        //         }
        //         else this.setState({ userId: 0 })
        //     })
        //     .then(() => this.props.fetchUser(this.state.userId))
        //     .catch((err) => console.log('Cannot find user info' + err))
    }

    displayUserAds(userId) {
        return (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} >
                {this.props.ads.ads
                    .filter(itm => itm.user_id == userId)
                    .map((item, index) => {
                        return (
                            <Card containerStyle={styles.productCardColumn} key={index} >
                                <TouchableOpacity key={index}
                                    onPress={() =>
                                        this.props.navigation.dispatch(StackActions.push('addetail', { adId: item.id, userId: item.user_id }))} >
                                    <View style={styles.imageConatiner}>
                                        <Image containerStyle={styles.cardImage}
                                            resizeMethod="scale"
                                            resizeMode="contain"
                                            source={{ uri: (imageUrl + item.img1), cache: 'force-cache' }}
                                        />
                                    </View>
                                    <View>
                                        <Text style={styles.priceText}> Rs {item.price}</Text>
                                        <Text numberOfLines={1} > {item.title}</Text>
                                        <Text style={styles.loc} >
                                            <MatIcon name="map-marker" size={10} />
                                            <Text style={styles.locText}>
                                                {this.props.loc.loc.filter(itm => itm.id == item.area_id).map((itm, index) => {
                                                    return (<Text key={index}>  {itm.area}, {itm.city}</Text>)
                                                })}
                                            </Text>
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </Card>
                        )
                    })}
            </ScrollView>

        )
    }

    render() {
        const { userId } = this.props.route.params
        return (
            <SafeAreaView style={{ backgroundColor: 'white' }}>
                <ScrollView style={styles.container}  >
                    <View style={styles.header} >
                        <Image source={{ uri: imageUrl + 'boy.png' }} style={styles.image} />
                        <View style={styles.subHead} >
                            <Text style={styles.username} >{this.props.users.users.filter(itm => itm.id == userId).map((itm) => { return (itm.name) })}</Text>
                            <View style={{ flexDirection: 'row' }} >
                                <Rating startingValue={this.state.rating} readonly count={5} imageSize={18}
                                    style={{ marginHorizontal: 15 }}
                                />
                                <Text style={{ color: '#f1c400', fontWeight: 'bold' }} >{this.state.rating} / 5 </Text>
                            </View>
                        </View>
                    </View>
                    <View>
                        <Divider style={{ height: 1.1, backgroundColor: 'black' }} />
                        <Text style={{ fontSize: 18, fontWeight: 'bold', margin: 5, marginLeft: 28 }} >Ads</Text>
                    </View>
                    <View style={styles.cardContainer} >
                        {this.displayUserAds(userId)}
                    </View>
                </ScrollView>
            </SafeAreaView >
        )
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
    cardContainer: {
    },
    image: {
        margin: 0,
        width: 80,
        height: 80
    },
    productCardColumn: {
        width: 140,
        height: 160,
        paddingVertical: 5,
        paddingHorizontal: 2,
        margin: 5,
        marginTop: 10,
        borderRadius: 8
    },
    imageConatiner: {
        width: '100%',
        height: '50%'
    },
    cardImage: {
        alignSelf: 'center',
        width: '100%',
        height: '100%',
        paddingVertical: 5
    },
    priceText: {
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 5,
    },
    locText: {
        fontSize: 10
    },
    loc: {
        marginTop: 10
    }
})


export default connect(mapStateToProps, mapDispatchToProps)(UserAccount)