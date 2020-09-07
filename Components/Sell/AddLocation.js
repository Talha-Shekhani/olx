import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform, ScrollView, NativeModules } from 'react-native';
import { SearchBar, Icon, Card, Image, ListItem, Input } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context'
import AntIcon from 'react-native-vector-icons/AntDesign'
import SimIcon from 'react-native-vector-icons/SimpleLineIcons'
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { postAd, fetchProvince, fetchCity, fetchLoc } from '../../redux/Actions'
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage'
import { Loading } from '../LoadingComponent';
import { Divider, Button } from 'react-native-paper'
import { Picker } from '@react-native-community/picker'
var RNUploader = NativeModules.RNUploader
// import RNUploader from 'react-native-uploader'
import { baseUrl } from '../../shared/baseUrl';

const mapStateToProps = state => {
    return {
        subcat: state.subcategories,
        loc: state.loc,
    }
}

const mapDispatchToProps = dispatch => ({
    postAd: (userId, formData) => dispatch(postAd(userId, formData)),
    fetchLoc: () => dispatch(fetchLoc()),
    fetchPro: () => dispatch(fetchProvince()),
    fetchCity: () => dispatch(fetchCity())
})
var errLoc = '', errcity = '', errprovince = ''

class AddLocation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            form: {
                loc: '',
                city: '',
                province: '',
            },
            errLoc: '',
            errcity: '',
            errprovince: '',
            userId: '',
        }
    }
    doUpload(form) {
        let opts = {
            url: `${baseUrl}ads/upload`,
            files: form.img,
            method: 'POST',                             // optional: POST or PUT
            headers: { 'Accept': 'application/json' },  // optional
            params: { 'user_id': this.state.userId },   // optional
        };
        RNUploader.upload(opts, (err, response) => {
            if (err) {
                console.log(err);
                return;
            }
            let status = response.status;
            let responseString = response.data;
            let json = JSON.parse(responseString);

            console.log('upload complete with status ' + status)
        })
    }

    handleSubmit(form) {

        if (this.state.form.province == '') {
            this.setState({ errprovince: 'Province Required' })
            errprovince = 'Province Required'
        }
        else errprovince = ' '
        if (this.state.form.city == '') {
            this.setState({ errcity: 'City Required' })
            errcity = 'Province Required'
        }
        else errcity = ' '
        if (this.state.form.loc == '') {
            this.setState({ errLoc: 'Province Required' })
            errLoc = 'Province Required'
        }
        else errLoc = ' '
        if (errprovince == ' ' && errcity == ' ' && errLoc == ' ') {
            form = Object.assign(form, { province: this.state.form.province, city: this.state.form.city, loc: this.state.form.loc })
            console.log(form)
            this.props.postAd(this.state.userId, form)
        }
        // if (this.state.errPrice == ' ') {
        //     form = Object.assign(form, { price: this.state.price })
        //     // console.log(form)
        //     // console.log(JSON.stringify(this.props))
        //     this.props.postAd(this.state.userId, form)
        // }
    }

    UNSAFE_componentWillMount() {
        AsyncStorage.getItem('userdata')
            .then((userdata) => {
                if (userdata) {
                    let userinfo = JSON.parse(userdata)
                    this.setState({ userId: userinfo.userId })
                    this.props.fetchPro()
                    this.props.fetchCity()
                    this.props.fetchLoc()
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
                        <Text style={styles.textTitle} >Province *</Text>
                        <Picker style={styles.inputCont} selectedValue={this.state.form.province} onValueChange={(item) => this.setState({ form: { ...this.state.form, province: item } })} >
                            <Picker.Item label='Province' value='' />
                            {this.props.loc.province.map((item, index) => {
                                return (
                                    <Picker.Item label={item.province} value={item.id} />
                                )
                            })}
                        </Picker>
                        <Text style={styles.errText} >{errprovince}</Text>
                        <Text style={styles.textTitle} >City *</Text>
                        <Picker style={styles.inputCont}
                            selectedValue={this.state.form.city}
                            onValueChange={(item) => this.setState({
                                form: { ...this.state.form, city: item }
                            })} >
                            <Picker.Item label='City' value='' />
                            {this.props.loc.city
                                .filter(item => item.p_id == this.state.form.province)
                                .map((item, index) => {
                                    return (
                                        <Picker.Item label={item.city} value={item.id} />
                                    )
                                })}
                        </Picker>
                        <Text style={styles.errText} >{errcity}</Text>
                        <Text style={styles.textTitle} >Area *</Text>
                        <Picker style={styles.inputCont}
                            selectedValue={this.state.form.loc}
                            onValueChange={(item) => this.setState({
                                form: { ...this.state.form, loc: item }
                            })} >
                            <Picker.Item label='Area' value='' />
                            {this.props.loc.loc
                                .filter(item => item.c_id == this.state.form.city)
                                .map((item, index) => {
                                    return (
                                        <Picker.Item label={item.area} value={item.id} />
                                    )
                                })}
                        </Picker>
                        <Text style={styles.errText} >{errLoc}</Text>
                    </View>
                </ScrollView>
                <View style={styles.formButton} >
                    <Button mode="contained" color='black'
                        onPress={() => this.doUpload(form)}
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

export default connect(mapStateToProps, mapDispatchToProps)(AddLocation)