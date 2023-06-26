import { useContext, useEffect, useState } from 'react';
import { View, TextInput, Button, FlatList, Text, TouchableHighlight, Keyboard } from 'react-native';
import { MQTTContext } from '../MQTTContext';
import styles from '../style';

const SubscribeScreen = () => {
    const { mqttClient, saveTopic, topics, removeTopic, getTopicObject } = useContext(MQTTContext);
    const [topic, setTopic] = useState('');
    const [factory, setFactory] = useState('');
    const [machine, setMachine] = useState('');
    const [sensor, setSensor] = useState('');
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState('');

    const handleSubscribe = () => {
        Keyboard.dismiss();
        if (mqttClient) {
            if (topic === '' || factory === '' || sensor === '') { setError('Please enter all required fields (establishment, sensor, topic)'); return; }
            mqttClient.subscribe(topic);
            saveTopic(factory, machine, sensor, topic);
            setTopic('');
            setFactory('');
            setMachine('');
            setSensor('');
            setError('');
        }
    };

    const handleUnsubscribe = (subsTopic) => {
        if (mqttClient) {
            removeTopic(subsTopic);
            mqttClient.unsubscribe(subsTopic);
            setMessages([]);
        }
    };

    useEffect(() => {
        if (mqttClient && mqttClient.isConnected()) {
            const onMessageArrived = (message) => {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { topic: message.topic, payload: message.payloadString },
                ]);
            };

            mqttClient.onMessageArrived = onMessageArrived;

            return () => {
                if (mqttClient.isConnected()) {
                    mqttClient.onMessageArrived = () => { };
                }
            };
        } else {
            setMessages([]);
        }
    }, [mqttClient]);

    const renderItem = (item) => {
        if (item) {
            const { factory, machine, sensor } = getTopicObject(item.topic);
            return (
                machine !== '' ? <Text key={item.topic}>{`${factory} / ${machine} / ${sensor} (${item.topic}): ${item.payload}`}</Text> : <Text key={item.topic}>{`${factory} / ${sensor} (${item.topic}): ${item.payload}`}</Text>
            )
        }
        return null;
    }

    return (
        <View style={styles.container} >
            {mqttClient && mqttClient.isConnected() ?
                <>
                    <TextInput
                        placeholder="Establishment Name (e.g. home/factory)*"
                        value={factory}
                        onChangeText={setFactory}
                        style={styles.textInputStyle}
                    />
                    <TextInput
                        placeholder="Machine Name (optional)"
                        value={machine}
                        onChangeText={setMachine}
                        style={styles.textInputStyle}
                    />
                    <TextInput
                        placeholder="Sensor Name*"
                        value={sensor}
                        onChangeText={setSensor}
                        style={styles.textInputStyle}
                    />
                    <TextInput
                        placeholder="Topic*"
                        value={topic}
                        onChangeText={setTopic}
                        style={styles.textInputStyle}
                    />
                    <TouchableHighlight onPress={handleSubscribe}><Text style={{ fontSize: 18, color: '#007AFF' }}>Subscribe</Text></TouchableHighlight>
                    {error !== '' && <Text style={{ color: 'grey', fontSize: 12 }}>{error}</Text>}
                    {topics.map((subsTopic) => (
                        <View key={subsTopic.topic} style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
                            <Text>{subsTopic.topic}</Text>
                            <TouchableHighlight onPress={() => handleUnsubscribe(subsTopic.topic)} titleStyle={{ fontSize: 10 }}><Text style={{ fontSize: 12, color: '#007AFF' }}>Unsubscribe</Text></TouchableHighlight>
                        </View>
                    ))}
                    <Text style={{ marginTop: 16, fontSize: 16, fontWeight: '600' }}>Messages:</Text>
                    <FlatList
                        data={messages}
                        renderItem={({ item }) => <Text>{renderItem(item)}</Text>}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </>
                :
                <Text>No connection, please connect to a broker in the connect tab to continue.</Text>}
        </View>
    );
};

export default SubscribeScreen;
