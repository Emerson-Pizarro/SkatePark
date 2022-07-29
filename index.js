
// Las tecnologías y herramientas utilizadas:

    // - Express
    const express = require('express');
    const app = express();

    // - Handlebars
    const {engine} = require("express-handlebars");

    //view engine, el motor de plantilla que se utiliza. Ejemplo: app.set('view engine', 'pug')
    app.set('view engine', 'handlebars');

    //app.engine es una función que registra un callback del motor de plantilla que queremos y el tipo de extensión que usará , en este caso es 'handlebars' la extensión
    app.engine('handlebars', engine({
        defaultLayout:'main',//nombre que le colocamos a la plantilla esqueleto común a todas las subpaginas
        layoutsDir: __dirname + "/views/layouts",//dirección donde seteamos que busque la plantilla común a todos (el esqueleto principal)
        partialsDir: __dirname + "/views/partials/", //dirección que le seteamos que busque los parciales.
        }
    ));

    // - PostgreSQL
    const { Pool, Client } = require('pg');

    // - JWT
    const jwt = require('jsonwebtoken');
    const secretKey =`clave secreta`

    // - Express-fileupload
    const expressFileUpload = require('express-fileupload');

    app.use( expressFileUpload({
        limits: { fileSize: 5000000 },
        abortOnLimit: true,
        responseOnLimit: "<script>alert('El peso del archivo que intentas subir supera el limite permitido')</script>",
    })
    );

// ---------------------------------------------------------------------------------
//require de funciones del archivo consultasSQL.js
const {getListaUsuarios,setUsuarioStatus,PostNuevoUsuario,getUsuario,putUsuario,deleteUsuario} = require('./consultasSQL.js');

//sirvo el estilo css y las imagenes en una carpeta pública
app.use(express.static(__dirname+`/public`));

//midleware que toma todas las request enviadas por el cliente y si contienen payload en
//formato JSON los parse a objetos.
app.use(express.json());

// Levanto servidor
const PORT = process.env.PORT || 3000;
// const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});
// ---------------------------------------------------------------------------------

app.get('/',async function (req, res) {

    try {

        let usuarios= await getListaUsuarios();//usuarios es un array que contiene arrays que cada uno son los usuarios
        res.status(200).render(`indexView`,{usuarios});
        
    } catch (error) {

        res.status(404).send({
            "error":"404 Not Found",
            "message":"Recurso no encontrado"
        });
        
    }
    
});

app.post(`/`,async function(req,res){
    res.status(404).send({
        "error":"404 Not Found",
        "message":"Recurso no encontrado"
    });
});

app.put(`/`,async function(req,res){
    res.status(404).send({
        "error":"404 Not Found",
        "message":"Recurso no encontrado"
    });
});

app.delete(`/`,async function(req,res){
    res.status(404).send({
        "error":"404 Not Found",
        "message":"Recurso no encontrado"
    });
});

// ---------------------------------------------------------------------------------
app.get('/registroView', function (req, res) {

    try {

        res.status(200).render(`registroView`);
        
    } catch (error) {

        res.status(404).send({
            "error":"404 Not Found",
            "message":"Recurso no encontrado"
        });
        
    }

});

app.post(`registroView`,async function (req,res){
    res.status(404).send({
        "error":"404 Not Found",
        "message":"Recurso no encontrado"
    });
});

app.put(`registroView`,async function (req,res){
    res.status(404).send({
        "error":"404 Not Found",
        "message":"Recurso no encontrado"
    });
});

app.delete(`registroView`,async function (req,res){
    res.status(404).send({
        "error":"404 Not Found",
        "message":"Recurso no encontrado"
    });
});

// ---------------------------------------------------------------------------------

app.post('/usuarios',async function(req, res) {

    try{

        if(req.files !== null){

            const foto=req.files.file;
            const nombreFoto=req.files.file.name;

            foto.mv(`${__dirname}/public/img/${nombreFoto}`,async(err)=>{
                if(err)return res.status(500).send({
                    error:`algo salio mal ${err}`,
                    code:500
                });
            });

            const nombreDeFoto=req.files.file.name;
            await PostNuevoUsuario(req.body,nombreDeFoto);
            res.status(201).send(`Nuevo Usuario creado`);


        }else{

            throw `Debe subir una foto`

        }

    }catch(error){

        res.status(500).send({
            error:`${error}`,
            code:500
        });

    }

});


app.put('/usuarios',async function(req, res) {

    try{

        await putUsuario(req.body);
        res.status(200).send(`Usuario Modificado`);

    }catch(error){

        res.status(500).send({
            error:`${error}`,
            code:500
        });

    }

});


