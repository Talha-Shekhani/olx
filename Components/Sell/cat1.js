import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform, ScrollView } from 'react-native';
import { SearchBar, Icon, Card, Image, ListItem, Input } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context'
import AntIcon from 'react-native-vector-icons/AntDesign'
import SimIcon from 'react-native-vector-icons/SimpleLineIcons'
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { fetchSubCategories } from '../../redux/Actions'
import { connect } from 'react-redux';
import { Loading } from '../LoadingComponent';
import { Divider, Button } from 'react-native-paper'
import { Picker } from '@react-native-community/picker'

const mapStateToProps = state => {
  return {
    subcat: state.subcategories
  }
}
var errCond = '', errType = '', errTitle = '', errDesc = ''
class cat1 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      form: {
        condition: '',
        type: '',
        title: '',
        description: '',
        catId: '',
        subcatId: ''
      },
      errCond: '',
      errType: '',
      errTitle: '',
      errDesc: '',
      isNewPress: false,
      isUsedPress: false
    }
  }

  handleSubmit() {
    console.log(JSON.stringify(this.state.form))
    if (this.state.form.condition == '') {
      this.setState({ errCond: 'Condition Required' })
      errCond = 'Condition Required'
    }
    else errCond = ' '
    if (this.state.form.type == '') {
      this.setState({ errType: 'Type Required' })
      errType = 'Type Required'
    }
    else errType = ' '
    if (this.state.form.title == '') {
      this.setState({ errTitle: 'Title Required' })
      errTitle = 'Title Required'
    }
    else if (this.state.form.title.length < 5) {
      this.setState({ errTitle: 'A minimum length of 5 characters is required.' })
      errTitle = 'A minimum length of 5 characters is required.'
    }
    else errTitle = ' '
    if (this.state.form.description == '') {
      this.setState({ errDesc: 'Description Required' })
      errDesc = 'Description Required'
    }
    else if (this.state.form.description.length < 20) {
      this.setState({ errDesc: 'A minimum length of 5 characters is required.' })
      errDesc = 'A minimum length of 5 characters is required.'
    }
    else errDesc = ' '
    if (errCond == ' ' && errDesc == ' ' && errTitle == ' ' && errType == ' ')
      this.props.navigation.navigate('imageselection', { form: this.state.form })
  }

  render() {
    
    const { catId, subcatId } = this.props.route.params
    return (
      <SafeAreaView style={{ backgroundColor: 'white' }} >
        <ScrollView style={{ height: '90%', backgroundColor: 'white' }}  >
          {/* <View><Text>{catId + ' ' + subcatId}</Text></View> */}
          <View style={styles.container} >
            <Text style={styles.textCond} >Condition *</Text>
            <View style={styles.rowBtn}>
              <Button style={this.state.isNewPress ? styles.pressBtn : styles.btn} onPress={() => { this.setState({ form: { ...this.state.form, condition: this.state.form.condition == 'new' ? '' : 'new' } }); this.setState({ isNewPress: !this.state.isNewPress }); this.setState({ isUsedPress: false }) }} mode='outlined' color='black' >New</Button>
              <Button style={this.state.isUsedPress ? styles.pressBtn : styles.btn} onPress={() => { this.setState({ form: { ...this.state.form, condition: this.state.form.condition == 'used' ? '' : 'used' } }); this.setState({ isUsedPress: !this.state.isUsedPress }); this.setState({ isNewPress: false }) }} mode='outlined' color='black' >Used</Button>
            </View>
            <Text style={styles.errText} >{errCond}</Text>
            <Text style={styles.textTitle} >Type *</Text>
            <Picker style={styles.inputCont} selectedValue={this.state.form.type} onValueChange={(item) => this.setState({ form: { ...this.state.form, type: item } })} >
              <Picker.Item label='Tablet > Type' value='' />
              <Picker.Item label='Apple' value='Apple' />
              <Picker.Item label='Danny Tabs' value='Danny Tabs' />
              <Picker.Item label='Q Tabs' value='Q Tabs' />
              <Picker.Item label='Samsung' value='Samsung' />
              <Picker.Item label='Other Tablets' value='Other Tablets' />
            </Picker>
            <Text style={styles.errText} >{errType}</Text>
            <Text style={styles.textTitle} >Ad Title *</Text>
            <Input
              maxLength={70}
              containerStyle={styles.formInput}
              inputContainerStyle={styles.inputContainer}
              inputStyle={styles.input}
              keyboardType="default"
              name="title"
              renderErrorMessage={true}
              errorMessage={errTitle}
              onChangeText={(title) => this.setState({ form: { ...this.state.form, title: title } })}
              rightIcon={<Text style={styles.counterText} >{this.state.form.title.length}/70</Text>}
            />
            <Text style={styles.textTitle}>Description what are you selling? *</Text>
            <Input
              maxLength={4096}
              containerStyle={styles.formInput}
              inputContainerStyle={styles.inputContainer}
              inputStyle={styles.input}
              keyboardType="default"
              name="desc"
              renderErrorMessage={true}
              errorMessage={errDesc}
              onChangeText={(desc) => this.setState({ form: { ...this.state.form, description: desc } })}
              rightIcon={<Text style={styles.counterText} >{this.state.form.description.length}/4096</Text>}
            />
          </View>
        </ScrollView>
        <View style={styles.formButton} >
          <Button mode="contained" color='black'
            onPress={() => { this.setState({ form: { ...this.state.form, catId: catId, subcatId: subcatId } }); this.handleSubmit() }}
            buttonStyle={{ backgroundColor: '#232323' }} >Next</Button>
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginVertical: '15%',
    marginHorizontal: 20
  },
  textCond: {
    color: 'grey',
    fontSize: 18,
    marginVertical: 5
  },
  rowBtn: {
    flexDirection: "row",
    width: '100%',
    marginHorizontal: '5%'
  },
  btn: {
    width: '45%',
    marginHorizontal: 5
  },
  pressBtn: {
    backgroundColor: '#a1ffac',
    borderWidth: 2,
    borderColor: 'green',
    width: '45%',
    marginHorizontal: 5
  },
  textTitle: {
    color: 'grey',
    marginTop: 15
  },
  formButton: {
    width: '90%',
    justifyContent: 'flex-end',
    margin: 20,
    bottom: 0,
  },
  inputCont: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    borderStyle: "solid"
  },
  formInput: {
    width: '100%',
    paddingHorizontal: 0,
  },
  inputContainer: {
    height: 33
  },
  input: {
    paddingHorizontal: 10
  },
  counterText: {
    alignSelf: 'flex-end',
    margin: 0,
    fontSize: 12,
    position: "absolute",
    color: 'grey',
    top: 45,
  },
  errText: {
    color: 'red',
    fontSize: 12,
    marginTop: 2
  }
})

export default connect(mapStateToProps)(cat1)