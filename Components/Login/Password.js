import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform, ScrollView, FlatList, Alert } from 'react-native';
import { Icon, Input, Image, Button } from 'react-native-elements';
import { TextValidator, Form } from 'react-native-validator-form'
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context'
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { connect } from 'react-redux';
import { baseUrl } from '../../shared/baseUrl';
import { Loading } from '../LoadingComponent';
import { ads } from '../../redux/ads';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { isEmail, matchRegexp } from 'react-native-validator-form/lib/ValidationRules';
import { fetchUser, checkUser, postUser } from '../../redux/Actions';
import AsyncStorage from '@react-native-community/async-storage'
// const bcrypt = require('bcrypt');
// const saltRounds = 10;

const mapStateToProps = state => ({
    user: state.users
})

const mapDispatchToProps = dispatch => ({
    checkUser: (email, password) => dispatch(checkUser(email, password)),
    postUser: (email, password) => dispatch(postUser(email, password))
})


class Password extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            errmsg: '',
            userId: '',
        }
    }

    UNSAFE_componentWillMount() {
        // async function retrieveData() {
        const userdata = AsyncStorage.getItem('userdata')
            .then((userdata) => {
                // Alert.alert(JSON.stringify(userinfo))
                if (userdata) {
                    let userinfo = JSON.parse(userdata)
                    this.setState({ email: userinfo.email })
                    this.setState({ userId: userinfo.userId })
                    console.log(userinfo)
                }
            })
            .catch((err) => console.log('Cannot find user info' + err))
        // }
        // retrieveData()
    }

    componentWillUnmount() {
        this.forceUpdate()
    }

    handleSubmit(newUser) {
        if (this.state.password != '') {
            // Alert.alert(JSON.stringify(this.props.user))
            if (matchRegexp(this.state.password, /^[A-Za-z0-9]\w{7,14}$/)) {
                this.setState({ errmsg: ' ' })
                if (newUser) {
                    this.props.postUser(this.state.email, this.state.password)
                        .then((res) => {
                            if (res != null && res.success == true)
                                AsyncStorage.setItem('userdata',
                                    JSON.stringify({ email: this.state.email, password: this.state.password, userId: res.userId }))
                                    // .then(() => console.log(this.state.email, this.state.password, res.userId))
                                    .then(() => this.props.navigation.dispatch(StackActions.replace('root')))
                                    .catch((err) => console.log('Could not save user info', err))
                        })
                }
                else if (!newUser) {
                    let check = false
                    Promise.resolve(this.props.checkUser(this.state.email, this.state.password))
                        .then((data) => {
                            check = data
                        }).then(() => {
                            if (check != false)
                                AsyncStorage.setItem('userdata',
                                    JSON.stringify({ email: this.state.email, password: this.state.password, userId: this.state.userId }))
                                    .then(() => this.props.navigation.dispatch(StackActions.replace('root')))
                                    .catch((err) => console.log('Could not save user info', err))
                            else this.setState({ errmsg: 'password not Matched' })
                        })
                }
            }
            else this.setState({ errmsg: 'Not Valid password' })
        }
        else this.setState({ errmsg: 'Password is Required' })
    }

    render() {
        const { newUser } = this.props.route.params
        return (
            <SafeAreaView style={{ backgroundColor: 'white' }}>
                <ScrollView style={{ height: '90%', backgroundColor: 'white' }}  >
                    <View style={styles.container} >
                        <Image source={{ uri: baseUrl + 'boy.png' }} style={styles.image} />
                        <Text style={styles.title}>Enter your Password</Text>
                        <Text style={styles.heading}>Welcome Back {this.state.email}</Text>
                        <Input
                            inputContainerStyle={styles.inputContainer}
                            containerStyle={styles.formInput}
                            inputStyle={styles.input}
                            textContentType="password"
                            secureTextEntry={true}
                            keyboardType="default"
                            name="password"
                            renderErrorMessage={true}
                            errorMessage={this.state.errmsg}
                            placeholder="Password"
                            type="text"
                            // keyboardType="email-address"
                            onChangeText={(password) => this.setState({ password: password })}
                            value={this.state.password}
                        />
                    </View>
                </ScrollView>
                <View style={styles.formButton} >
                    <Button
                        onPress={(this.handleSubmit.bind(this, newUser))}
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
        marginBottom: 40,
    },
    image: {
        margin: 10,
        width: 80,
        height: 80
    },
    formInput: {
        marginVertical: 10,
        width: '100%',
        paddingHorizontal: 0
    },
    input: {
        paddingHorizontal: 10,
    },
    formButton: {
        width: '90%',
        justifyContent: 'flex-end',
        margin: 20,
        bottom: 0,
    }
})


export default connect(mapStateToProps, mapDispatchToProps)(Password)