import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

const { width } = Dimensions.get('window')

const SERVICES = [
  {
    icon: 'desktop-outline', color: '#00D4FF',
    title: 'Website Redesign & Optimization',
    desc: 'Stunning, high-performance websites built to convert. SEO-optimized and fully responsive.',
    features: ['UI/UX Design', 'Performance Optimization', 'SEO & Analytics'],
  },
  {
    icon: 'phone-portrait-outline', color: '#00FF88',
    title: 'Web & Mobile App Development',
    desc: 'Custom apps engineered to solve your specific business challenges. Scalable and secure.',
    features: ['React / Next.js', 'iOS & Android', 'API Integration'],
  },
  {
    icon: 'people-outline', color: '#7C3AED',
    title: 'Custom CRM Systems',
    featured: true,
    desc: 'Purpose-built CRM platforms that centralize client data and supercharge productivity.',
    features: ['Client Management', 'Pipeline Tracking', 'Reports & Dashboards'],
  },
  {
    icon: 'flash-outline', color: '#FFB800',
    title: 'Business Process Automation',
    desc: 'Eliminate repetitive tasks. Automate workflows so your team focuses on what matters.',
    features: ['Workflow Automation', 'Data Sync', 'ERP Integration'],
  },
  {
    icon: 'mail-outline', color: '#f093fb',
    title: 'Email & Communication Automation',
    desc: 'Smart automated campaigns and notification systems that scale with your business.',
    features: ['Email Campaigns', 'SMS & WhatsApp', 'Notification Systems'],
  },
  {
    icon: 'construct-outline', color: '#4facfe',
    title: 'Graphic / ICT / Admin Services',
    desc: 'Professional design, IT infrastructure support, and admin solutions under one roof.',
    features: ['Brand Identity', 'IT Support', 'Virtual Admin'],
  },
]

export default function ServicesScreen() {
  const router = useRouter()
  return (
    <SafeAreaView style={s.safe}>
      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Text style={s.title}>Our Services</Text>
        <Text style={s.sub}>Everything your business needs to thrive digitally — under one roof.</Text>

        {SERVICES.map(sv => (
          <View key={sv.title} style={[s.card, sv.featured && s.cardFeatured]}>
            {sv.featured && (
              <View style={s.badge}><Text style={s.badgeText}>Most Popular</Text></View>
            )}
            <View style={[s.iconBox, { backgroundColor: sv.color + '20' }]}>
              <Ionicons name={sv.icon as any} size={26} color={sv.color} />
            </View>
            <Text style={s.cardTitle}>{sv.title}</Text>
            <Text style={s.cardDesc}>{sv.desc}</Text>
            <View style={s.features}>
              {sv.features.map(f => (
                <View key={f} style={s.featureRow}>
                  <View style={s.check} />
                  <Text style={s.featureText}>{f}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity onPress={() => router.push('/contact')} style={s.cta} activeOpacity={0.8}>
              <Text style={[s.ctaText, { color: sv.color }]}>Get a Quote →</Text>
            </TouchableOpacity>
          </View>
        ))}
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

  card: { backgroundColor:'rgba(255,255,255,0.04)', borderWidth:1, borderColor:'rgba(255,255,255,0.09)', borderRadius:20, padding:24, marginBottom:16, position:'relative' },
  cardFeatured: { borderColor:'rgba(0,212,255,0.3)', backgroundColor:'rgba(0,102,255,0.08)' },
  badge: { position:'absolute', top:-12, right:20, backgroundColor:'#00D4FF', paddingHorizontal:12, paddingVertical:4, borderRadius:100 },
  badgeText: { fontSize:10, fontWeight:'800', color:'#060D1F', letterSpacing:0.5 },

  iconBox: { width:52, height:52, borderRadius:14, alignItems:'center', justifyContent:'center', marginBottom:14 },
  cardTitle: { fontSize:16, fontWeight:'700', color:'#F0F4FF', marginBottom:8, lineHeight:22 },
  cardDesc:  { fontSize:13, color:'#8B9DC3', lineHeight:20, marginBottom:14 },

  features:    { gap:8, marginBottom:16 },
  featureRow:  { flexDirection:'row', alignItems:'center', gap:10 },
  check:       { width:16, height:16, borderRadius:4, backgroundColor:'rgba(0,255,136,0.15)', borderWidth:1, borderColor:'rgba(0,255,136,0.3)' },
  featureText: { fontSize:13, color:'#8B9DC3' },

  cta:     { paddingVertical:4 },
  ctaText: { fontSize:14, fontWeight:'700' },
})
