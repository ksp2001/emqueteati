import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MQTTProvider } from './MQTTContext';
import ConnectionScreen from './screens/ConnectionScreen';
import SubscribeScreen from './screens/SubscribeScreen';
import PublishScreen from './screens/PublishScreen';
import { View } from 'react-native';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <MQTTProvider>
          <Tab.Navigator>
            <Tab.Screen name="Connect" component={ConnectionScreen} />
            <Tab.Screen name="Subscribe" component={SubscribeScreen} />
            <Tab.Screen name="Publish" component={PublishScreen} />
          </Tab.Navigator>
      </MQTTProvider>
    </NavigationContainer >
  );
};

export default App;
