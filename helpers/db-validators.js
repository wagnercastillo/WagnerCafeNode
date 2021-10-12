const Role = require('../models/role');
const { usuario, Categoria, Producto } = require('../models');


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


/**
 * Categorias
 */

const existeCategoriaPorId = async (id) => {
    const existeCategoria = await Categoria.findById(id);
    if (!existeCategoria) {
        throw new Error(`La categoria con el  ${id} no existe`);
    }

}


/**
 * Productos
 */

const existeProductosPorId = async (id) => {
    const existeProducto = await Producto.findById(id);
    if (!existeProducto) {
        throw new Error(`La categoria con el  ${id} no existe`);
    }

}


/* 
* Validar Colecciones permitidas
*/

const coleccionesPermitidas = (coleccion = '', colecciones = []) => {


    const incluida = colecciones.includes(coleccion);
    if (!incluida) {
        throw new Error(`La coleccion ${coleccion} no es permitda - ${coleciones}`);
    }

    return true;

}



module.exports = {
    esRolValido,
    EmailExiste,
    existeUsuariobyId,
    existeCategoriaPorId,
    existeProductosPorId,
    coleccionesPermitidas
}