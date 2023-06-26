import { useContext, useState } from 'react';
import { View, TextInput, Button, TouchableHighlight, Keyboard } from 'react-native';
import { MQTTContext } from '../MQTTContext';
import { Text } from 'react-native';
import styles from '../style';

const ConnectionScreen = () => {
  const { connectToBroker, disconnectFromBroker, connectionStatus, brokerUrl, port } = useContext(
    MQTTContext
  );
  const [brokerUrlInput, setBrokerUrlInput] = useState('');
  const [portInput, setPortInput] = useState('');
  const [clientId, setClientId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleConnect = () => {
    connectToBroker(brokerUrlInput, clientId, portInput, username, password);
    setBrokerUrlInput('');
    setClientId('');
    setPortInput('');
    setUsername('');
    setPassword('');
    Keyboard.dismiss();
  };

  const handleDisconnect = () => {
    disconnectFromBroker();
  };

  return (
    <View style={styles.container} >
      {connectionStatus ?
        <>
          <Text>Connected to {brokerUrl} at port {port}</Text><Button title="Disconnect" onPress={handleDisconnect} />
        </> :
        <>
          <TextInput
            placeholder="Broker URL"
            value={brokerUrlInput}
            onChangeText={setBrokerUrlInput}
            style={styles.textInputStyle}
          />
          <TextInput
            placeholder="Client ID"
            value={clientId}
            onChangeText={setClientId}
            style={styles.textInputStyle}
          />
          <TextInput
            placeholder="Websocket Port"
            value={portInput}
            onChangeText={setPortInput}
            keyboardType='numeric'
            style={styles.textInputStyle}
          />
          <TextInput
            placeholder="Username (optional)"
            value={username}
            onChangeText={setUsername}
            style={styles.textInputStyle}
          />
          <TextInput
            placeholder="Password (optional)"
            value={password}
            onChangeText={setPassword}
            style={styles.textInputStyle}
          />
          <TouchableHighlight onPress={handleConnect}><Text style={{fontSize: 18, color: '#007AFF'}}>Connect</Text></TouchableHighlight>
        </>
      }
    </View>
  );
};

export default ConnectionScreen;
