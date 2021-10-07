const { response } = require('express');
const { Categoria } = require('../models');


// Obtener categorias - paginado - total - populate
const ObtenerCategorias = async (req = request, res = response) => {
    const { limit = 5, desde = 0 } = req.query;

    const query = { estado: true };
    const [total, categoria] = await Promise.all([
        Categoria.countDocuments(query),
        await Categoria.find(query)
            .populate('usuario', 'nombre')
            .skip(Number(desde))
            .limit(Number(limit))
    ]);

    res.json({
        total,
        categoria
    });
}


// ObtenerCategoria - populate 
const ObtenerCategoria = async (req = request, res = response) => {
    const { id } = req.params;

    const categoria = await Categoria.findById(id)
        .populate('usuario', 'nombre');

    res.json({
        categoria
    });

}
// Crear categoria
const crearCategoria = async (req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();
    const categoriaDB = await Categoria.findOne({ nombre });

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre} ya existe`
        })
    }

    // Generar la data a guardar

    const data = {
        nombre,
        usuario: req.usuario._id
    }

    console.log(data);

    const categoria = new Categoria(data);

    //  Guardar  BD
    await categoria.save();

    res.status(201).json(categoria);
}

// Actualizar Categoria
const UpdateCategoria = async (req, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;
    data.nombre = data.nombre.toUpperCase;
    data.usuario = data.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

    res.json({
        categoria
    });
}

// Borrar Categoría - estado: false
const CategoriaDelete = async (req, res = response) => {
    const { id } = req.params;

    const categoria = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true });
    const CategoriaAutenticado = req.categoria;
    
    res.json({ categoria, CategoriaAutenticado });
}

module.exports = {
    crearCategoria,
    ObtenerCategoria,
    ObtenerCategorias,
    UpdateCategoria,
    CategoriaDelete
}