import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform, ScrollView, Linking, InteractionManager, BackHandler } from 'react-native';
import { Icon, Card, Image, Rating, Input, Button } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context'
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { connect } from 'react-redux';
import { baseUrl, imageUrl } from '../../shared/baseUrl';
import { Loading } from '../LoadingComponent';
import { postComment, postFav, delFav, fetchFav, postReview, fetchReviewByAd, postFeatured } from '../../redux/Actions'
import AsyncStorage from '@react-native-community/async-storage'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { fetchUser } from '../../redux/Actions'
import { SliderBox } from 'react-native-image-slider-box'
import NumberFormat from 'react-number-format';
import { StackActions, CommonActions } from '@react-navigation/native';
// import { Button } from 'react-native-paper';

const mapStateToProps = state => ({
  ad: state.ads,
  loc: state.loc,
  // ads: state.ads,
  user: state.users,
  fav: state.favorites
})

const mapDispatchToProps = dispatch => ({
  delFav: (userId, adId) => dispatch(delFav(userId, adId)),
  fetchFav: (userId) => dispatch(fetchFav(userId)),
  postFav: (userId, adId) => dispatch(postFav(userId, adId)),
  fetchUser: (userId) => dispatch(fetchUser(userId)),
  postReview: (userId, adId, rating, review) => dispatch(postReview(userId, adId, rating, review)),
  fetchReviewByAd: (adId) => dispatch(fetchReviewByAd(adId)),
  postfeature: (userId, catId) => dispatch(postFeatured(userId, catId))
})

var errReview = '', username = ''

class adDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      search: '',
      userId: '',
      username: '',
      review: '',
      rating: 0,
      reviews: []
    }
  }

  UNSAFE_componentWillMount() {
    console.log(this.props.user)
    InteractionManager.runAfterInteractions(() => {
      const userdata = AsyncStorage.getItem('userdata')
        .then((userdata) => {
          if (userdata) {
            let userinfo = JSON.parse(userdata)
            this.setState({ userId: userinfo.userId })
            this.props.fetchUser('')
            console.log(this.props.route.params.userId, this.props.route.params.catId)
            this.props.postfeature(this.state.userId, this.props.route.params.catId)
              .then((res) => {
                console.log(res)
              })
          }
        })
        .then(() => this.props.fetchFav(this.state.userId))
        .then(() => this.props.fetchReviewByAd(this.props.route.params.adId)
          .then((res) => {
            if (res.success) this.setState({ reviews: res.result })
            else this.setState({ reviews: ["Error: Network Issue!"] })
          }))
        .catch((err) => console.log('Cannot find user info' + err))
    })
  }

  renderRelatedAds(catId, id) {
    if (this.props.ad.isLoading) {
      return (
        <Loading />
      )
    }
    else if (this.props.ad.errMess) {
      return (<Text>Network Error</Text>)
    }
    else
      return (
        // <Text>{JSON.stringify(props.props)}</Text>
        this.props.ad.ads.filter(item => item.active === 'true' && item.category_id == catId && item.id != id).map((item, index) => {
          return (
            <Card containerStyle={styles.productCardColumn} key={index}>
              <TouchableOpacity onPress={() => this.props.navigation.dispatch(StackActions.push('addetail', { adId: item.id, userId: item.user_id }))} >
                <View style={styles.imageConatiner}>
                  <Image containerStyle={styles.cardImage}
                    resizeMethod="scale"
                    resizeMode="stretch"
                    source={{ uri: (imageUrl + item.img1) }}
                  />
                </View>
                <View>
                  <View style={styles.row} ><Text style={styles.priceText}>Rs {item.price}</Text><Icon name="heart-o" type="font-awesome" /></View>
                  <Text >{item.title}</Text>
                  <Text style={styles.loc} ><MatIcon name="map-marker" size={10} /><Text style={styles.locText}>
                    {this.props.loc.loc.filter(itm => itm.id == item.area_id).map((itm, index) => {
                      return (<Text key={index}>  {itm.area}, {itm.city}</Text>)
                    })}</Text> </Text>
                </View>
              </TouchableOpacity>
            </Card>
          )
        })
      )
  }

  handleSubmit(userId, adId, rating, review) {
    if (this.state.review.length != '') {
      this.props.postReview(userId, adId, rating, review)
        .then((res) => {
          if (res.success == true) {
            this.setState({ rating: 0, review: '' })
          }
        })
        .then(() => {
          this.props.fetchReviewByAd(this.props.route.params.adId)
            .then((res) => {
              if (res.success) this.setState({ reviews: res.result })
              else this.setState({ reviews: ["Error: Network Issue!"] })
            })
        })
    } else {
      errReview = 'Review is Required!'
    }
  }

  renderAd(adId, userId) {
    // if (this.props.ad.isLoading) {
    //   return (
    //     <Loading />
    //   )
    // }
    // else 
    if (this.props.ad.errMess) {
      return (<Text>Network Error</Text>)
    }
    else
      return (
        this.props.ad.ads.filter(item => item.id == adId).map((item, index) => {
          let val = ''
          let adId = item.id
          {
            val = this.props.fav.favorites
              .filter(itm => item.id == itm.ad_id && itm.user_id == userId)
              .map((item, index) => { return (item.ad_id) })
          }
          var dat = new Date(item.created_date)
          let img = []
          if (item.img1 != '') img[0] = imageUrl + item.img1
          if (item.img2 != '') img[1] = imageUrl + item.img2
          if (item.img3 != '') img[2] = imageUrl + item.img3
          return (
            <View key={index} style={styles.container} >
              <View style={styles.imgConatiner}>
                <SliderBox
                  images={img}
                  resizeMode='contain'
                  style={styles.sliderImg}
                />
              </View>
              <View style={styles.titleBar} >
                <View style={styles.row} >
                  <NumberFormat value={item.price} displayType={'text'} thousandSeparator={true} prefix={'Rs '} renderText={formattedValue => <Text style={styles.priceText} >{formattedValue}</Text>} />
                  <Icon name={val == item.id ? 'heart' : 'heart-o'} type='font-awesome' onPress={() => {
                    if (val == item.id)
                      this.props.delFav(this.state.userId, item.id)
                    else
                      this.props.postFav(this.state.userId, item.id)
                  }}
                    type="font-awesome" style={styles.iconHeart} color={'red'} />
                </View>
                <Text style={styles.titleText} >{item.title}</Text>
                <View style={styles.row}>
                  <Text>
                    <MatIcon name="map-marker" size={11} />
                    <Text style={styles.locText}>
                      {this.props.loc.loc
                        .filter(itm => itm.id == item.area_id)
                        .map((itm, index) => {
                          return (<Text key={index}>  {itm.area}, {itm.city}</Text>)
                        })}</Text> </Text>
                  <Text style={styles.dateText}>{dat.toUTCString().slice(5, 12)}</Text>
                </View>
              </View>
              <View style={styles.separator}>
                <Text style={styles.detailTitle} >Details</Text>
              </View>
              <View style={styles.separator}>
                <Text style={styles.detailTitle} >Description</Text>
                <Text style={styles.desc} >{item.description}</Text>
              </View>
              <View style={styles.separator}>
                <Text style={styles.detailTitle} >Ad ID: {item.id}</Text>
              </View>
              <View style={styles.separator}>
                {this.props.user.users
                  .filter(itm => item.user_id == itm.id)
                  .map((item, index) => {
                    let dat = new Date(item.updated_at)
                    username = item.name
                    return (
                      <>
                        <View style={styles.userDetail} >
                          <Image source={{ uri: imageUrl + item.img }} style={styles.userImage} />
                          <View>
                            <Text style={styles.textStyle}>{item.name}</Text>
                            <Text style={styles.textStyle} >Member since {dat.toUTCString().slice(7, 16)} </Text>
                            <Text style={styles.seeProfile} onPress={() => this.props.navigation.navigate('useraccount', { userId: item.id })} >See Profile</Text>
                          </View>
                        </View>
                        <View>
                          <Text style={{ fontSize: 18, fontWeight: 'bold', margin: 5, marginTop: 10 }}>Review User</Text>
                          <Rating ratingCount={5} count={1} imageSize={22}
                            startingValue={this.state.rating} onFinishRating={(rating) => this.setState({ rating: rating })}
                            style={styles.rating} />
                          <Input placeholder='Type a review...' maxLength={100} onChangeText={(val) => this.setState({ review: val })}
                            multiline keyboardType="default" renderErrorMessage={true}
                            errorMessage={errReview} value={this.state.review} />
                          <Button style={{ width: '80%', alignSelf: 'center' }}
                            buttonStyle={styles.btnReview} onPress={() => this.handleSubmit(this.state.userId, adId, this.state.rating, this.state.review)}
                            title='Review' />
                        </View>
                        <View style={styles.reviewMainCont}>
                          {this.state.reviews.map((item, index) => {
                            let dat = new Date(item.date_time)
                            return (
                              <View style={styles.reviewCont} >
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
              </View>
              <View style={styles.separator}>
                <Text style={styles.detailTitle} >Related Ads</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} >
                <View style={styles.cardRow} >
                  {/* <RenderRelatedAds props={props.props} catId={item.category_id} id={item.id} /> */}
                  {this.renderRelatedAds(item.category_id, item.id)}
                </View>
              </ScrollView>
            </View>
          )
        })
      )
  }

  render() {
    const { adId, userId, catId } = this.props.route.params
    return (
      <SafeAreaView>
        <View style={styles.footer}>
          <Button buttonStyle={styles.footerBtn} title='Chat'
            titleStyle={styles.footerBtnLabel}
            icon={() => <Icon name='message-circle' type='feather' color='white' />}
            onPress={() => this.props.navigation.navigate('chat', { userId: userId, title: username })} />
          <Button buttonStyle={styles.footerBtn} title='SMS'
            titleStyle={styles.footerBtnLabel}
            icon={() => <Icon name='envelope-o' type='font-awesome' color='white' />}
            onPress={() => { var sms = ''; sms = Platform.OS == 'android' ? 'sms:${0123}' : 'smsprompt:${0123}'; Linking.openURL(sms) }} />
          <Button buttonStyle={styles.footerBtn} title='Call'
            titleStyle={styles.footerBtnLabel}
            icon={() => <Icon name='phone' type='feather' color='white' />}
            onPress={() => { var phn = ''; phn = Platform.OS == 'android' ? 'tel:${0123}' : 'telprompt:${0123}'; Linking.openURL(phn) }} />
        </View>
        <ScrollView>
          <View style={styles.container}>
            {/* <RenderAd props={this.props} adId={adId} userId={userId} /> */}
            {this.renderAd(adId, userId)}
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  imgConatiner: {
    width: '100%',
    height: 260
  },
  sliderImg: {
    width: '100%',
    height: '100%',
    opacity: 0.9,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignSelf: 'center'
  },
  titleBar: {
    height: 100,
    borderColor: '#999',
    borderStyle: "solid",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    padding: 10
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  priceText: {
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 5,
  },
  titleText: {
    fontSize: 18,
  },
  locText: {
    fontSize: 14,
  },
  separator: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'solid',
    padding: 15,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  desc: {
    marginVertical: 10,
  },
  cardContainer: {
    backgroundColor: 'white',
    marginTop: 5,
    padding: 10,
    paddingBottom: 15
  },
  link: {
    textDecorationLine: 'underline'
  },
  productText: {
    alignSelf: 'center',
    textAlign: 'center',
    textTransform: "uppercase",
    fontSize: 10
  },
  productCard: {
    width: 160,
    marginHorizontal: 2,
    borderColor: 'grey',
    borderRadius: 5
  },
  cardRow: {
    overflow: "scroll",
    flexWrap: "nowrap",
    flexDirection: 'row',
    margin: 10,
    marginBottom: 70
  },
  imageConatiner: {
    width: '94%',
    height: '62%',
    margin: 5
  },
  cardImage: {
    alignSelf: 'center',
    width: '100%',
    height: '100%',
    paddingVertical: 5
  },
  productCardColumn: {
    width: 180,
    height: 250,
    padding: 5,
    marginHorizontal: 4,
    borderColor: 'grey',
    borderRadius: 5,
    marginVertical: 8
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
  },
  userDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  userImage: {
    width: 40,
    height: 40,
    marginHorizontal: 20
  },
  seeProfile: {
    fontStyle: 'italic',
    textDecorationLine: "underline",
    fontWeight: "bold",
    lineHeight: 16
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
  footer: {
    zIndex: 2,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    borderTopColor: 'black',
    borderWidth: 1,
    height: 60,
    elevation: 22,
    shadowColor: 'grey',
    flexDirection: 'row',
    justifyContent: 'space-around',

  },
  footerBtn: {
    backgroundColor: 'black',
    alignSelf: 'center',
    height: '70%',
    margin: 8,
    width: '55%'
  },
  footerBtnLabel: {
    color: 'white',
    alignSelf: 'center',
    justifyContent: 'center',
    fontSize: 16,
    margin: 6
  }
})


export default connect(mapStateToProps, mapDispatchToProps)(adDetail)