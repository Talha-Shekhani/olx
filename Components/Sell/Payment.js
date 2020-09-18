import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { SearchBar, Icon, Card, Image, ListItem, Input } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context'
import MatIcon from 'react-native-vector-icons/MaterialIcons'
import { fetchSubCategories } from '../../redux/Actions'
import { connect } from 'react-redux';
import { Loading } from '../LoadingComponent';
import { Divider, Button } from 'react-native-paper'
import DateTimePicker from '@react-native-community/datetimepicker'
import ImagePicker from 'react-native-image-picker'

const mapStateToProps = state => {
  return {
    // subcat: state.subcategories
  }
}
var errTransId = '', errDate = '', errBillNo = '', errAmount = '', errImg = ''
class Payment extends Component {
  constructor(props) {
    super(props)
    this.state = {
      form: {
        transactionId: '',
        date: new Date(),
        billNo: '',
        amount: '',
        img: ''
      },
      errTransId: '',
      errDate: '',
      errBillNo: '',
      errAmount: '',
      errImg: '',
      showDate: false
    }
  }

  UNSAFE_componentWillMount() {
    // this.setState({ form: { ...this.state.form, catId: this.props.route.params.catId, subcatId: this.props.route.params.subcatId } })
  }

  getPhotoByCamera() {
    ImagePicker.launchCamera({ allowsEditing: true, mediaType: "photo", storageOptions: { cameraRoll: true } }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        console.log(response)
        this.setState({ form: { ...this.state.form, img: response } })
        // this.processImage()
      }
    })
  }
  getPhotoByGallery() {
    ImagePicker.launchImageLibrary({ allowsEditing: true, mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        console.log(response)
        this.setState({ form: { ...this.state.form, img: response } })
      }
    })
  }

  handleSubmit() {
    // console.log(JSON.stringify(this.state.form))
    if (this.state.form.transactionId == '') {
      this.setState({ errTransId: 'Transaction Id Required' })
      errTransId = 'Transaction Id Required'
    } else if (this.state.form.transactionId.length < 5) {
      console.log(this.state.form.transactionId.length)
      this.setState({ errTransId: 'A minimum length of 5 digits is required.' })
      errTransId = 'A minimum length of 5 digits is required.'
    } else errTransId = ' '
    
    if (this.state.form.amount == '') {
      this.setState({ errAmount: 'Amount Required' })
      errAmount = 'Amount Required'
    } else if (this.state.form.amount.length < 2) {
      this.setState({ errAmount: 'A minimum length of 2 digits is required.' })
      errAmount = 'A minimum length of 2 digits is required.'
    } else errAmount = ' '

    if (this.props.route.params.payment == 'bank') {
      if (this.state.form.billNo == '') {
        this.setState({ billNo: 'Bill number Required' })
        errBillNo = 'Bill number Required'
      } else if (this.state.form.billNo.length < 5) {
        this.setState({ errBillNo: 'A minimum length of 5 digits is required.' })
        errBillNo = 'A minimum length of 5 digits is required.'
      } else errBillNo = ' '
    }

    if (this.state.form.img.length < 1) {
      this.setState({ errImg: 'Image of transaction is required!' })
      errImg = 'Image of transaction is required!'
    } else errImg = ' '
    if (this.props.route.params.payment == 'bank') {
      if (errTransId == ' ' && errAmount == ' ' && errImg == ' ' && errBillNo == ' ')
        console.log('object')
    }
    else if (errTransId == ' ' && errAmount == ' ' && errImg == ' ')
      //     this.props.navigation.navigate('imageselection', { form: this.state.form })
      console.log(this.state.form)
    // this.forceUpdate()
  }

  toggleDatePicker() {
    this.setState({ showDate: !this.state.showDate })
  }

  setDate(event, dat) {
    if (dat != undefined)
      this.setState({
        form: { ...this.state.form, date: dat }
      })
  }

  render() {
    const { payment } = this.props.route.params
    return (
      <SafeAreaView style={{ backgroundColor: 'white' }} >
        <ScrollView style={{ height: '88%', backgroundColor: 'white' }}  >
          <View style={styles.container} >
            <Text style={styles.textTitle} >Transaction id *</Text>
            <Input maxLength={20} containerStyle={styles.formInput} textContentType="postalCode"
              inputContainerStyle={styles.inputContainer} inputStyle={styles.input}
              keyboardType="decimal-pad" renderErrorMessage={true} errorMessage={errTransId}
              onChangeText={(tId) => this.setState({
                form: { ...this.state.form, transactionId: tId }
              })}
            />
            <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', borderColor: '#999', borderWidth: 1.2, }}
              onPress={this.toggleDatePicker.bind(this)} >
              <Text style={{ padding: 5, alignSelf: 'center', color: 'grey' }} >
                {this.state.form.date.toDateString().slice(3)}</Text>
              <Image source={require('../../assets/calendar.png')} style={{ width: 22, height: 22, margin: 5 }} />
            </TouchableOpacity>
            {this.state.showDate && <DateTimePicker
              testID="dateTimePicker"
              value={this.state.form.date}
              mode="date"
              // is24Hour={true}
              onTouchCancel={this.toggleDatePicker()}
              display="default"
              maximumDate={new Date()}
              onChange={this.setDate.bind(this)}
            />}
            <Text style={styles.textTitle} >Amount *</Text>
            <Input maxLength={6} containerStyle={styles.formInput} textContentType='postalCode'
              inputContainerStyle={styles.inputContainer} inputStyle={styles.input}
              keyboardType="decimal-pad" renderErrorMessage={true} errorMessage={errAmount}
              onChangeText={(amount) => this.setState({
                form: { ...this.state.form, amount: amount }
              })}
            />
            {payment == 'bank' &&
              <View>
                <Text style={styles.textTitle} >Bill *</Text>
                <Input maxLength={6} containerStyle={styles.formInput} textContentType='postalCode'
                  inputContainerStyle={styles.inputContainer} inputStyle={styles.input}
                  keyboardType="decimal-pad" renderErrorMessage={true} errorMessage={errBillNo}
                  onChangeText={(billNo) => this.setState({
                    form: { ...this.state.form, billNo: billNo }
                  })}
                />
              </View>}
            <View >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center' }} >
                <Text style={[styles.textTitle, { marginBottom: 10 }]} >ScreenShot of Transaction *</Text>
                <Button onPress={() => this.setState({ form: { ...this.state.form, img: [] } })}
                  contentStyle={{ margin: 8 }} color='black' mode='outlined' >
                  Clear
              </Button>
              </View>
              <Text style={styles.errText}>{errImg}</Text>
              {this.state.form.img == '' && <View style={{ position: 'absolute', marginHorizontal: '44%', marginVertical: '52%', backgroundColor: 'white', zIndex: 5, borderRadius: 5 }} >
                <TouchableOpacity onPress={this.getPhotoByCamera.bind(this)} >
                  <Image source={require('../../assets/camera.png')}
                    style={{ width: 30, height: 30, margin: 5 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={this.getPhotoByGallery.bind(this)}>
                  <Image source={require('../../assets/addGall.png')}
                    style={{ width: 30, height: 30, margin: 5 }} />
                </TouchableOpacity></View>}
              <Image style={{ width: '100%', height: 320 }} source={{ uri: this.state.form.img.uri }} />
            </View>

          </View>
        </ScrollView>
        <View style={styles.formButton} >
          <Button mode="contained" color='black'
            onPress={() => { this.handleSubmit() }}
            buttonStyle={{ backgroundColor: '#232323' }} >Next</Button>
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginVertical: '4%',
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
    margin: 25,
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
    height: 35
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

export default connect(mapStateToProps)(Payment)