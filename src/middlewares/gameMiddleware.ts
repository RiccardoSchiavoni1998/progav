import * as game from "../models/gameModel"

/**
 * Middleware per validare la richiesta, con opportuni messaggi di errore
 * @param req request
 * @param res response
 * @param next
 */


//MID GET
export async function checkGetShipsMatchRequest(req: any, res: any, next: any){
  if(req.body.state == 'stateplayera'){
    req.body.state = 'stateplayerb'
  }else{
    req.body.state = 'stateplayera'
  }
  next();
}

export async function checkGetInfoMatchRequest(req: any, res: any, next: any){
  try{
    if(checkRequestFields((req.body),['idMatch'])){
      let checkExistence = await game.checkElementExistence(req.body.idMatch)
      if(checkExistence){
        let info:any = await game.getGeneralInfo(req.body.idMatch);
        let playerA =info?.getDataValue('playera')
        let playerB =info?.getDataValue('playerb')
        if(req.user.email == playerA){
            req.body.state= 'stateplayera';
            next();
        }else if(req.user.email == playerB){
            req.body.state  = 'stateplayerb';
            next();
        }else{
            res.status(403).send('Non sta partecipando a questa partita');
        }
      }else{
        res.status(400).send('La partita selezionata non esiste');
      }
    }else{
      res.status(400).send('Errore nella richiesta');
    }
  }catch(e){
    res.status(500).send(e);
  }
}

/**
 * 
 * @param req 
 * @param res 
 * @param next 
 * Controllo che i campi contenuti nel body della request non siano diversi da quelli predefiniti.
 *  
 */
export async function checkNewMatchFormatRequest (req: any, res: any, next: any){
  if(checkRequestFields((req.body),['typology','dimension','shipsamount', 'player'])){
    req.body.shipsamount =  Object.keys(req.body.shipsamount).map((key)=>[String(key), req.body.shipsamount[key]]);
    next();
  } else { 
    res.status(400).send('Errore nella richiesta');
  }
}

/**
 * 
 * @param req 
 * @param res 
 * @param next 
 * Controllo che i valori contenuti all'interno del body della request. 
 * Nel caso in cui la partita sia contro un Bot o Ia il campo player viene settato di conseguenza
 */

export async function checkNewMatchContentRequest(req: any, res: any, next: any){
  if(req.body.typology == "UvBOT") req.body.player = "BOT";
  else if (req.body.typology == "UvIA") req.body.player = "IA";
  if(
    checkMatchTypology(req.body.typology) &&
    checkTableDimension(req.body.dimension) &&
    checkShipsDefinition(req.body.dimension, req.body.shipsamount) && (req.user.email!==req.body.player)){
      req.body.neededTokenAmount = 0.4;
      next();
  } else {
    res.status(400).send('Errore nella richiesta');
  }
}


//MIDDLWARE ESECUZIONE MOSSA UTENTE (MODIFICA DI UNA PARTITA)

/**
 * 
 * @param req 
 * @param res 
 * @param next 
 * Controllo che i campi contenuti nel body della request non siano diversi da quelli predefiniti.
 * Controllo che il match associato all'id selezionat esista
 *  
 */
export async function checkModifyMatchFormatRequest(req: any, res: any, next: any){
  try{
    if (checkRequestFields((req.body), ['cell','idMatch'])){
      let checkExistence = await game.checkElementExistence(req.body.idMatch)
      if(checkExistence){
        next();
      }else{
        res.status(400).send('Errore nella richiesta');
      }
    }else{
      res.status(400).send('Errore nella richiesta');
    }
  }catch(e){
    res.status(500).send(e)
  }
}

/**
 * 
 
 * @param req 
 * @param res 
 * @param next 
 * 
 * Controllo  validità valori contenuti nei campi del body della request e recupero informazioni necessarie
 * 
 */

export async function checkModifyMatchContentRequest(req: any, res: any, next: any){
  try{    
    let info:any = await game.getGeneralInfo(req.body.idMatch); //Recupero informazioni relative alla partita da modificare
    let parsedinfo=JSON.parse(info?.getDataValue('info'));
    let playerA =info?.getDataValue('playera')
    let playerB =info?.getDataValue('playerb')
    if(parsedinfo.state=="inprogress"){ // Controllo se la partita non è finita
      if(req.body.cell > (parsedinfo.dimension)*(parsedinfo.dimension)){ // Controllo se la mossa scelta sia una delle possibili o se ecceda la dimensione della tabella
        res.status(400).send('Mossa non valida')
      }else{
        req.body.neededTokenAmount = 0.01;
        if(req.user.email == playerA && req.user.email == parsedinfo.turn){  //Controllo se l'utente che invoca la funzionalità sia uno dei due giocatori e che sia il suo turno
            req.body.stateToModify = 'stateplayera';
            next();
        }else if(req.user.email == playerB && req.user.email == parsedinfo.turn){
            req.body.stateToModify = 'stateplayerb';
            next();
        }else{
            res.status(403).send('Non è il tuo turno o non stai partecipando a questa partita');
        }
      }
    }else{
      res.status(403).statu('Partita terminata');
    }
  }catch(e){
    res.status(500).send(e)
  }
  
}

