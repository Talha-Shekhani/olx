import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform, ScrollView, FlatList, Alert, Linking } from 'react-native';
import { Icon, Input, Image, Button } from 'react-native-elements';
import { TextValidator, Form } from 'react-native-validator-form'
import { NavigationContainer, Link } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context'
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { connect } from 'react-redux';
import { baseUrl, imageUrl } from '../../shared/baseUrl';
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


class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            errmsg: ''
        }
    }

    UNSAFE_componentWillUpdate() {

    }

    handleSubmit() {
        if (this.state.email != '') {
            // Alert.alert(JSON.stringify(this.props.user))
            if (isEmail(this.state.email)) {
                Promise.resolve(this.props.fetchUser(this.state.email))
                    .then(() => {
                        if (!isEmpty(this.props.user.users[0])) {
                            if (this.state.email == this.props.user.users[0].email) {
                                // _removeStoreData = async () => {
                                AsyncStorage.removeItem('userdata')
                                    .then(() => {
                                        // _StoreData = async () => {
                                        AsyncStorage.setItem('userdata',
                                            JSON.stringify({ email: this.state.email, userId: this.props.user.users[0].id }))
                                            .then(() => console.log(this.state.email))
                                            .then(() => this.props.navigation.navigate('password', { newUser: false }))
                                            .catch((err) => console.log('Could not save user info', err))
                                        // }
                                    })
                                // }
                            }
                            else this.setState({ errmsg: 'Email not Matched' })
                        }
                        else this.setState({ errmsg: 'Email not Matched!' })
                    })
            }
            else this.setState({ errmsg: 'Not Valid Email' })
        }
        else this.setState({ errmsg: 'Email is Required' })
    }

    handleSignUp() {
        if (this.state.email != '') {
            if (isEmail(this.state.email)) {
                let code = Math.floor(1000 + Math.random() * 9000);
                sendCode(code, this.state.email).then((res) => {
                    console.log(res)
                })
                this.props.navigation.navigate('code', { code: code, email: this.state.email })
            }
            else this.setState({ errmsg: 'Not Valid Email' })
        }
        else this.setState({ errmsg: 'Email is Required' })
    }

    render() {
        return (
            <SafeAreaView style={{ backgroundColor: 'white' }}>
                <ScrollView style={{ height: '90%', backgroundColor: 'white' }}  >
                    <View style={styles.container} >
                        <Image source={{ uri: imageUrl + 'boy.png' }} style={styles.image} />
                        <Text style={styles.title}>Enter your Email</Text>
                        <Text style={styles.heading}>Email</Text>
                        <Input
                            inputContainerStyle={styles.inputContainer}
                            containerStyle={styles.formInput}
                            inputStyle={styles.input}
                            textContentType="emailAddress"
                            keyboardType="email-address"
                            name="email"
                            renderErrorMessage={true}
                            errorMessage={this.state.errmsg}
                            placeholder="Email"
                            onChangeText={(email) => this.setState({ email: email })}
                            value={this.state.email}
                        />
                        <Text style={{ textDecorationLine: 'underline', color: 'blue', alignSelf: 'center', fontSize: 16 }}
                            onPress={this.handleSignUp.bind(this)}
                        >
                            Sign-up?
                        </Text>
                    </View>
                </ScrollView>
                <View style={styles.formButton} >
                    <Button
                        onPress={() => this.handleSubmit()}
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
        width: '100%',
        paddingHorizontal: 0,
    },
    input: {
        paddingHorizontal: 10,
    },
    inputContainer: {
        backgroundColor: '#eee',
        borderBottomColor: 'white'
    },
    formButton: {
        width: '90%',
        justifyContent: 'flex-end',
        margin: 20,
        bottom: 0,
    }
})

export const sendCode = (code, email) => {
    console.log(code)
    return fetch(`${baseUrl}sendCode`, {
        mode: 'no-cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({code: code, email: email})
    })
        .then(response => {
            if (response.ok) {
                return response
            }
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText)
                error.response = response
                return error
            }
        },
            error => {
                var errmess = new Error(error.message)
                return errmess
            })
        .then((response) => { return response.json() })
        .then(response => { return response })
        .catch(error => { return error })
}


export default connect(mapStateToProps, mapDispatchToProps)(Login)