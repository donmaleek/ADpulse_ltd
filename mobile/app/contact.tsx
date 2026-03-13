import { useState } from 'react'
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000'

export default function ContactScreen() {
  const [form, setForm]     = useState({ name:'', email:'', company:'', service:'', message:'' })
  const [status, setStatus] = useState<'idle'|'sending'|'done'>('idle')

  async function submit() {
    if (!form.name || !form.email || !form.message) {
      Alert.alert('Missing fields', 'Please fill in your name, email, and message.')
      return
    }
    setStatus('sending')
    try {
      await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setStatus('done')
    } catch {
      Alert.alert('Error', 'Could not send message. Please try WhatsApp instead.')
      setStatus('idle')
    }
  }

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView style={s.scroll} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
        <Text style={s.title}>Let&apos;s Talk</Text>
        <Text style={s.sub}>We respond within 24 hours with a tailored proposal.</Text>

        {/* Quick contact buttons */}
        <View style={s.quickRow}>
          <TouchableOpacity style={s.quickBtn} onPress={() => Linking.openURL('https://wa.me/254769968696')} activeOpacity={0.85}>
            <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
            <Text style={s.quickText}>WhatsApp</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.quickBtn} onPress={() => Linking.openURL('tel:+254769968696')} activeOpacity={0.85}>
            <Ionicons name="call-outline" size={20} color="#00D4FF" />
            <Text style={s.quickText}>Call Us</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.quickBtn} onPress={() => Linking.openURL('mailto:adpulseindustries@gmail.com')} activeOpacity={0.85}>
            <Ionicons name="mail-outline" size={20} color="#7C3AED" />
            <Text style={s.quickText}>Email Us</Text>
          </TouchableOpacity>
        </View>

        {status === 'done' ? (
          <View style={s.successBox}>
            <Ionicons name="checkmark-circle" size={48} color="#00FF88" />
            <Text style={s.successTitle}>Message Sent!</Text>
            <Text style={s.successSub}>We&apos;ll be in touch within 24 hours.</Text>
          </View>
        ) : (
          <View style={s.form}>
            {[
              { key:'name',    label:'Full Name',           placeholder:'John Doe',            multiline:false },
              { key:'email',   label:'Email Address',       placeholder:'john@company.com',    multiline:false },
              { key:'company', label:'Company (optional)',  placeholder:'Your Company Ltd',    multiline:false },
            ].map(f => (
              <View key={f.key} style={s.field}>
                <Text style={s.label}>{f.label}</Text>
                <TextInput
                  value={form[f.key as keyof typeof form]}
                  onChangeText={v => setForm(p => ({ ...p, [f.key]: v }))}
                  placeholder={f.placeholder}
                  placeholderTextColor="#4A5878"
                  style={s.input}
                  keyboardType={f.key === 'email' ? 'email-address' : 'default'}
                  autoCapitalize={f.key === 'email' ? 'none' : 'words'}
                />
              </View>
            ))}
            <View style={s.field}>
              <Text style={s.label}>Message</Text>
              <TextInput
                value={form.message}
                onChangeText={v => setForm(p => ({ ...p, message: v }))}
                placeholder="Describe your project and goals…"
                placeholderTextColor="#4A5878"
                style={[s.input, s.textarea]}
                multiline
                numberOfLines={5}
              />
            </View>
            <TouchableOpacity onPress={submit} disabled={status === 'sending'} activeOpacity={0.85}>
              <LinearGradient colors={['#00D4FF','#00FF88']} style={s.submitBtn} start={{x:0,y:0}} end={{x:1,y:0}}>
                <Text style={s.submitText}>{status === 'sending' ? 'Sending…' : 'Send Message'}</Text>
                {status === 'idle' && <Ionicons name="send" size={18} color="#060D1F" />}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe:    { flex:1, backgroundColor:'#060D1F' },
  scroll:  { flex:1 },
  content: { padding:24, paddingTop:40 },
  title:   { fontWeight:'800', fontSize:28, color:'#F0F4FF', marginBottom:8, letterSpacing:-0.5 },
  sub:     { fontSize:15, color:'#8B9DC3', marginBottom:24, lineHeight:22 },

  quickRow: { flexDirection:'row', gap:10, marginBottom:28 },
  quickBtn: { flex:1, flexDirection:'row', alignItems:'center', justifyContent:'center', gap:6, backgroundColor:'rgba(255,255,255,0.05)', borderWidth:1, borderColor:'rgba(255,255,255,0.09)', borderRadius:12, paddingVertical:12 },
  quickText: { fontSize:13, fontWeight:'600', color:'#F0F4FF' },

  form:      { gap:18 },
  field:     { gap:8 },
  label:     { fontSize:13, fontWeight:'600', color:'#8B9DC3' },
  input:     { backgroundColor:'rgba(255,255,255,0.05)', borderWidth:1.5, borderColor:'rgba(255,255,255,0.09)', borderRadius:12, padding:14, fontSize:14, color:'#F0F4FF' },
  textarea:  { height:120, textAlignVertical:'top' },

  submitBtn:  { flexDirection:'row', alignItems:'center', justifyContent:'center', gap:10, padding:16, borderRadius:14 },
  submitText: { fontSize:16, fontWeight:'700', color:'#060D1F' },

  successBox:  { alignItems:'center', padding:40, gap:12 },
  successTitle: { fontSize:22, fontWeight:'800', color:'#F0F4FF' },
  successSub:   { fontSize:15, color:'#8B9DC3', textAlign:'center' },
})
