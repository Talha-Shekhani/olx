import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform, ScrollView } from 'react-native';
import { SearchBar, Icon, Card, Image, ButtonGroup } from 'react-native-elements';
import { NavigationContainer, StackActions, CommonActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context'
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { connect } from 'react-redux';
import { baseUrl } from '../../shared/baseUrl';
import { Loading } from '../LoadingComponent';
import { postComment } from '../../redux/Actions'
import { ToggleButton, Button, RadioButton, Divider } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';

const mapStateToProps = state => ({
})

class AddPackage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedIndex: 0,
      paymentMethod: 'easypaisa'
    }
    // this.updateIndex = this.updateIndex.bind(this)
  }

  updateIndex(index) {
    this.setState({ selectedIndex: index })
  }

  displayPaymentMethod() {
    if (this.state.selectedIndex === 1)
      return (
        <View>
          <Divider style={{ height: 2 }} />
          <RadioButton.Group onValueChange={val => this.setState({ paymentMethod: val })} value={this.state.paymentMethod} >
            <View style={styles.row} >
              <RadioButton.Item value='easypaisa' label='Easy Paisa'
                color='#387eff' labelStyle={styles.labelStyle}
                style={styles.radioStyle} />
              {/* <Text>Easy Paisa</Text> */}
            </View>
            <View style={styles.row} >
              <RadioButton.Item value='bank' label='Bank'
                color='#387eff' labelStyle={styles.labelStyle}
                style={styles.radioStyle} />
              {/* <Text>Bank</Text> */}
            </View>
          </RadioButton.Group>
          <Divider style={{ height: 2 }} />
          {this.displayAcountDetail()}
        </View>
      )
    else return (<></>)
  }

  displayAcountDetail() {
    if (this.state.paymentMethod == 'easypaisa')
      return (
        <Text style={styles.accText} >Easy Paisa Account Number : 123456789</Text>
      )
    else if (this.state.paymentMethod == 'bank')
      return (
        <Text style={styles.accText}>Bank Account Number : 123456789</Text>
      )
    else return (<></>)
  }

  handleNavigate() {
    if (this.state.selectedIndex == 0)
      this.props.navigation.dispatch(CommonActions.reset({ index: 1, routes: [{ name: 'root' }] }))
    else if (this.state.selectedIndex == 1)
      if (this.state.paymentMethod == 'easypaisa')
        console.log('easy')
      else if (this.state.paymentMethod == 'bank')
        console.log('bank')
  }

  render() {
    return (
      <SafeAreaView style={styles.container} >
        <View style={styles.innerContainer} >
          <Text style={styles.haeding} >Select Package </Text>
          <View style={styles.pkgCont}>
            <TouchableOpacity key={0} style={[styles.touchOption, this.state.selectedIndex === 0 ? styles.activeBorder : styles.deactiveBorder]}
              onPress={this.updateIndex.bind(this, 0)} accessible={true} accessibilityLabel='Tap me!' accessibilityHint="Navigates to the previous screen" >
              <Button style={[styles.btnOption, this.state.selectedIndex === 0 ? styles.activeBtn : styles.deactiveBtn]}
                color={this.state.selectedIndex === 0 ? 'white' : 'black'} >
                Basic
              </Button>
              <View style={styles.textsOption} >
                <Text style={{ margin: 5 }} >Expiry One Month</Text>
                <Text style={{ margin: 5 }} >Free!</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity key={1} style={[styles.touchOption, this.state.selectedIndex === 1 ? styles.activeBorder : styles.deactiveBorder]}
              onPress={this.updateIndex.bind(this, 1)} >
              <Button style={[styles.btnOption, this.state.selectedIndex === 1 ? styles.activeBtn : styles.deactiveBtn]}
                color={this.state.selectedIndex === 1 ? 'white' : 'black'} >
                Premium
              </Button>
              <View style={styles.textsOption} >
                <Text style={{ margin: 5 }} >No Expiry ad</Text>
                <Text style={{ margin: 5 }} >$25/ad</Text>
              </View>
            </TouchableOpacity>
          </View>
          {this.displayPaymentMethod()}
        </View>
        <View style={styles.formButton} >
          <Button mode="contained" color='black'
            onPress={this.handleNavigate.bind(this)}
            buttonStyle={{ backgroundColor: '#232323' }} >Next</Button>
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: '100%'
  },
  innerContainer: {
    backgroundColor: 'white',
    height: '88%'
  },
  haeding: {
    fontSize: 20,
    margin: 5,
    marginTop: 20,
    marginLeft: 20,
    fontWeight: 'bold'
  },
  pkgCont: {
    flexDirection: 'row',
    backgroundColor: 'white',
    justifyContent: 'space-evenly',
    margin: 10,
    marginBottom: 20
  },
  touchOption: {
    width: 140,
    flexDirection: 'column',
    borderWidth: 1,
    borderRadius: 5
  },
  btnOption: {
    borderBottomWidth: 1,
    // borderColor: 'black',
    borderRadius: 0
  },
  textsOption: {
    backgroundColor: 'white',
    alignItems: 'center'
  },
  activeBtn: {
    backgroundColor: '#387eff'
  },
  deactiveBtn: {
    backgroundColor: 'white',
    borderBottomColor: 'black'
  },
  activeBorder: {
    borderColor: '#387eff',
    borderBottomColor: '#387eff'
  },
  deactiveBorder: {
    borderColor: 'black'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelStyle: {
    width: '90%'
  },
  radioStyle: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start'
  },
  accText: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 20
  },
  formButton: {
    width: '90%',
    justifyContent: 'flex-end',
    margin: 20,
    bottom: 0,
  },
})

export default connect(mapStateToProps)(AddPackage)