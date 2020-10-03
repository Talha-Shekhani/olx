import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform, ScrollView, Linking, InteractionManager, BackHandler } from 'react-native';
import { Icon, Card, Image, Rating, Input, Button } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context'
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { connect } from 'react-redux';
import { baseUrl, imageUrl } from '../../shared/baseUrl';
import { Loading } from '../LoadingComponent';
import { postReview, fetchReviewByUser } from '../../redux/Actions'
import AsyncStorage from '@react-native-community/async-storage'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { fetchUser } from '../../redux/Actions'
import { SliderBox } from 'react-native-image-slider-box'
import NumberFormat from 'react-number-format';
import { StackActions } from '@react-navigation/native';
// import { Button } from 'react-native-paper';

const mapStateToProps = state => ({
    user: state.users,
})

const mapDispatchToProps = dispatch => ({
    fetchUser: (userId) => dispatch(fetchUser(userId)),
    // postReview: (userId, adId, rating, review) => dispatch(postReview(userId, adId, rating, review)),
    fetchReviewByUser: (adId) => dispatch(fetchReviewByUser(adId))
})

class Reviews extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userId: 0,
            reviews: []
        }
    }

    UNSAFE_componentWillMount() {
        InteractionManager.runAfterInteractions(() => {
            const userdata = AsyncStorage.getItem('userdata')
                .then((userdata) => {
                    if (userdata) {
                        let userinfo = JSON.parse(userdata)
                        this.setState({ userId: userinfo.userId })
                    } else this.setState({ userId: 0 })
                    this.props.fetchUser(this.state.userId)
                    this.props.fetchReviewByUser(this.props.route.params.userId)
                        .then((res) => {
                            if (res.success) this.setState({ reviews: res.result })
                            else this.setState({ reviews: ["Error: Network Issue!"] })
                        })
                })
                .catch((err) => console.log('Cannot find user info' + err))
        })
    }

    render() {
        const { userId } = this.props.route.params
        console.log(this.state.reviews)
        return (
            <ScrollView style={styles.container} >
                {this.props.user.users
                    .filter(itm => itm.id == this.state.userId)
                    .map((item, index) => {
                        let dat = new Date(item.updated_at)
                        return (
                            <>
                                <View style={styles.reviewMainCont}>
                                    {this.state.reviews.map((item, index) => {
                                        let dat = new Date(item.date_time)
                                        return (
                                            <View style={[styles.reviewCont, styles.separator]} >
                                                <View style={[{ justifyContent: 'space-between' }]} >
                                                    <Text style={{ fontWeight: "bold" }} > For Ad id : {item.ad_id}</Text>
                                                    <Text style={{ fontWeight: "bold" }} > Product Title : {item.title}</Text>
                                                </View>
                                                <View style={styles.reviewRow} >
                                                    <Image source={{ uri: imageUrl + item.img }} style={styles.reviewUserImage} />
                                                    <Text>{item.name}</Text>
                                                </View>
                                                <View style={styles.reviewRow} >
                                                    <Rating readonly startingValue={item.rating} imageSize={10} style={styles.reviewRating} />
                                                    <Text style={styles.textDate}>{dat.toDateString().slice(4)}</Text>
                                                </View>
                                                <Text style={styles.reviewText} >{item.review}</Text>
                                            </View>
                                        )
                                    })}
                                </View>
                            </>
                        )
                    })}
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
    },
    rating: {
        justifyContent: 'flex-start'
    },
    btnReview: {
        backgroundColor: 'black',
        width: '94%',
        alignSelf: 'center'
    },
    textStyle: {
        lineHeight: 16
    },
    reviewMainCont: {
        marginTop: 10,
        marginLeft: 10,
        width: '90%',
        alignContent: 'flex-start'
    },
    reviewCont: {
    },
    reviewRow: {
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center'
    },
    reviewUserImage: {
        width: 25,
        height: 25,
        margin: 5,
        marginRight: 10
    },
    reviewRating: {
        marginLeft: 5
    },
    textDate: {
        marginLeft: 10,
        fontSize: 12,
        color: 'grey'
    },
    reviewText: {
        margin: 5,
        color: 'grey',
        minHeight: 2
    },
    separator: {
        borderBottomWidth: 1,
        borderColor: '#ddd',
        borderStyle: 'solid',
        padding: 5,
    },
})


export default connect(mapStateToProps, mapDispatchToProps)(Reviews)