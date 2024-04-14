import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Button, Modal, Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'orange',
        //tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
      initialRouteName='home'
    >
      <Tabs.Screen
        name='map'
        options={{
          title: 'Taxi Finder',
          tabBarIcon: ({ color }) => <TabBarIcon name='taxi' color={color} />,
          headerShown: true,
        }}
      />

      <Tabs.Screen
        name='index'
        options={{
          title: '',
          tabBarIcon: ({ color }) => <TabBarIcon name='home' color={color} />,
          tabBarLabel: 'Home',
          headerShown: true,
          headerRight: () => {
            return (
              <Link href='/modal/info' asChild>
                <FontAwesome
                  name='info'
                  style={{
                    borderRadius: 20,
                    marginRight: 20,
                  }}
                  color='gold'
                  size={28}
                />
              </Link>
            );
          },
        }}
      />

      {/* <Tabs.Screen
        name='About'
        options={{
          title: 'About',
          tabBarIcon: ({ color }) => <TabBarIcon name='info' color={color} />,
          headerShown: false,
        }}
      /> */}

      <Tabs.Screen
        name='Contact'
        options={{
          title: 'Contact',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name='support' color={color} />
          ),
          headerShown: true,
        }}
      />
    </Tabs>
  );
}