app.delete(`/usuarios`, async(req,res)=>{

    try{

        await deleteUsuario(req.body.email);
        res.status(200).send(`Usuario eliminado con éxito`);

    }catch(error){

        res.status(500).send({
            error:`${error}`,
            code:500

        });

    }

});


app.get(`/usuarios`,async(req,res)=>{//ruta a la que se puede acceder solo si hay un token válido

    const{token}=req.query;
    jwt.verify(token,secretKey,(err,decoded)=>{

        if(err){

            res.status(401).send(
                {
                    error:`401 unauthorized`,
                    message:`Usted no está autorizado para estar aquí`,
                    token_error:err.message
                }
            );

        }else{

            const {data}=decoded;
            res.status(200).render(`datos`,{data});

        }

    });

});

// ---------------------------------------------------------------------------------
app.get('/adminView',async function (req, res) {

    try {

        let usuarios= await getListaUsuarios();//usuarios es un array que contiene arrays que cada uno son los usuarios
        res.render(`adminView`,{usuarios});
        
    } catch (error) {

        res.status(500).send({
            error:`algo salio mal...`,
            code:500

        });
        
    }

});

app.post(`/adminView`,async function(req,res){
    res.status(404).send({
        "error":"404 Not Found",
        "message":"Recurso no encontrado"
    });
});
app.put(`/adminView`,async function(req,res){
    res.status(404).send({
        "error":"404 Not Found",
        "message":"Recurso no encontrado"
    });
});

app.delete(`/adminView`,async function(req,res){
    res.status(404).send({
        "error":"404 Not Found",
        "message":"Recurso no encontrado"
    });
});


// -------------------------------------------------------------------------
app.put('/statusUsuarios',async(req,res)=>{

    const {idUsuario,auth}=req.body;

    try{

        const usuario=await setUsuarioStatus(idUsuario,auth);
        res.status(200).send(usuario);

    }catch(error){

        res.status(500).send({
            error:`algo salio mal... ${error}`,
            code:500

        });

    }

});

app.get(`/statusUsuarios`, async(req,res)=>{
    res.status(404).send({
        "error":"404 Not Found",
        "message":"Recurso no encontrado"
    });
});
app.post(`/statusUsuarios`, async(req,res)=>{
    res.status(404).send({
        "error":"404 Not Found",
        "message":"Recurso no encontrado"
    });
});
app.delete(`/statusUsuarios`, async(req,res)=>{
    res.status(404).send({
        "error":"404 Not Found",
        "message":"Recurso no encontrado"
    });
});


// -------------------------------------------------------------------

app.get(`/loginView`,async(req,res)=>{

    try {

        res.status(200).render(`loginView`);

    } catch (error) {

        res.status(500).send({

            error:`algo salio mal...`,
            code:500

        });
        
    }

});

app.post(`/loginView`,async(req,res)=>{
    res.status(404).send({
        "error":"404 Not Found",
        "message":"Recurso no encontrado"
    });
});
app.put(`/loginView`,async(req,res)=>{
    res.status(404).send({
        "error":"404 Not Found",
        "message":"Recurso no encontrado"
    });
});
app.delete(`/loginView`,async(req,res)=>{
    res.status(404).send({
        "error":"404 Not Found",
        "message":"Recurso no encontrado"
    });
});

// ------------------------------------------------------
app.post(`/tokens`,async(req,res)=>{

    try{

        const{email,password}=req.body;
        const user=await getUsuario(email,password);

        if(user){//si el usuario existe

            if(user.estado){//si el usuario esta autorizado

                const token=jwt.sign(
                    {
                        exp:Math.floor(Date.now()/1000)+180,
                        data:user
                    },
                    secretKey
                );
            
                res.send(token);

            }else{//si el usuario no esta autorizado

                res.status(401).send(
                    {
                        error:`este usuario aún no ha sido autorizada`,
                        code:401,
                    }
                );

            }
            
        }else{//si el usuario no existe
        
            res.status(404).send({
                error:'este usuario no está registrado en la base de datos',
                code:404
            });

        }


    }catch(error){

        res.status(404).send({
            error:'error al consultar la base de datos',
            code:404
        });

    }

});

app.get(`/tokens`,async(req,res)=>{
    res.status(404).send({
        "error":"404 Not Found",
        "message":"Recurso no encontrado"
    });
});
app.put(`/tokens`,async(req,res)=>{
    res.status(404).send({
        "error":"404 Not Found",
        "message":"Recurso no encontrado"
    });
});
app.delete(`/tokens`,async(req,res)=>{
    res.status(404).send({
        "error":"404 Not Found",
        "message":"Recurso no encontrado"
    });
});





























































































