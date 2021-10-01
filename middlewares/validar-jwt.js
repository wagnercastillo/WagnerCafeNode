const { response, request } = require("express");
const jwt = require('jsonwebtoken');

const usuario = require("../models/usuario");



const validarJwt = async (req = request, res = response, next) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay un token en la petición'
        });
    }

    try {

        const { uid } = jwt.verify(token, process.env.SECRETOPPRIVATEKEY);


        if (!usuario) {
            return res.status(401).json({
                msg: 'Token no valido - Usuario no existe en la BD'
            });
        }


        //Verificar si el uid del usuario tiene estado true
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Token no valido - Usuario con estado: false '
            });

        }


        req.usuario = await usuario.findById(uid);
        req.uid = uid;

        next();


    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Error en el token'
        });

    }


}

module.exports = {
    validarJwt
}