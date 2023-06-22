import { useContext, useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { MQTTContext } from '../MQTTContext';
import Paho from 'paho-mqtt';
import styles from '../style';

const PublishScreen = () => {
  const { mqttClient } = useContext(MQTTContext);
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');

  const handlePublish = () => {
    if (mqttClient) {
      const newMessage = new Paho.Message(message);
      newMessage.destinationName = topic;
      mqttClient.send(newMessage);
      setMessage('');
      setTopic('');
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
          <Button title="Publish" onPress={handlePublish} />
        </>
        :
        <Text>No connection, please connect to a broker in the connect tab to continue.</Text>
      }
    </View>
  );
};

export default PublishScreen;
