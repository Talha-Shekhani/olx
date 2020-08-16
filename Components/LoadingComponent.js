import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'

const styles = StyleSheet.create({
    loadingView: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    loadingText: {
        color: '#512DA8',
        fontSize: 14,
        fontWeight: 'bold'
    }
})

export const Loading = () => {
    return (
        <View style={styles.loadingView}>
            <ActivityIndicator size='large' color='#512DA8' />
            <Text style={styles.loadingText}>Loading . . .</Text>
        </View>
    )
}