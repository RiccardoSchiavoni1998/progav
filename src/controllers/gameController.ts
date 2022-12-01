import * as game from "../models/gameModel";
import * as user from "../models/userModel";
import { GameModifier } from "../gameUtilities/gameModifier";
import { GameBuilder } from "../gameUtilities/gameBuilder";
import { MoveMaker } from "../gameUtilities/cpu/cpu";
import { send } from "process";


export class GameController{

    /**
     * 
     * @param req 
     * @param res 
     * Funzionalità per la creazione di una nuova partita.
     * Mediante la classe GameBuilder vengono inizializzate separatamente le posizioni delle barchette dei due giocatori
     */
    public createNewMatch = async(req: any, res: any, next:any)=>{
        try{
            var gameBuilder = Object.assign(new GameBuilder(), req.body); //copio le proprietà contenute all'interno del body nella classe GameBuilder
            gameBuilder.initializePlayerNewMatch();                                                //   
            let statePlayerA:{[key:string]: string} = gameBuilder.getInitializedPlayerState();     //Funzioni per impostare la disposizione delle barchette
            gameBuilder.initializePlayerNewMatch();                                                //e lo storico delle mosse (inizialmente vuoto)
            let statePlayerB:{[key:string]: string} =  gameBuilder.getInitializedPlayerState();    //
            let info = {'dimension': req.body.dimension, 'turn':req.body.player, 'winner':'', 'state':'inprogress'}; // Creo info iniziali sul match 
            let result = await game.newGame(
                    req.body.typology,
                    req.user.email,
                    req.body.player,
                    JSON.stringify(info),
                    JSON.stringify(statePlayerA),
                    JSON.stringify(statePlayerB)
                );
            if(result){
                res.status(200).send("Partita creata correttamente");
            }else{
                res.sendStatus(404);
            }
        }catch(e){
            res.status(500).send(e);
        }
    };
    
    /**
     * 
     * @param req 
     * @param res
     * 
     * Funzionalità per permettere all'utente di modificare una partita esistente 
     * Verifica se mossa non è stata effettuata e, nel caso sia una nuova mossa,
     * verifica l'esito e la registra
     */
    public modifyStateMatch = async(req: any, res: any)=>{
        try{
            let info:any = await game.getGeneralInfo(req.body.idMatch); //recupero info generali sulla partita
            let generalparsedinfo=JSON.parse(JSON.stringify(info));   
            generalparsedinfo.info = JSON.parse(generalparsedinfo.info);
            let result:any = await game.getGameState(req.body.idMatch, req.body.stateToModify); //recupero lo stato delle barchette da colpire e
            var gameModifier = Object.assign(new GameModifier(), JSON.parse(result));           //lo storico delle mosse dell'utente che vuole effettuare la mossa
            let cell = {'cell':req.body.cell, 'outcome':'miss'};
            gameModifier.setModifyMode();
            if(gameModifier.validateMove(cell.cell)){
                cell.outcome  = gameModifier.makeMove(cell.cell); //esecuzione mossa e controllo risultato
                gameModifier.registerMove(cell); //aggiornamento stato delle barchette 
                const r1 = await game.modifyState(req.body.idMatch, req.body.stateToModify, gameModifier.getModifies()); //modifico stato barchette da colpire
                const r2 = await game.modifyInfo(req.body.idMatch, gameModifier.changeInfo(generalparsedinfo)); //aggiorno storico mosso
                if(r1 && r2){
                    let result = [String(cell.cell), ' ', cell.outcome].join('');
                    res.status(200).send(result);
                }else{
                    res.sendStatus(400)
                }
            }else{
                res.sendStatus(400)
            }
        }catch(e){
            res.status(500).send(e)
        }
    };
    public cpuMove = async(req: any, res: any)=>{
        try{
            let info:any = await game.getGeneralInfo(req.body.idMatch);
            let generalparsedinfo=JSON.parse(JSON.stringify(info));
            generalparsedinfo.info = JSON.parse(generalparsedinfo.info);
            let state = await game.getGameState(req.body.idMatch, 'stateplayerb');
            let history = JSON.parse(state).history;
            var moveMaker = new MoveMaker();
            let cell = moveMaker.move(generalparsedinfo.info.dimension, generalparsedinfo.playerb, history);
            var gameModifier = Object.assign(new GameModifier(), JSON.parse(state));
            gameModifier.setModifyMode();
            cell.outcome  = gameModifier.makeMove(cell.cell);
            gameModifier.registerMove(cell);
            const r1 = await game.modifyState(req.body.idMatch, "stateplayerb", gameModifier.getModifies());
            const r2 = await game.modifyInfo(req.body.idMatch, gameModifier.changeInfo(generalparsedinfo));
            if(r1 && r2){
                let result = [String(cell.cell), ' ', cell.outcome].join('');
                res.status(200).send(result);
            }else{
                res.sendStatus(400)
            }

        }catch(e){

        }
    }

    /**
     * 
     * @param req 
     * @param res
     * 
     * Funzionalità per permettere all'utente di stoppare una partita esistente:
     * modifica info generali della partita
     * 
     */

    public stopMatch = async(req: any, res: any, next:any)=>{
        try{
            let newInfo = '{"winner":"", "turn":"", "state":"stopped"}';
            const result = await game.modifyInfo(req.body.idMatch, newInfo);
            if (result){
                res.status(200).send("Match terminato");
            }else{
                res.sendStatus(400);
            }
        }catch(e){
            res.status(500).send(e)
        }
    };

    /**
     * 
     * @param req 
     * @param res 
     * Funzionalità per vedere tutte le partite a cui utente sta partecipando
     */
    public listAllMatches = async(req: any, res: any)=>{
        try{
            const result = await game.getAllGames(req.user.email);
            let allMatch = JSON.parse(JSON.stringify(result));
            res.send(result);
        }catch(e){
            res.status(500).send(e);
        }
    };


    /**
     * 
     * @param req 
     * @param res 
     * Funzionalità per visualizzare info su un determinato match
     */
    public getMatchInfo = async(req:any, res: any)=>{
        try{
            const result = await game.getGeneralInfo(req.body.idMatch);
            let info = JSON.parse(result?.getDataValue('info'));
            if(info){
                res.status(200).send(info);//200
            }else{
                res.status(404).send("Non è possibile visualizzare le informazioni richieste")
            }
        }catch(e){
            res.status(500).send(e);
        }
    };
    
    /**
     * 
     * @param req 
     * @param res 
     * Funzionalità per visualizzare storico mosse su un determinato match
     */
    public getMatchHistory = async(req:any, res:any)=>{
        try{
            const result = await game.getGameState(req.body.idMatch, req.body.state);
            let history = JSON.parse(JSON.parse(result).history);
            if(history){
                res.status(200).send(history)
            }else{
                res.status(404).send("Non è possibile visualizzare le informazioni richieste")
            }
            res.send(history);//200
        }catch(e){
            res.status(500).send(e)
        }
    };

    /**
     * 
     * @param req 
     * @param res 
     * Funzionalità per visualizzare lo stato delle proprie barchette in un determinato match
     */
    public getShips = async(req:any, res:any)=>{
        try{
            const result = await game.getGameState(req.body.idMatch, req.body.state);
            let ships = JSON.parse(JSON.parse(result).ships);
            if(ships){
                res.status(200).send(ships)
            }else{
                res.status(404).send("Non è possibile visualizzare le informazioni richieste")
            }
        }catch(e){
            res.status(500).send(e)
        }
    };
}