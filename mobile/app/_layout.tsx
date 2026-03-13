import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'

const CYAN  = '#00D4FF'
const BG    = '#060D1F'
const TEXT2 = '#8B9DC3'

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor={BG} />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#0A1628',
            borderTopColor: 'rgba(255,255,255,0.09)',
            height: 64,
            paddingBottom: 8,
          },
          tabBarActiveTintColor:   CYAN,
          tabBarInactiveTintColor: TEXT2,
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        }}
      >
        <Tabs.Screen name="index"    options={{ title: 'Home',     tabBarIcon: ({ color, size }) => <Ionicons name="home-outline"      size={size} color={color} /> }} />
        <Tabs.Screen name="services" options={{ title: 'Services', tabBarIcon: ({ color, size }) => <Ionicons name="apps-outline"      size={size} color={color} /> }} />
        <Tabs.Screen name="pricing"  options={{ title: 'Pricing',  tabBarIcon: ({ color, size }) => <Ionicons name="pricetag-outline"  size={size} color={color} /> }} />
        <Tabs.Screen name="contact"  options={{ title: 'Contact',  tabBarIcon: ({ color, size }) => <Ionicons name="chatbubble-outline" size={size} color={color} /> }} />
        <Tabs.Screen name="about"    options={{ title: 'About',    tabBarIcon: ({ color, size }) => <Ionicons name="information-circle-outline" size={size} color={color} /> }} />
      </Tabs>
    </>
  )
}
