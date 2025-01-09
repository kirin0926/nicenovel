import { Text, View, Image, TouchableOpacity, FlatList, Dimensions, ActivityIndicator, TextInput } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';

export default function BookSearch() {
  const [searchText, setSearchText] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  
  return (
    <View>
      <View className="m-2 mt-3 mb-3">
        <View className="flex-row items-center bg-white rounded-lg p-2">
          <FontAwesome name="search" size={16} color="#FF629A" />
          <TextInput
            placeholder="search for novels"
            placeholderTextColor="#666"
            className="flex-1 p-2 outline-none"
            onChangeText={setSearchText}
            value={searchText}
          />
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              console.log('Search for:', searchText);
              // 这里添加你的搜索处理逻辑
            }}
            className="px-3 py-1"
          >
            <Text className="text-[#FF629A]">Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="m-2 mt-3 mb-3">
        <Text>Search History</Text>
        <FlatList
          data={[]}
          renderItem={({ item }) => <Text>{item}</Text>}
        />
      </View>
    </View>
  );
}