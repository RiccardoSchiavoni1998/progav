import * as cpufuns from "./cpuFunctions"
abstract class Cpu {
    public abstract analyzeMatch(dim:number):number[];
    public abstract makeMove(setMoves:number[], dim:number):any; 
}

class Bot extends Cpu {
    private history:any;
    public constructor(history:any){
        super();
        this.history = history;
    }
    public analyzeMatch(dim:number):number[]{
        return Array.from({ length: dim*dim }, (v, i) => v= i).filter((move)=>!this.history.includes(move));   
    }

    public makeMove(setMoves:number[], dim:number):any{
        let cell = setMoves[Math.floor(Math.random()*setMoves.length)];
        return {'cell': cell, 'outcome': 'miss'};
    }
}

class Ia extends Cpu {
    private history:any;

    public constructor(history:any){
        super();
        this.history = history;
    }
    /**
         * Funzionalità per recuperare le ultime mosse utilialla decisione 
         * */
        public analyzeMatch(dim:number){
        let allMoves = Array.from({ length: dim*dim}, (v, i) => v= i).filter((move)=>!this.history.map((cell:any)=>cell = cell.cell).includes(move)); //tra tutte le celle elimino quelle già colpite
        let outcomes=[]; //costruisco il vettore degli esiti
        if (this.history.length > 7){ //se ho effettuato piu di sette mosse prendo le ultime 8 (se si colpisce una casella e la max dimensione per una barchetta è di 5 celle, potrò sbagliare 3 volte al max prima di iniziare a prendere le altre 4)
            outcomes = this.history.map((cell:any)=>cell = cell.outcome).slice(this.history.length-8);
        }else{
            outcomes = this.history.map((cell:any)=>cell = cell.outcome); 
        }
        let index = outcomes.lastIndexOf('sunk'); //trovo tra gli ultimi k esiti, se presente, quello di una barchetta affondata
        if(index !== -1){ outcomes = outcomes.slice(index) } //prendo tutti gli esiti dopo la barchetta affondata
        index = outcomes.indexOf('hit'); //trovo tra i rimanenti il primo in cui c'stato un colpo riuscito
        if(index == -1){ //se non ci sono colpi riusciti vado a caso tra le rimanenti
           return allMoves;
        }else{//altrimenti considero quelle dopo il primo colpo colpito
            outcomes = outcomes.slice(index)
            this.history = this.history.slice(this.history.length-outcomes.length); //prendo solo le mosse d'interesse
            return allMoves;
        }   
    }

    public makeMove(setMoves:any, dim:number):any{
        let hitcell = this.history.filter((cell:any) => cell.outcome == 'hit').map((cell:any)=> cell = cell.cell).sort(); //filtro e ordino le celle che hanno avuto esito hit 
        let misscell = this.history.filter((cell:any) => cell.outcome == 'miss').map((cell:any)=> cell = cell.cell).sort();//filtro e ordino le celle che hanno avuto esito miss
        if(hitcell.length == 0){ //se non ci sono mosse positive procedo casualmente
            let cell = setMoves[Math.floor(Math.random()*setMoves.length)]
            return {'cell': cell, 'outcome': 'miss'};
        }
        else if(hitcell.length == 1){//caso in cui trovo solo una cella hit
            let neighbors = [] //creo un vettore contentente le cellule adicenti, filtrando quelle già colpite e controllando che le cellule adiadcenti non 'eccedano'
            neighbors = [cpufuns.moveleft(hitcell[0], dim), cpufuns.moveright(hitcell[0], dim), cpufuns.moveup(hitcell[0], dim), cpufuns.movedown(hitcell[0], dim)]
                    .filter((elem:any)=> !misscell.includes(elem)) //filtra mancate
                    .filter((elem:any)=> !(cpufuns.checkmoveup(elem, dim) || cpufuns.checkmovedown(elem, dim) || cpufuns.checkmoveright(elem, dim) || cpufuns.checkmoveleft(elem, dim)))
                    .filter((elem:any)=>setMoves.includes(elem))//filtra colpite
            let cell = neighbors[Math.floor(Math.random()*neighbors.length)];
            return {'cell': cell, 'outcome': 'miss'};
        }else if (hitcell.length>1){//caso in cui trovo piu celle hit
            let neighbors:any = []
            let goRight = true; //controllo se mi muovo orizzontalmente
            hitcell.reduce((accumulator:any, currentValue:any, currentIndex:any, array:any) => {
                goRight = cpufuns.moveright(array[currentIndex-1], dim) == currentValue;
            }
            , goRight);
            let goDown = true; //controllo se mi muovo verticalmente
            hitcell.reduce((accumulator:any, currentValue:any, currentIndex:any, array:any) => {
                goDown = cpufuns.movedown(array[currentIndex-1], dim) == currentValue;
            }
            , goDown);
            if(goRight){ //prendo le cellule adiacenti filtrando quelle gia colpite e che non 'eccedono'
                neighbors = [cpufuns.moveleft(hitcell[0], dim), cpufuns.moveright(hitcell[hitcell.length-1], dim)]
                .filter((elem)=> !misscell.includes(elem))
                .filter((elem)=>!(cpufuns.checkmoveleft(elem, dim)||cpufuns.checkmoveright(elem, dim)))
                .filter((elem:any)=>setMoves.includes(elem))
            }
            else if(goDown){
                neighbors = [cpufuns.moveup(hitcell[0], dim), cpufuns.movedown(hitcell[hitcell.length-1], dim)]
                .filter((elem)=> !misscell.includes(elem))
                .filter((elem)=>!(cpufuns.checkmoveup(elem, dim)||cpufuns.checkmovedown(elem, dim)))
                .filter((elem:any)=>setMoves.includes(elem))
            }
            if(neighbors.length>0){
                let cell = neighbors[Math.floor(Math.random()*neighbors.length)]
                return {'cell': cell, 'outcome': 'miss'};
            }else{
                let cell = setMoves[Math.floor(Math.random()*setMoves.length)]
                return {'cell': cell, 'outcome': 'miss'};
            }

        }
    }
}

abstract class CpuWorkFlow{
    public abstract moveMaker(dimension:number, history:string): any;
}

class IaWorkFlow implements CpuWorkFlow{
    public moveMaker(dimension: number, history: string) {
        var ia = new Ia( JSON.parse(history));
        let setMoves = ia.analyzeMatch(dimension);
        return ia.makeMove(setMoves, dimension);
    }
}

class BotWorkFlow implements CpuWorkFlow{
    public moveMaker(dimension: number, history: string) {
        var bot = new Bot( JSON.parse(history));
        let setMoves = bot.analyzeMatch(dimension);
        return bot.makeMove(setMoves, dimension);
    }
}
//abstract class abstractMoveMaker()
export class MoveMaker{
    public move(dimension:number, cpu:string, history:string):any{
        if(cpu=="IA"){
            var iaWorkFlow = new IaWorkFlow();
            return iaWorkFlow.moveMaker(dimension, history);
        }
        else if (cpu == "BOT"){
            var botWorkFlow = new BotWorkFlow();
            return botWorkFlow.moveMaker(dimension, history);
        }
    }
}
