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
import { TouchableOpacity } from 'react-native-gesture-handler'
import { fetchUser } from '../../redux/Actions'
import NumberFormat from 'react-number-format';
// const Intl = require('react-native-intl')
// const en = new Intl.Translation('en-US')

const mapStateToProps = state => ({
  ad: state.ads,
  loc: state.loc,
  ads: state.ads,
  user: state.users
})

const mapDispatchToProps = dispatch => ({
  fetchUser: (userId) => dispatch(fetchUser(userId))
})

function RenderRelatedAds(props) {
  if (props.props.ads.isLoading) {
    return (
      <Loading />
    )
  }
  else if (props.props.ads.errMess) {
    return (<Text>Network Error</Text>)
  }
  else
    return (
      // <Text>{JSON.stringify(props.props)}</Text>
      props.props.ads.ads.filter(item => item.category_id == props.cat_id && item.id != props.id).map((item, index) => {
        return (
          <Card containerStyle={styles.productCardColumn} key={index}>
            <TouchableOpacity onPress={() => props.props.navigation.navigate('addetail', { adId: item.id, userId: item.user_id })} >
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
                <Text style={styles.loc} ><MatIcon name="map-marker" size={10} /><Text style={styles.locText}>{props.props.loc.loc.filter(itm => itm.area_id == item.area_id).map((itm, index) => {
                  return (<Text key={index} >  {itm.area}, {itm.city}</Text>)
                })}</Text> </Text>
              </View>
            </TouchableOpacity>
          </Card>
        )
      })
    )
}

function RenderAd(props) {
  if (props.props.ad.isLoading) {
    return (
      <Loading />
    )
  }
  else if (props.props.ad.errMess) {
    return (<Text>Network Error</Text>)
  }
  else
    return (
      props.props.ad.ads.filter(item => item.id == props.adId).map((item, index) => {
        return (
          <View key={index} style={styles.container} >
            <View style={styles.imgConatiner}>
              <Image source={{ uri: baseUrl + item.img1 }} resizeMode='stretch' style={{ width: '100%', height: '100%', opacity: 0.7 }} />
              {/* <Text>{JSON.stringify(props.props.user)}</Text> */}
              {/* <Text>{JSON.stringify(props.props.ad.ads.filter(item => item.id == props.adId )[0])}</Text> */}
            </View>
            <View style={styles.titleBar} >
              <View style={styles.row} >
                <NumberFormat value={item.price} displayType={'text'} thousandSeparator={true} prefix={'Rs '} renderText={formattedValue => <Text style={styles.priceText} >{formattedValue}</Text>} />
                <Icon name='heart-o' type='font-awesome' size={24} />
              </View>
              <Text style={styles.titleText} >{item.title}</Text>
              <View style={styles.row}>
                <Text><MatIcon name="map-marker" size={11} /><Text style={styles.locText}>{props.props.loc.loc.filter(itm => itm.area_id == item.area_id).map((itm, index) => {
                  return (<Text key={index}>  {itm.area}, {itm.city}</Text>)
                })}</Text> </Text>
                <Text style={styles.dateText}>23 JUL</Text>
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
              {props.props.user.users.map((item, index) => {
                return (
                  <View>
                    <Image source={{ uri: baseUrl + item.img }} />
                    <View>
                      <Text>{item.name}</Text>
                      {/* {date = new Date(item.created_at)} */}
                      <Text>Member since  </Text>
                      {/* {new Intl.DateTimeFormat('en-US').format(date).then((str) => {
                        console.log(str)
                      })} */}
                      {/* <FormattedDate value={new Date(1459832991883)}  year="numeric"  month="long" day="2-digit" /> */}
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
                <RenderRelatedAds props={props.props} cat_id={item.category_id} id={item.id} />
              </View>
            </ScrollView>
          </View>
        )
      })
    )
}

class adDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      search: ''
    }
  }

  UNSAFE_componentWillMount() {
    this.props.fetchUser(this.props.route.params.userId)
  }
  // getUser(userId) {
  //   this.props.fetchUser(userId)
  // }

  render() {
    const { adId, userId } = this.props.route.params
    return (
      <SafeAreaView>
        <ScrollView>
          <View style={styles.container}>
            {/* {this.getUser(userId)} */}
            <RenderAd props={this.props} adId={adId} userId={userId} />
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
    height: 280,
    flex: 1
  },
  titleBar: {
    height: 100,
    borderColor: 'black',
    borderStyle: "solid",
    borderWidth: 1,
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
  }
})


export default connect(mapStateToProps, mapDispatchToProps)(adDetail)