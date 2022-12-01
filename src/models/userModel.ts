import { Sequelize, DataTypes} from 'sequelize';
import { isDataType } from 'sequelize-typescript';
import {SingConnectionDB} from './postgres/dbConn'

const sequelize: Sequelize = SingConnectionDB.getDB().getConnection();

export const User = sequelize.define('users', {
  // Model attributes are defined here
  email: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  funtoken: {
    type: DataTypes.REAL,
    allowNull: false
  }
}, {
  // Other model options go here
  //sequelize, // We need to pass the connection instance
  modelName: 'Users' // We need to choose the model name
});

export async function getUser(email: string){
  return await User.findOne({
    attributes:['email'],
    where:{email:email}
  });
}

export async function getDataUser(email:string){
  return await User.findByPk(email);
}

export async function getFuntokensAmount(email: string){
  return await User.findOne({
    attributes:['funtoken'],
    where:{email:email}
  });
}

export async function setFuntokensAmount(email:string, funtoken:number){
  return await User.update(
    {
      funtoken:funtoken,
    },
    {
      where: {email:email}
    }
  ).then(result => result !== null);
}

// the defined model is the class itself
//console.log(User === sequelize.models.User); // true