

export class GameModifier{
    private ships:any;
    private history:any;

    constructor(){
    }
    /**
    * Cambio lo stato del gioco nel caso in cui la partita sia finita
    */
    public stopGame(info: any){
        info.winner = "";
        info.turn = "";
        info.state = "game over";
    }
    
    /** 
     * Funzionalità per parsare gli oggetti che vengono copiati all'interno dell'oggetto
    */
    public setModifyMode(){
        this.ships = JSON.parse(this.ships);
        this.history = JSON.parse(this.history);
    }

    /**
     * 
     * @param generalinfo 
     * @returns 
     * 
     * Funzionalità per cambiare lo stato generale di una partita:
     * Nel caso non ci sono più barchette, la partita è finita. Viene registrato il vincitore e viene cambiato lo stato della partita.
     * Altrimenti viene aggiornato il turno
     */

    public changeInfo(generalinfo: any):any{
        let nShipsAlive = this.ships.filter((ship:any)=>ship.cells.length>0).length;
        if (nShipsAlive==0){
            generalinfo.info.winner = generalinfo.info.turn;
            generalinfo.info.turn = "";
            generalinfo.info.state = "game over";
        }else{
            if(generalinfo.info.turn == generalinfo.playera){
                    generalinfo.info.turn = generalinfo.playerb;
            }else{
                generalinfo.info.turn  = generalinfo.playera;
            }
        }
        return JSON.stringify(generalinfo.info);
    }
    /**
     * 
     * @param c 
     * @returns 
     * 
     * Funzionalità per controllare se una mossa è già stata effettuata
     */
    public validateMove(c:any):boolean{
        if(this.history.length>0){
            let l = this.history.filter((e:any)=> e.cell == c).length;
            if(l>0){
                return false;
            }else{
                return true;
            }
        }else{
            return true;
        }
    }


    /**
     * 
     * @param cell 
     * @returns 
     * Funzionalità per controllare esito mossa
     */
    public makeMove(cell:number):string{
        let index = this.ships.findIndex((element:any) => element.cells.includes(cell) ); //controllo se una delle barchette occupa cella selezionata
        if(index>-1){
            let cells = this.ships[index].cells.filter((e:any)=>e!=cell); //se la trovo rimuovo la cella dal campo celle della barchetta in questione 
            this.ships[index].cells=cells;
            if(cells.length==0){
                return 'sunk';
            }else{
                return 'hit';
            }
        }else{
            return 'miss';
        }
    }

    public registerMove(cell:any){
        this.history.push(cell)
    }

    public getModifies(){
        return JSON.stringify({'ships':JSON.stringify(this.ships), 'history':JSON.stringify(this.history)});
    }
}