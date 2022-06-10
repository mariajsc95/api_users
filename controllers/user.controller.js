const nodemailer = require("nodemailer");
const HttpStatus = require("http-status-codes");
const  models  = require("../models");
const PropertiesReader = require("properties-reader");
const crypto = require("../utils/encryptPassword");


const properties = PropertiesReader("./bin/common.properties");
// Create and Save a new Tutorial


// create transporter object with smtp server details
const getTransport = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    // service: 'gmail',
    secure: false,
    pool: true,
    auth: {
      user: 'mariajsc.95@gmail.com',
      pass: 'wkjbonbpouoesmym'
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

const sendEmail = async (data) => {
  const { email, username, code } = data;
  console.log("SEND EMAIL");
  const transport = await getTransport();
  const message = {
    from: 'mariajsc.95@gmail.com', // Sender address
    to: email, // List of recipients
    subject: 'Envio de codigo', // Subject line
    text: `Se ha enviado el siguiente codigo para uso en la aplicacion: ${code}` + "\n\nCuenta no monitoreada no responda este correo", // Plain text body
  };
  //console.log(message);
  await transport.sendMail(message, function (err, info) {
    transport.close();

    if (err) {
      console.error('ERROR',{ err, sent: false });
      //res.status(500).send({error: err})
      send(err);
    } else {
      console.log({ info });
      return { info, sent: true };
    }
  });

}

const create = async (req, res, next) => {
    try {
      let tempUser = null;
  
      tempUser = await models.User.findOne({
        where: { usuario : req.body.usuario },
      });

     // console.log(tempUser)
  
      if(tempUser){
        const message = properties.get("message.user.res.userAlredyExistsUsername");
        res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message });
        return;
      }
  
        //let hash = crypto.encrypt(req.body.password);
        const rolId = await models.Rol.findOne({
          where: {nombre : req.body.rol},
        }).catch(err => {throw err})

        
        const user = await models.User.create({
          usuario: req.body.usuario,
          password: req.body.password,
          status: req.body.status,
          createdAt: new Date(),
          updateAt: new Date(),
        }).catch(err => {throw err})
        if(user){
         // console.log(rolId)
            const userol= await models.user_rol.create({
                uro_user_id : user.dataValues.id,
                uro_rol_id: rolId.dataValues.id
            }).catch(err => {throw err})

            if(userol){
              const message = properties.get("message.user.res.okCreated");
              return res.status(HttpStatus.StatusCodes.OK).json({ message, user });
            }
            else{
              const message = properties.get("message.res.errorInternalServer");
              return res.status(HttpStatus.StatusCodes.OK).json({ message: "mal mal mal", user });
            }
            
        }else {
          const message = properties.get("message.res.errorInternalServer");
          return res.status(HttpStatus.StatusCodes.OK).json({ message: "mal mal mal", user });
        }
    } catch (err) {
      console.log(err)
      const message = properties.get("message.res.errorInternalServer");
      res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message });
    }
  };

  const findAll = async (req, res, next) => {
    try {
      console.log("FIND ALL USERS")
      const users = await models.User.findAll({
        include: [{
          model: models.Rol,
          through: { attributes: ["uro_rol_id"] },
        }], raw:true
      });

      if(users) {
         const message = properties.get("message.res.okData");
      return res.status(HttpStatus.StatusCodes.OK).json({ data: users });
      }
      else{
        const message = properties.get("message.res.errorInternalServer");
      return res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message });
      }

     
    } catch (err) {
      console.log(err)  
      const message = properties.get("message.res.errorInternalServer");
      return res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message });
    }
  };

  const update = async (req, res, next) => {
 
    const { id } = req.body;
    //let hash = crypto.encrypt(req.body.usr_password);
      try {
          const [updated] = await models.User.update({
            usuario: req.body.usuario,
            password: req.body.password,
            status: req.body.status,
            updateAt: new Date(),
          }, {
            where: { id: id },
          });

          if (updated) {
            const rol = await models.Rol.findOne({
              where : { nombre: req.body.rol }
            })

            if(rol){
              const user_rol = await models.user_rol.update({
                uro_rol_id: rol.dataValues.id
            },{ where: { uro_user_id : id}});
            if(user_rol){
                const message = properties.get("message.user.res.Updated");
                const updateUser = await models.User.findOne({
                    where: { id: id },
                });
                res.status(HttpStatus.StatusCodes.OK).json({ message, updateUser });
            }else {
            const message = properties.get("message.user.res.notDataToUpdate");
            res.status(HttpStatus.StatusCodes.NOT_FOUND).json(message);
          }
            }

  
        }else {
            const message = properties.get("message.res.errorInternalServer");
            res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message, err });
        }
      } catch (err) {
        const message = properties.get("message.res.errorInternalServer");
        res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message, err });
      }
};

