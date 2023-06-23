import { useContext } from "react";
import { MQTTContext } from '../MQTTContext';
import { View, Text } from 'react-native';
import styles from '../style';


const HierarchyScreen = () => {
    const { mqttClient, hierarchy } = useContext(
        MQTTContext
    );
    return (
        <View style={styles.container} >
            {mqttClient && mqttClient.isConnected() ?
                hierarchy !== {} && Object.entries(hierarchy).map(([key, value]) => {
                    return (
                        <View key={key}>
                            <Text style={{fontSize:16, fontWeight: "800"}}>{key}</Text>
                            {Object.entries(value).map(([key, value]) => {
                                if (key !== 'sensors') {
                                    return (
                                        <View key={key}>
                                            <Text>Machine: {key}</Text>
                                            {value.sensors.map(
                                                sensor => (
                                                    <Text key={sensor.sensorName}>- {sensor.sensorName} ({sensor.topic})</Text>
                                                )
                                            )}
                                        </View>
                                    )
                                }
                                else {
                                    return (
                                        <View key={key}>
                                            <Text>Individual Sensors: </Text>
                                            {value.map(sensor => {
                                                return <Text key={sensor.sensorName}>- {sensor.sensorName} ({sensor.topic})</Text>
                                            }
                                            )}
                                        </View>
                                    )
                                }
                            })}
                        </View>
                    )
                })
                :
                <Text>No connection, please connect to a broker in the connect tab to continue.</Text>}
        </View>
    )
}


export default HierarchyScreen;