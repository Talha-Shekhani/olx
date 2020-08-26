import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform, ScrollView } from 'react-native';
import { SearchBar, Icon, Card, Image, ListItem, Input } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context'
import AntIcon from 'react-native-vector-icons/AntDesign'
import SimIcon from 'react-native-vector-icons/SimpleLineIcons'
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { postAd } from '../../redux/Actions'
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage'
import { Loading } from '../LoadingComponent';
import { Divider, Button } from 'react-native-paper'
import { Picker } from '@react-native-community/picker'

const mapStateToProps = state => {
    return {
        subcat: state.subcategories
    }
}

const mapDispatchToProps = dispatch => ({
    // fetchFav: (userId) => dispatch(fetchFav(userId)),
    postAd: (userId, formData) => dispatch(postAd(userId, formData))
})

class pricePage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            price: '',
            errPrice: '',
            userId: '',
        }
    }

    handleSubmit(form) {
        console.log(form)
        // console.log(this.state.price)
        if (this.state.price == '') this.setState({ errPrice: 'Price Required' })
        else if (this.state.price < 500) this.setState({ errPrice: 'A minimum 500 of price is required.' })
        else this.setState({ errPrice: ' ' })
        if (this.state.errPrice == ' ') {
            form = Object.assign(form, { price: this.state.price })
            console.log(form)
            // console.log(JSON.stringify(this.props))
            this.props.postAd(this.state.userId, form)
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
            // .then(() => this.props.fetchFav(this.state.userId))
            .catch((err) => console.log('Cannot find user info' + err))

    }

    render() {

        const { form } = this.props.route.params
        // console.log(form)

        return (
            <SafeAreaView style={{ backgroundColor: 'white' }} >
                <ScrollView style={{ height: '90%', backgroundColor: 'white' }}  >
                    <View style={styles.container} >
                        <Text style={styles.textTitle} >Price *</Text>
                        <Input
                            maxLength={7}
                            containerStyle={styles.formInput}
                            inputContainerStyle={styles.inputContainer}
                            inputStyle={styles.input}
                            keyboardType="default"
                            name="price"
                            renderErrorMessage={true}
                            errorMessage={this.state.errPrice}
                            onChangeText={(price) => this.setState({ price: price })}
                        />
                    </View>
                </ScrollView>
                <View style={styles.formButton} >
                    <Button mode="contained" color='black'
                        onPress={() => this.handleSubmit(form)}
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
        height: 30
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

export default connect(mapStateToProps, mapDispatchToProps)(pricePage)