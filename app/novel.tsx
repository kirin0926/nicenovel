import { View,Text,ScrollView,Pressable,SafeAreaView,useWindowDimensions} from 'react-native';
import { useEffect, useState } from 'react';
import RenderHtml from 'react-native-render-html';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { Analytics } from '@/services/analytics';
import SubscriptionPlanDrawer from '@/components/pay/plan/SubscriptionPlanDrawer';
import { api } from '@/services/api';

interface Chapter {
  id: string;
  title: string;
  content: string;
  chapter_number: number;
  novel_id: string;
}

export default function ReadScreen() {
  const { id } = useLocalSearchParams();// 获取小说ID
  const [fontSize, setFontSize] = useState(18);// 字体大小
  const [chapter, setChapter] = useState<Chapter | null>(null);// 当前章节
  const { width } = useWindowDimensions(); // 获取屏幕宽度用于渲染HTML
  const [pageEnterTime, setPageEnterTime] = useState<Date>(new Date());// 记录进入页面的时间
  const [isSubscribed, setIsSubscribed] = useState(false);// 是否订阅
  const [showControls, setShowControls] = useState(true);// 是否显示控制按钮
  const [nextChapter, setNextChapter] = useState<Chapter | null>(null);// 下一章节
  const [prevChapter, setPrevChapter] = useState<Chapter | null>(null);// 上一章节
  

  // 检查订阅状态
  useEffect(() => {
    async function checkSubscription() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsSubscribed(false);
        return;
      }
      
      const { data: subscription } = await api.checkSubscriptionStatus(user.id);
      setIsSubscribed(!!subscription);
    }
    
    checkSubscription();
  }, []);


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

  // 修改 processContent 函数来限制内容
  const processContent = (content: string) => {
    if (!content) return '';
    
    let processedContent = content
      .split('\n')
      .filter(line => line.trim() !== '')
      .map(line => `<p>${line}</p>`)
      .join('')
      .replace(/\\"/g, '"')
      .replace(/\\n/g, '<br/>');

    if (!isSubscribed) {
      // 限制在3000字以内
      const truncatedContent = processedContent.slice(0, 5000);
      processedContent = `
        ${truncatedContent}
      `;
    }

    return processedContent;
  };

  if (!chapter) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Text></Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className={`${!showControls && 'opacity-0 h-0'}`}>
        <View className="flex-row items-center p-2.5 bg-white border-b border-[#eee]">
          <Pressable className="p-1" onPress={handleBack}>
            <Ionicons name="chevron-back" size={24} color="#333" />
          </Pressable>
          <Text className="flex-1 text-base font-bold text-center mx-4" numberOfLines={1}>
            {chapter.title}
          </Text>
          <Pressable className="p-1">
            <Ionicons name="settings-outline" size={24} color="#333" />
          </Pressable>
        </View>
      </View>

      <ScrollView 
        className="flex-1 p-4"
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
        
        {!isSubscribed && (
          <View>
            <View className="flex-row items-center justify-center px-4 my-5">
              <View className="flex-1 h-[1px] border border-dashed border-gray-300 mx-2.5" />
              <Text className="text-sm text-gray-600 font-medium">
                Subscribe to Continue Reading Full Novel
              </Text>
              <View className="flex-1 h-[1px] border border-dashed border-gray-300 mx-2.5" />
            </View>
            
            <SubscriptionPlanDrawer />
          </View>
        )}
      </ScrollView>
      
      <View className={`${!showControls && 'opacity-0 h-0'}`}>
        <View className="hidden flex-row justify-between items-center p-4 bg-white border-t border-[#eee]">
          <Pressable 
            className={`py-2 px-4 rounded ${!prevChapter ? 'bg-gray-400' : 'bg-[#007AFF]'}`}
            disabled={!prevChapter}
            onPress={() => prevChapter && navigateToChapter(prevChapter.id)}
          >
            <Text className="text-white text-sm">上一章</Text>
          </Pressable>
          <View className="flex-row items-center">
            <Pressable 
              className="p-2 mx-2 bg-gray-100 rounded"
              onPress={() => setFontSize(Math.max(14, fontSize - 2))}
            >
              <Text className="text-sm text-[#333]">A-</Text>
            </Pressable>
            <Pressable 
              className="p-2 mx-2 bg-gray-100 rounded"
              onPress={() => setFontSize(Math.min(24, fontSize + 2))}
            >
              <Text className="text-sm text-[#333]">A+</Text>
            </Pressable>
          </View>
          <Pressable 
            className={`py-2 px-4 rounded ${!nextChapter ? 'bg-gray-400' : 'bg-[#007AFF]'}`}
            disabled={!nextChapter}
            onPress={() => nextChapter && navigateToChapter(nextChapter.id)}
          >
            <Text className="text-white text-sm">下一章</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
} 