const updateUserRol = async(req, res, next) => {
    const id      = req.params.id;
    const rol_id  = req.body.rol_id;
    console.log(id, rol_id)
    try {        
        const [updated] = await models.user_rol.update({
            uro_rol_id: rol_id,
        }, {
            where: { uro_user_id: id },
        });
        console.log(update);
        if (updated) {
            const message = properties.get("message.roluser.res.Updated");
            const updatedRolUser = await models.user_rol.findOne({
                where: { uro_user_id: id },
            });
            res.status(HttpStatus.StatusCodes.OK).json({ message, updatedRolUser });
        } else {
            const message = properties.get("message.roluser.res.notDataToUpdate");
            res.status(HttpStatus.StatusCodes.NOT_FOUND).json(message);
        }
    } catch (err) {
        console.log(err)
        const message = properties.get("message.res.errorInternalServer");
        res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message, err });
    }
};


const logUser = async(req, res, next) => {
  
  try {     
      const user      = req.body.usuario;
      const password  = req.body.password;
    
    if (user === "") {
      const message = properties.get("message.login.res.notEmail");
      return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({message});
    }
    if (password === "") {
      const message = properties.get("message.login.res.notPassword");
      return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({message});
    }
    const userToLog =  await models.User.findOne({   
            where: { usuario: user, password: password },
    }).catch(err=>{
      console.log("ERROR",err)
      const message = properties.get("message.login.res.notPasswordUserLogin");
      return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ message });
    })
    if(userToLog){
      console.log("USUARIO TO LOG", userToLog.dataValues)
      if(userToLog.dataValues.status === "Activo"){
        const message = properties.get("message.login.res.okData");
        return res.status(HttpStatus.StatusCodes.OK).json(userToLog.dataValues);
      }else {
        const message = properties.get("message.login.res.notActiveUser");
        return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ message });
      }

      
      // let result = crypto.validate(password, userToLog.dataValues.password) 
      // if(result) {
      //    const message = properties.get("message.res.okData");
      // return res.status(HttpStatus.StatusCodes.OK).json(userToLog.dataValues);
      // }else {
      //   const message = properties.get("message.login.res.notPasswordUserLogin");
      // return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ message });
      // }
     
    }else {
      const message = properties.get("message.login.res.notPasswordUserLogin");
      return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ message });
    }
} catch (err) {
    console.log(err)
    const message = properties.get("message.res.errorInternalServer");
    return res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message, err });
}


  
};
  
