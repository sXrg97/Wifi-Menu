const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const next = require('next');

// Next.js configuration
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

// Express app for Next.js
const appNext = express();

// Socket.IO server
const serverSocket = http.createServer();
const io = new Server(serverSocket, {
    cors: {
        origin: '*',
    }
});

// Handle connections
io.on('connection', (socket) => {
    console.log('A user has connected');

    socket.on('call-for-waiter', () => {
        io.emit('call-for-waiter-called');
    });

    socket.on('waiter-on-the-way', (data) => {
        io.emit('waiter-on-the-way-notification', data);
        console.log('Emitting waiter-on-the-way notification');
        io.emit('call-for-waiter-called');
    });

    socket.on('request-bill', () => {
        io.emit('request-bill-called');
    });

    socket.on('bill-on-the-way', (data) => {
        io.emit('bill-on-the-way-notification', data);
        console.log('Emitting bill-on-the-way notification');
        io.emit('request-bill-called');
    });

    socket.on('disconnect', () => {
        console.log('A user has disconnected');
    });
});

// Start Next.js app
nextApp.prepare().then(() => {
    appNext.all('*', (req, res) => {
        return handle(req, res);
    });

    const portNext = process.env.PORT || 3000;
    appNext.listen(portNext, () => {
        console.log(`Next.js server is running on port http://localhost:${portNext}`);
    });

    const portSocket = 4000;
    serverSocket.listen(portSocket, () => {
        console.log(`Socket.IO server is running on port http://localhost:${portSocket}`);
    });
});
