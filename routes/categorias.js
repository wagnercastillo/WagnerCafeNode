const { Router } = require('express');
const { check } = require('express-validator');
const { existeCategoriaPorId }= require('../helpers/db-validators');
const { validarCampos, validarJwt, esAdminRole } = require('../middlewares');
const { ObtenerCategorias, ObtenerCategoria, crearCategoria, UpdateCategoria, CategoriaDelete } = require('../controllers/categorias');
const router = Router();



/**
 * {{url}}/api/categorias
 */

// Obtener todas las categorias - publico
router.get('/', ObtenerCategorias)


// Obtener una categoria por id:

router.get('/:id', [
    validarJwt,
    validarCampos,
    check('id', 'No es un usuario valido').isMongoId(),
    check('id').custom(existeCategoriaPorId)
], ObtenerCategoria)



// Crear una categoria - privado - cualquier persona con un token válido

router.post('/', [
    validarJwt,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos,
], crearCategoria)


// Actualizar - privado - cualquiera con token valido
router.put('/:id', [
    validarJwt,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], UpdateCategoria)


// Borrar una categoria

router.delete('/:id', [
    validarJwt,
    esAdminRole,
    check('id', 'No es un usuario valido').not().isEmpty(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], CategoriaDelete)





module.exports = router;