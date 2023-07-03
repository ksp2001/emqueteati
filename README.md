### EMQUETEATI 

A cross-platform project to facilitate broker connections to publish and receive messages through the MQTT protocol, predominantly used for IoT applications, to send and receive data from sensors and other devices.

Current features:
- Broker connection/disconnection (including authenticated connections)
- Publish messages
- Subscribe/unsubscribe to topics
- View topic hierarchy (e.g. factory > machine > sensor (topic name))
- Receive messages

Future features/fixes:
- Explore allowing TCP ports alongside websockets for lower latency
    - The current, well supported  `paho-mqtt` library does not support this in React Native without Node, however, the overhead added by websockets is not large enough for the scope of this project
    for this to be an immediate concern
- Explore adding local storage to persist connection information

#### Technologies used

React Native, Expo, paho-mqtt

#### How to run

Available to down on PlayStore [here](https://play.google.com/store/apps/details?id=com.emqueteati.app).

To test, clone the repository and run `npm install` and `npm run start` in the root directory, and run on a simulator or device using the Expo app.
