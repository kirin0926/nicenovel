import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { Analytics } from '../../services/analytics';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 32) / 2;

interface Novel {
  id: string;
  title: string;
  author: string;
  cover: string;
  like: number;
}

export default function Home() {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Analytics.trackPageView('Home', {
      timestamp: new Date().toISOString(),
      numberOfNovels: novels.length
    });
    
    fetchNovels();
  }, []);

  async function fetchNovels() {
    try {
      const { data, error } = await supabase
        .from('novels')
        .select('*');

      if (error) {
        throw error;
      }

      if (data) {
        setNovels(data);
      }
    } catch (error) {
      console.error('Error fetching novels:', error);
    } finally {
      setLoading(false);
    }
  }

  const renderNovelItem = ({ item }: { item: Novel }) => (
    <TouchableOpacity
      style={styles.novelCard}
      onPress={() => router.push({
        pathname: '/novel',
        params: { id: item.id }
      })}>
      <Image source={{ uri: item.cover }} style={styles.coverImage} />
      <View style={styles.novelInfo}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={styles.author} numberOfLines={1}>{item.author}</Text>
          <View style={styles.likesContainer}>
            <FontAwesome name="heart" size={12} color="#FF6B6B" />
            <Text style={styles.likes}>{item.like}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text>loading...</Text>
        </View>
      ) : (
        <FlatList
          data={novels}
          renderItem={renderNovelItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
        />
      )}
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
    borderRadius: 8,//圆角
    marginBottom: 16,//下边距
    elevation: 0.3,//阴影
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 