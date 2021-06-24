////////////////////
// npm run dev
////////////////////

const express =require('express');
const cors = require('cors');
const path = require('path');

const { dbConnection } = require('./db/config');
require('dotenv').config();

console.log(process.env)

//crear servidor de la aplicacion express
const app =express();

//Base de datos
dbConnection();

//Directorio público
app.use(express.static('public'))

//cors
app.use(cors());

//lectura y parseo del body
app.use( express.json() );

//Rutas
app.use('/api/auth', require('./routes/auth'));

//manejar  demas rutas
app.get('*', (req, res) => {
    res.sendFile( path.resolve(__dirname, 'public/index.html')) 
})

app.listen(process.env.PORT, () => {
   
    console.log(`servidor corriendo en puerto ${process.env.PORT}`);
});