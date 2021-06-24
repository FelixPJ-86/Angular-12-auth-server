const {response, request} =require('express');
const Usuario =require('../models/Usuario');
const bcrypt = require('bcryptjs'); 
const { generarJWT } = require('../util/jwt');

const crearUsuario = async (req, res = response)=>{
   
   

    const {email, name, password}=req.body;

    try{

        //verificar email unico
        const usuario = await Usuario.findOne({email:email});

        if(usuario){
            return res.status(400).json(
                {
                    ok:false,
                    msg:'El usuario ya existe con ese email'
                }
            );
        }
        
        //crear usuario con el modelo
      const  dbUser=new Usuario(req.body);

        //Encriptar hash contraseña
    const salt= bcrypt.genSaltSync();
        dbUser.password=bcrypt.hashSync(password,salt);

        //Generar el JWT
    const token= await generarJWT(dbUser.id, name);

        //crear usuario de DB
       await dbUser. save();

        //Generar respuesta exitos
        return res.status(201).json({
            ok:true,
            uid:dbUser.id,
            name,
            email,
            token,
        });

    }catch(error){
        return res.status(500).json({
            ok:false,
            msg:'por favor hable con el admin'
        });
    }


    return res.json({
        ok:true,
        msg:'Crear usuario /new'
    });
    }



 const loginUsuario=  async (req, res)=>{

    const {email, password}=req.body;

    try{   

        const dbUser=await Usuario.findOne({email});

        if(!dbUser){
            return res.status(400).json(
                {
                    ok:false,
                    msg:'El correo no existe'
                }
            );
        }

        //confirmar si el password hace match
        const validPassword =bcrypt.compareSync(password, dbUser.password);

        if(!validPassword){
            return res.status(400).json(
                {
                    ok:false,
                    msg:'El password no es válido'
                }
            );

        }

             //Generar el JWT
    const token= await generarJWT(dbUser.id, dbUser.name);

        //respuesta del servicio
        return res.json({
            ok:true,
            uid:dbUser.id,
            name:dbUser.name,
            email:dbUser.email,
            token
        });


     }catch(error){
        return res.status(500).json({
            ok:false,
            msg:'por favor hable con el admin'
        });
    }

}
const revalidarToken =  async (req, res = response)=>{
    
    const {uid}=req;
     
    //leer la bbdd
    const dbUser= await Usuario.findById(uid);



    //Generar el JWT
    const token= await generarJWT(uid, dbUser.name);

    return res.json({
        ok:true,
        uid,
        name:dbUser.name,
        email:dbUser.email,
        token
    });
    }


    module.exports = {
        crearUsuario,
        loginUsuario,
        revalidarToken
    }