//MIDDLWARE ESECUZIONE MOSSA CPU (MODIFICA DI UNA PARTITA)

/**
 * 
 * @param req 
 * @param res 
 * @param next 
 * Controllo che i campi contenuti nel body della request non siano diversi da quelli predefiniti.
 * Controllo che il match associato all'id selezionat esista
 *  
 */

export async function checkCpuFormatRequest(req: any, res: any, next: any){
  try{
    if (checkRequestFields((req.body), ['idMatch'])){
      let checkExistence = await game.checkElementExistence(req.body.idMatch)
      if(checkExistence){
        next();
      }else{
        res.status(400).send('La partita selezionata non esiste');
      }
    }else{
      res.status(400).send('Errore nella richiesta');
    }
  }catch(e){
    res.status(500).send(e)
  }
}

/**
 * 
 
 * @param req 
 * @param res 
 * @param next 
 * 
 * Controllo  validità valori contenuti nei campi del body della request e recupero informazioni necessarie
 * 
 */

export async function checkCpuContentRequest(req: any, res: any, next: any){
  try{    
    let info:any = await game.getGeneralInfo(req.body.idMatch);
    let parsedinfo=JSON.parse(info?.getDataValue('info')); //Recupero informazioni relative alla partita da modificare
    let playerA =info?.getDataValue('playera')
    if(parsedinfo.state=="inprogress"){ //Controllo se la partita non è terminata
      if(req.user.email == playerA && req.user.email !== parsedinfo.turn){ //controllo se l'utente che invoca la funzionalità stia giocando quella partita e che non sia il suo turno
        next();
      }else{
          res.status(403).send("Non è il turno dell'avversario o non stai partecipandoa questa partita");
      }
    }else{
      res.sendStatus(403).send("La partita è terminata");
    }
  }catch(e){
    res.status(500).send(e)
  }
  
} 

//MIDDLEWARE TERMINAZIONE PARTITA

/**
 * 
 * @param req 
 * @param res 
 * @param next 
 * Controllo che i campi contenuti nel body della request non siano diversi da quelli predefiniti.
 * Controllo che il match associato all'id selezionat esista
 *  
 */

export async function checkStopMatchFormatRequest(req: any, res: any, next: any){
  try{
    if(checkRequestFields((req.body), ['idMatch'])){ 
      let checkExistence = await game.checkElementExistence(req.body.idMatch)
      if(checkExistence){
        next();
      }else{
        res.status(400).send('La partita selezionata non esiste');
      }
    }else{
      res.status(400).send('Errore nella richiesta');
    }
  }catch(e){
    res.status(500).send(e);
  }
}

/**
 * 
 
 * @param req 
 * @param res 
 * @param next 
 * 
 * Controllo  validità valori contenuti nei campi del body della request e recupero informazioni necessarie
 * 
 */

export async function checkStopMatchContentRequest(req: any, res: any, next: any){
  try{    
    let info:any = await game.getGeneralInfo(req.body.idMatch);
    let parsedinfo=JSON.parse(info?.getDataValue('info'));
    if(parsedinfo.state=="inprogress" && (req.body.email == parsedinfo.playerA || req.body.email == parsedinfo.playerB)){ //controllo che la partita non sia finita e che l'utente che invoca la funzionalità sia uno dei due giocatori
      let statesA = await game.getGameState(req.body.idMatch,'stateplayera'); 
      let statesB = await game.getGameState(req.body.idMatch,'stateplayerb'); //Recupero le infromazioni sulle barche dei due utenri
      let amountA = calculateAmountShipAlive(JSON.parse(statesA).ships);  //Calcolo la quantità di token necessari per l'eliminazione
      let amountB = calculateAmountShipAlive(JSON.parse(statesB).ships);
      req.body.neededTokenAmount = (amountA+amountB);
      next();
    }else{
      res.status(403).send("Non è possibile eliminare la partita")
    }
  }catch(e){
      res.status(500).send(e)
    }
}

//FUNZIONALITÀ PER REALIZZAZIONE DEI MIDDLEWARES

var checkRequestFields = (body:any, fields:any):boolean=>{
  var bodyfields = Object.keys(body).map((key)=>[String(key), body[key]]);
  return bodyfields.every((f:any) => fields.includes(f[0]));
}

var calculateAmountShipAlive = (ships:any):number=>{
  ships = JSON.parse(ships);
  let n = ships.filter((s:any)=>s.cells.length>0).length;
  return n*0.005;
}

var checkMatchTypology = (type:string):boolean=>{
  if(type=='UvU' || type=='UvIA' || type=='UvBOT') return true;
  else return false
}

var checkTableDimension = (dim:number):boolean=>{
  if(dim == 10 || dim == 15 || dim == 20) return true;
  else return false;
}

var checkShipsDefinition = (dim: number, shipsamount:any[]):boolean=>{
  let sum = shipsamount.map(x => x[1]).reduce((a,b)=>a+b);
  let format = shipsamount.every((elem) => ['cacciatorpediniere','sottomarino','corazzata', 'portaerei'].includes(elem[0]) && elem[1]>0);
  return format && (dim*dim>sum*5);
}


