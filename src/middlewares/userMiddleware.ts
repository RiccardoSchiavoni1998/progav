import * as user from '../models/userModel'

//CONTROLLO SE UTENTE DI RUOLO 0 (UTENTE SEMPLICE)
export async function checkUserRole(req:any, res:any, next:any){
    if(req.user.role==0){
        next();
    }else{
        res.sedStatus(403);
    }
}

//CONTROLLO SE UTENTE È DI RUOLO 1 (ADMIN)
export async function checkAdminRole(req:any, res:any, next:any){
    if(req.user.role==1){
        next();
    }else{
        res.sendStatus(403);
    }
}

export async function checkAdminFormatRequest(req: any, res: any, next: any){
    if(checkRequestFields((req.body), ['token', 'player'])){ 
        next();
    }else{
        res.status(400).send('Errore nella richiesta');
    }
  }

//CONTROLLE SE UTENTE È REGISTRATO NEL DATABASE
export async function checkUserExistence (req:any, res:any, next:any){
    try{
        if((req.body.typology == "UvU") || (req.user.role==1)){
            const result= await user.getUser(req.body.player);
            if(result?.getDataValue('email')==req.body.player){
                next();
            }else{
                res.status(400).send("Utente scelto non esiste");
            }
        }else{
            next();
        }
    }catch(e){
        res.status(500).send(e);
    }
}



//CONTROLLE QUANTITÀ TOKEN ASSOCIATI ALL'UTENTE
export async function checkUserTokenAmount(req:any, res:any, next:any){
    try{
        const result = await user.getFuntokensAmount(req.user.email);
        if(result?.getDataValue('funtoken')>req.body.neededTokenAmount){
            req.body.newTokenAmount = result?.getDataValue('funtoken')-req.body.neededTokenAmount;
            next();
        }else{
            res.status(403).send("Token insufficienti")
        }
    }catch(e){
        res.status(500).send(e);
    }
}

var checkRequestFields = (body:any, fields:any):boolean=>{
    var bodyfields = Object.keys(body).map((key)=>[String(key), body[key]]);
    return bodyfields.every((f:any) => fields.includes(f[0]));
  }