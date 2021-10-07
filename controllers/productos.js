const { response } = require('express');
const { Producto } = require('../models');


// Obtener categorias - paginado - total - populate
const obtenerProductos = async (req = request, res = response) => {
    const { limit = 5, desde = 0 } = req.query;

    const query = { estado: true };
    const [total, producto] = await Promise.all([
        Producto.countDocuments(query),
        await Producto.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip(Number(desde))
            .limit(Number(limit))
    ]);

    res.json({
        total,
        producto
    });
}

// ObtenerCategoria - populate 
const obtenerProducto = async (req = request, res = response) => {
    const { id } = req.params;

    const producto = await Producto.findById(id)
        .populate('usuario', 'nombre');

    res.json({
        producto
    });

}

const crearProducto = async (req, res = response) => {

    const { estado, usuario, ...body } = req.body;
    // nombre = this.nombre.toUpperCase();

    const ProductoDB = await Producto.findOne({ nombre: body.nombre});

    if (ProductoDB) {
        return res.status(400).json({
            msg: `El producto ${ProductoDB.nombre} ya existe`
        })
    }

    // Generar la data a guardar

    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const producto = new Producto(data);

    //  Guardar  BD
    await producto.save();
    res.status(201).json(producto);
}

// Actualizar Categoria
const UpdateProducto = async (req, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();
    }
    data.usuario =  req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

    res.json({
        producto
    });
}



// Borrar Categoría - estado: false
const ProductoDelete = async (req, res = response) => {
    const { id } = req.params;

    const productoBorrado = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });


    res.json({ productoBorrado });
}

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    UpdateProducto,
    ProductoDelete  
}