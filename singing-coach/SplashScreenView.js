import { StyleSheet, Text, View, Image} from 'react-native'
import React from 'react'

const SplashScreenView = () => {
  return (
   <View style={styles.Splashscreen}>
    <View>
   <Image
   source={require('../singing-coach/Image/sf.png')}
   style={styles.splash}
   />
    </View>
   </View>
  )
}

export default SplashScreenView

const styles = StyleSheet.create({
    Splashscreen: {
        flex:1,
         justifyContent:'center',
         alignItems:'center',
         backgroundColor:'black',
         width:'100%'
    },
    splash:{
        width:200,
        height:200,
        resizeMode:'contain'
    }

})