import { createContext, useState } from 'react';
import Paho from 'paho-mqtt';

export const MQTTContext = createContext();

export const MQTTProvider = ({ children }) => {
    const [mqttClient, setMqttClient] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState(false);
    const [brokerUrl, setBrokerUrl] = useState('');
    const [port, setPort] = useState(0);

    const connectToBroker = (brokerUrl, clientId, port) => {
        const client = new Paho.Client(brokerUrl, Number(port), clientId);

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

    const disconnectFromBroker = () => {
        if (mqttClient && mqttClient.isConnected()) {
            mqttClient.disconnect();
            mqttClient.onConnectionLost = () => { };
            mqttClient.onMessageArrived = () => { };
            setMqttClient(null);
            setConnectionStatus(false);
        }
    };

    const onConnectionLost = (responseObject) => {
        if (responseObject.errorCode !== 0) {
            console.log('onConnectionLost: ' + responseObject.errorMessage);
            setConnectionStatus(false);
        }
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
            }}
        >
            {children}
        </MQTTContext.Provider>
    );
};
