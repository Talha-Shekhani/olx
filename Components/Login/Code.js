import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform, ScrollView, FlatList, Alert, Linking } from 'react-native';
import { Icon, Input, Image, Button } from 'react-native-elements';
import { TextValidator, Form } from 'react-native-validator-form'
import { NavigationContainer, Link } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context'
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { connect } from 'react-redux';
import { baseUrl } from '../../shared/baseUrl';
import { Loading } from '../LoadingComponent';
import { ads } from '../../redux/ads';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { isEmail, isEmpty } from 'react-native-validator-form/lib/ValidationRules';
import { fetchUser } from '../../redux/Actions';
import AsyncStorage from '@react-native-community/async-storage'

const mapStateToProps = state => ({
    user: state.users
})

const mapDispatchToProps = dispatch => ({
    fetchUser: (userEmail) => dispatch(fetchUser(userEmail))
})


class Code extends Component {
    constructor(props) {
        super(props)
        this.state = {
            code1: '',
            code2: '',
            code3: '',
            code4: '',
            errmsg: ''
        }
    }

    UNSAFE_componentWillUpdate() {

    }

    handleSubmit(code, email) {
        console.log(code)
        let cde = this.state.code1 + this.state.code2 + this.state.code3 + this.state.code4
        console.log(cde)
        if (code.toString() === cde.toString()) {
            console.log('object')
            AsyncStorage.removeItem('userdata')
                .then(() => {
                    AsyncStorage.setItem('userdata',
                        JSON.stringify({ email: email }))
                        // .then(() => console.log(this.state.email))
                        .then(() => this.props.navigation.navigate('password', { newUser: true }))
                        .catch((err) => console.log('Could not save user info', err))
                })
        }
    }

    render() {
        const { code, email } = this.props.route.params
        console.log(code, email)
        return (
            <SafeAreaView style={{ backgroundColor: 'white' }}>
                <ScrollView style={{ height: '90%', backgroundColor: 'white' }}  >
                    <View style={styles.container} >
                        {/* <Image source={{ uri: baseUrl + 'boy.png' }} style={styles.image} /> */}
                        <Text style={styles.title}>Enter your Code</Text>
                        <View style={{ flexDirection: 'row', margin: 10, justifyContent: 'center' }} >
                            <Input
                                inputContainerStyle={styles.inputContainer}
                                containerStyle={styles.formInput}
                                inputStyle={styles.input}
                                keyboardType="decimal-pad"
                                maxLength={1}
                                ref={(input) => { this.code1 = input }}
                                value={this.state.code1}
                                onChangeText={(code1) => {
                                    this.setState({ code1: code1 })
                                    if (code1.length == 1)
                                        this.code2.focus()
                                }}
                            />
                            <Input
                                inputContainerStyle={styles.inputContainer}
                                containerStyle={styles.formInput}
                                inputStyle={styles.input}
                                keyboardType="decimal-pad"
                                maxLength={1}
                                ref={(input) => { this.code2 = input }}
                                value={this.state.code2}
                                onChangeText={(code2) => {
                                    this.setState({ code2: code2 })
                                    if (code2.length == 1)
                                        this.code3.focus()
                                    else if (code2.length == 0)
                                        this.code1.focus()
                                }}
                            />
                            <Input
                                inputContainerStyle={styles.inputContainer}
                                containerStyle={styles.formInput}
                                inputStyle={styles.input}
                                keyboardType="decimal-pad"
                                maxLength={1}
                                ref={(input) => { this.code3 = input }}
                                value={this.state.code3}
                                onChangeText={(code3) => {
                                    this.setState({ code3: code3 })
                                    if (code3.length == 1)
                                        this.code4.focus()
                                    else if (code3.length == 0)
                                        this.code2.focus()
                                }}
                            />
                            <Input
                                inputContainerStyle={styles.inputContainer}
                                containerStyle={styles.formInput}
                                inputStyle={styles.input}
                                keyboardType="decimal-pad"
                                maxLength={1}
                                ref={(input) => { this.code4 = input }}
                                value={this.state.code4}
                                onChangeText={(code4) => {
                                    this.setState({ code4: code4 })
                                    if (code4.length == 0)
                                        this.code3.focus()
                                }}
                            />
                        </View>
                    </View>
                </ScrollView>
                <View style={styles.formButton} >
                    <Button
                        onPress={this.handleSubmit.bind(this, code, email)}
                        title='Next'
                        buttonStyle={{ backgroundColor: '#232323' }} />
                </View>
            </SafeAreaView >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        alignContent: 'space-between',
        margin: 25,
        backgroundColor: 'white'
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold'
    },
    heading: {
        fontSize: 16,
        marginTop: 40,
    },
    image: {
        margin: 10,
        width: 80,
        height: 80
    },
    formInput: {
        marginVertical: 10,
        marginHorizontal: 10,
        width: '10%',
        paddingHorizontal: 0,
    },
    input: {
        paddingHorizontal: 10,
        fontSize: 20
    },
    inputContainer: {
        backgroundColor: '#eee',
        borderBottomColor: 'white',
        borderRadius: 10
    },
    formButton: {
        width: '90%',
        justifyContent: 'flex-end',
        margin: 20,
        bottom: 0,
        marginVertical: 0
    }
})


export default connect(mapStateToProps, mapDispatchToProps)(Code)