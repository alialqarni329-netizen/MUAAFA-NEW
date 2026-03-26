import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Send, Camera, Bot, User, AlertCircle } from 'lucide-react-native';
import { supabase } from '@lib/supabase';
import { Colors } from '@constants/colors';
import { Layout } from '@constants/layout';
import { Typography } from '@constants/typography';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image_url?: string;
  created_at: string;
}

// ─── AI Config (reads from env - DO NOT hardcode keys) ───────────────────────
const AI_CONFIG = {
  model: 'gpt-4o',
  max_tokens: 300,
  temperature: 0.4,
  top_p: 0.9,
  frequency_penalty: 0.1,
  presence_penalty: 0.1,
  MAX_MESSAGES_PER_DAY: 20,
  WARNING_THRESHOLD: 16,
} as const;

const SYSTEM_PROMPT = `أنت الطبيب الذكي في تطبيق مُعافى - مساعد صحي ذكي ومتعاطف.

مهامك:
- الإجابة على الأسئلة الصحية والطبية باللغة العربية
- تحليل الصور الطبية وتقديم توصيات
- اقتراح حجز جلسة طبية عند الحاجة
- تقييم درجة الخطورة (منخفضة/متوسطة/عالية)

قواعد مهمة:
- لا تشخص أمراضاً بشكل قاطع
- انصح دائماً بمراجعة طبيب متخصص عند الضرورة
- ردودك يجب أن تكون مختصرة ومفيدة (حد أقصى 3 فقرات)
- استخدم لغة عربية واضحة وسهلة الفهم

عند تحليل الصور: اذكر ما تراه، درجة الخطورة المحتملة، والتوصيات.`;

