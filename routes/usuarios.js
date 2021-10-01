const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJwt, esAdminRole, tieneRol } = require('../middlewares');
const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosPatch } = require('../controllers/usuarios');
const { esRolValido, EmailExiste, existeUsuariobyId } = require('../helpers/db-validators');

const router = Router();


router.get('/', usuariosGet);

router.put('/:id', [
    check('id', 'No es un usuario Valido').isMongoId(),
    check('id').custom(existeUsuariobyId),
    check('rol').custom(esRolValido),
    validarCampos
], usuariosPut);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña debe ser mayor a 6 digitos').isLength({ min: 6 }),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom(EmailExiste),

    // check('rol', 'El rol no es valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom(esRolValido),
    validarCampos
], usuariosPost);

router.delete('/:id', [
    validarJwt,
    esAdminRole,
    tieneRol('ADMIN_ROLE', 'USER_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un usuario Valido').isMongoId(),
    check('id').custom(existeUsuariobyId),
    validarCampos
], usuariosDelete);

router.patch('/', usuariosPatch);

module.exports = router;