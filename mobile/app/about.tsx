import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

export default function AboutScreen() {
  const router = useRouter()
  return (
    <SafeAreaView style={s.safe}>
      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Text style={s.title}>About Adpulse</Text>
        <Text style={s.sub}>Empowering businesses across Kenya &amp; East Africa with smart technology.</Text>

        {/* CTO Card */}
        <LinearGradient colors={['rgba(0,102,255,0.15)','rgba(0,212,255,0.08)']} style={s.ctoCard}>
          <View style={s.ctoAvatar}>
            <Text style={s.ctoInitials}>MA</Text>
          </View>
          <View style={s.ctoInfo}>
            <Text style={s.ctoName}>Engineer Mathias Alfred</Text>
            <Text style={s.ctoRole}>Chief Technical Officer</Text>
            <Text style={s.ctoCompany}>Adpulse Ltd, Nairobi</Text>
          </View>
        </LinearGradient>

        {/* Mission */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Our Mission</Text>
          <Text style={s.body}>
            Adpulse Ltd is a Kenya-based IT support and software automation company dedicated to helping businesses unlock the full potential of modern technology. We combine deep technical expertise with a genuine commitment to our clients&apos; success.
          </Text>
        </View>

        {/* Stats */}
        <View style={s.statsGrid}>
          {[['50+','Projects Delivered'],['30+','Satisfied Clients'],['98%','Satisfaction Rate'],['5+','Years Experience']].map(([val, lab]) => (
            <View key={lab} style={s.statCard}>
              <Text style={s.statVal}>{val}</Text>
              <Text style={s.statLab}>{lab}</Text>
            </View>
          ))}
        </View>

        {/* Values */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Our Values</Text>
          {['Results-Driven Approach','Transparent Communication','Affordable & Scalable Solutions','Long-term Partnership Mindset'].map(v => (
            <View key={v} style={s.valueRow}>
              <Ionicons name="checkmark-circle" size={18} color="#00FF88" />
              <Text style={s.valueText}>{v}</Text>
            </View>
          ))}
        </View>

        {/* Contact info */}
        <View style={s.contactCard}>
          {[
            { icon:'call-outline',       text:'+254 769 968 696',      action:() => Linking.openURL('tel:+254769968696') },
            { icon:'mail-outline',       text:'adpulseindustries@gmail.com',   action:() => Linking.openURL('mailto:adpulseindustries@gmail.com') },
            { icon:'location-outline',   text:'Nairobi, Kenya',        action:null },
            { icon:'logo-whatsapp',      text:'Chat on WhatsApp',      action:() => Linking.openURL('https://wa.me/254769968696') },
          ].map(item => (
            <TouchableOpacity key={item.text} style={s.contactRow} onPress={item.action || undefined} activeOpacity={item.action ? 0.7 : 1} disabled={!item.action}>
              <View style={s.contactIcon}><Ionicons name={item.icon as any} size={18} color="#00D4FF" /></View>
              <Text style={[s.contactText, item.action && { color:'#00D4FF' }]}>{item.text}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity onPress={() => router.push('/contact')} activeOpacity={0.85} style={{ marginBottom:12 }}>
          <LinearGradient colors={['#00D4FF','#00FF88']} style={s.ctaBtn} start={{x:0,y:0}} end={{x:1,y:0}}>
            <Text style={s.ctaBtnText}>Work With Us →</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height:32 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe:    { flex:1, backgroundColor:'#060D1F' },
  scroll:  { flex:1 },
  content: { padding:20, paddingTop:40 },
  title:   { fontWeight:'800', fontSize:28, color:'#F0F4FF', marginBottom:8, letterSpacing:-0.5 },
  sub:     { fontSize:15, color:'#8B9DC3', marginBottom:24, lineHeight:22 },

  ctoCard:   { borderRadius:20, padding:20, flexDirection:'row', alignItems:'center', gap:16, marginBottom:24, borderWidth:1, borderColor:'rgba(0,212,255,0.2)' },
  ctoAvatar: { width:60, height:60, borderRadius:30, backgroundColor:'rgba(0,102,255,0.3)', alignItems:'center', justifyContent:'center' },
  ctoInitials: { fontSize:20, fontWeight:'800', color:'#00D4FF' },
  ctoInfo:   { flex:1 },
  ctoName:   { fontSize:16, fontWeight:'800', color:'#F0F4FF' },
  ctoRole:   { fontSize:13, color:'#00D4FF', fontWeight:'600' },
  ctoCompany: { fontSize:12, color:'#8B9DC3', marginTop:2 },

  section:      { marginBottom:24 },
  sectionTitle: { fontSize:18, fontWeight:'700', color:'#F0F4FF', marginBottom:12 },
  body:         { fontSize:14, color:'#8B9DC3', lineHeight:22 },

  statsGrid: { flexDirection:'row', flexWrap:'wrap', gap:10, marginBottom:24 },
  statCard:  { width:'47%', backgroundColor:'rgba(255,255,255,0.04)', borderWidth:1, borderColor:'rgba(255,255,255,0.09)', borderRadius:16, padding:18, alignItems:'center' },
  statVal:   { fontSize:28, fontWeight:'800', color:'#00D4FF', marginBottom:4 },
  statLab:   { fontSize:12, color:'#8B9DC3', textAlign:'center' },

  valueRow:  { flexDirection:'row', alignItems:'center', gap:10, marginBottom:10 },
  valueText: { fontSize:14, color:'#8B9DC3' },

  contactCard: { backgroundColor:'rgba(255,255,255,0.04)', borderWidth:1, borderColor:'rgba(255,255,255,0.09)', borderRadius:20, padding:20, gap:0, marginBottom:20, overflow:'hidden' },
  contactRow:  { flexDirection:'row', alignItems:'center', gap:12, paddingVertical:12, borderBottomWidth:1, borderBottomColor:'rgba(255,255,255,0.06)' },
  contactIcon: { width:36, height:36, borderRadius:10, backgroundColor:'rgba(0,212,255,0.1)', alignItems:'center', justifyContent:'center' },
  contactText: { fontSize:14, color:'#8B9DC3', fontWeight:'500' },

  ctaBtn:     { padding:16, borderRadius:14, alignItems:'center' },
  ctaBtnText: { fontSize:16, fontWeight:'700', color:'#060D1F' },
})
