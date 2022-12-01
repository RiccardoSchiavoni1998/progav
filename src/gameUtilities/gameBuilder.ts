

export class GameBuilder{
    private dimension!:number;
    private shipsamount!:any;
    private matrix!:any;
    private shipVector!:any;

    constructor(){
        this.shipVector = []
    }
    public getInitializedPlayerState():{[key:string]: string}{
        return {
            "ships":JSON.stringify(this.shipVector),
            "history": JSON.stringify([])
        }
    }
    
    /**
     * Creazione Matrice iniziale
     * Agnuna delle barchette vengono assegnate randomicamente n caselle, dove n è la dimensione della barchetta
     * 
     */
    public initializePlayerNewMatch(){
        this.setInitialMatrix();
        this.shipsamount.forEach((value:any) =>{ // ogni elemento di shipsamount corrisponde ad una barchetta : contiene tipologia (posizione 0), numero pezzi scelti(posizione)
            for(let i=0; i<value[1]; i++){
                let result = []
                do{                                        // per ogni pezzo di ogni topologia di barchetta
                    result = this.getRandomCells(value[0]); // prendo n celle tra quelle non selezionate nei cicli precedenti
                }while(result.includes('-1'));
                result.forEach(e=>this.matrix[e]=true) //imposto come selezionate le celle appena selezionate
                this.shipVector.push({'name':value[0], 'cells':result});
            }
        });
    }
    
    /**
     * Creazione matrice iniziale per disposizione randomica con tutti i valori selezionati a false.
     * La dimenzione viene specificata in fase di creazione
     */

    setInitialMatrix(){
        this.shipVector = []
        this.matrix = Array.from({ length: this.dimension }, (_, i) => i)
                .map(x => Array.from({ length: this.dimension }, (v:boolean)=>v=false))
                .reduce((prev, current)=> prev.concat(current));
    }

     /**
     * Funzionalità per indicare la dimensione di ogni tipologia di barchetta
     */

    setShipDimension(name:string): number{
        switch (name){
            case 'cacciatorpediniere':{
                return 2
            }
            case 'sottomarino':{
                return 3
            }
            case 'incrociatore':{
                return 3
            }
            case 'corazzata':{
                return 4
            }
            case 'portaerei':{
                return 5
            }
            default:{
                return 0
            }
        }
    }


    /**
     * 
     * @param name 
     * @returns 
     * 
     * Funzionalità per assegnare n celle adiacenti (secondo la logica del gioco) ad una barchetta
     */
    getRandomCells(name: string){
        let dimension: number = this.setShipDimension(name);
        let gradientX = Math.floor(Math.random()*2); //scelgo se aumenta lungo x (riga)
        let gradientY = 1-gradientX; //scelgo se aumenta lungo y (colonna)
        let initial = 0;
        do{initial = Math.floor(Math.random()*this.matrix.length);} //seleziono randomicamente uno degli elementi della matrice
        while(this.matrix[initial]);                                //finchè non ne trovo uno non assegnato
        let initialY= initial%10; //prendo colonna cella iniziale 
        let initialX = Math.floor((initial/10)%10); // prendo riga cella iniziale
        let cells:any[] = []

        for(let k=0; k<dimension; k++){//DISPONGO NAVE NELLA TABELLA
            let xaux=0
            let yaux=0;
            if(gradientX&&(initialX+(k*gradientX)>=this.dimension)){                      //controllo nel caso in cui sto sforando.
                xaux=1                                                                    //Esempio: sto posizioando vericalmente una barchetta (di dim 5)
            }                                                                             //ho occupato cell 48 e 49 la cella adiacente in teoria è la 50 
            else if(gradientY&&(initialY+(k*gradientY)>=this.dimension)){                 //Ma per la logica del gioco la cella 50 corrisponde a riga 5, colonna 0
                yaux = 1                                                                  //e non è adiacente alla 2 precedenti, quindi assegno la 45, poi 46, poi 47
            }
            if (this.matrix[(initialX+(k*gradientX)-dimension*xaux)*10+(initialY+(k*gradientY)-(dimension*yaux))]){ 
                cells.push('-1') //Controllo se c'è collisione con una delle celle precedentemente assegnate e inserisco "-1" per ripetere assegnazione
            }else{
                cells.push((initialX+(k*gradientX)-dimension*xaux)*10+(initialY+(k*gradientY)-(dimension*yaux)));
            }//ogni ciclo cresce gradientX o gradientY (a seconda se la sto disponendo verticalmente o orizzontalmente)
                //xaux o y aux mi dice se devo effettuare la correzione
        }
        return cells;
    }
    
    
    

}