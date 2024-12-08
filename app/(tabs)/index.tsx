import { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 32) / 2;

interface Novel {
  id: string;
  title: string;
  author: string;
  cover: string;
  likes: number;
}

export default function Home() {
  const [novels] = useState<Novel[]>([
    {
      id: '1',
      title: '仙逆',
      author: '耳根',
      cover: 'https://picsum.photos/200/300',
      likes: 1234,
    },
    {
      id: '2',
      title: '凡人修仙传',
      author: '忘语',
      cover: 'https://picsum.photos/200/300',
      likes: 5678,
    },
    // Add more sample novels as needed
  ]);

  const renderNovelItem = ({ item }: { item: Novel }) => (
    <TouchableOpacity
      style={styles.novelCard}
      onPress={() => router.push({
        pathname: '/novel',
        params: { id: item.id }
      })}>
      <Image source={{ uri: item.cover }} style={styles.coverImage} />
      <View style={styles.novelInfo}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.author} numberOfLines={1}>{item.author}</Text>
        <View style={styles.likesContainer}>
          <FontAwesome name="heart" size={12} color="#FF6B6B" />
          <Text style={styles.likes}>{item.likes}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={novels}
        renderItem={renderNovelItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 8,
  },
  row: {
    justifyContent: 'space-between',
  },
  novelCard: {
    width: COLUMN_WIDTH,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  coverImage: {
    width: COLUMN_WIDTH,
    height: COLUMN_WIDTH * 1.5,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  novelInfo: {
    padding: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likes: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
}); 