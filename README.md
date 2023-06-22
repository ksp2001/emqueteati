### EMQUETEATI 

A cross-platform project to facilitate broker connections to publish and receive messages through the MQTT protocol.

Current features:
- Broker connection/disconnection
- Publish messages
- Subscribe to topics
- Receive messages

Future features/ideas:
- [IMPORTANT] Broker authentication (username/password support for private connections)
- [IMPORTANT] Allow unsubscribing from topics
- Explore allowing TCP ports alongside websockets for lower latency
    - The current, well supported  `paho-mqtt` library does not support this in React Native without Node, however, the overhead added by websockets is not large enough for the scope of this project
    for this to be an immediate concern
- Explore adding local storage to persist connection information
- Explore adding structuring to segregate topics (for instance, sensors can be under FactoryName > MachineName > SensorName)

#### Technologies used

React Native, Expo, paho-mqtt

#### How to run

Currently not available to download on stores. To test, clone the repository and run `npm install` and `npm run start` in the root directory, and run on a simulator or device using the Expo app.