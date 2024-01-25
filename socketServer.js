const http = require('http')
const { Server } = require('socket.io')


const server = http.createServer();
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});


io.on('connection', (socket) => {
    console.log('a user has connected');


    socket.on('call-for-waiter', () => {
        io.emit('call-for-waiter-called');
    })

    socket.on('waiter-on-the-way', (data) => {
        io.emit("waiter-on-the-way-notification", data);
        console.log("emitting notification")
        io.emit('call-for-waiter-called');
    })


    socket.on('disconnect', () => {
        console.log('a user has disconnected');
    }
    )

})


const port = process.env.PORT || 3001;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
