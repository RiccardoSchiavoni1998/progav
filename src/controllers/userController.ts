import { nextTick } from "process";
import * as user from "../models/userModel";


export class UserController{

    /**
     * 
     * @param req 
     * @param res 
     * @param next +
     * Funzionaità per ricaricare e scalare i token di un determinato utente
     */
    
    public rechargeFuntokensAmount = async(req:any,res:any)=>{
        try{
            const tokenAmount = await user.getFuntokensAmount(req.body.player);
            let newTokenAmount = tokenAmount?.getDataValue('funtoken')+req.body.token;
            let result = await user.setFuntokensAmount(req.body.player, newTokenAmount);
            if(result){
                res.status(200).send('Token caricati correttamente')
            }else{
                res.status(404).send("Non è possibile eseguire l'operazione richiesta")
            }
        }catch(e){
            res.status(500).send(e);
        }
    }

    public dischargeFuntokensAmount = async(req:any,res:any, next:any)=>{
        try{
            let result = await user.setFuntokensAmount(req.user.email, req.body.newTokenAmount);
            if(result!==null){
                res.status(200);
            }else{
                res.status(404).send("Non è possibile eseguire l'operazione richiesta");
            }
        }catch(e){
            console.log(e)
        }
    }
}