import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform, ScrollView, ToastAndroid, Alert } from 'react-native';
import { SearchBar, Icon, Card, Image, ListItem, Input, CheckBox } from 'react-native-elements';
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
import { isEmpty } from 'react-native-validator-form/lib/ValidationRules';
import { SliderBox } from 'react-native-image-slider-box'
import { TouchableOpacity } from 'react-native-gesture-handler';

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
            selectedImage: []
        }
    }

    componentDidMount() {
        this.processImage()
    }

    renderImages() {
        return (
            this.state.images.map((item, index) => {
                return (
                    <TouchableOpacity onPress={() => {
                        this.setState({
                            selectedImage: this.state.selectedImage.includes(item.uri) ? this.state.selectedImage.filter(el => el != item.uri) : this.state.selectedImage.concat(item.uri)
                        })
                    }} >
                        <CheckBox checked={this.state.selectedImage.includes(item.uri) ? true : false}
                            containerStyle={styles.checkBox} />
                        <Image source={{ uri: item.uri }} style={styles.image} />
                    </TouchableOpacity>
                )
            })
        )
    }

    processImage() {
        this.setState({ images: [] })
        request("android.permission.CAMERA").then((results) => {
            switch (results) {
                case RESULTS.GRANTED: {
                    CameraRoll.getPhotos({ first: 100000, assetType: "Photos" }).then((res) => {
                        return (
                            res.edges.map((item, index) => {
                                this.setState({ images: this.state.images.concat(item.node.image) })
                            })
                        )
                    })
                }
            }
        })
    }

    openCamera() {
        ImagePicker.launchCamera({ allowsEditing: true, mediaType: "photo", storageOptions: { cameraRoll: true } }, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                console.log(response)
                this.setState({ selectedImage: this.state.selectedImage.concat(response) })
                this.processImage()
            }
        })
    }

    handleSubmit(form) {
        if (!isEmpty(this.state.selectedImage)) {
            console.log(this.state.selectedImage[0].slice(this.state.selectedImage[0].lastIndexOf('/') + 1))
            // console.log(this.state.selectedImage[0].lastIndexOf('/'))
            form = Object.assign(form, { img: this.state.selectedImage })
            // console.log(form)
            // this.props.navigation.navigate('pricePage', {form: form} )
        }
        else Alert.alert('No images Selected', 'Please select atleast one image')
    }

    render() {
        const { form } = this.props.route.params
        { var d = ''; isEmpty(this.state.selectedImage) ? d = 'flex' : d = 'none' }
        return (
            <SafeAreaView style={{ backgroundColor: 'white', height: '100%' }} >
                <View style={styles.sliderBox} >

                    <Text style={[styles.selectText, { display: d }]} >No Item Selected</Text>
                    <SliderBox resizeMode='contain'
                        images={this.state.selectedImage.map((itm, indx) => {
                            return itm.uri
                        })}
                        sliderBoxHeight={400}
                    />
                </View>
                <ScrollView style={{ height: '37%', backgroundColor: 'white' }}  >
                    {/* <Text>{JSON.stringify(thi.state.images[0])}{this.state.image}</Text> */}
                    {/* <Text>{JSON.stringify(this.state.selectedImage)}</Text> */}
                    <View style={styles.imageCont} >
                        <TouchableOpacity onPress={() => this.openCamera()}
                            style={styles.gridView} >
                            <Image source={{ uri: baseUrl + 'camera.png' }} style={styles.image} />
                        </TouchableOpacity>
                        {this.renderImages()}
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
    image: {
        width: 90,
        height: 90,
        margin: 1
    },
    imageCont: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: "wrap"
    },
    checkBox: {
        position: "absolute",
        top: -12,
        right: -20,
        zIndex: 1
    },
    sliderBox: {
        width: '100%',
        height: 400,
        backgroundColor: '#ddd',
        justifyContent: 'center',
    },
    selectText: {
        alignSelf: 'center',
        fontSize: 16,
        zIndex: 0
    },
    formButton: {
        width: '90%',
        justifyContent: 'flex-end',
        margin: 20,
        bottom: 0,
    },
})

export default connect(mapStateToProps)(ImageSelection)