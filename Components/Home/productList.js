import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform, ScrollView } from 'react-native';
import { SearchBar, Icon, Card, Image } from 'react-native-elements';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context'
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { connect } from 'react-redux';
import { baseUrl } from '../../shared/baseUrl';
import NumberFormat from 'react-number-format';
import { Loading } from '../LoadingComponent';
import { postComment } from '../../redux/Actions'

const mapStateToProps = state => ({
  cat: state.categories,
  subcat: state.subcategories,
  ads: state.ads,
  loc: state.loc,
  feat: state.featured
})

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      search: ''
    }
  }

  renderAds(catId, subcatId, type) {
    if (this.props.ads.isLoading) {
      return (
        <Loading />
      )
    }
    else if (this.props.ads.errMess) {
      return (<Text>Network Error</Text>)
    }
    else
      if (subcatId == undefined)
        return (
          this.props.ads.ads.filter(item => item.type == type && item.category_id == catId).map((item, index) => {
            let feat = ''
            { var dat = new Date(item.created_date) }
            { feat = this.props.feat.featured.filter(itm => item.category_id == itm.cat_id).map((item, index) => { return (item.cat_id) }) }
            return (
              <Card containerStyle={styles.productCardColumn}>
                {feat == item.category_id && item.type != 'premium' ? <View style={styles.featuredTag} >
                  <Text style={styles.featuredText}>Featured</Text>
                </View> : <></>}
                {item.type == 'premium' ? <View style={styles.premiumTag} >
                  <Text style={styles.premiumText}>Premium</Text>
                </View> : <></>}
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
                      <Text style={styles.productLoc}>
                        <MatIcon name="map-marker" size={10} />
                        {this.props.loc.loc.filter(itm => itm.id == item.area_id).map((itm, index) => {
                          return (<Text key={index}>  {itm.area}, {itm.city}</Text>)
                        })}</Text>
                      <Text style={styles.productDate}>{dat.toUTCString().slice(5, 12)}</Text>
                    </View>
                  </View>
                </View>
              </Card>
            )
          })
        )
      else
        return (
          this.props.ads.ads.filter(item => item.type == type && item.category_id == catId && item.sub_category_id == subcatId).map((item, index) => {
            let feat = ''
            { var dat = new Date(item.created_date) }
            { feat = this.props.feat.featured.filter(itm => item.category_id == itm.cat_id).map((item, index) => { return (item.cat_id) }) }
            return (
              <Card containerStyle={styles.productCardColumn} key={index}>
                {feat == item.category_id && item.type != 'premium' ? <View style={styles.featuredTag} >
                  <Text style={styles.featuredText}>Featured</Text>
                </View> : <></>}
                {item.type == 'premium' ? <View style={styles.premiumTag} >
                  <Text style={styles.premiumText}>Premium</Text>
                </View> : <></>}
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
                      <Text style={styles.productLoc}>
                        <MatIcon name="map-marker" size={10} />
                        {this.props.loc.loc.filter(itm => itm.id == item.area_id).map((itm, index) => {
                          return (<Text key={index}>  {itm.area}, {itm.city}</Text>)
                        })}</Text>
                      <Text style={styles.productDate}>{dat.toUTCString().slice(5, 12)}</Text>
                    </View>
                  </View>
                </View>
              </Card>
            )
          })
        )
  }

  render() {
    const { catId, subcatId } = this.props.route.params
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
              platform='android' />
            <View style={styles.cardContainer} >
              {this.renderAds(catId, subcatId, 'premium')}
              {this.renderAds(catId, subcatId, 'basic')}
              {/* <RenderAds props={this.props} catId={catId} subcatId={subcatId} /> */}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {

  },
  inputContainerStyle: {
    height: 24,
  },
  inputStyle: {
    minHeight: 24,
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
    marginHorizontal: 2,
    padding: 0,
    borderColor: 'grey',
    borderRadius: 5,
    marginVertical: 8
  },
  product: {
    flexDirection: 'row',
    width: '100%'
  },
  featuredTag: {
    backgroundColor: '#fff200',
    width: 80,
    position: 'absolute',
    zIndex: 1,
    padding: 1,
    margin: 5,
    elevation: 2
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


export default connect(mapStateToProps)(Home)