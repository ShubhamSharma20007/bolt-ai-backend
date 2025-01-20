module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log(`⚡: ${socket.id} user just connected!`);

        //  listen for a new message
        socket.on('new-chat', (message) => {
            io.to(message.receiverId).emit('response-new-chat', message);
        });

        socket.on('ai-response', (data) => {
            console.log("Received ai-response:", data);
        });

        socket.on('disconnect', () => {
            console.log('🔥: A user disconnected');
        });

    })
}