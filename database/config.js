const mongoose = require('mongoose');

const ConnectionDBMG = async () => {

    try {

        await mongoose.connect(process.env.MONGOCOMPAS);
        console.log('Base de datos conectada')
        
    } catch (error) {
        console.log(error);
        throw new Error('Hay problema para conectarse a la base de datos')
    }



};


module.exports = {
    ConnectionDBMG
}