var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('nombre')) {
    window.location = 'index.html';
    throw new Error('El nombre y la sala son necesario');
}

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
};


socket.on('connect', function() {
    console.log('Conectado al servidor');
    socket.emit('entrarChat', usuario, function(resp) {
        console.log(resp);
    })

});

// escuchar
socket.on('disconnect', function() {
    console.log('Perdimos conexión con el servidor');
});

// Escuchar lista de personas conectadas
socket.on('listaPersonas', function(mensaje) {
    console.log('Servidor:', mensaje);
});

// Escuchar información
socket.on('crearMensaje', function(mensaje) {
    console.log('Servidor:', mensaje);
});

// *********** Mensajes Privados********

socket.on('mensajePrivado', function(mensaje) {
    console.log('mensaje privado', mensaje);
})

// // Enviar información
// socket.emit('crearMensaje', {
//     usuario: 'Fernando',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });

// socket.emit('crearMensaje', {
//     nombre: 'Jose',
//     mensaje: 'Hola a todos'
// };