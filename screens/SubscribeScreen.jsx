import { useContext, useEffect, useState } from 'react';
import { View, TextInput, Button, FlatList, Text } from 'react-native';
import { MQTTContext } from '../MQTTContext';
import styles from '../style';

const SubscribeScreen = () => {
    const { mqttClient } = useContext(MQTTContext);
    const [topic, setTopic] = useState('');
    const [messages, setMessages] = useState([]);

    const handleSubscribe = () => {
        if (mqttClient) {
            mqttClient.subscribe(topic);
            setTopic('');
        }
    };

    useEffect(() => {
        if (mqttClient) {
            const onMessageArrived = (message) => {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { topic: message.topic, payload: message.payloadString },
                ]);
            };

            mqttClient.onMessageArrived = onMessageArrived;

            return () => {
                if (mqttClient.isConnected()) {
                    mqttClient.onMessageArrived = null;
                }
            };
        } else {
            setMessages([]);
        }
    }, [mqttClient]);

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
                    <Button title="Subscribe" onPress={handleSubscribe} />
                    <FlatList
                        data={messages}
                        renderItem={({ item }) => <Text>{item.topic}: {item.payload}</Text>}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </>
                :
                <Text>No connection, please connect to a broker in the connect tab to continue.</Text>}
        </View>
    );
};

export default SubscribeScreen;
