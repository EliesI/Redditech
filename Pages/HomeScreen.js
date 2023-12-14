import React, { useState, useEffect } from "react";
import { Card, Button, Title, Paragraph, Caption } from "react-native-paper";
import { Image, ScrollView, View, Alert, FlatList, Text } from "react-native";
import { authorizeUser, getSubscribedSubreddits, getSubscribedSubredditsPosts, logout, unsubscribeFromSubreddit,subscribeFromSubreddit } from "../fonctions";
import SearchBar from "../Components/SearchBar";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = () => {
  const [isConnected, setConnection] = useState(false);
  const [subreddits, setSubreddits] = useState([]);
  const [searchReddits, setSearchReddits] = useState([]);
  const [Searchposts, setSearchPosts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState(["hot"]);

  useEffect(() => {
    if (AsyncStorage.getItem("token") != "") {
      const fetchData = async () => {
        const data = await getSubscribedSubreddits();
        setSubreddits(data.data.children);
      };
      fetchData();
      const intervalId = setInterval(fetchData, 500);
      return () => clearInterval(intervalId);
    }
  }, [AsyncStorage.getItem("token")]);

  const fetchPosts = async (item) => {
    const posts = await getSubscribedSubredditsPosts(item,filter);
    setPosts(posts);
  };

  const handleDisconnect = () => {
    setConnection(false);
    logout();
  };

  const handleConnect = () => {
    setConnection(true);
    authorizeUser();
  };

  return (
    <ScrollView style={{ backgroundColor: '#efebe2' }}>
      <View style={{ flexDirection: 'row' }}>
        <Image source={require('../assets/LogoRedditech.png')} style={{ marginTop: 30, marginLeft: 20, width: 80, height: 80 }} />
        {
          isConnected === false ? (
            <Button mode="contained" onPress={handleConnect} style={{ marginTop: 55, marginLeft: 150, width: 150, backgroundColor: '#f08e25' }}>Se connecter</Button>
          ) : (
            <Button mode="contained" onPress={handleDisconnect} style={{ marginTop: 55, marginLeft: 110, width: 195, backgroundColor: '#ec0000' }}>Se déconnecter</Button>
          )
        }
      </View>
      <View>
        <SearchBar subreddits={searchReddits} setSubreddits={setSearchReddits}/>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'center', flex: 1, alignItems: 'center'}}>
                    <Button onPress={() => setFilter('hot')} style={{marginRight: 5}}>Hot</Button>
                    <Button onPress={() => setFilter('new')} style={{marginRight: 5}}>New</Button>
                    <Button onPress={() => setFilter('top')}>Top</Button>
                    <Text style={{ color: "#f08e25"}}> Selected : {filter}</Text>
                  </View>
                  { searchReddits.data && searchReddits.data.children && (
                  <View style={{ flex: 1 }}>
                    <FlatList
                      data={searchReddits.data.children}
                      keyExtractor={(item) => item.data.id}
                      renderItem={({ item }) => (
                        <Card style={{ margin: 10}}>
                          <View>
                            <Image
                              source={{ uri: item.data.mobile_banner_image }}
                              style={{ width: '100%'}}
                              resizeMode="cover"
                            />
                            <View>
                              <Card.Content style={{ flexDirection: 'row' }}>
                                <Card.Cover
                                  source={{ uri: item.data.community_icon.replace(/&amp;/g, '&') }}
                                  style={{ width: 35, height: 35, marginTop: 5 }}
                                />
                                <View>
                                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Title>{item.data.display_name}</Title>
                                    <Caption style={{ marginLeft: 10, marginTop: 5 }}>{item.data.subscribers} subscribers</Caption>
                                  </View>
                                  <Paragraph>{item.data.public_description}</Paragraph>
                                  <View style={{ flexDirection: 'row' }}>
                                  <Card.Actions>
                                    <Button onPress={() => subscribeFromSubreddit(item.data.display_name)}>Subcribe</Button>
                                  </Card.Actions>
                                  </View>
                                </View>
                              </Card.Content>
                            </View>
                          </View>
                        </Card>
                      )}
                    />
                  </View>
                )}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: "#f08e25"}}>Subreddits Subscription</Text>
        </View>
      <View>
        <View>
          <FlatList
            data={subreddits}
            keyExtractor={(item) => item.data.id}
            renderItem={({ item }) => (
              <Card style={{ margin: 10}}>
              <View>
                <Image
                  source={{ uri: item.data.mobile_banner_image }}
                  style={{ width: '100%'}}
                  resizeMode="cover"
                />
                <View>
                  <Card.Content style={{ flexDirection: 'row' }}>
                    <Card.Cover
                      source={{ uri: item.data.community_icon.replace(/&amp;/g, '&') }}
                      style={{ width: 35, height: 35, marginTop: 5 }}
                    />
                    <View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                        <Title>{item.data.display_name}</Title>
                        <Caption style={{ marginLeft: 10, marginTop: 5 }}>{item.data.subscribers} subscribers</Caption>
                      </View>
                      <Paragraph>{item.data.public_description}</Paragraph>
                      <View style={{ flexDirection: 'row' }}>
                      <Card.Actions>
                        <Button onPress={() => fetchPosts(item.data.display_name)}>Fetch posts</Button>
                      </Card.Actions>
                      <Card.Actions>
                        <Button onPress={() => unsubscribeFromSubreddit(item.data.display_name)}>Unsubcribe</Button>
                      </Card.Actions>
                      </View>
                    </View>
                  </Card.Content>
                </View>
              </View>
            </Card>            
            )}
          />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: "#f08e25"}}>Layout POSTS</Text>
        </View>
        <View style={{ flex: 1 }}>
          <FlatList
            data={posts}
            keyExtractor={(item) => item.data.id}
            renderItem={({ item }) => (
              <Card style={{ margin: 10}}>
              <Card.Content>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Title>
                  {item.data.author} - {item.data.ups} upvotes
                  </Title>
              </View>
                <Title>{item.data.title}</Title>
                <Paragraph>{item.data.selftext}</Paragraph>
                {item.data.preview && item.data.preview.images && item.data.preview.images[0].resolutions[1] && (
                  <Image 
                    source={{uri: item.data.preview.images[0].resolutions[1].url.replace(/&amp;/g, '&')}} 
                    style={{
                      width: item.data.preview.images[0].resolutions[1].width,
                      height: item.data.preview.images[0].resolutions[1].height,
                    }}
                    onLoad={() => console.log('Image loaded')}
                    onError={() => console.log('Error loading image')}
                  />
                )}

                <Caption style={{marginTop: 8}}>{item.data.num_comments} comments</Caption>
              </Card.Content>
            </Card>                      
            )}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
