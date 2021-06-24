const jwt =require('jsonwebtoken');


const generarJWT =( uid, name) =>{

    const payload={uid,name};

   return new Promise((resolve,reject)=>{

    jwt.sign(payload, process.env.SECRET_JWT_SEED,{
        expiresIn:'24h'
    },(err,token)=>{
        if(err){
            //todo mal
            console.log(err);
            reject(err)
        }else{
            //todo bien
            resolve(token)
        }
    });

    })


}


module.exports={
    generarJWT
}