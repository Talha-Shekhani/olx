import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform, ScrollView, TouchableOpacity, Picker } from 'react-native';
import { SearchBar, Icon, Card, Image, ListItem, Input } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context'
import MatIcon from 'react-native-vector-icons/MaterialIcons'
import { postAd } from '../../redux/Actions'
import AsyncStorage from '@react-native-community/async-storage'
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

const mapDispatchToProps = dispatch => ({
  postAd: (userId, formData) => dispatch(postAd(userId, formData)),
})

var errTransId = '', errDate = '', errBillNo = '', errBank = '', errImg = ''
class Payment extends Component {
  constructor(props) {
    super(props)
    this.state = {
      form: {
        transactionId: '',
        date: new Date(),
        billNo: '',
        img: '',
        bankName: '',
      },
      errTransId: '',
      errDate: '',
      errBillNo: '',
      errBank: '',
      errImg: '',
      showDate: false,
      userId: 0
    }
  }

  UNSAFE_componentWillMount() {
    AsyncStorage.getItem('userdata')
      .then((userdata) => {
        if (userdata) {
          let userinfo = JSON.parse(userdata)
          this.setState({ userId: userinfo.userId })
        }
        else this.setState({ userId: 0 })
      })
      .catch((err) => console.log('Cannot find user info' + err))
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
        response.data = ''
        response.name = response.fileName
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
        response.data = ''
        response.name = response.fileName
        console.log(response)
        this.setState({ form: { ...this.state.form, img: response } })
      }
    })
  }

  handleSubmit(payment, form) {
    console.log('handle')
    if (this.state.form.transactionId == '') {
      errTransId = 'Transaction Id Required'
      this.setState({ errTransId: 'Transaction Id Required' })
    } else if (this.state.form.transactionId.length < 5) {
      errTransId = 'A minimum length of 5 digits is required.'
      this.setState({ errTransId: 'A minimum length of 5 digits is required.' })
    } else errTransId = ' '

    if (this.state.form.bankName == '') {
      errBank = 'Bank name Required'
      this.setState({ errBank: 'Bank name Required' })
    } else errBank = ' '

    if (payment == 'bank') {
      if (this.state.form.billNo == '') {
        errBillNo = 'Bill number Required'
        this.setState({ billNo: 'Bill number Required' })
      } else if (this.state.form.billNo.length < 5) {
        errBillNo = 'A minimum length of 5 digits is required.'
        this.setState({ errBillNo: 'A minimum length of 5 digits is required.' })
      } else errBillNo = ' '
    }

    if (this.state.form.img.length < 1) {
      this.setState({ errImg: 'Image of transaction is required!' })
      errImg = 'Image of transaction is required!'
    } else errImg = ' '
    form = Object.assign(form, {
      transactionId: this.state.form.transactionId,
      tDate: this.state.form.date,
      billNo: this.state.form.billNo,
      screenshot: this.state.form.img,
      method: this.props.route.params.payment,
      bankName: this.state.form.bankName,
      paid: 'y'
    })
    if (payment == 'bank') {
      console.log('bank')
      if (errTransId == ' ' && errImg == ' ' && errBillNo == ' ')
        console.log('form', JSON.stringify(form))
      this.props.postAd(this.state.userId, form)
    }
    else if (errTransId == ' ' && errImg == ' ') {
      console.log('easypaisa')
      //     this.props.navigation.navigate('imageselection', { form: this.state.form })
      console.log('form', JSON.stringify(form))
      this.props.postAd(this.state.userId, form)
    }
    // this.forceUpdate()
  }

  handleSkip(form) {
    console.log('skip', form)
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
    const { payment, form } = this.props.route.params
    return (
      <SafeAreaView style={{ backgroundColor: 'white' }} >
        <ScrollView style={{ height: '86%', backgroundColor: 'white' }}  >
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
              keyboardType="decimal-pad" editable={false} value={form.price}
            // onChangeText={(amount) => this.setState({
            //   form: { ...this.state.form, amount: amount }
            // })}
            />
            {payment == 'bank' &&
              <View>
                <Text style={styles.textTitle} >Bill # *</Text>
                <Input maxLength={6} containerStyle={styles.formInput} textContentType='postalCode'
                  inputContainerStyle={styles.inputContainer} inputStyle={styles.input}
                  keyboardType="decimal-pad" renderErrorMessage={true} errorMessage={errBillNo}
                  onChangeText={(billNo) => this.setState({
                    form: { ...this.state.form, billNo: billNo }
                  })}
                />
                <Text style={styles.textTitle} >Bank name # *</Text>
                <Picker style={styles.inputCont} selectedValue={this.state.form.bankName} onValueChange={(item) => this.setState({ form: { ...this.state.form, bankName: item } })} >
                  <Picker.Item label='Bank' value='' />
                  <Picker.Item label='Habaib Bank Limited' value='HBL' />
                  <Picker.Item label='United Bank Limited' value='UBL' />
                  <Picker.Item label='National Bank of Pakistan' value='NBP' />
                  <Picker.Item label='Allied' value='Allied' />
                  <Picker.Item label='Alfalah' value='Alfalah' />
                </Picker>
                <Text style={styles.errText}>{errBank}</Text>
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
            onPress={this.handleSkip.bind(this, form)} style={{marginVertical: 5}}
            buttonStyle={{ backgroundColor: '#232323' }} >Skip & Post Ad</Button>
          <Button mode="contained" color='black' style={{marginVertical: 5}}
            onPress={this.handleSubmit.bind(this, payment, form)}
            buttonStyle={{ backgroundColor: '#232323' }} >Next</Button>
        </View>
      </SafeAreaView >
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
    alignSelf: 'center',
    marginVertical: 0,
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

export default connect(mapStateToProps, mapDispatchToProps)(Payment)