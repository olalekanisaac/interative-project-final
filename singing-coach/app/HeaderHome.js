import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const HeaderHome = () => {
    return (

        <View style={styles.home}>
            <Text>Home</Text>
        </View>
    )
}

export default HeaderHome

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(217, 210, 217, 0.45)',
        alignItems: 'center',
    },
    home: {
        marginTop: 50,
        backgroundColor: 'rgba(217, 210, 217, 0.45)',
        width: '100%',
        borderBottomWidth: 1,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomColor: '#D9D2D9',


    }
})

