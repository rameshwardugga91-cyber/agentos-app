import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, SafeAreaView,
  StatusBar, ActivityIndicator
} from 'react-native';const AGENTS = [
  { id: 'personal', name: 'Personal Agent', emoji: '🤖', color: '#3b82f6', desc: 'Tasks aur schedule manage karta hoon' },
  { id: 'research', name: 'Research Agent', emoji: '🔍', color: '#8b5cf6', desc: 'Kuch bhi search aur analyze karta hoon' },
  { id: 'business', name: 'Business Agent', emoji: '💼', color: '#10b981', desc: 'Business aur customers handle karta hoon' },
];export default function App() {
  const [activeAgent, setActiveAgent] = useState(AGENTS[0]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          system: `You are ${activeAgent.name}. ${activeAgent.desc}. Reply in same language as user.`,
          messages: [{ role: 'user', content: input }],
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || 'Error!';
      setMessages(prev => [...prev, { role: 'agent', text: reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'agent', text: 'Internet error!' }]);
    }
    setLoading(false);
  };return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#050810" />
      <View style={styles.header}>
        <Text style={styles.logo}>⬡ AgentOS</Text>
        <Text style={styles.headerSub}>AI Agent Platform</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.agentBar}>
        {AGENTS.map(agent => (
          <TouchableOpacity
            key={agent.id}
            style={[styles.agentBtn, activeAgent.id === agent.id && { borderColor: agent.color, backgroundColor: agent.color + '22' }]}
            onPress={() => { setActiveAgent(agent); setMessages([]); }}
          >
            <Text style={styles.agentEmoji}>{agent.emoji}</Text>
            <Text style={[styles.agentName, activeAgent.id === agent.id && { color: agent.color }]}>{agent.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView><View style={[styles.activeBar, { borderLeftColor: activeAgent.color }]}>
        <Text style={{ color: activeAgent.color, fontWeight: 'bold' }}>{activeAgent.emoji} {activeAgent.name}</Text>
        <Text style={styles.activeDesc}>{activeAgent.desc}</Text>
      </View>
      <ScrollView style={styles.chat} contentContainerStyle={{ padding: 16 }}>
        {messages.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>{activeAgent.emoji}</Text>
            <Text style={styles.emptyText}>Namaste! Main hoon {activeAgent.name}</Text>
            <Text style={styles.emptyDesc}>Kuch bhi poocho — Hindi ya English mein!</Text>
          </View>
        )}
        {messages.map((msg, i) => (
          <View key={i} style={[styles.bubble, msg.role === 'user' ? styles.userBubble : styles.agentBubble]}>
            <Text style={[styles.bubbleText, msg.role === 'user' ? styles.userText : styles.agentText]}>
              {msg.text}
            </Text>
          </View>
        ))}
        {loading && (
          <View style={styles.agentBubble}>
            <ActivityIndicator color={activeAgent.color} />
          </View>
        )}
      </ScrollView><View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Kuch bhi poocho..."
          placeholderTextColor="#64748b"
          value={input}
          onChangeText={setInput}
          multiline
        />
        <TouchableOpacity style={[styles.sendBtn, { backgroundColor: activeAgent.color }]} onPress={sendMessage}>
          <Text style={styles.sendText}>→</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#050810' },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#1e2d4a' },
  logo: { fontSize: 22, fontWeight: 'bold', color: '#3b82f6' },
  headerSub: { fontSize: 12, color: '#64748b', marginTop: 2 },
  agentBar: { paddingHorizontal: 12, paddingVertical: 12, maxHeight: 90 },
  agentBtn: { marginRight: 10, padding: 10, borderRadius: 12, borderWidth: 1, borderColor: '#1e2d4a', backgroundColor: '#0c1120', alignItems: 'center', minWidth: 120 },
  agentEmoji: { fontSize: 20 },
  agentName: { fontSize: 11, color: '#94a3b8', marginTop: 4, fontWeight: '600' },
  activeBar: { marginHorizontal: 16, marginBottom: 8, padding: 10, backgroundColor: '#0c1120', borderRadius: 10, borderLeftWidth: 3 },
  activeDesc: { fontSize: 11, color: '#64748b', marginTop: 2 },
  chat: { flex: 1 },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, color: '#e2e8f0', fontWeight: 'bold' },
  emptyDesc: { fontSize: 13, color: '#64748b', marginTop: 6 },
  bubble: { maxWidth: '85%', padding: 12, borderRadius: 16, marginBottom: 10 },
  userBubble: { backgroundColor: '#1e3a5f', alignSelf: 'flex-end' },
  agentBubble: { backgroundColor: '#111827', alignSelf: 'flex-start', borderWidth: 1, borderColor: '#1e2d4a' },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  userText: { color: '#e2e8f0' },
  agentText: { color: '#cbd5e1' },
  inputRow: { flexDirection: 'row', padding: 12, borderTopWidth: 1, borderTopColor: '#1e2d4a', alignItems: 'flex-end' },
  input: { flex: 1, backgroundColor: '#0c1120', color: '#e2e8f0', borderRadius: 12, padding: 12, fontSize: 14, borderWidth: 1, borderColor: '#1e2d4a', maxHeight: 100 },
  sendBtn: { marginLeft: 8, width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  sendText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});
}
