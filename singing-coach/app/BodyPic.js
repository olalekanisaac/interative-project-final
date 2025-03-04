import { StyleSheet, Text, View,Image, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
const BodyPic = ({navigation}) => {

  return (
    <ScrollView style={styles.container}>
    <View>
    <View style={{
       width: '100%',
       height: 400, // Adjust according to the image size
       
    }}>
       <Image source={require('../assets/Group 5.png')}
       style={styles.pic}
       />
       <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('HeaderHome')}> 
      <Text style={{textAlign:'center', marginTop:10, color:'white'}}>Get Started</Text>
         </TouchableOpacity>
         </View>
         <View>
           <Image source={require('../assets/Real-time Voice Analysis for Singers.png')}
           style={{
            width: '80%',
            height: 10,
            marginTop:40,
            marginLeft:10,
            resizeMode: 'contain',
           }}
           />
         <Text style={{
          marginTop:15,
          marginLeft:10,
          fontSize: 10,
          fontWeight: 'light',
         }}>GET INSTANT FEEDBACK AND PRACTICE TOOLS TO ENHANCE SINGING SKILLS</Text>

<TouchableOpacity style={styles.practice}> 
      <Text style={{textAlign:'center', marginTop:10, color:'white'}}>Practice Now</Text>
         </TouchableOpacity>
         <Image 
         source={require('../assets/Untitled design (2) 1.jpg')}
         style={styles.pic2}
         />
         <Text style={{
          marginLeft:10,
          fontSize: 13,
          fontWeight: 'light',
         }}>
         Interactive Singing Coach Bot for Musicians offers real-time voice analysis, feedback, and practice tools to help singers improve their skills
         </Text>
         </View>
       
    </View>
    </ScrollView>
  )
}

export default BodyPic;

const styles = StyleSheet.create({


   container:{
    width: '100%',
    height: '100%', // Adjust according to the image size
    position: 'relative',

   },

    pic:{
      width: '100%',
      height: '100%',
      marginBottom:100,
      resizeMode: 'cover',
    },
    button:{
      backgroundColor:'#611CA7',
      width:120,
      height:46,
      borderRadius:10,
      position:'absolute',
      
      alignItems:'center',
      top: '85%', // Move the button vertically
      left: '35%', // Move the button horizontally
      transform: [{ translateX: -50 }],
      transform: [{ translateY: -2 }],
    },
    practice:{
      backgroundColor:'#611CA7',
      width:120,
      height:46,
      marginTop:20,
      marginLeft:40,
      borderRadius:5
    },
    pic2:{
      width: '92%', 
      height:400,
      marginLeft:10,
      resizeMode: 'contain',

     },

 
})