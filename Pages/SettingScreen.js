import React, {useEffect, useState} from "react"
import {Button, Menu, Provider} from "react-native-paper";
import {Image, Text, View, ScrollView} from "react-native";
import {
    getUser,
    getPrefs,
    updatePrefsEmailMessages,
    updatePrefsLang,
    updatePrefsOverEight,
    updatePrefsPrivate, updatePrefsPrivateFollow,
    updatePrefsReadMessages
} from "../fonctions";

function SettingScreen() {
    const optionsLang = [
        { label: 'Français', value: 'fr' },
        { label: 'English', value: 'en' },
        { label: 'Español', value: 'es' },
    ];
    const [menuVisible, setMenuVisible] = useState(false);
    const [langueC, setCurrentLang] = useState("");
    const [readMessages, setreadMessages] = useState("");
    const [overEight, setOverEight] = useState("");
    const [privatePms, setPrivatePms] = useState("");
    const [privateFollow, setPrivateFollow] = useState("");
    const [emailsMessages, setEmailMessages] = useState("");

    const handlePress = async () => {
        const data = await getUser();
        const prefs = await getPrefs();
        setCurrentLang(prefs.lang);
        setreadMessages(prefs.mark_messages_read);
        setOverEight(prefs.over_18);
        setPrivatePms(prefs.accept_pms);
        setPrivateFollow(prefs.enable_followers);
        setEmailMessages(prefs.email_private_message);
    };
    useEffect(() => {
        const interval = setInterval(() => {
          handlePress();
        }, 500);
        return () => clearInterval(interval);
      }, []);

    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

    return(
        <ScrollView style={{ backgroundColor: '#efebe2' }}>
        <Provider>
            <View style={{ alignItems: 'center', marginTop: 100 }}>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'grey' }}>Langue actuelle : {langueC}</Text>
                <Menu visible={menuVisible} onDismiss={closeMenu} anchor={<Button onPress={openMenu}>Select Language</Button>}>
                    {optionsLang.map(option => (
                        <View key={option.value}>
                            <Menu.Item onPress={() => updatePrefsLang(option.value)} title={option.label} />
                        </View>
                    ))}
                </Menu>
                <Text style={{ marginTop: 15, fontSize: 15, fontWeight: 'bold', color: 'grey' }}>Messages Readed : {readMessages.toString()}</Text>
                <Button mode="outlined" buttonColor="white"
                        textColor="black" style={{ marginTop: 5, width: 250 }}
                        onPress={() => updatePrefsReadMessages(!readMessages)}>Read all messages
                </Button>
                <Text style={{ marginTop: 15, fontSize: 15, fontWeight: 'bold', color: 'grey' }}>Over 18 : {overEight.toString()}</Text>
                <Button mode="outlined" buttonColor="white"
                        textColor="black" style={{ marginTop: 5, width: 250 }}
                        onPress={() => updatePrefsOverEight(!overEight)}>Over 18 ?
                </Button>
                <Text style={{ marginTop: 15, fontSize: 15, fontWeight: 'bold', color: 'grey' }}>Private : {privatePms}</Text>
                <Button mode="outlined" buttonColor="white"
                        textColor="black" style={{ marginTop: 5, width: 250 }}
                        onPress={() => updatePrefsPrivate(privatePms)}>Private Pms ?
                </Button>
                <Text style={{ marginTop: 15, fontSize: 15, fontWeight: 'bold', color: 'grey' }}>Enable Followers : {privateFollow.toString()}</Text>
                <Button mode="outlined" buttonColor="white"
                        textColor="black" style={{ marginTop: 5, width: 250 }}
                        onPress={() => updatePrefsPrivateFollow(!privateFollow)}>Private Acc ?
                </Button>
                <Text style={{ marginTop: 15, fontSize: 15, fontWeight: 'bold', color: 'grey' }}>NSFW : {emailsMessages.toString()}</Text>
                <Button mode="outlined" buttonColor="white"
                        textColor="black" style={{ marginTop: 5, width: 250 }}
                        onPress={() => updatePrefsEmailMessages(!emailsMessages)}>NSFW ?
                </Button>
            </View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image source={require('../assets/LogoRedditech.png')} style={{ width: 200, height: 200 }} />
            </View>
        </Provider>
        </ScrollView>
    )
}

export default SettingScreen;