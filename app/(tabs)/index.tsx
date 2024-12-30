import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, Dimensions,ActivityIndicator } from 'react-native';
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

  const [hasMore, setHasMore] = useState(true); // 是否还有更多数据

  useEffect(() => {
    // 跟踪页面浏览
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
  // 加载更多数据
  const loadMore = () => {
    if (!hasMore || loading) return;
    console.log('loadMore');
    // setPage((prevPage) => prevPage + 1);
    // fetchData(page + 1);
  };
  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator 
    size="large" // 设置加载动画的大小
    color="blue" // 设置加载动画的颜色
    />;
  };

  const renderNovelItem = ({ item }: { item: Novel }) => (
    <TouchableOpacity
      style={styles.novelCard}
      activeOpacity={0.9}
      onPress={() => {
        Analytics.trackNovelClick(item.id, item.title, item.author);
        router.push({
          pathname: '/novel',
          params: { id: item.id }
        });
      }}>
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
          data={novels}//设置数据
          renderItem={renderNovelItem}//设置列表项
          keyExtractor={(item) => item.id}//设置key
          numColumns={2}//设置每行2列
          columnWrapperStyle={styles.row}//设置每行2列
          contentContainerStyle={styles.list}//设置列表的样式
          onEndReached={loadMore} // 加载更多
          onEndReachedThreshold={0.5} // 加载更多阈值
          ListFooterComponent={renderFooter} // 加载更多组件
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
    elevation: 0,//阴影
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