import { createContext, useState } from 'react';
import Paho from 'paho-mqtt';

export const MQTTContext = createContext();

export const MQTTProvider = ({ children }) => {
    const [mqttClient, setMqttClient] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState(false);
    const [brokerUrl, setBrokerUrl] = useState('');
    const [port, setPort] = useState(0);
    const [hierarchy, setHierarchy] = useState({});
    const [topics, setTopics] = useState([]);

    const connectToBroker = (brokerUrl, clientId, port, username, password) => {
        const client = new Paho.Client(brokerUrl, Number(port), clientId);

        if (username !== '' && password !== '') {
            client.username_pw_set(username, password);
        }

        client.onConnectionLost = onConnectionLost;

        client.connect({
            onSuccess: () => {
                setMqttClient(client);
                setBrokerUrl(brokerUrl);
                setConnectionStatus(true);
                setPort(port);
                console.log('Connected!');
            },
            onFailure: (e) => {
                console.log('Failed', e);
            },
        });
    };

    const saveTopic = (factoryName, machineName, sensorName, topic) => {
        setHierarchy(() => {
            const updatedHierarchy = { ...hierarchy };

            if (machineName !== '') {
                // If machineName exists, add the sensor under the specified machine
                if (!updatedHierarchy[factoryName]) {
                    updatedHierarchy[factoryName] = {};
                }
                if (!updatedHierarchy[factoryName][machineName]) {
                    updatedHierarchy[factoryName][machineName] = { sensors: [] };
                }
                updatedHierarchy[factoryName][machineName].sensors.push({
                    sensorName,
                    topic,
                });
            } else {
                // If machineName is empty, add the sensor directly under the specified factory
                if (!updatedHierarchy[factoryName]) {
                    updatedHierarchy[factoryName] = { sensors: [] };
                }
                if (!updatedHierarchy[factoryName].sensors) {
                    updatedHierarchy[factoryName].sensors = [];
                }
                updatedHierarchy[factoryName].sensors.push({ sensorName, topic });
            }

            return updatedHierarchy;
        });
        setTopics([...topics, { factory: factoryName, machine: machineName, sensor: sensorName, topic: topic }])
    }

    const removeTopic = (topic) => {
        setHierarchy(() => {
            const updatedHierarchy = { ...hierarchy };
            const {factory, machine, sensor} = getTopicObject(topic);
            if (machine !== '') {
                if (updatedHierarchy[factory][machine].sensors.length === 1) {
                    delete updatedHierarchy[factory][machine];
                    if (Object.keys(updatedHierarchy[factory]).length === 0) {
                         delete updatedHierarchy[factory];
                    }
                } else {
                    updatedHierarchy[factory][machine].sensors = updatedHierarchy[factory][machine].sensors.filter((s) => s.sensorName !== sensor);
                }
            }
            else {
                if (updatedHierarchy[factory].sensors.length === 1) {
                    delete updatedHierarchy[factory].sensors;
                    if (Object.keys(updatedHierarchy[factory]).length === 0) {
                        delete updatedHierarchy[factory];
                   }
                } else {
                    updatedHierarchy[factory].sensors = updatedHierarchy[factory].sensors.filter((s) => s.sensorName !== sensor);
                }
            }
            return updatedHierarchy;
        })
        setTopics(topics.filter((t) => t.topic !== topic));
    }

    const disconnectFromBroker = () => {
        if (mqttClient && mqttClient.isConnected()) {
            mqttClient.disconnect();
            mqttClient.onConnectionLost = () => { };
            mqttClient.onMessageArrived = () => { };
            setMqttClient(null);
            setConnectionStatus(false);
            setHierarchy({});
            setTopics([]);
        }
    };

    const onConnectionLost = (responseObject) => {
        if (responseObject.errorCode !== 0) {
            console.log('onConnectionLost: ' + responseObject.errorMessage);
            setConnectionStatus(false);
            setHierarchy({});
            setTopics([]);
        }
    };

    const getTopicObject = (topic) => {
        const topicObject = topics.find((t) => t.topic === topic);
        if (topicObject) {
            return topicObject;
        }
        return null;
    };

    return (
        <MQTTContext.Provider
            value={{
                mqttClient,
                connectionStatus,
                connectToBroker,
                disconnectFromBroker,
                brokerUrl,
                port,
                hierarchy,
                saveTopic,
                topics,
                removeTopic,
                getTopicObject,
            }}
        >
            {children}
        </MQTTContext.Provider>
    );
};
