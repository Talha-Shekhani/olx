import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform, ScrollView } from 'react-native';
import { SearchBar, Icon, Card, Image, ButtonGroup } from 'react-native-elements';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context'
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { connect } from 'react-redux';
import { baseUrl } from '../../shared/baseUrl';
import { Loading } from '../LoadingComponent';
import { postComment } from '../../redux/Actions'
import { ToggleButton, Button } from 'react-native-paper';

const mapStateToProps = state => ({
})

class AddPackage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedIndex: 0
        }
        this.updateIndex = this.updateIndex.bind(this)
    }

    updateIndex(selectedIndex) {
        this.setState({ selectedIndex })
    }

    render() {
        return (
            <SafeAreaView style={styles.container} >
                <View style={{flexDirection: 'row', backgroundColor: 'red', justifyContent: 'space-evenly'}}>
                    <Button style={{width: '45%', backgroundColor: 'yellow', borderWidth: 1, borderColor: '#387eff', flexDirection: 'column'}} >
                        Basic
                        <View >
                            <Text>Price: 0</Text>
                        </View>
                    </Button>
                    <Button style={{width: '45%', backgroundColor: 'green', borderWidth: 1, borderColor: '#387eff'}} >
                        Premium
                    </Button>
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white'
    }
})

export default connect(mapStateToProps)(AddPackage)