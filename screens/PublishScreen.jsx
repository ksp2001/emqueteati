import { useContext, useState } from 'react';
import { View, TextInput, Button, Text, TouchableHighlight, Keyboard } from 'react-native';
import { MQTTContext } from '../MQTTContext';
import Paho from 'paho-mqtt';
import styles from '../style';

const PublishScreen = () => {
  const { mqttClient } = useContext(MQTTContext);
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePublish = () => {
    Keyboard.dismiss();
    if (mqttClient) {
      if (topic === '' || message === '') {setError('Please enter both fields'); return; }
      const newMessage = new Paho.Message(message);
      newMessage.destinationName = topic;
      mqttClient.send(newMessage);
      setMessage('');
      setTopic('');
      setError('');
    }
  };

  return (
    <View style={styles.container} >
      {mqttClient ?
        <>
          <TextInput
            placeholder="Topic"
            value={topic}
            onChangeText={setTopic}
            style={styles.textInputStyle}
          />
          <TextInput
            placeholder="Message"
            value={message}
            onChangeText={setMessage}
            style={styles.textInputStyle}
          />
          <TouchableHighlight onPress={handlePublish}><Text style={{fontSize: 18, color: '#007AFF'}}>Publish</Text></TouchableHighlight>
          {error !== '' && <Text style={{color: 'grey', fontSize: 12}}>{error}</Text>}
        </>
        :
        <Text>No connection, please connect to a broker in the connect tab to continue.</Text>
      }
    </View>
  );
};

export default PublishScreen;
