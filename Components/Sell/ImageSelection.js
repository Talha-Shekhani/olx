import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform, ScrollView, Alert } from 'react-native';
import { SearchBar, Icon, Card, Image, ListItem, Input, CheckBox } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context'
import FeatIcon from 'react-native-vector-icons/Feather'
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
var images = []

class ImageSelection extends Component {
    constructor(props) {
        super(props)
        this.state = {
            images: [],
            selectedImage: []
        }
    }

    componentDidMount() {
        images = []
        this.processImage()
    }

    renderImages() {
        return (
            images.map((item, index) => {
                return (
                    <TouchableOpacity containerStyle={styles.gridView} onPress={() => {
                        // item.filename = item.uri.slice(item.uri.lastIndexOf('/') + 1)
                        item.originalname = item.filename
                        item.name = item.filename
                        item.type = 'image/*'
                        item.size = item.fileSize
                        item.path = item.uri.replace('file://', '')
                        item.uri = Platform.OS === "android" ? item.uri : item.uri.replace("file://", "")
                        item.playableDuration = ''
                        this.setState({
                            selectedImage: this.state.selectedImage.includes(item) ? this.state.selectedImage.filter(el => el != item) : this.state.selectedImage.concat(item)
                        })
                    }} >
                        <CheckBox checked={this.state.selectedImage.includes(item) ? true : false}
                            containerStyle={styles.checkBox} />
                        <Image source={{ uri: item.uri }} style={styles.image} />
                    </TouchableOpacity>
                )
            })
        )
    }

    processImage() {
        // this.setState({ images: [] })
        request("android.permission.CAMERA").then((results) => {
            this.forceUpdate()
            switch (results) {
                case RESULTS.GRANTED: {
                    CameraRoll.getPhotos({ first: 10, groupTypes: "All", assetType: "Photos", include: ["fileSize", "filename", "imageSize"] }).then((res) => {
                        return (
                            res.edges.map((item, index) => {
                                // console.log(item.node)
                                images = images.concat(item.node.image)
                            })
                        )
                    }).then(() => {
                        this.forceUpdate()
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
            form = Object.assign(form, { img: this.state.selectedImage })
            console.log('form', this.state.selectedImage[0], this.state.selectedImage[0].path)
            var formData = new FormData()
            for (let i = 0; i < this.state.selectedImage.length; i++)
                formData.append('img', this.state.selectedImage[i])
            // formData._parts[0] = ['img', this.state.selectedImage[0], this.state.selectedImage[0].path]
            async function uploadData() {
                debugger
                console.log(formData, JSON.stringify(formData))
                return await fetch(`${baseUrl}ads/upload`, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formData,
                    redirect: 'follow',
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
                            var errmess = new Error(error)
                            return errmess
                        })
                    // .then((response) => { return response.json() })
                    .then(response => console.log(response))
                    .catch(error => console.log(error))
            }
            // uploadData()
            this.props.navigation.navigate('pricePage', { form: form })
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
                            return itm
                        })}
                        sliderBoxHeight={400}
                    />
                </View>
                <ScrollView style={{ height: '37%', backgroundColor: 'white' }}  >
                    {/* <Text>{JSON.stringify(thi.state.images[0])}{this.state.image}</Text> */}
                    {/* <Text>{JSON.stringify(this.state.selectedImage)}</Text> */}
                    <View style={styles.imageCont} >
                        <TouchableOpacity onPress={() => this.openCamera()}
                            containerStyle={styles.gridView} >
                            <FeatIcon name='camera' size={46} style={[styles.image, { margin: '25%' }]} />
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
        width: '100%',
        height: '100%',
    },
    imageCont: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: "wrap"
    },
    gridView: {
        width: '24.4%',
        height: 100,
        margin: 1
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
        padding: 0,
        marginVertical: 10
    },
})

export default connect(mapStateToProps)(ImageSelection)