import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Keyboard, StyleSheet, TextInput, View } from "react-native";

type SearchBarProps = {
  placeholder: string;
  clicked: boolean;
  setClicked: (clicked: boolean) => void;
  searchString: string;
  setSearchString: (searchString: string) => void;
  onSearchSubmit: () => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder, 
  clicked, 
  setClicked, 
  searchString, 
  setSearchString,
  onSearchSubmit
}) => (
  <View style={styles.container}>
    <View style={styles.inputContainer}>
      <FontAwesome name="search" size={20} color="#666" />
      <TextInput
        style={styles.textInput}
        placeholder={placeholder}
        value={searchString}
        onChangeText={setSearchString}
        onFocus={() => {
          setClicked(true);
        }}
        onSubmitEditing={onSearchSubmit} 
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        inputMode="text"
        keyboardType="default"
        placeholderTextColor="#888"
      />
      {clicked && (
        <FontAwesome
          name="remove"
          size={20}
          color="#666"
          onPress={() => {
            if (searchString) {
              setSearchString("");
              onSearchSubmit(); 
            } else {
              Keyboard.dismiss();
              setClicked(false);
            }
          }}
        />
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  textInput: {
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
    paddingVertical: 2,
    color: '#333',
  },
});

export default SearchBar;