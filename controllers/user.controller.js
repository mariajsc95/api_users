const HttpStatus = require("http-status-codes");
const  models  = require("../models");
const PropertiesReader = require("properties-reader");
const crypto = require("../utils/encryptPassword");

const properties = PropertiesReader("./bin/common.properties");
// Create and Save a new Tutorial

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
            where: { usuario: user },
    }).catch(err=>{
      console.log(err)
      const message = properties.get("message.login.res.notPasswordUserLogin");
      return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ message });
    })
    console.log(userToLog)
    if(userToLog){
      const message = properties.get("message.res.okData");
      return res.status(HttpStatus.StatusCodes.OK).json(userToLog.dataValues);
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
  


  module.exports = {
    findAll,
    create,
    update,
    updateUserRol,
    logUser
  };