# ClickPrint (In progress)

> **Mobile gateway for automated print queuing system.**

The **ClickPrint** is a React Native (Expo) application designed to eliminate physical queues at print shops. It allows to submit documents digitally, pay via a virtual wallet, and receive real-time updates on their print status. 

## Architecture Role

This app acts as the **Primary Actor Interface** in a distributed system:

1. **User:** Uploads PDF and selects specs (Color, Duplex, Pages).
2. **Client App:** Transmits data to the **Node.js Backend**.
3. **Status:** Listens via **WebSockets** for updates from the **Desktop Print Agent**.

## Tech Stack

- **Frontend:** React Native (Expo)
- **State:** React Context API / Hooks
- **Real-time:** Socket.io-client
- **API:** Axios (REST)
