import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform, ScrollView } from 'react-native';
import { SearchBar, Icon, Card, Image, ListItem } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context'
import AntIcon from 'react-native-vector-icons/AntDesign'
import SimIcon from 'react-native-vector-icons/SimpleLineIcons'
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { fetchSubCategories } from '../../redux/Actions'
import { connect } from 'react-redux';
import { Loading } from '../LoadingComponent';
import { Divider } from 'react-native-paper'

const mapDispatchToProps = dispatch => ({
  fetchSubCategories: () => dispatch(fetchSubCategories())
})

const mapStateToProps = state => {
  return {
    subcat: state.subcategories,
    // cat: state.categories
  }
}

function RenderItem(props) {
  if (props.props.subcat.isLoading) {
    return (
      <Loading />
    )
  }
  else if (props.props.subcat.errMess) {
    return (<Text>Network Error</Text>)
  }
  else
    if (props.sell === false)
      return (
        <View style={styles.container}>
          {props.props.subcat.subcategories.filter(item => item.cat_id == props.catId).map((item, index) => {
            return (
              <ListItem key={index} style={styles.categoryLink} onPress={() => props.props.navigation.navigate('productlist', { subcatId: item.subcat_id, catId: item.cat_id })} title={item.title} ></ListItem>
            )
          })}
          <ListItem style={styles.categoryLink} title='View All' onPress={() => props.props.navigation.navigate('productlist', { subcat_id: 'none', catId: props.catId })} >
          </ListItem>
        </View>
      )
    else if (props.sell === true)
      return (
        <View style={styles.container}>
          {/* <Text>{JSON.stringify(props)}</Text> */}
          {props.props.subcat.subcategories.filter(item => item.cat_id == props.catId).map((item, index) => {
            return (
              <ListItem key={index} style={styles.categoryLink}
                onPress={() => props.props.navigation.navigate(`cat${item.cat_id}`, { subcatId: item.subcat_id, catId: item.cat_id })} 
                title={item.title} ></ListItem>
            )
          })}
        </View>
      )
}

class SubCategories extends Component {
  constructor(props) {
    super(props)
  }

  UNSAFE_componentWillMount() {
    if (this.props.subcat.subcategories == [])
      this.props.fetchSubCategories()
  }

  render() {
    this.props.navigation.setOptions({
      title: this.props.route.params.catName
    })
    const { catId, sell } = this.props.route.params

    return (
      <ScrollView style={{ backgroundColor: 'white' }} >
        <RenderItem catId={catId} sell={sell} props={this.props} />
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  categoryLink: {
    margin: 2,
    borderBottomColor: '#aaa',
    borderBottomWidth: 1,
    borderStyle: "solid",
    marginVertical: 0
  },
  productText: {
    marginHorizontal: 5
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(SubCategories)