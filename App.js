import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MQTTProvider } from './MQTTContext';
import ConnectionScreen from './screens/ConnectionScreen';
import SubscribeScreen from './screens/SubscribeScreen';
import PublishScreen from './screens/PublishScreen';
import { View } from 'react-native';
import HierarchyScreen from './screens/HierarchyScreen';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <MQTTProvider>
          <Tab.Navigator>
            <Tab.Screen name="Connect" component={ConnectionScreen} />
            <Tab.Screen name="Subscribe" component={SubscribeScreen} />
            <Tab.Screen name="Publish" component={PublishScreen} />
            <Tab.Screen name="Hierarchy" component={HierarchyScreen} />
          </Tab.Navigator>
      </MQTTProvider>
    </NavigationContainer >
  );
};

export default App;
