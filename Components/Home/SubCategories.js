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
    return (
      <View style={styles.container}>
        {/* <Text>{JSON.stringify(props)}</Text> */}
        {props.props.subcat.subcategories.filter(item => item.cat_id == props.catId).map((item, index) => {
          return (
            <ListItem key={index} style={styles.categoryLink} onPress={() => props.props.navigation.navigate('productlist', {subcatId: item.subcat_id, catId: item.cat_id})} title={item.title} ></ListItem>
          )
        })}
        <ListItem style={styles.categoryLink} title='View All' onPress={() => props.props.navigation.navigate('productlist', {subcat_id: 'none', catId: props.catId})} >
        </ListItem>
      </View>
    )
  // }
  // else if (props.name == 'vehicle') {
  //   return(
  //     <View style={styles.container}>
  //       <ListItem style={styles.categoryLink} title='Cars' >
  //       </ListItem>
  //       <ListItem style={styles.categoryLink} title='Cars on Installment' >
  //       </ListItem>
  //       <ListItem style={styles.categoryLink} title='Cars Accessories' >
  //       </ListItem>
  //       <ListItem style={styles.categoryLink} title='Spare Parts' >
  //       </ListItem>
  //     </View>
  //   )
  // }
}

class SubCategories extends Component {
  constructor(props) {
    super(props)
  }

  UNSAFE_componentWillMount() {
    if (this.props.subcat == undefined)
      this.props.fetchSubCategories()
  }

  render() {
    this.props.navigation.setOptions({
      title: this.props.route.params.catName
    })
    const { cat_id } = this.props.route.params

    return (
      <ScrollView style={{backgroundColor: 'white'}} >
        <RenderItem catId={cat_id} props={this.props} />
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  categoryLink: {
    margin: 5,
  },
  productText: {
    marginHorizontal: 5
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(SubCategories)