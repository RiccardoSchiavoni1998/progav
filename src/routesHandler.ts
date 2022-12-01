import express = require('express');
import { GameController } from './controllers/gameController';
import { UserController } from './controllers/userController';
import * as mdl from './middlewares/middlewareChain';
const gameCntrl = new GameController();
const userCntrl = new UserController()
const router = express.Router();
router.use(express.json());
router.use(mdl.jwtAuthChain);
//router.use(jwtMid.logErrors);
//router.use(jwtMid.errorHandler);
//router.use(midUser.checkUserRole)

router.post('/createGame', 
    mdl.newGameChain,
    async(req:any, res:any, next:any)=>{
        userCntrl.dischargeFuntokensAmount(req, res, next);
        gameCntrl.createNewMatch(req, res, next);
    }
);

router.post('/modifyGame',
    mdl.modifyGameChain,
    async(req:any, res:any, next:any)=>{
        userCntrl.dischargeFuntokensAmount(req, res, next);
        gameCntrl.modifyStateMatch(req, res);
       
    }
);

router.post('/cpu',
    mdl.cpuChain,
    async(req:any, res:any, next:any)=>{
        gameCntrl.cpuMove(req, res);
    }
);

router.post('/deleteGame',
    mdl.deleteGameChain,
    async(req:any, res:any, next:any)=>{
        userCntrl.dischargeFuntokensAmount(req, res, next);
        gameCntrl.stopMatch(req, res, next);
    }
);

router.get('/listAllMatches',
    mdl.getGameInfoChain,
    async(req:any, res:any)=>{
        gameCntrl.listAllMatches(req, res);
    }
);

router.get('/getMatchHistory',
    mdl.getGameInfoChain,
    async(req:any, res:any)=>{
        gameCntrl.getMatchHistory(req, res);
    }
);

router.get('/getMatchInfo',
    mdl.getGameInfoChain,   
    async(req:any, res:any)=>{
        gameCntrl.getMatchInfo(req, res)
    }
);

router.get('/getShips',
    mdl.getShipsInfo,
        async (req:any, res:any)=>{
            gameCntrl.getShips(req, res);
        }
);
/*
router.get('/getTokensAmount',
    async(req:any, res:any, next:any)=>{
        //gameCntrl.getFuntokensAmount(req, res);
    }
);*/

router.post('/rechargeToken',
    mdl.rechargeTokens, 
    async (req: any, res:any)=>{
        userCntrl.rechargeFuntokensAmount(req, res);
    }
);

router.get("*", async (req, res) => {
    res.status(404).send("Risorsa richiesta non esiste");
  });
  
  router.post("*", async (req, res) => {
    res.sendStatus(404).send("Risorsa richiesta non esiste");
  });
module.exports = router;