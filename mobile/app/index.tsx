import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Linking, Dimensions } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'

const { width } = Dimensions.get('window')

const SERVICES = [
  { icon: 'desktop-outline',    label: 'Website Design',       color: '#00D4FF' },
  { icon: 'phone-portrait-outline', label: 'Mobile Apps',      color: '#00FF88' },
  { icon: 'people-outline',     label: 'CRM Systems',          color: '#7C3AED' },
  { icon: 'flash-outline',      label: 'Automation',           color: '#FFB800' },
  { icon: 'mail-outline',       label: 'Email Automation',     color: '#f093fb' },
  { icon: 'construct-outline',  label: 'ICT Support',          color: '#4facfe' },
]

const STATS = [
  { value: '50+', label: 'Projects' },
  { value: '30+', label: 'Clients' },
  { value: '98%', label: 'Satisfaction' },
  { value: '5+',  label: 'Years' },
]

export default function HomeScreen() {
  const router = useRouter()

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <LinearGradient colors={['#0A1628', '#060D1F']} style={styles.hero}>
          <View style={styles.badge}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>Available for Projects — Kenya &amp; Beyond</Text>
          </View>
          <Text style={styles.heroTitle}>
            We Turn{' '}
            <Text style={styles.gradientLabel}>Technology</Text>
            {'\n'}Into Your{' '}
            <Text style={styles.gradientLabel}>Edge</Text>
          </Text>
          <Text style={styles.heroSub}>
            IT support, software automation, and digital transformation for businesses across East Africa.
          </Text>
          <View style={styles.heroButtons}>
            <TouchableOpacity onPress={() => router.push('/contact')} activeOpacity={0.85}>
              <LinearGradient colors={['#00D4FF', '#00FF88']} style={styles.btnPrimary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={styles.btnPrimaryText}>Start a Project</Text>
                <Ionicons name="arrow-forward" size={18} color="#060D1F" />
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnGhost} onPress={() => router.push('/services')} activeOpacity={0.85}>
              <Text style={styles.btnGhostText}>Our Services</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Stats */}
        <View style={styles.statsRow}>
          {STATS.map((s, i) => (
            <View key={s.label} style={[styles.statItem, i < STATS.length - 1 && styles.statBorder]}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTag}>What We Do</Text>
          <Text style={styles.sectionTitle}>Our Services</Text>
          <View style={styles.servicesGrid}>
            {SERVICES.map(s => (
              <TouchableOpacity key={s.label} style={styles.serviceCard} onPress={() => router.push('/services')} activeOpacity={0.85}>
                <View style={[styles.serviceIcon, { backgroundColor: s.color + '20' }]}>
                  <Ionicons name={s.icon as any} size={24} color={s.color} />
                </View>
                <Text style={styles.serviceLabel}>{s.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* CTA */}
        <LinearGradient colors={['rgba(0,102,255,0.15)', 'rgba(0,212,255,0.08)']} style={styles.ctaBanner}>
          <Text style={styles.ctaTitle}>Ready to Grow Your Business?</Text>
          <Text style={styles.ctaSub}>Book a free 30-minute discovery call today.</Text>
          <TouchableOpacity onPress={() => router.push('/contact')} activeOpacity={0.85}>
            <LinearGradient colors={['#00D4FF','#00FF88']} style={styles.btnPrimary} start={{x:0,y:0}} end={{x:1,y:0}}>
              <Text style={styles.btnPrimaryText}>Book Free Call</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>

        {/* WhatsApp */}
        <TouchableOpacity style={styles.whatsapp} onPress={() => Linking.openURL('https://wa.me/254700000000?text=Hello%20Adpulse')} activeOpacity={0.85}>
          <Ionicons name="logo-whatsapp" size={20} color="#fff" />
          <Text style={styles.whatsappText}>Chat with us on WhatsApp</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: '#060D1F' },
  scroll: { flex: 1 },

  hero: { padding: 24, paddingTop: 40, paddingBottom: 32 },
  badge: { flexDirection:'row', alignItems:'center', gap:8, backgroundColor:'rgba(255,255,255,0.06)', borderWidth:1, borderColor:'rgba(255,255,255,0.1)', paddingHorizontal:14, paddingVertical:7, borderRadius:100, alignSelf:'flex-start', marginBottom:20 },
  badgeDot: { width:7, height:7, backgroundColor:'#00FF88', borderRadius:4 },
  badgeText: { fontSize:12, color:'#8B9DC3', fontWeight:'500' },
  heroTitle: { fontSize:32, fontWeight:'800', color:'#F0F4FF', lineHeight:40, marginBottom:14, letterSpacing:-0.5 },
  gradientLabel: { color:'#00D4FF' },
  heroSub: { fontSize:15, color:'#8B9DC3', lineHeight:24, marginBottom:28 },
  heroButtons: { flexDirection:'row', gap:12, flexWrap:'wrap' },

  btnPrimary: { flexDirection:'row', alignItems:'center', gap:8, paddingHorizontal:22, paddingVertical:13, borderRadius:12 },
  btnPrimaryText: { fontSize:15, fontWeight:'700', color:'#060D1F' },
  btnGhost: { paddingHorizontal:22, paddingVertical:13, borderRadius:12, borderWidth:1.5, borderColor:'rgba(255,255,255,0.12)', justifyContent:'center' },
  btnGhostText: { fontSize:15, fontWeight:'600', color:'#F0F4FF' },

  statsRow: { flexDirection:'row', backgroundColor:'rgba(255,255,255,0.04)', borderTopWidth:1, borderBottomWidth:1, borderColor:'rgba(255,255,255,0.09)' },
  statItem: { flex:1, alignItems:'center', paddingVertical:18 },
  statBorder: { borderRightWidth:1, borderRightColor:'rgba(255,255,255,0.09)' },
  statValue: { fontSize:22, fontWeight:'800', color:'#00D4FF', marginBottom:2 },
  statLabel: { fontSize:11, color:'#8B9DC3' },

  section: { padding:24 },
  sectionTag: { fontSize:11, fontWeight:'700', letterSpacing:2, textTransform:'uppercase', color:'#00D4FF', marginBottom:8 },
  sectionTitle: { fontSize:22, fontWeight:'800', color:'#F0F4FF', marginBottom:20, letterSpacing:-0.3 },

  servicesGrid: { flexDirection:'row', flexWrap:'wrap', gap:12 },
  serviceCard: { width:(width - 60) / 2, backgroundColor:'rgba(255,255,255,0.04)', borderWidth:1, borderColor:'rgba(255,255,255,0.09)', borderRadius:16, padding:18 },
  serviceIcon: { width:44, height:44, borderRadius:12, alignItems:'center', justifyContent:'center', marginBottom:10 },
  serviceLabel: { fontSize:13, fontWeight:'600', color:'#F0F4FF', lineHeight:18 },

  ctaBanner: { margin:24, borderRadius:20, padding:28, alignItems:'center', borderWidth:1, borderColor:'rgba(0,212,255,0.2)' },
  ctaTitle: { fontSize:20, fontWeight:'800', color:'#F0F4FF', textAlign:'center', marginBottom:8, letterSpacing:-0.3 },
  ctaSub: { fontSize:14, color:'#8B9DC3', textAlign:'center', marginBottom:20 },

  whatsapp: { flexDirection:'row', alignItems:'center', justifyContent:'center', gap:10, backgroundColor:'#25D366', marginHorizontal:24, borderRadius:12, paddingVertical:14 },
  whatsappText: { fontSize:15, fontWeight:'700', color:'#fff' },
})
