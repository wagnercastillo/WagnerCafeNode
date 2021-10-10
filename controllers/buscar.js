const { response } = require("express");
const { ObjectId } = require('mongoose').Types;
const { usuario, Categoria, Producto } = require('../models');

const coleccionesPermitidas = [
    'categorias',
    'usuarios',
    'productos',
    'roles'
]

// Buscar usuarios
const buscarUsuarios = async (termino = '', res = response) => {
    const isMongoId = ObjectId.isValid(termino);

    if (isMongoId) {
        const user = await usuario.findById(termino)
        res.json({
            result: [
                (user) ? [user] : []
            ]
        });
    }
    const regex = new RegExp(termino, 'i');
    const usuarios = await usuario.find({
        $or: [{ nombre: regex, }, { correo: regex }],
        $and: [{ estado: true }]

    });

    res.json({
        usuarios
    });
}

// Buscar categorias
const buscarCategorias = async (termino = '', res = response) => {
    const isMongoId = ObjectId.isValid(termino);

    if (isMongoId) {
        const categoria = await Categoria.findById(termino)
        res.json({
            result: [
                (categoria) ? [categoria] : []
            ]
        });
    }
    const regex = new RegExp(termino, 'i');
    const categorias = await Categoria.find({ nombre: regex });

    res.json({
        categorias
    });
}

// Buscar productos
const buscarProductos = async (termino = '', res = response) => {

    const isMongoId = ObjectId.isValid(termino);

    if (isMongoId) {
        const producto = await Producto.findById(termino)
        res.json({
            result: [
                (producto) ? [producto] : []
            ]
        });
    }

    const regex = new RegExp(termino, 'i');
    const productos = await Producto.find({ nombre: regex, estado: true });

    res.json({
        productos
    });
}

const buscar = (req, res = response) => {

    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son ${coleccionesPermitidas}`
        });
    }

    switch (coleccion) {

        case 'categorias':
            buscarCategorias(termino, res);
            break;
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
        case 'productos':
            buscarProductos(termino, res);
            break;

        default:
            res.status(500).json({
                msg: 'Se me olvido hacer esta busqueda'
            });
    }

}


module.exports = {
    buscar
}