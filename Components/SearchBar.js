import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { getSubreddits } from '../fonctions';

const SearchBar = ({ subreddits, setSubreddits }) => {
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchSubreddits = async () => {
      const subreddits = await getSubreddits(searchText);
      setSubreddits(subreddits);
    };

    if (searchText !== "") {
      fetchSubreddits();
    } else {
      setSubreddits([]);
    }
  }, [searchText]);

  const handleSearch = () => {
    console.log(searchText);

  }

  return (
    <View style={styles.backgroundStyle}>
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.inputStyle}
        placeholder="Search"
        value={searchText}
        onChangeText={text => setSearchText(text)}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  backgroundStyle: {
    backgroundColor: '#F0EEEE',
    height: 50,
    borderRadius: 5,
    marginHorizontal: 15,
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    borderColor: '#CCCCCC',
    borderWidth: 1,
  },
  inputStyle: {
    flex: 1,
    fontSize: 18,
  },
  buttonStyle: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});

export default SearchBar;
