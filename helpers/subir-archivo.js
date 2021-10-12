const path = require('path');
const { v4: uuidv4 } = require("uuid");


const subirArchivo = (files, extensionesValidas = ['jpg', 'png', 'jpeg'], carpeta = '') => {
    
    
    return new Promise((resolve, reject) => {
        
        const { archivo } = files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1]


        if (!extensionesValidas.includes(extension)) {
            return reject(`La extensión ${extension} no es permitida, Extensiones permitidas: ${extensionesValidas}`);
        }

        const nombreFinal = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname,'../uploads', carpeta, nombreFinal);

        archivo.mv(uploadPath, (err) => {
            if (err) {
                reject(err);
            }

            resolve(nombreFinal);
        });

    })

}


module.exports = {
    subirArchivo
}