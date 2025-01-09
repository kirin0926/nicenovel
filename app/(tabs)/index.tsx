import { useState, useEffect } from 'react';
import { Text, View, Image, TouchableOpacity, FlatList, Dimensions, ActivityIndicator, TextInput } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { Analytics } from '@/services/analytics';

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
  const [hasMore, setHasMore] = useState(true);

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

  const loadMore = () => {
    if (!hasMore || loading) return;
    console.log('loadMore');
  };

  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator 
      size="large"
      color="blue"
    />;
  };

  const renderNovelItem = ({ item }: { item: Novel }) => (
    <TouchableOpacity
      className="w-[COLUMN_WIDTH] bg-white rounded-lg mb-4"
      style={{ width: COLUMN_WIDTH }}
      activeOpacity={0.9}
      onPress={() => {
        Analytics.trackNovelClick(item.id, item.title, item.author);
        router.push({
          pathname: '/novel',
          params: { id: item.id }
        });
      }}>
      <Image 
        source={{ uri: item.cover }}
        defaultSource={require('@/assets/images/icon.png')}
        loadingIndicatorSource={require('@/assets/images/icon.png')}
        className="rounded-t-lg"
        style={{ width: COLUMN_WIDTH, height: COLUMN_WIDTH * 1.5 }}
      />
      <View className="p-2">
        <Text className="text-base font-bold mb-1" numberOfLines={2}>{item.title}</Text>
        <View className="flex-row justify-between items-center">
          <Text className="text-sm text-gray-600 mb-1" numberOfLines={1}>{item.author}</Text>
          <View className="flex-row items-center">
            <FontAwesome name="heart" size={12} color="#FF6B6B" />
            <Text className="text-xs text-gray-600 ml-1">{item.like}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-100">
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <Text>loading...</Text>
        </View>
      ) : (
        <>
          {/* search bar */}
          <View className="m-2 mt-3 mb-3 hidden">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push('/booksearch')}
            >
              <View className="flex-row items-center bg-white rounded-lg p-2">
                <FontAwesome name="search" size={16} color="#FF629A" />
                <TextInput
                  placeholder="search for novels"
                  placeholderTextColor="#666"
                  className="flex-1 p-2"
                  onChangeText={(text) => console.log(text)}
                  editable={false}
                />
              </View>
            </TouchableOpacity>
          </View>
          {/* novel list */}
          <FlatList
            data={novels}
            renderItem={renderNovelItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            className="p-2"
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
          />
          </>
      )}
    </View>
  );
} 