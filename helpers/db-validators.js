const Role = require('../models/role');
const usuario = require('../models/usuario');


const esRolValido = async (rol = '') => {
    const existeRol = await Role.findOne({ rol })
    if (!existeRol) {
        throw new Error(`El rol ${rol} no esta registrado en la bd`);
    }
}
const EmailExiste = async (correo = '') => {

    const existeEmail = await usuario.findOne({ correo });
    if (existeEmail) {
        throw new Error(`El correo ${correo} ya esta registrado en la bd`);
    }

}
const existeUsuariobyId = async (id) => {
    const existeUsuario = await usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`El usuario con el  ${id} no existe`);
    }

}
module.exports = {
    esRolValido,
    EmailExiste,
    existeUsuariobyId
}