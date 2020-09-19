import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform, ScrollView, FlatList, InteractionManager } from 'react-native';
import { SearchBar, Icon, Card, Image } from 'react-native-elements';
import { NavigationContainer, StackActions, TabActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context'
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { connect } from 'react-redux';
import { baseUrl } from '../../shared/baseUrl';
import { Loading } from '../LoadingComponent';
import { postFav, delFav, fetchFav, fetchFeat } from '../../redux/Actions'
import { ads } from '../../redux/ads'
import AsyncStorage from '@react-native-community/async-storage'
import { TouchableOpacity, State } from 'react-native-gesture-handler'
import { isEmpty } from 'react-native-validator-form/lib/ValidationRules'
import { Button } from 'react-native-paper';

const mapStateToProps = state => ({
  ads: state.ads,
  cat: state.categories,
  loc: state.loc,
  fav: state.favorites,
  feat: state.featured
})

const mapDispatchToProps = dispatch => ({
  delFav: (userId, adId) => dispatch(delFav(userId, adId)),
  fetchFav: (userId) => dispatch(fetchFav(userId)),
  postFav: (userId, adId) => dispatch(postFav(userId, adId)),
  fetchFeat: (userId) => dispatch(fetchFeat(userId))
})

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      search: '',
      userId: '',
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
          console.log(this.state.userId)
          this.props.fetchFav(this.state.userId)
          this.props.fetchFeat(this.state.userId)
        })
        .catch((err) => console.log('Cannot find user info' + err))
    })
  }

  renderCat() {
    if (this.props.cat.errMess) {
      return (<Text>Network Error</Text>)
    }
    else
      return (
        // <Text>{JSON.stringify(props.props)}</Text>
        this.props.cat.categories.map((item, index) => {
          while (index < 9)
            return (
              <TouchableOpacity key={index} style={styles.categoryLink}
                onPress={() => this.props.navigation.navigate('subcategories', { catId: item.cat_id, catName: item.title, sell: false })} >
                <View style={styles.iconBack}>
                  <Image style={{ width: 40, height: 40 }} source={{ uri: baseUrl + item.img }} />
                </View>
                <Text style={styles.productText} >{item.title}</Text>
              </TouchableOpacity>
            )
        })
      )
  }

  renderAds(userId, type) {
    // console.log(this.props.ads)
    if (this.props.ads.isLoading || this.props.fav.isLoading) {
      return (
        <Loading />
      )
    }
    else
      if (this.props.ads.errMess || this.props.fav.errMess) {
        return (<Text>Network Error</Text>)
      }
      else
        // if (!isEmpty(this.props.fav.favorites))
        return (
          this.props.ads.ads
            .filter(item => type == 'premium' ? item.paid == 'y' : item.paid == '' && item.active === 'true' && (item.title.toLowerCase().includes(this.state.search) ||
              this.props.cat.categories
                .filter(el => el.title.toLowerCase().includes(this.state.search))
                .find(el => el.cat_id == item.category_id) != undefined)
            )
            .map((item, index) => {
              let fav = '', feat = ''
              { if (this.state.userId != 0) fav = this.props.fav.favorites.filter(itm => item.id == itm.ad_id && itm.user_id == userId).map((item, index) => { return (item.ad_id) }) }
              { if (this.state.userId != 0) feat = this.props.feat.featured.filter(itm => item.category_id == itm.cat_id && itm.user_id == userId).map((item, index) => { return (item.cat_id) }) }
              return (
                <Card containerStyle={styles.productCardColumn} key={index} >
                  {feat == item.category_id && item.type != 'premium' ? <View style={styles.featuredTag} >
                    <Text style={styles.featuredText}>Featured</Text>
                  </View> : <></>}
                  {item.type == 'premium' ? <View style={styles.premiumTag} >
                    <Text style={styles.premiumText}>Premium</Text>
                  </View> : <></>}
                  <View style={styles.iconHBack} ><Icon name={fav == item.id ? 'heart' : 'heart-o'} type='font-awesome' onPress={() => {
                    if (fav == item.id)
                      this.props.delFav(userId, item.id)
                    else
                      this.props.postFav(userId, item.id)
                  }}
                    type="font-awesome" style={styles.iconHeart} color={'red'} /></View>
                  <TouchableOpacity key={index} onPress={() => this.props.navigation.dispatch(StackActions.push('addetail', { adId: item.id, userId: item.user_id, catId: item.category_id }))} >
                    <View style={styles.imageConatiner}>
                      <Image containerStyle={styles.cardImage}
                        resizeMethod="scale"
                        resizeMode="contain"
                        source={{ uri: (baseUrl + item.img1), cache: 'force-cache' }}
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
            })
        )
  }

  render() {
    if (this.state.userId != undefined || 0 || '')
      return (
        <SafeAreaView>
          {/* <Button onPress={() => this.props.navigation.dispatch(StackActions.push('addpkg', { payment: 'bank' }))} >Development Shortcut</Button> */}
          <ScrollView>
            <View style={styles.container} >
              <SearchBar containerStyle={styles.searchBar}
                inputContainerStyle={styles.inputContainerStyle}
                inputStyle={styles.inputStyle}
                placeholder=""
                value={this.state.search}
                onChangeText={(val) => this.setState({ search: val })}
                platform='android' />
              <View style={styles.cardContainer}>
                <View style={styles.row}><Text>Browse Categories</Text><Text style={styles.link} onPress={() => this.props.navigation.navigate('categories')} >See all</Text></View>
                <View style={styles.categories}>
                  {this.renderCat()}
                </View>
              </View>

              <View style={styles.cardContainer} >
                <View style={styles.row}><Text>More on </Text><Text style={styles.link}>View more</Text></View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}
                // style={{width: 100}}
                >
                  {this.props.ads.ads
                    .filter(item => item.type == 'basic' && item.active === 'true' && item.category_id == this.props.feat.featured
                      .filter(itm => item.category_id == itm.cat_id && itm.user_id == this.state.userId)
                      .map((item, index) => { return (item.cat_id) }))
                    .map((item, index) => {
                      let fav = '', feat = ''
                      { fav = this.props.fav.favorites.filter(itm => item.id == itm.ad_id && itm.user_id == this.state.userId).map((item, index) => { return (item.ad_id) }) }
                      { feat = this.props.feat.featured.filter(itm => item.category_id == itm.cat_id && itm.user_id == this.state.userId).map((item, index) => { return (item.cat_id) }) }
                      return (
                        <Card containerStyle={styles.productCardColumnScroll} key={index} >
                          {feat == item.category_id && item.type != 'premium' ? <View style={styles.featuredTag} >
                            <Text style={styles.featuredText}>Featured</Text>
                          </View> : <></>}
                          {item.type == 'premium' ? <View style={styles.premiumTag} >
                            <Text style={styles.premiumText}>Premium</Text>
                          </View> : <></>}
                          <View style={styles.iconHBack} ><Icon name={fav == item.id ? 'heart' : 'heart-o'} type='font-awesome' onPress={() => {
                            if (fav == item.id)
                              this.props.delFav(this.state.userId, item.id)
                            else
                              this.props.postFav(this.state.userId, item.id)
                          }}
                            type="font-awesome" style={styles.iconHeart} color={'red'} /></View>
                          <TouchableOpacity key={index} onPress={() => this.props.navigation.dispatch(StackActions.push('addetail', { adId: item.id, userId: item.user_id, catId: item.category_id }))} >
                            <View style={styles.imageConatiner}>
                              <Image containerStyle={styles.cardImage}
                                resizeMethod="scale"
                                resizeMode="contain"
                                source={{ uri: (baseUrl + item.img1), cache: 'force-cache' }}
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
              </View>
              <View style={styles.cardContainer} >
                <View style={styles.row}><Text>Fresh Recommendations</Text></View>
                <View style={styles.cardColumn} >
                  {this.renderAds(this.state.userId, 'premium')}
                  {this.renderAds(this.state.userId, 'basic')}
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      )
    else return (<></>)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  inputContainerStyle: {
    height: 24,
  },
  inputStyle: {
    fontSize: 14
  },
  searchBar: {
    height: 40,
    borderColor: 'black',
    borderStyle: 'solid',
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
  },
  link: {
    textDecorationLine: 'underline'
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryLink: {
    width: 120,
    minWidth: 95,
    margin: '0%',
    marginVertical: 12,
    justifyContent: 'center',
    alignSelf: 'center'
  },
  iconBack: {
    borderRadius: 50,
    // width: '100%',
    height: 40,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  iconHBack: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 50,
    width: 40,
    height: 40,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    zIndex: 2,
  },
  iconHeart: {
    zIndex: 2
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
    width: '98%',
    height: '62%',
    margin: 2
  },
  cardImage: {
    alignSelf: 'center',
    width: '100%',
    height: '100%',
    paddingVertical: 5
  },
  cardColumn: {
    overflow: "scroll",
    flexWrap: "wrap",
    flexDirection: 'row',
    marginBottom: 40
  },
  productCardColumn: {
    width: '47%',
    height: 250,
    padding: 5,
    marginHorizontal: 4,
    borderColor: 'grey',
    borderRadius: 5,
    marginVertical: 8
  },
  productCardColumnScroll: {
    width: 160,
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
    marginTop: 18
  },
  featuredTag: {
    backgroundColor: '#fff200',
    width: 80,
    position: 'absolute',
    zIndex: 1,
    padding: 1,
    margin: 2
  },
  featuredText: {
    alignSelf: 'center'
  },
  premiumTag: {
    backgroundColor: '#00e5ff',
    width: 80,
    position: 'absolute',
    zIndex: 1,
    padding: 1,
    margin: 4,
    elevation: 2
  },
  premiumText: {
    alignSelf: 'center'
  }
})


export default connect(mapStateToProps, mapDispatchToProps)(Home)