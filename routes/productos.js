const { Router } = require('express');
const { check } = require('express-validator');
const { existeProductosPorId, existeCategoriaPorId} = require('../helpers/db-validators');
const { validarCampos, validarJwt, esAdminRole } = require('../middlewares');

const { obtenerProductos, 
        obtenerProducto, 
        crearProducto, 
        UpdateProducto,
        ProductoDelete } = require('../controllers/productos');

const router = Router();




// Obtener todas los productos
router.get('/', obtenerProductos)


// Obtener un producto por id:

router.get('/:id', [
    validarJwt,
    validarCampos,
    check('id', 'No es un usuario valido').isMongoId(),
    check('id').custom(existeProductosPorId)
], obtenerProducto)



// Crear una producto - privado - cualquier persona con un token válido
//   nombre, usuario: req.usuario._id, precio, categoria: req.Categoria._id, descripción 
router.post('/', [
    validarJwt,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id de Mongo').isMongoId(),
    check('categoria').custom( existeCategoriaPorId ),
    validarCampos,
], crearProducto)


// Actualizar - privado - cualquiera con token valido
router.put('/:id', [
    validarJwt,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id de Mongo').isMongoId(),
    check('categoria').custom( existeCategoriaPorId ),
    validarCampos
], UpdateProducto)


// Borrar un producto

router.delete('/:id', [
    validarJwt,
    esAdminRole,
    check('id', 'No es un usuario valido').not().isEmpty(),
    check('id').custom(existeProductosPorId),
    validarCampos
], ProductoDelete)





module.exports = router;