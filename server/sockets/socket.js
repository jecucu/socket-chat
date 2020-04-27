const { io } = require('../server');

const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utilidades/utilidades');

const usuarios = new Usuarios();

io.on('connection', (client) => {


    client.on('entrarChat', (usuario, callback) => {
        console.log('Usuario recibido: ', {
            id: client.id,
            usuario
        });
        if (!usuario.nombre || !usuario.sala) {
            return callback({
                error: true,
                message: 'El nombre y la sala son necesario'
            });
        }

        client.join(usuario.sala);

        let personas = usuarios.agregarPersona(client.id, usuario.nombre, usuario.sala);
        console.log('Personas Conectadas: ', personas);

        client.broadcast.to(usuario.sala).emit('listaPersonas', usuarios.getPersonasPorSala(usuario.sala));

        return callback(usuarios.getPersonasPorSala(usuario.sala));
    })

    client.on('crearMensaje', (data) => {
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
    })

    client.on('disconnect', () => {
        console.log(client.id);
        let usuarioBorrado = usuarios.borrarPersona(client.id)
        console.log('Usuario desconectado: ', usuarioBorrado);

        client.broadcast.to(usuarioBorrado.sala).emit('crearMensaje', crearMensaje('Administrador', `${ usuarioBorrado.nombre } abandonó el chat.`))
        client.broadcast.to(usuarioBorrado.sala).emit('listaPersonas', usuarios.getPersonasPorSala(usuarioBorrado.sala));
    });

    client.on('mensajePrivado', (data) => {
        let persona = usuarios.getPersona(client.id);
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
    });

});