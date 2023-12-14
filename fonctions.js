import * as AuthSession from 'expo-auth-session';
import { encode } from 'base-64';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { func } from 'prop-types';

const config = {
    clientId : '6Y7qIkDpbr_04KSjdr_sFg',
    redirectUri : 'exp://10.26.104.63:19000',
    scopes: ['account', 'creddits', 'edit', 'flair', 'history', 'identity', 'livemanage', 'modconfig', 'modflair', 'modlog', 'modposts', 'modwiki', 'mysubreddits', 'privatemessages', 'read', 'report', 'save', 'structuredstyles', 'submit', 'subscribe', 'vote', 'wikiedit', 'wikiread'],
    duration : 'temporary',
    state : Math.random().toString(36).substring(7), 
    serviceConfiguration: {
      authorizationEndpoint: 'https://www.reddit.com/api/v1/authorize',
      tokenEndpoint: 'https://www.reddit.com/api/v1/access_token',
      revocationEndpoint: 'https://www.reddit.com/api/v1/revoke_token',
    },
  };

// EXEMPLE DE REQUETE QUI MARCHE
// https://www.reddit.com/api/v1/authorize?client_id=6Y7qIkDpbr_04KSjdr_sFg&response_type=code&state=RANDOM_STRING&redirect_uri=http://www.example.com/unused/redirect/uri&scope=identity&duration=permanent

export async function authorizeUser() {
    try {
      const authUrl = `https://www.reddit.com/api/v1/authorize?client_id=${config.clientId}&response_type=code&state=${config.state}&redirect_uri=${encodeURIComponent(config.redirectUri)}&duration=${config.duration}&scope=${config.scopes}`;
      const result = await AuthSession.startAsync({
        authUrl: authUrl,
      });
      if (result.type === 'success' && result.params.code) {
        const tokenUrl = 'https://www.reddit.com/api/v1/access_token';
        const response = await fetch(tokenUrl, {
          method: 'POST',
          headers: {
            Authorization: `Basic ${encode(config.clientId + ':' + '6Rj8mrxQQGWCARnw8pkoerw2Wfo3Cw')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `grant_type=authorization_code&code=${result.params.code}&redirect_uri=${config.redirectUri}`,
        });
        
        const tokenResponse = await response.json();
        const token = tokenResponse.access_token;
        AsyncStorage.setItem("accessToken", token).then(() => {
          console.log('Access token stored successfully : ', token);
        })
        .catch(error => {
          console.error('Error storing access token:', error);
        });

      }
        
        else {
        console.log('Authorization failed');
      }
    }
    catch (error) {
        console.error(error);
    }
  }
  export async function logout(){
    AsyncStorage.setItem("accessToken", "").then(() => {
      console.log('Access token : ', AsyncStorage.getItem('token'));
    })
  }
  export async function getUser() {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await fetch('https://oauth.reddit.com/api/v1/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'User-Agent': 'myapp/1.0.0',
        },
      });
      const data = await response.json();
      //console.log(data);
      return data;
    } catch (error) {
      console.error("Erreur :" + error);
    }
  }
  
  export async function getPrefs() {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await fetch('https://oauth.reddit.com/api/v1/me/prefs', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'User-Agent': 'myapp/1.0.0',
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erreur :" + error);
    }
  }

  export async function updatePrefsLang(newPrefs) {
    try {
      const data2 = getPrefs();
      data2.lang = newPrefs;
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await fetch('https://oauth.reddit.com/api/v1/me/prefs', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'User-Agent': 'myapp/1.0.0',
        },
        body: JSON.stringify(data2),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
    }
  }

  export async function updatePrefsReadMessages(newPrefs) {
    try {
      const data2 = getPrefs();
      data2.mark_messages_read = newPrefs;
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await fetch('https://oauth.reddit.com/api/v1/me/prefs', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'User-Agent': 'myapp/1.0.0',
        },
        body: JSON.stringify(data2),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
    }
  }

  export async function updatePrefsOverEight(newPrefs) {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const data2 = getPrefs();
      data2.over_18 = newPrefs;
      const response = await fetch('https://oauth.reddit.com/api/v1/me/prefs', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'User-Agent': 'myapp/1.0.0',
        },
        body: JSON.stringify(data2),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
    }
  }

  export async function updatePrefsPrivate(newPrefs) {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const data2 = getPrefs();
      if(newPrefs == "everyone"){
        newPrefs = "whitelisted";
      }else{
        newPrefs = "everyone";
      }
      data2.accept_pms = newPrefs;
      const response = await fetch('https://oauth.reddit.com/api/v1/me/prefs', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'User-Agent': 'myapp/1.0.0',
        },
        body: JSON.stringify(data2),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
    }
  }

  export async function updatePrefsPrivateFollow(newPrefs) {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const data2 = getPrefs();
      data2.enable_followers = newPrefs;
      const response = await fetch('https://oauth.reddit.com/api/v1/me/prefs', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'User-Agent': 'myapp/1.0.0',
        },
        body: JSON.stringify(data2),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
    }
  }

  export async function updatePrefsEmailMessages(newPrefs) {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const data2 = getPrefs();
      data2.email_private_message = newPrefs;
      const response = await fetch('https://oauth.reddit.com/api/v1/me/prefs', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'User-Agent': 'myapp/1.0.0',
        },
        body: JSON.stringify(data2),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
    }
  }

  export async function getSubscribedSubreddits() {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await fetch('https://oauth.reddit.com/subreddits/mine/subscriber', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'User-Agent': 'myapp/1.0.0'
        }
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erreur :" + error);
    }
  }
  
  export async function getSubscribedSubredditsPosts(subreddit,param) {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await fetch(`https://oauth.reddit.com/r/${subreddit}/${param}?limit=10`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'User-Agent': 'myapp/1.0.0'
        }
      });
      const data = await response.json();
      return data.data.children;
    } catch (error) {
      console.error("Erreur :" + error);
      throw error;
    }
  }


  export async function getSubreddits(param) {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await fetch(`https://www.reddit.com/subreddits/search.json?q=${param}&limit=2`, {});
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error("Erreur :" + error);
    }
  }
  
  
  export async function unsubscribeFromSubreddit(subredditName) {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await fetch(`https://oauth.reddit.com/api/subscribe`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'User-Agent': 'myapp/1.0.0',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `sr_name=${subredditName}&action=unsub`
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erreur :" + error);
    }
  }

  export async function subscribeFromSubreddit(subredditName) {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await fetch(`https://oauth.reddit.com/api/subscribe`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'User-Agent': 'myapp/1.0.0',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `sr_name=${subredditName}&action=sub`
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erreur :" + error);
    }
  }
  
  