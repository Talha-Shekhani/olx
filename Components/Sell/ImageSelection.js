import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform, ScrollView, ToastAndroid } from 'react-native';
import { SearchBar, Icon, Card, Image, ListItem, Input } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context'
import AntIcon from 'react-native-vector-icons/AntDesign'
import SimIcon from 'react-native-vector-icons/SimpleLineIcons'
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { fetchSubCategories } from '../../redux/Actions'
import { connect } from 'react-redux';
// import ImagePicker from 'react-native-customized-image-picker'
import ImagePicker from 'react-native-image-picker'
import { PERMISSIONS, check, RESULTS, request } from 'react-native-permissions'
import CameraRoll from '@react-native-community/cameraroll'
import { Divider, Button } from 'react-native-paper'
import { Picker } from '@react-native-community/picker'
import { baseUrl } from '../../shared/baseUrl';

const mapStateToProps = state => {
    return {
        subcat: state.subcategories
    }
}

class ImageSelection extends Component {
    constructor(props) {
        super(props)
        this.state = {
            images: [],
        }
    }

    processImage() {
        // requestNotifications(["alert", "sound"]).then(({ settings, status }) => {
        // console.log(status)
        request("android.permission.CAMERA").then((results) => {
            switch (results) {
                case RESULTS.GRANTED:
                    {
                        // ImagePicker.launchCamera({}, (response) => {
                        //     if (response.didCancel) {
                        //         console.log('User cancelled image picker')
                        //     } else if (response.error) {
                        //         console.log('ImagePicker Error: ', response)
                        //     } else if (response.customButton) {
                        //         console.log('User tapped custom button: ', response.customButton)
                        //     } else {
                        //         console.log(response)
                        //     }
                        // })
                        CameraRoll.getPhotos({first: 20, assetType: "Photos"}).then((res) => {
                            console.log(res.edges)
                        })
                        // ImagePicker.launchImageLibrary({
                        //     allowsEditing: true,
                        // }, (response) => {
                        //     if (response.didCancel) {
                        //         console.log('User cancelled image picker')
                        //     } else if (response.error) {
                        //         console.log('ImagePicker Error: ', response)
                        //     } else if (response.customButton) {
                        //         console.log('User tapped custom button: ', response.customButton)
                        //     } else {
                        //         console.log(response.fileName)
                        //     }
                        // })
                    }
            }
        })
    }
    render() {
        // const { catId, subcatId } = this.props.route.params

        return (
            <SafeAreaView style={{ backgroundColor: 'white' }} >
                <ScrollView style={{ height: '90%', backgroundColor: 'white' }}  >
                    {/* <View><Text>{catId + ' ' + subcatId}</Text></View> */}
                    <Button onPress={this.processImage} mode="contained" >Press</Button>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
})

export default connect(mapStateToProps)(ImageSelection)