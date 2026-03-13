import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

const PLANS = [
  {
    name: 'Starter', price: '15,000', period: '/mo',
    desc: 'For small businesses getting started.',
    color: '#8B9DC3', featured: false,
    features: ['Website Hosting & Maintenance','IT Support (8hrs/mo)','Monthly Backups','Security Monitoring'],
  },
  {
    name: 'Growth', price: '45,000', period: '/mo',
    desc: 'For businesses that need automation & CRM.',
    color: '#00D4FF', featured: true,
    features: ['Everything in Starter','CRM System Access','3 Automation Workflows','Email Campaign Mgmt','Priority IT Support (20hrs)','Monthly Analytics Report'],
  },
  {
    name: 'Enterprise', price: '120,000', period: '/mo',
    desc: 'Full-service digital partnership.',
    color: '#00FF88', featured: false,
    features: ['Everything in Growth','Dedicated Account Manager','Unlimited Automations','Unlimited IT Support','Staff ICT Training','24/7 Emergency Support'],
  },
]

const ONE_TIME = [
  { name: 'Landing Page',    price: '25,000',  icon: 'globe-outline' },
  { name: 'Business Website', price: '80,000',  icon: 'desktop-outline' },
  { name: 'Custom Web App',  price: '250,000', icon: 'code-slash-outline' },
  { name: 'Mobile App',      price: '350,000', icon: 'phone-portrait-outline' },
]

