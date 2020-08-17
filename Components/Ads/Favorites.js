import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Icon, Card, Image } from 'react-native-elements';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import IconMat from 'react-native-vector-icons/MaterialCommunityIcons'
import MatIcon from 'react-native-vector-icons/MaterialIcons'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { fetchFav, delFav } from '../../redux/Actions'
import { Loading } from '../LoadingComponent'
import NumberFormat from 'react-number-format';
import AsyncStorage from '@react-native-community/async-storage'
import { connect } from 'react-redux';
import { baseUrl } from '../../shared/baseUrl';
import { isEmpty } from 'react-native-validator-form/lib/ValidationRules';


const mapStateToProps = state => {
  return {
    fav: state.favorites,
    ads: state.ads
  }
}

const mapDispatchToProps = dispatch => ({
  // fetchFav: (userId) => dispatch(fetchFav(userId)),
  delFav: (userId, adId) => dispatch(delFav(userId, adId))
})

function RenderItem(props) {
  if (props.props.fav.isLoading) {
    return (
      <Loading />
    )
  }
  else if (props.props.fav.errMess) {
    return (<Text>Network Error</Text>)
  }
  else
    if (props.userId != undefined)
      if (!isEmpty(props.props.fav.favorites)) {
        return (
          // <Text>{JSON.stringify(props.props.fav.favorites[0].ad_id) + ' '+ x}</Text>
          props.props.fav.favorites.map((itm, indx) => {
            return (
              props.props.ads.ads.filter(item => item.id == itm.ad_id).map((item, index) => {
                return (
                  <Card containerStyle={styles.productCardColumn} key={index} onPress={() => props.props.navigation.navigate('addetail', { adId: item.id, userId: item.user_id })}>
                    <View style={styles.iconHBack} ><Icon name='heart' onPress={() => props.props.delFav(item.user_id, item.id)} type="font-awesome" style={styles.iconHeart} color={'red'} /></View>
                    <TouchableOpacity>
                      <View style={styles.product} >
                        <View style={styles.imageConatiner}>
                          <Image containerStyle={styles.cardImage}
                            resizeMethod="scale"
                            resizeMode="stretch"
                            source={{ uri: baseUrl + item.img1 }}
                          />
                        </View>
                        <View style={styles.rightSide} >
                          <NumberFormat value={item.price} displayType={'text'} thousandSeparator={true} prefix={'Rs '} renderText={formattedValue => <Text style={styles.productPrice} >{formattedValue}</Text>} />
                          <Text style={styles.productTitle} numberOfLines={1}>{item.title}</Text>
                          <View style={styles.rightBottom} >
                            <Text style={styles.productLoc}><IconMat name="map-marker" size={10} />Karachi, Sindh</Text>
                            <Text style={styles.productDate}>23 JUL</Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </Card>
                )
              })
            )
          })

        )
      }
      else return (<View><Text>No Favorites</Text></View>)
}

class Favorites extends Component {

  constructor(props) {
    super(props)
    this.state = {
      userId: '',
    }
  }

  componentDidUpdate() {
    // this.props.fetchFav(this.state.userId)
    console.log(this.props.fav)
  }

  UNSAFE_componentWillMount() {
    async function retrieveData() {
      const userdata = await AsyncStorage.getItem('userdata')
        .then((userdata) => {
          // Alert.alert(JSON.stringify(userinfo))
          if (userdata) {
            let userinfo = JSON.parse(userdata)
            this.setState({ userId: userinfo.userId })
          }
        })
        // .then(() => this.props.fetchFav(this.state.userId))
        .catch((err) => console.log('Cannot find user info' + err))
    }
    retrieveData()

  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.cardContainer} >
          <RenderItem props={this.props} userId={this.state.userId} />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  cardContainer: {
    backgroundColor: 'white',
    marginTop: 0,
    padding: 10,
    paddingBottom: 15
  },
  rightSide: {
    margin: 5,
    width: '60%',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20
  },
  productTitle: {
    fontSize: 14,
    overflow: "hidden",
  },
  rightBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 35,
  },
  productLoc: {
    fontSize: 10,
  },
  productDate: {
    fontSize: 10
  },
  imageConatiner: {
    width: '32%',
    height: '85%',
    margin: 10
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  productCardColumn: {
    width: '100%',
    height: 130,
    marginHorizontal: 0,
    padding: 0,
    borderColor: 'grey',
    borderRadius: 5,
    marginVertical: 8
  },
  product: {
    flexDirection: 'row',
    width: '100%'
  },
  iconHBack: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderRadius: 50,
    margin: 5,
    width: 40,
    height: 40,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    zIndex: 2,
    // elevation: 20,
  },
  iconHeart: {
    zIndex: 2
  },
})


export default connect(mapStateToProps, mapDispatchToProps)(Favorites)