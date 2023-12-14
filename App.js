import { StatusBar } from 'expo-status-bar';
import {NavigationContainer} from "@react-navigation/native";
import HomeScreen from "./Pages/HomeScreen";
import ProfileScreen from "./Pages/ProfileScreen";
import SettingScreen from "./Pages/SettingScreen";
import EditProfileScreen from "./Pages/EditProfile"
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {createMaterialBottomTabNavigator} from "@react-navigation/material-bottom-tabs";
import { LogBox } from 'react-native';


const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator()

LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreLogs(['source.uri should not be an empty string']);
LogBox.ignoreLogs(['VirtualizedLists should never be nested inside plain ScrollViews']);
LogBox.ignoreLogs(['SyntaxError: JSON Parse error', 'Possible Unhandled Promise Rejection']);

export default function App() {

  return (
      <NavigationContainer>
          <Tab.Navigator
              shifting={true}
              sceneAnimationEnabled={false}
              activeColor="black"
              inactiveColor="black"
              barStyle={{
                  backgroundColor: "white",
              }}
          >
              <Stack.Screen name="Actu" component={HomeScreen} options={{
                  tabBarIcon: 'format-list-bulleted',
              }}/>
              <Stack.Screen name="Profil" component={ProfilePendings} options={{
                  tabBarIcon: 'account-circle-outline',
              }}/>
              <Stack.Screen name="Paramètres" component={SettingScreen} options={{
                  tabBarIcon: 'cog',
              }}/>
          </Tab.Navigator>
      </NavigationContainer>
  );
}

const ProfileStack = createNativeStackNavigator();

function ProfilePendings() {
    return (
        <ProfileStack.Navigator screenOptions={({route}) => ({headerShown: false})}>
            <ProfileStack.Screen name="Profile" component={ProfileScreen}/>
            <ProfileStack.Screen name="EditProfile" component={EditProfileScreen}/>
        </ProfileStack.Navigator>
    )
}