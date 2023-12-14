import React, { useState, useEffect } from "react";
import {Card, Button , Title ,Paragraph} from "react-native-paper";
import { Image, TouchableOpacity, View, Text, ScrollView} from "react-native";
import { getUser } from "../fonctions";

function ProfileScreen({ navigation }) {


  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePic, setPic] = useState("");
  const [profileBanner, setBanner] = useState("");

  const handlePress = async () => {
    const data = await getUser();
    const newUrl = data.icon_img.replace(/&amp;/g, '&');
    const newUrl2 = data.subreddit.banner_img.replace(/&amp;/g, '&');
    setName(data.subreddit.display_name);
    setBio(data.subreddit.public_description);
    setBanner(newUrl2);
    setPic(newUrl);
  };
  useEffect(() => {
    const interval = setInterval(() => {
      handlePress();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
      <ScrollView style={{ backgroundColor: '#efebe2'}}>
        <View style={{width: '100%', height: 150, backgroundColor: '#000'}}>
          <TouchableOpacity>
            <Image source={{ uri: profileBanner }} style={{ width:'100%', height:150}}></Image>
            <View style={{position: 'relative', padding:10, marginTop:-130}}></View>
          </TouchableOpacity>
        </View>
        <View style={{alignItems: 'center'}}>
          <Image source={{uri : profilePic}}
                 style={{width:140, height: 140, borderRadius: 100, marginTop: -70, borderColor:'white', borderWidth:3}}></Image>
          <Text style={{fontSize:25, fontWeight: 'bold', padding: 10}}>{name}</Text>
          <Text style={{fontSize:15, fontWeight: 'bold', color:'grey'}}>{bio}</Text>
        </View>
      </ScrollView>
  );
}

export default ProfileScreen;
