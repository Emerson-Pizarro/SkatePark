//CAPTACIÓN DE MODULOS
const { Pool } = require("pg");

// const pool = new Pool({//objeto para el logeo a la base de datos de postgreSQL

//     user: "postgres",
//     host: "localhost",
//     password: "admin",
//     port: 5432,
//     database: "skatepark",

// });

// Base de datos Heroku
const pool = new Pool({//objeto para el logeo a la base de datos de postgreSQL

    user: "kedlqadphhwvrc",
    host: "eec2-18-214-35-70.compute-1.amazonaws.com",
    password: "52288b0cd168204e4115e5036227d8b23962e649c9d252b3f7416ad48c7503b8",
    port: 5432,
    database: "d9j10f94vs9m6v",

});
// -------------------------------------------------------------------


const getListaUsuarios= async()=>{

    try{

        const consulta={
            rowMode:`object`,
            text:`SELECT id,foto,nombre,anos_experiencia,especialidad,estado FROM skaters`
        }
        const result= await pool.query(consulta);
        const resultado = result.rows;
        return resultado;

    }catch(error){

        throw `Error al obtener la lista de postulantes`

    }

}


const setUsuarioStatus=async(idUsuario,auth)=>{

    try{

        const consulta={
            // rowMode:`object`,
            text:`UPDATE skaters SET estado = ${auth} WHERE id = ${idUsuario} RETURNING*`
        }

        const result= await pool.query(consulta);
        const resultado = result.rows;
        return resultado;

    }catch(error){

        throw 'error al realizar la consulta'

    }


}


const PostNuevoUsuario=async(reqBody,nombreDeFotosuario)=>{

    try {

        const datosNuevoUsuario=reqBody;
        delete datosNuevoUsuario[`repeatPassword`];
        datosNuevoUsuario.estado=false;
        datosNuevoUsuario.foto=nombreDeFotosuario;

        const values=Object.values(datosNuevoUsuario);

        const consulta = {
            rowMode:'array',
            text:`INSERT INTO skaters (email,nombre,password,anos_experiencia,especialidad,estado,foto) VALUES($1,$2,$3,$4,$5,$6,$7) returning*`,
            values: values
        };
        const result= await pool.query(consulta);
        const resultado = result.rows;
        return resultado;

    } catch (error) {
        
        throw `Error al crear nuevo Usuario`
        
    }

}

const getUsuario= async(email,password)=>{

    try{

        const values=[email,password];

        const consulta={
            rowMode:`object`,
            text:`SELECT email,nombre,password,anos_experiencia,especialidad,estado FROM skaters WHERE email=$1 and password=$2`,
            values: values
        }
        const result= await pool.query(consulta);
        const resultado = result.rows[0];
        return resultado;

    }catch({e}){

        throw 'error al realizar la consulta'

    }

}




const putUsuario=async(reqBody)=>{

    try {

        const nuevosDatosUsuario=reqBody;
        const values=Object.values(nuevosDatosUsuario);
        const consulta = {
            rowMode:'array',
            text:`UPDATE skaters SET
            nombre=$2,
            password=$3,
            anos_experiencia=$4,
            especialidad=$5
            WHERE email=$1
            returning*
            `,
            values: values
        };
        const result= await pool.query(consulta);
        const resultado = result.rows[0];
        return resultado;

    } catch (error) {

        throw `No se pudo modificar el usuario`
        
    }

}


const deleteUsuario=async(email)=>{

    try {

        const values=[email];
        const consulta = {
            rowMode:'array',
            text:`DELETE FROM skaters WHERE email=$1 returning*`,
            values: values
        };
        const result= await pool.query(consulta);
        const resultado = result.rows[0];
        return resultado;

    } catch (error) {

        throw `No se pudo eliminar el usuario`
        
    }

}




module.exports = {getListaUsuarios,setUsuarioStatus,PostNuevoUsuario,getUsuario,putUsuario,deleteUsuario};










































































































































