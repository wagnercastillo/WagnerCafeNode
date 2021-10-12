const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary');
const { subirArchivo } = require('../helpers');
const { response } = require("express");
const { Producto, usuario } = require('../models');
const cargarArchivos = async (req, res = response) => {


    try {

        const extensionesValidas = ['txt', 'md'];
        const nombre = await subirArchivo(req.files, extensionesValidas);

        res.json({ nombre });
    } catch (error) {
        res.status(400).json({ error })
    }
}

const actualizarImagen = async (req, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':

            modelo = await usuario.findById(id);

            if (!modelo) {
                res.status(500).json({
                    msg: `No existe el Usuario con ese id ${id}`
                });
            }

            break;
        case 'productos':

            modelo = await Producto.findById(id);

            if (!modelo) {
                res.status(500).json({
                    msg: `No existe un Producto con ese id ${id}`
                });
            }

            break;

        default:
            res.status(500).json({ msg: 'Se me olvido validar esto' });
            break;
    }


    // Limpiar imagenes previas

    if (modelo.img) {
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img)
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
    }

    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;

    await modelo.save();

    res.json({
        modelo
    });
}



const actualizarImagenCloudinary = async (req, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':

            modelo = await usuario.findById(id);

            if (!modelo) {
                res.status(500).json({
                    msg: `No existe el Usuario con ese id ${id}`
                });
            }

            break;
        case 'productos':

            modelo = await Producto.findById(id);

            if (!modelo) {
                res.status(500).json({
                    msg: `No existe un Producto con ese id ${id}`
                });
            }

            break;

        default:
            res.status(500).json({ msg: 'Se me olvido validar esto' });
            break;
    }


    // Limpiar imagenes previas

    if (modelo.img) {
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1]
        const [public_id] = nombre.split('.');

        cloudinary.uploader.destroy( public_id );
    }

    const { tempFilePath } = req.files.archivo
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
    modelo.img = secure_url;

    await modelo.save();

    res.json({
        modelo
    });
}

const mostrarImagen = async (req, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':

            modelo = await usuario.findById(id);

            if (!modelo) {
                res.status(500).json({
                    msg: `No existe el Usuario con ese id ${id}`
                });
            }

            break;
        case 'productos':

            modelo = await Producto.findById(id);

            if (!modelo) {
                res.status(500).json({
                    msg: `No existe un Producto con ese id ${id}`
                });
            }

            break;

        default:
            res.status(500).json({ msg: 'Se me olvido validar esto' });
            break;
    }


    // Limpiar imagenes previas

    if (modelo.img) {
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img)
        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen)
        }
    }

    const pathNoImagen = path.join(__dirname, '../assets/no-image.jpg');
    return res.sendFile(pathNoImagen);


}
module.exports = {
    cargarArchivos,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}