import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ToastAndroid, Alert } from 'react-native';
import { SearchBar, Icon, Card, Image } from 'react-native-elements';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import IconMat from 'react-native-vector-icons/MaterialCommunityIcons'
import MatIcon from 'react-native-vector-icons/MaterialIcons'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { putStatus, delAd } from '../../redux/Actions'
import AsyncStorage from '@react-native-community/async-storage'
import { connect } from 'react-redux';
import { baseUrl } from '../../shared/baseUrl';
import NumberFormat from 'react-number-format';
import { Button } from 'react-native-paper';

const mapStateToProps = state => {
  return {
    ads: state.ads,
    loc: state.loc,
  }
}

const mapDispatchToProps = dispatch => ({
  putStatus: (userId, adId, active) => dispatch(putStatus(userId, adId, active)),
  delAd: (adId) => dispatch(delAd(adId))
})

class MyAds extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userId: ''
    }
  }

  componentDidMount() {
    // async function retrieveData() {
    const userdata = AsyncStorage.getItem('userdata')
      .then((userdata) => {
        // Alert.alert(JSON.stringify(userinfo))
        if (userdata) {
          let userinfo = JSON.parse(userdata)
          this.setState({ userId: userinfo.userId })
        }
      })
      .catch((err) => console.log('Cannot find user info' + err))
    // }
    // retrieveData()
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.cardContainer} >
          {/* <Text>{JSON.stringify(this.props)}</Text> */}
          {this.props.ads.ads
            .filter(item => item.user_id == this.state.userId)
            .map((item, index) => {
              { var dat = new Date(item.created_date) }
              return (
                <Card containerStyle={styles.productCardColumn} key={index} >
                  <View style={styles.btnFlowActive} >
                    <Button style={styles.btnFloatText}
                      mode={"contained"}
                      labelStyle={{ fontSize: 12, textTransform: "none" }}
                      contentStyle={{ margin: -6 }} color='#00a6ff'
                      onPress={() => { ToastAndroid.show("Others can't see your ad", ToastAndroid.SHORT); item.active ? console.log('active') : console.log('disbale'); this.props.putStatus(this.state.userId, item.id, item.active) }} >{item.active == 'true' ? 'Disable ?' : 'Active ?'}</Button>
                  </View>
                  <View style={styles.btnFlowDelete}>
                    <Button style={styles.btnFloatText}
                      mode={"contained"}
                      labelStyle={{ fontSize: 12, textTransform: "none" }}
                      contentStyle={{ margin: -6 }} color='#00a6ff'
                      onPress={() => Alert.alert('Pakka?', 'sachi, delete krdu?', [
                        { text: 'Cancel', style: "destructive" },
                        { text: 'OK', style: 'default', onPress: () =>  this.props.delAd(item.id)}
                      ], { cancelable: true })}>Delete Ad</Button>
                  </View>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('addetail', { adId: item.id, userId: item.user_id })} onLongPress={() => { console.log(this.render()) }}  >
                    <View style={styles.product} >
                      <View style={styles.imageConatiner}>
                        <Image containerStyle={styles.cardImage}
                          resizeMethod="scale"
                          resizeMode="contain"
                          source={{ uri: baseUrl + item.img1 }}
                        />
                      </View>
                      <View style={styles.rightSide} >
                        <NumberFormat value={item.price}
                          displayType={'text'}
                          thousandSeparator={true}
                          prefix={'Rs '}
                          renderText={formattedValue => <Text style={styles.productPrice} >{formattedValue}</Text>} />
                        <Text style={styles.productTitle} numberOfLines={1}>{item.title}</Text>
                        <View style={styles.rightBottom} >
                          <Text style={styles.productLoc}>
                            <IconMat name="map-marker" size={10} />
                            {this.props.loc.loc.filter(itm => itm.id == item.area_id).map((itm, index) => {
                              return (<Text key={index}>  {itm.area}, {itm.city}</Text>)
                            })}
                          </Text>
                          <Text style={styles.productDate}>{dat.toUTCString().slice(5, 12)}</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Card>
              )
            })}
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
  btnFlowActive: {
    position: "absolute",
    top: 2,
    right: 2,
    zIndex: 1,
    padding: 2,
    width: 88
  },
  btnFlowDelete: {
    position: "absolute",
    top: 26,
    right: 2,
    zIndex: 1,
    padding: 2,
    width: 88
  },
  btnFloatText: {
    fontSize: 10,
    textTransform: "none",
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(MyAds)