import { 
  View, //视图
  Text, //文本
  StyleSheet, //样式
  ScrollView, //滚动视图
  Pressable, //按钮
  SafeAreaView,//安全区域
  useWindowDimensions//获取屏幕宽度
} from 'react-native';
import RenderHtml from 'react-native-render-html';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { Analytics } from '@/services/analytics';

interface Chapter {
  id: string;
  title: string;
  content: string;
  chapter_number: number;
  novel_id: string;
}

export default function ReadScreen() {
  const { id } = useLocalSearchParams();
  const [showControls, setShowControls] = useState(true);
  const [fontSize, setFontSize] = useState(18);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [nextChapter, setNextChapter] = useState<Chapter | null>(null);
  const [prevChapter, setPrevChapter] = useState<Chapter | null>(null);
  const { width } = useWindowDimensions(); // 获取屏幕宽度用于渲染HTML
  const [pageEnterTime, setPageEnterTime] = useState<Date>(new Date());// 记录进入页面的时间

  useEffect(() => {
    // 获取当前章节
    async function fetchChapters() {
      try {
        // 获取当前章节
        const { data: currentChapter, error: currentError } = await supabase
          .from('novels')
          .select('*')
          .eq('id', id)
          .limit(1)
          .single();

        if (currentError) throw currentError;
        if (currentChapter) {
          setChapter(currentChapter);

          // 获取上一章
          // const { data: prevData } = await supabase
          //   .from('chapters')
          //   .select('*')
          //   .eq('novel_id', id)
          //   .lt('chapter_number', currentChapter.chapter_number)
          //   .order('chapter_number', { ascending: false })
          //   .limit(1)
          //   .single();
          
          // setPrevChapter(prevData);

          // // 获取下一章
          // const { data: nextData } = await supabase
          //   .from('novels')
          //   .select('*')
          //   .eq('novel_id', id)
          //   .gt('chapter_number', currentChapter.chapter_number)
          //   .order('chapter_number', { ascending: true })
          //   .limit(1)
          //   .single();
          // setNextChapter(nextData);
        }
      } catch (error) {
        console.error('Error fetching chapters:', error);
      }
    }
    // 获取当前章节
    fetchChapters();
  }, [id]);

  useEffect(() => {
    // 记录进入页面的时间
    setPageEnterTime(new Date());
    
    // 发送页面访问事件
    Analytics.trackPageView('Novel Reading', {
      novelId: id,
      chapterTitle: chapter?.title
    });

    // 在组件卸载时计算并发送停留时间
    return () => {
      const exitTime = new Date();
      const durationInSeconds = Math.round((exitTime.getTime() - pageEnterTime.getTime()) / 1000);
      
      Analytics.trackEvent('Novel Reading Duration', {
        novelId: id,
        chapterTitle: chapter?.title,
        durationInSeconds,
        exitTime: exitTime.toISOString()
      });
    };
  }, [id]); // 只在 id 变化时执行

  const toggleControls = () => {
    // setShowControls(!showControls);
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  const navigateToChapter = async (chapterId: string) => {
    // 这里可以添加导航到指定章节的逻辑
    // 可以通过修改 URL 参数或其他方式实现
  };

  // 添加内容预处理函数
  const processContent = (content: string) => {
    if (!content) return '';
    return content
      // 将换行符转换为 HTML 段落标签
      .split('\n')
      .filter(line => line.trim() !== '') // 过滤空行
      .map(line => `<p>${line}</p>`)
      .join('')
      // 将 \" 转换为引号
      .replace(/\\"/g, '"')
      // 可以根据需要添加其他替换规则
      .replace(/\\n/g, '<br/>');
  };

  if (!chapter) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Loading... */}
        <Text></Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.controlsContainer, !showControls && styles.hidden]}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={handleBack}>
            <Ionicons name="chevron-back" size={24} color="#333" />
          </Pressable>
          <Text style={styles.title} numberOfLines={1}>
            {chapter.title}
          </Text>
          <Pressable style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color="#333" />
          </Pressable>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        onTouchStart={toggleControls}
      >
        <RenderHtml
          contentWidth={width}
          source={{ html: processContent(chapter?.content || '') }}
          tagsStyles={{
            body: {
              fontSize: fontSize,
              lineHeight: fontSize * 1.7,
              color: '#333',
            },
            p: {
              marginBottom: 16,
              textAlign: 'justify',
            }
          }}
        />
      </ScrollView>

      <View style={[styles.controlsContainer, !showControls && styles.hidden]}>
        <View style={styles.footer}>
          <Pressable 
            style={[styles.navButton, !prevChapter && styles.disabledButton]}
            disabled={!prevChapter}
            onPress={() => prevChapter && navigateToChapter(prevChapter.id)}
          >
            <Text style={styles.navButtonText}>上一章</Text>
          </Pressable>
          <View style={styles.fontControls}>
            <Pressable 
              style={styles.fontButton}
              onPress={() => setFontSize(Math.max(14, fontSize - 2))}
            >
              <Text style={styles.fontButtonText}>A-</Text>
            </Pressable>
            <Pressable 
              style={styles.fontButton}
              onPress={() => setFontSize(Math.min(24, fontSize + 2))}
            >
              <Text style={styles.fontButtonText}>A+</Text>
            </Pressable>
          </View>
          <Pressable 
            style={[styles.navButton, !nextChapter && styles.disabledButton]}
            disabled={!nextChapter}
            onPress={() => nextChapter && navigateToChapter(nextChapter.id)}
          >
            <Text style={styles.navButtonText}>下一章</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  controlsContainer: {
    opacity: 1,
  },
  hidden: {
    opacity: 0,
    height: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 4,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 16,
  },
  settingsButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  contentText: {
    lineHeight: 28,
    color: '#333',
  },
  footer: {
    display: 'none',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  navButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  navButtonText: {
    color: 'white',
    fontSize: 14,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  fontControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fontButton: {
    padding: 8,
    marginHorizontal: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  fontButtonText: {
    fontSize: 14,
    color: '#333',
  },
}); 