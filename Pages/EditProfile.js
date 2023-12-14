import React from "react"
import {Button, IconButton, TextInput} from "react-native-paper";
import {View} from "react-native";
import { getUser } from "../fonctions";

function EditScreen() {
    return(
        <View style={{flex: 1, alignItems: 'center', justifyContent: "center"}}>
            <Button mode="contained"  onPress={getUser} style={{marginTop: 20, width: 250}}
                    contentStyle={{flexDirection: 'row-reverse'}}
            >Valider</Button>
        </View>
    )
}

export default EditScreen;