// ─── Component ────────────────────────────────────────────────────────────────
export default function AIDoctorScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dailyCount, setDailyCount] = useState(0);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

  useEffect(() => {
    initSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initSession = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await loadOrCreateConversation(user.id);
    await loadDailyCount(user.id);
  };

  const loadOrCreateConversation = async (uid: string) => {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('chat_conversations')
      .select('id')
      .eq('user_id', uid)
      .gte('created_at', today)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data) {
      setConversationId(data.id);
      await loadMessages(data.id);
    } else {
      const { data: newConv } = await supabase
        .from('chat_conversations')
        .insert({ user_id: uid, title: 'جلسة الطبيب الذكي' })
        .select('id')
        .single();
      if (newConv) setConversationId(newConv.id);
    }
  };

  const loadMessages = async (convId: string) => {
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', convId)
      .order('created_at', { ascending: true });
    if (data) setMessages(data as Message[]);
  };

  const loadDailyCount = async (uid: string) => {
    const today = new Date().toISOString().split('T')[0];
    const { count } = await supabase
      .from('chat_messages')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'user')
      .gte('created_at', today)
      .in('conversation_id',
        (await supabase.from('chat_conversations').select('id').eq('user_id', uid).then(r => r.data?.map(c => c.id) ?? []))
      );
    setDailyCount(count ?? 0);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      base64: true,
    });
    if (!result.canceled && result.assets[0].base64) {
      setSelectedImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const saveMessage = async (role: 'user' | 'assistant', content: string, imageUrl?: string) => {
    if (!conversationId) return null;
    const { data } = await supabase
      .from('chat_messages')
      .insert({
        conversation_id: conversationId,
        role,
        content,
        image_url: imageUrl ?? null,
      })
      .select('*')
      .single();
    return data as Message | null;
  };

  const callOpenAI = async (userContent: string, imageBase64?: string) => {
    if (!apiKey || apiKey === 'your_openai_api_key_here') {
      return 'مفتاح OpenAI API غير مُعيَّن. يرجى إضافة EXPO_PUBLIC_OPENAI_API_KEY في ملف .env';
    }

    const history = messages.slice(-6).map(m => ({
      role: m.role,
      content: m.content,
    }));

    const userMessage = imageBase64
      ? [
          { type: 'text', text: userContent || 'حلل هذه الصورة الطبية' },
          { type: 'image_url', image_url: { url: imageBase64, detail: 'low' } },
        ]
      : userContent;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        max_tokens: AI_CONFIG.max_tokens,
        temperature: AI_CONFIG.temperature,
        top_p: AI_CONFIG.top_p,
        frequency_penalty: AI_CONFIG.frequency_penalty,
        presence_penalty: AI_CONFIG.presence_penalty,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...history,
          { role: 'user', content: userMessage },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message ?? 'خطأ في الاتصال بالذكاء الاصطناعي');
    }

    const json = await response.json();
    return json.choices[0]?.message?.content ?? 'لا توجد إجابة';
  };

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text && !selectedImage) return;
    if (dailyCount >= AI_CONFIG.MAX_MESSAGES_PER_DAY) {
      Alert.alert('تجاوزت الحد اليومي', 'لقد وصلت إلى الحد الأقصى (20 رسالة) لهذا اليوم. يتجدد غداً.');
      return;
    }

    setLoading(true);
    const msgText = text || 'حلل هذه الصورة';
    const image = selectedImage ?? undefined;
    setInput('');
    setSelectedImage(null);

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: msgText,
      image_url: image,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    await saveMessage('user', msgText, image);
    setDailyCount(c => c + 1);

    try {
      const reply = await callOpenAI(msgText, image);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply,
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiMsg]);
      await saveMessage('assistant', reply);
    } catch (err) {
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `حدث خطأ: ${err instanceof Error ? err.message : 'يرجى المحاولة مرة أخرى'}`,
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, selectedImage, dailyCount, messages, conversationId]);

  const remaining = AI_CONFIG.MAX_MESSAGES_PER_DAY - dailyCount;
  const isWarning = dailyCount >= AI_CONFIG.WARNING_THRESHOLD;

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.msgRow, isUser ? styles.msgRowUser : styles.msgRowAI]}>
        <View style={[styles.avatar, isUser ? styles.avatarUser : styles.avatarAI]}>
          {isUser
            ? <User size={16} color="#fff" />
            : <Bot size={16} color="#fff" />}
        </View>
        <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAI]}>
          {item.image_url && (
            <Image source={{ uri: item.image_url }} style={styles.previewImage} resizeMode="cover" />
          )}
          <Text style={[styles.bubbleText, isUser ? styles.textUser : styles.textAI]}>
            {item.content}
          </Text>
          <Text style={styles.timestamp}>
            {new Date(item.created_at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.botIcon}>
            <Bot size={22} color={Colors.white} />
          </View>
          <View>
            <Text style={styles.headerTitle}>الطبيب الذكي</Text>
            <Text style={styles.headerSub}>مدعوم بـ GPT-4o</Text>
          </View>
        </View>
        <View style={[styles.countBadge, isWarning ? styles.countWarning : styles.countNormal]}>
          {isWarning && <AlertCircle size={12} color="#fff" />}
          <Text style={styles.countText}>{remaining} متبقي</Text>
        </View>
      </View>

      {/* Messages */}
      {messages.length === 0 ? (
        <View style={styles.emptyState}>
          <Bot size={56} color={Colors.primary} />
          <Text style={styles.emptyTitle}>مرحباً! أنا طبيبك الذكي</Text>
          <Text style={styles.emptySub}>
            يمكنني الإجابة على أسئلتك الصحية، تحليل الصور الطبية، وحجز جلسات مع الأطباء
          </Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />
      )}

      {/* Image preview */}
      {selectedImage && (
        <View style={styles.imagePreviewRow}>
          <Image source={{ uri: selectedImage }} style={styles.thumbPreview} />
          <TouchableOpacity onPress={() => setSelectedImage(null)} style={styles.removeImage}>
            <Text style={styles.removeImageText}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Input */}
      <View style={styles.inputBar}>
        <TouchableOpacity onPress={pickImage} style={styles.cameraBtn}>
          <Camera size={22} color={Colors.primary} />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="اسأل طبيبك الذكي..."
          placeholderTextColor={Colors.textMuted}
          multiline
          textAlign="right"
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity
          onPress={sendMessage}
          style={[styles.sendBtn, (!input.trim() && !selectedImage) || loading ? styles.sendBtnDisabled : styles.sendBtnActive]}
          disabled={(!input.trim() && !selectedImage) || loading}
        >
          {loading
            ? <ActivityIndicator size="small" color="#fff" />
            : <Send size={18} color="#fff" />}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: Colors.white, paddingHorizontal: 16, paddingVertical: 12,
    paddingTop: 50, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  botIcon: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { fontSize: Typography.fontSize.md, fontWeight: Typography.fontWeight.bold, color: Colors.textPrimary },
  headerSub: { fontSize: Typography.fontSize.xs, color: Colors.textMuted },
  countBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12,
  },
  countNormal: { backgroundColor: Colors.primary },
  countWarning: { backgroundColor: Colors.warning },
  countText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  messageList: { padding: 12, paddingBottom: 8 },
  msgRow: { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-end', gap: 8 },
  msgRowUser: { flexDirection: 'row-reverse' },
  msgRowAI: { flexDirection: 'row' },
  avatar: {
    width: 30, height: 30, borderRadius: 15,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarUser: { backgroundColor: Colors.primary },
  avatarAI: { backgroundColor: Colors.success },
  bubble: {
    maxWidth: '78%', padding: 10, borderRadius: 14,
    ...Layout.shadow.sm,
  },
  bubbleUser: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleAI: {
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 4,
  },
  bubbleText: { fontSize: Typography.fontSize.sm, lineHeight: 20 },
  textUser: { color: '#fff' },
  textAI: { color: Colors.textPrimary },
  timestamp: { fontSize: 10, color: 'rgba(255,255,255,0.6)', marginTop: 4, textAlign: 'right' },
  emptyState: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32,
  },
  emptyTitle: {
    fontSize: Typography.fontSize.xl, fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary, marginTop: 16, marginBottom: 8, textAlign: 'center',
  },
  emptySub: {
    fontSize: Typography.fontSize.sm, color: Colors.textSecondary,
    textAlign: 'center', lineHeight: 22,
  },
  imagePreviewRow: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12,
    paddingVertical: 6, backgroundColor: Colors.white,
  },
  thumbPreview: { width: 48, height: 48, borderRadius: 8, marginRight: 8 },
  removeImage: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: Colors.error, justifyContent: 'center', alignItems: 'center',
  },
  removeImageText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 8,
    paddingHorizontal: 12, paddingVertical: 10,
    backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.border,
  },
  cameraBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  input: {
    flex: 1, backgroundColor: Colors.background, borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 10, fontSize: Typography.fontSize.sm,
    color: Colors.textPrimary, maxHeight: 100, borderWidth: 1, borderColor: Colors.border,
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center',
  },
  sendBtnActive: { backgroundColor: Colors.primary },
  sendBtnDisabled: { backgroundColor: Colors.textMuted },
  previewImage: { width: '100%', height: 150, borderRadius: 8, marginBottom: 6 },
});
