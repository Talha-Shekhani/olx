import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform, ScrollView, Linking } from 'react-native';
import { Icon, Card, Image } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context'
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { connect } from 'react-redux';
import { baseUrl } from '../../shared/baseUrl';
import { Loading } from '../LoadingComponent';
import { postComment, postFav, delFav, fetchFav } from '../../redux/Actions'
import AsyncStorage from '@react-native-community/async-storage'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { fetchUser } from '../../redux/Actions'
import { SliderBox } from 'react-native-image-slider-box'
import NumberFormat from 'react-number-format';
import { Button } from 'react-native-paper';

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
  fetchUser: (userId) => dispatch(fetchUser(userId))
})

class adDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      search: '',
      userId: ''
    }
  }

  UNSAFE_componentWillMount() {
    this.props.fetchUser(this.props.route.params.userId)
    const userdata = AsyncStorage.getItem('userdata')
      .then((userdata) => {
        if (userdata) {
          let userinfo = JSON.parse(userdata)
          this.setState({ userId: userinfo.userId })
        }
      })
      .then(() => this.props.fetchFav(this.state.userId))
      .catch((err) => console.log('Cannot find user info' + err))
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
              <TouchableOpacity onPress={() => this.props.navigation.navigate('addetail', { adId: item.id, userId: item.user_id })} >
                <View style={styles.imageConatiner}>
                  <Image containerStyle={styles.cardImage}
                    resizeMethod="scale"
                    resizeMode="stretch"
                    source={{ uri: (baseUrl + item.img1) }}
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

  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log(prevProps, prevState)
    return prevProps, prevState
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log(snapshot)
  }

  renderAd(adId, userId) {
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
        this.props.ad.ads.filter(item => item.id == adId).map((item, index) => {
          let val = ''
          {
            val = this.props.fav.favorites
              .filter(itm => item.id == itm.ad_id && itm.user_id == userId)
              .map((item, index) => { return (item.ad_id) })
          }
          var dat = new Date(item.created_date)
          return (
            <View key={index} style={styles.container} >
              <View style={styles.imgConatiner}>
                <SliderBox
                  images={[baseUrl + item.img1, baseUrl + item.img1]}
                  resizeMode='contain'
                  style={styles.sliderImg}
                />
              </View>
              <View style={styles.titleBar} >
                <View style={styles.row} >
                  <NumberFormat value={item.price} displayType={'text'} thousandSeparator={true} prefix={'Rs '} renderText={formattedValue => <Text style={styles.priceText} >{formattedValue}</Text>} />
                  <Icon name={val == item.id ? 'heart' : 'heart-o'} type='font-awesome' onPress={() => {
                    if (val == item.id)
                      this.props.delFav(userId, item.id)
                    else
                      this.props.postFav(userId, item.id)
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
                {this.props.user.user
                  .filter(itm => item.user_id == itm.id)
                  .map((item, index) => {
                    let dat = new Date(item.updated_at)
                    console.log(item)
                    return (
                      <View>
                        <Image source={{ uri: baseUrl + item.img }} />
                        <View>
                          <Text>{item.name}</Text>
                          <Text>Member since {dat.toUTCString().slice(7, 16)} </Text>
                        </View>
                      </View>
                    )
                  })}
              </View>
              <View style={styles.separator}>
                <Text style={styles.detailTitle} >Ad ID: {item.id}</Text>
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
    const { adId, userId } = this.props.route.params
    return (
      <SafeAreaView>
        <View style={styles.footer}>
          <Button style={styles.footerBtn} contentStyle={styles.footerBtnCont}
            labelStyle={styles.footerBtnLabel}
            icon={() => <Icon name='message-circle' type='feather' color='white' />}
            onPress={() => this.props.navigation.navigate('chat')} >Chat</Button>
          <Button style={styles.footerBtn} contentStyle={styles.footerBtnCont}
            labelStyle={styles.footerBtnLabel}
            icon={() => <Icon name='envelope-o' type='font-awesome' color='white' />}
            onPress={() => { var sms = ''; sms = Platform.OS == 'android' ? 'sms:${0123}' : 'smsprompt:${0123}'; Linking.openURL(sms) }} > SMS</Button>
          <Button style={styles.footerBtn} contentStyle={styles.footerBtnCont}
            labelStyle={styles.footerBtnLabel}
            icon={() => <Icon name='phone' type='feather' color='white' />}
            onPress={() => { var phn = ''; phn = Platform.OS == 'android' ? 'tel:${0123}' : 'telprompt:${0123}'; Linking.openURL(phn) }} > Call</Button>
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
    justifyContent: 'space-evenly',

  },
  footerBtn: {
    backgroundColor: 'black',
    alignSelf: 'center',
    height: '70%'
  },
  footerBtnLabel: {
    color: 'white',
    alignSelf: 'center',
    justifyContent: 'center',
    fontSize: 16
  }
})


export default connect(mapStateToProps, mapDispatchToProps)(adDetail)