export default function PricingScreen() {
  const router = useRouter()
  return (
    <SafeAreaView style={s.safe}>
      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Text style={s.title}>Pricing</Text>
        <Text style={s.sub}>Flexible plans for every stage of your business.</Text>

        {/* Subscription plans */}
        <Text style={s.cat}>Monthly Subscription Plans</Text>
        {PLANS.map(p => (
          <View key={p.name} style={[s.planCard, p.featured && { borderColor:'rgba(0,212,255,0.4)', backgroundColor:'rgba(0,102,255,0.1)' }]}>
            {p.featured && (
              <View style={s.popularBadge}><Text style={s.popularText}>Most Popular</Text></View>
            )}
            <Text style={[s.planName, { color: p.color }]}>{p.name}</Text>
            <View style={s.priceRow}>
              <Text style={s.currency}>KES </Text>
              <Text style={s.price}>{p.price}</Text>
              <Text style={s.period}>{p.period}</Text>
            </View>
            <Text style={s.planDesc}>{p.desc}</Text>
            <View style={s.features}>
              {p.features.map(f => (
                <View key={f} style={s.featureRow}>
                  <Ionicons name="checkmark-circle" size={16} color="#00FF88" />
                  <Text style={s.featureText}>{f}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity onPress={() => router.push('/contact')} activeOpacity={0.85}>
              {p.featured ? (
                <LinearGradient colors={['#00D4FF','#00FF88']} style={s.planBtn} start={{x:0,y:0}} end={{x:1,y:0}}>
                  <Text style={[s.planBtnText, { color:'#060D1F' }]}>Get Started</Text>
                </LinearGradient>
              ) : (
                <View style={s.planBtnGhost}>
                  <Text style={s.planBtnText}>Get Started</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        ))}

        {/* One-time packages */}
        <Text style={s.cat}>One-Time Project Packages</Text>
        <View style={s.grid}>
          {ONE_TIME.map(o => (
            <TouchableOpacity key={o.name} style={s.onetimeCard} onPress={() => router.push('/contact')} activeOpacity={0.85}>
              <Ionicons name={o.icon as any} size={24} color="#00D4FF" />
              <Text style={s.onetimeName}>{o.name}</Text>
              <Text style={s.onetimeFrom}>From KES</Text>
              <Text style={s.onetimePrice}>{o.price}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Consultation */}
        <View style={s.consultCard}>
          <Ionicons name="chatbubble-ellipses-outline" size={28} color="#00D4FF" />
          <Text style={s.consultTitle}>Tech Consultation</Text>
          <Text style={s.consultDesc}>Get expert advice on your technology challenges from our senior engineers.</Text>
          <View style={s.consultRates}>
            {[['1-Hour', 'KES 5,000'], ['Half-Day', 'KES 15,000'], ['Full Day', 'KES 25,000']].map(([label, price]) => (
              <View key={label} style={s.rateRow}>
                <Text style={s.rateLabel}>{label}</Text>
                <Text style={s.ratePrice}>{price}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity onPress={() => router.push('/contact')} activeOpacity={0.85}>
            <LinearGradient colors={['#00D4FF','#00FF88']} style={s.planBtn} start={{x:0,y:0}} end={{x:1,y:0}}>
              <Text style={[s.planBtnText, { color:'#060D1F' }]}>Book a Session</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

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
  cat:     { fontSize:13, fontWeight:'700', color:'#00D4FF', marginBottom:14, marginTop:8, letterSpacing:1, textTransform:'uppercase' },

  planCard:     { backgroundColor:'rgba(255,255,255,0.04)', borderWidth:1, borderColor:'rgba(255,255,255,0.09)', borderRadius:20, padding:24, marginBottom:16, position:'relative' },
  popularBadge: { position:'absolute', top:-12, left:'50%', marginLeft:-50, width:100, backgroundColor:'#00D4FF', paddingVertical:4, borderRadius:100, alignItems:'center' },
  popularText:  { fontSize:10, fontWeight:'800', color:'#060D1F' },
  planName:     { fontSize:20, fontWeight:'800', marginBottom:4 },
  priceRow:     { flexDirection:'row', alignItems:'baseline', marginBottom:8 },
  currency:     { fontSize:14, fontWeight:'600', color:'#8B9DC3' },
  price:        { fontSize:36, fontWeight:'800', color:'#F0F4FF', letterSpacing:-1 },
  period:       { fontSize:14, color:'#8B9DC3', marginLeft:2 },
  planDesc:     { fontSize:13, color:'#8B9DC3', marginBottom:16, lineHeight:19 },

  features:    { gap:10, marginBottom:20 },
  featureRow:  { flexDirection:'row', alignItems:'center', gap:8 },
  featureText: { fontSize:13, color:'#8B9DC3' },

  planBtn:      { padding:14, borderRadius:12, alignItems:'center' },
  planBtnGhost: { padding:14, borderRadius:12, alignItems:'center', borderWidth:1.5, borderColor:'rgba(255,255,255,0.12)' },
  planBtnText:  { fontSize:15, fontWeight:'700', color:'#F0F4FF' },

  grid:         { flexDirection:'row', flexWrap:'wrap', gap:12, marginBottom:12 },
  onetimeCard:  { width:'47%', backgroundColor:'rgba(255,255,255,0.04)', borderWidth:1, borderColor:'rgba(255,255,255,0.09)', borderRadius:16, padding:18, gap:6 },
  onetimeName:  { fontSize:14, fontWeight:'700', color:'#F0F4FF', lineHeight:18 },
  onetimeFrom:  { fontSize:11, color:'#4A5878' },
  onetimePrice: { fontSize:20, fontWeight:'800', color:'#00D4FF' },

  consultCard:  { backgroundColor:'rgba(255,255,255,0.04)', borderWidth:1, borderColor:'rgba(0,212,255,0.2)', borderRadius:20, padding:24, gap:12, marginBottom:12 },
  consultTitle: { fontSize:18, fontWeight:'700', color:'#F0F4FF' },
  consultDesc:  { fontSize:13, color:'#8B9DC3', lineHeight:20 },
  consultRates: { backgroundColor:'rgba(255,255,255,0.03)', borderRadius:12, overflow:'hidden', borderWidth:1, borderColor:'rgba(255,255,255,0.08)' },
  rateRow:      { flexDirection:'row', justifyContent:'space-between', paddingVertical:10, paddingHorizontal:16, borderBottomWidth:1, borderBottomColor:'rgba(255,255,255,0.06)' },
  rateLabel:    { fontSize:13, color:'#8B9DC3' },
  ratePrice:    { fontSize:13, fontWeight:'700', color:'#F0F4FF' },
})
