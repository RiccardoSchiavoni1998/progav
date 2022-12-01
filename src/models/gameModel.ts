import { Sequelize, DataTypes, Op} from 'sequelize';
import {SingConnectionDB} from './postgres/dbConn'

const sequelize: Sequelize = SingConnectionDB.getDB().getConnection();

export const Game = sequelize.define('games', {
    typology:{
        type: DataTypes.STRING,
        allowNull:false
    },
    playera:{
        type: DataTypes.STRING,
        allowNull:false
    },
    playerb:{
        type: DataTypes.STRING,
        allowNull:false
    },
    info:{
        type: DataTypes.STRING,
    },
    stateplayera:{
        type: DataTypes.STRING,
        allowNull:false
    },
    stateplayerb:{
        type: DataTypes.STRING,
        allowNull:false
    }
}, {
    // Other model options go here
    //sequelize, // We need to pass the connection instance
    modelName: 'Games' // We need to choose the model name
});

export async function newGame(typology:string, playerA: string, playerB: string, info:string, statePlayerA:string, statePlayerB:string){
    console.log("6.1 CREO GAME");
    return await Game.create({
        typology: typology,
        playera: playerA,
        playerb: playerB,
        info: info,
        stateplayera: statePlayerA,
        stateplayerb: statePlayerB
    }).then((result => result));
}

export async function getAllGames(player: string) {
    return await Game.findAll({
        attributes:['id', 'typology', 'playera', 'playerb'],
        where: {
            [Op.or]: [{playera: player}, {playerb: player}]
        }
    });
}

export async function getGeneralInfo(id: number) {
    const result = await Game.findOne({
        attributes:[ 'typology', 'info', 'playera', 'playerb'],
        where: {
          id: id
        },
    });
    return result;
}

export async function getGameState(id: number, stateplayer:string){
    const result = await Game.findOne({
        attributes:['stateplayera', 'stateplayerb'],
        where: {
          id: id
        },
    }).then(result=>result?.getDataValue(stateplayer));
    return result;
}

export async function checkElementExistence(id: number){
    const result = await Game.findOne({
        attributes:['id'],
        where:{
            id:id
        },
    }).then(result=>result!==null);
    return result;
}
//
export async function modifyState(id:number, nameState:string, newState:string){
    return await Game.update({[nameState]: newState }, {
        where: {
          id:id
        }
    }).then(result=>result);
}

export async function modifyInfo(id:number, newInfo:string){
    return await Game.update(
        { 
            info: newInfo 
        }, 
        {
            where: {id:id}
        }
    ).then(result=> result!=null)
}
/*
*/


  /*

  // JSON_VALUE - extract a scalar value from a JSON string
User.findAll({
  attributes: [[ sequelize.fn('JSON_VALUE', sequelize.col('userDetails'), '$.address.Line1'), 'address line 1']]
})

// JSON_VALUE - query a scalar value from a JSON string
User.findAll({
  where: sequelize.where(sequelize.fn('JSON_VALUE', sequelize.col('userDetails'), '$.address.Line1'), '14, Foo Street')
})

// JSON_QUERY - extract an object or array
User.findAll({
  attributes: [[ sequelize.fn('JSON_QUERY', sequelize.col('userDetails'), '$.address'), 'full address']]
})
  */