const sendCode = async(req, res, next) => {
  const { usuario, email} = req.body;
  const { type } =  req.params;
  try {
    let emailResponse;
    let characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let result = ''
    let length = 10 // Customize the length here.
    for (let i = length; i > 0; --i) result += characters[Math.round(Math.random() * (characters.length - 1))]

      const userExist = await models.User.findOne({
        where: {usuario: usuario}
      }).catch(err => {throw err})
      if(userExist){
        const regCode = await models.Codes.findOne({
          where: { id_usuario: userExist.dataValues.id, tipo_codigo: type}
        }).catch(err => {throw err})
        if(regCode){
          //hacer update del codigo
          const updateCode = await models.Codes.update({
            codigo: result
          },{
            where: { id_usuario: userExist.dataValues.id, tipo_codigo: type }
          }).catch(err => {throw err})
          if(updateCode){
            emailResponse = sendEmail({
              email: email,
              username: usuario,
              code: result
            })
            console.log('EMAIL RESPONSE',emailResponse)
            if(!emailResponse.err){
              const message = properties.get("message.login.res.sendCodeSuccessful");
              return res.status(HttpStatus.StatusCodes.OK).json({ message });
            }else {
              const message = properties.get("message.res.sendCodeError");
              return res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message, err });

            }
          }
        }
        else{
          //registrar
          const newCode = await models.Codes.create({
            id_usuario: userExist.dataValues.id,
            tipo_codigo: type,
            codigo: result
          }).catch(err => {throw err})

          if(newCode){
            emailResponse = sendEmail({
              email: email,
              username: usuario,
              code: result
            })
            console.log('EMAIL RESPONSE',emailResponse)
            if(!emailResponse.err){
              const message = properties.get("message.login.res.sendCodeSuccessful");
              return res.status(HttpStatus.StatusCodes.OK).json({ message });
            }else {
              const message = properties.get("message.res.sendCodeError");
              return res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message, err });

            }
          }
          
        }
      }
      else{
        const message = properties.get("message.login.res.userDontExist");
        return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ message });
      }
  }
  catch (err) {
    console.log(err)
    const message = properties.get("message.res.errorInternalServer");
    return res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message, err });
  }
}

const newPassword = async(req, res, next) => {
  const { usuario, newPass, code} = req.body;
  console.log('NUEVA CONTRASENA',newPass)
  try{
    if(!usuario || !newPass || !code) return res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message:"todos los campos son requeridos" });
    const userExist = await models.User.findOne({
      where: {usuario: usuario}
    }).catch(err => {throw err})

    if(userExist){
      const validCode = await models.Codes.findOne({
        where: {id_usuario: userExist.dataValues.id, codigo: code }
      }).catch(err => {throw err})
      if(validCode){
        const updateUser = await models.User.update({password: newPass},
        {where: { id: userExist.dataValues.id}}
        ).catch(err => {throw err})

        if(updateUser) {
          const message = properties.get("message.login.res.changePassSuccessful");
          return res.status(HttpStatus.StatusCodes.OK).json({ message });
        }
        else{
          const message = properties.get("message.login.res.changePassError");
          return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ message });
        }
      }
      else{
        const message = properties.get("message.login.res.invalidCode");
        return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ message });
      }
    }

    else{
      const message = properties.get("message.login.res.userDontExist");
      return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ message });
    }


  }catch(err) {
    console.log(err)
    const message = properties.get("message.res.errorInternalServer");
    return res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message, err });
  }


}

const activateUser = async(req,res,next) => {
    const { usuario, code} = req.body;
    try{
      const userExist = await models.User.findOne({
        where: {usuario: usuario}
      }).catch(err => {throw err})
      if(userExist) {
        const validCode = await models.Codes.findOne({
          where: {id_usuario: userExist.dataValues.id, codigo: code }
        }).catch(err => {throw err})
        if(validCode){
          const updateUser = await models.User.update({
            status: 'Activo'
          }, { where: {id: userExist.dataValues.id}})
          .catch(err => {throw err})

          if(updateUser) {
            const message = properties.get("message.login.res.activateUserSuccessful");
            return res.status(HttpStatus.StatusCodes.OK).json({ message });
          }
          else {
            const message = properties.get("message.login.res.activateUserError");
            return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ message });
          }
          
        }
        else {
          const message = properties.get("message.login.res.invalidCode");
          return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ message });
        }
      }
      else{
        const message = properties.get("message.login.res.userDontExist");
      return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ message });
      }

    }catch(err){
      console.log(err)
      const message = properties.get("message.res.errorInternalServer");
      return res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message, err });
    }

}

  module.exports = {
    findAll,
    create,
    update,
    updateUserRol,
    logUser,
    sendCode,
    newPassword,
    activateUser
  };