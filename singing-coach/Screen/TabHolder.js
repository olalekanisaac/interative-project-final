import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import TabNavigation from '../AppNavigation/TabNavigation'

export default function TabHolder() {
  return (
<View style={styles.container}>
      <TabNavigation/>
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#fff',
    },
})