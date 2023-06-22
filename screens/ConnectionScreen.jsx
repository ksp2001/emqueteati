import { useContext, useState } from 'react';
import { View, TextInput, Button } from 'react-native';
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

  const handleConnect = () => {
    connectToBroker(brokerUrlInput, clientId, portInput);
    setBrokerUrlInput('');
    setClientId('');
    setPortInput('');
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
          <Button title="Connect" onPress={handleConnect} />
        </>
      }
    </View>
  );
};

export default ConnectionScreen;
