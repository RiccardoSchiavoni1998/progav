Programmazione Avanzata 
Schiavoni Riccardo 1108426

## SPECIFICHE

[](https://linktodocumentation)

Si chiede di realizzare un back-end utilizzando i seguenti framework / librerie:

•	Node.JS

•	Express

•	Sequelize

•	RDBMS a scelta dello studente (es. Postgres, MySQL, sqlite,…)


Descrizione del progetto:

Si realizzi un sistema che consenta di gestire il gioco della battaglia navale.
In particolare, il sistema deve prevedere la possibilità di far interagire due utenti (autenticati mediante JWT) o un utente contro l’elaboratore.
Ci possono essere più partite attive in un dato momento. 
Un utente può allo stesso tempo partecipare ad una ed una sola partita.
Si chiede di sviluppare anche la possibilità di giocare contro l’elaboratore (di seguito IA).
Nel caso di IA la logica può essere semplice (mosse randomiche) o tenere in considerazione lo storico delle mosse

•	Dare la possibilità di creare una nuova partita specificando (codifica a scelta dello studente):

    • Tipologia: utente contro utente o utente contro IA
    • Dimensione della griglia (es. 20x20)
    • Numero e tipologie delle imbarcazioni (tipo 1: dimensione 3 caselle,…)
    • L’allocazione delle imbarcazioni è randomica (fatta all’atto della creazione).
    • email dell’avversario che sarà usata poi per autenticare le richieste mediante token JWT 
    (solo nel caso di partita utente contro utente).

•	Per ogni partita viene addebitato un numero di token in accordo con quanto segue:
   
    •	0.40 all’atto della creazione
    •	0.01 per ogni mossa da parte degli utenti (anche IA)
    •	Il modello può essere creato se c’è credito sufficiente ad esaudire la richiesta 
    (se il credito durante la partita scende sotto lo zero si può continuare comunque).

• Creazione Rotte    
    
    •	Creare la rotta per effettuare una mossa in una data partita verificando se questa è ammissibile o meno
    •	Creare una rotta per valutare lo stato di una data partita (di chi è il turno, se è terminata, vincitore,…)
    •	Creare una rotta per restituire lo storico delle mosse di una data partita in formato JSON
    •	Creare una rotta per interrompere una partita; 
    (in tal caso il giocatore perde un importo pari a 0.005 * il numero totale di imbarcazioni ancora in gioco)
    •   Le richieste devono essere validate (es. utente che scelga un evento che non esistente).
    •   Ogni utente autenticato (ovvero con JWT) ha un numero di token (valore iniziale impostato nel seed del database). 
        Nel caso di token terminati ogni richiesta da parte dello stesso utente deve restituire 401 Unauthorized. 
    •   Prevedere una rotta per l’utente con ruolo admin che consenta di effettuare la ricarica per un utente 
    fornendo la mail ed il nuovo “credito” (sempre mediante JWT). I token JWT devono contenere i dati essenziali.

• Il numero residuo di token deve essere memorizzato nel db sopra citato.

• Si deve prevedere degli script di seed per inizializzare il sistema.

• Si chiede di utilizzare le funzionalità di middleware.

• Si chiede di gestire eventuali errori mediante gli strati middleware sollevando le opportune eccezioni.

• Si chiede di commentare opportunamente il codice.

• Note:
Nello sviluppo del progetto è richiesto l’utilizzo di Design Pattern che dovranno essere documentati opportunamente nel Readme.MD. 
È preferibile una implementazione in typescript.
I token JWT da usare possono essere generati attraverso il seguente link: https://jwt.io/  
La chiave privata da usare lato back-end deve essere memorizzata un file .env e caricata mediante la libreria 

## IMPLEMENTAZIONE

## Casi d'uso 
    Le funzionalità implementate si dividono in 2 Gruppi
    • Funzioni utente
        • Creare una nuova partita
        • Modificare una partita esistente (eseguire una mossa)
        • Vedere la mossa del dell'IA/BOT (se si sta giocando contro IA/BOT)
        • Stoppare una partita esistente
        • Vedere le informazioni relative ad una partita esistente
    • Funzioni admin
        • Ricaricare i token dell'utente

![Casi d'uso](/imgReadme/casiduso.jpeg)

## Utilizzo Pattern e organizzazione del codice
    La classi del codice sono state organizzate secondo la logica del pattern MVC abbinata all'utilizzo dei middlewares.
    Ogni richiesta degli utenti autenticati viene prima validata dalle funzioni dei due middleware (GameMiddleware e UserMiddleware),
    poi elaborata dai due controller (UserController e GameController) 
    e infine i risultati vengono processati dai model (UserModel e GameModel).

    In particolare:
      •GameMiddleware: verifica che la forma e il contenuto delle richieste siano conformi alla logica del gioco.
      •UserMiddleware: verifica che le informazioni sugli utenti, contenute nelle richieste siano valide. 
      •GameController: si occupa di elaborare le richieste di creazione, modifica, elminazione e visualizzazione di una data partita.
      •UserController: si occupa di gestire i dati realtivi all'utente.

    Per quanto riguarda i due model essi rappresentano le astrazioni logiche delle due relazioni contenute nel database.
      •UserModel:
            Campi:  - email (chiave primaria)
                    - funtoken (quantità di token posseduti dall'utente)
      •GameModel:
            Campi:  - id (chiave primaria, autogenereata).
                    - typology (tipologia della partita: 'UvU', 'UvIA', 'UvBOT').
                    - playera (mail dell'utente che ha creato la partita).
                    - playerb (mail dell'utente sfidato).
                    - stateplayera (contiene lo storico delle mosse di playera e le celle delle barchette di playerb).
                    - stateplayerb (contiene lo storico delle mosse di playera e le celle delle barchette di playerb).          
    Altre classi sono:
        •GameBuilder: contiene tutti i metodi per inizializzare e configurare una nuova partita.
        •GameModifier: contiene tutti i metodi per validare ed effettuare le modifiche sullo stato di una partita esistente.
        •Cpu: classe atratta da cui ereditano la classe Ia e la classe Bot, queste implementano i metodi della classe cpu.
        •MoveMaker: classe che invoca, a seconda della tipologia della partita, la classe Ia o la classe Bot.

## Token JWT
    Ogni utente che effettua una richiesta deve essere validato tramite jwt (json web token), di seguito un esempio di token:

    Il payload contiene la mail e il ruolo dell'utente da autenticare.
    Il controllo della validità del token è affidati alla classe jwtMiddleware, 
    essa infatti estrae il token cifrato contenuto nell'header della request
    e lo decifra con la chiave conenuta nel file .env 

    esempio di payload utilizzato per il token jwt:
        {
            "iss": "",
            "iat": 1669837971,
            "exp": 1701373971,
            "aud": "",
            "sub": "",
            "email": "user1@genericmail.com",
            "role": 0
        }
                    
## Funzionalità

• /createGame

    Creazione di una nuova partita, il corpo della richiesta associata a questa richiesta dovrà contenere i seguenti campi:
        {
            "typology": "UvU",
            "dimension": 10,
            "player": "user2@genericmail.com",
            "shipsamount": {
                "cacciatorpediniere": 3,
                "sottomarino": 2,
                "corazzata": 2,
                "portaerei": 1
            }
        }


    La richiesta verrà validata innanziatutto dalle classi GameMiddleware e UserMiddleware, esse controllano:
        • Campi contenuti sono quelli richiesti
        • Valore dei campi sia conforme con le regole del gioco.
        • Utente sfidato esista.
        • Utente sfidante abbia una quantità di token necessaria alla creazione di una nuova partita.
    
    In seguito GameController costruisce gli stati iniziali dei due giocatori mediante le funzionalità di GameBuilder:
        • setta un vettore pari al quadrato della dimensione specificata nella richiesta.
        • per ogni barchetta assegna randomicamente n celle del vettore iniziale (n è la dimensione di una tipologia di barchetta)
            (assegnazione senza ripetizione).
        • ritorna uno storico mosse vuoto e lo stato iniziale della partita.
    
    Infine viene creato il modello e viene scalata all'utente la quantità di token prestabiliti.
    
   ![Creazione](/imgReadme/create.jpeg)


• /modifyGame


    Modifica di una partita esistente, il corpo della richiesta associata a questa richiesta dovrà contenere i seguenti campi:
        
        {
            "idMatch": 2,
            "cell": 56
        }

    La richiesta verrà validata innanziatutto dalle classi GameMiddleware e UserMiddleware, esse controllano:
        • Campi contenuti sono quelli richiesti.
        • Valore dei campi sia conforme con le regole del gioco.
        • Match selezionato esiste ed è il turno dell'utente.
        • Utente abbia una quantità di token per effettuare una nuova mossa.

    In seguito GameController dopo aver recuperato le informazioni generali e sullo stato della partita del giocatore
    mediante la classe game modifier esegue le seguenti operazioni:
        • Controlla se la mossa è già stata eseguita (è presente nel campo history di state player).
        • Nel caso sia una nuova mossa controlla (nel campo ships di state player) se c'è una barchetta che occupa quella cella.
        • La cella colpita e l'esito del colpo vengono registrate.
        • Viene cambiato il turno.
        • Nel caso in cui l'utente abbia colpito tutte le celle dell'avversario lo stato della partita viene cambiato a 'game over'.
    
    L'elemento nel database viene aggiornato e viene scalata all'utente la quantità di token prestabiliti. 
    Infine viene creato il modello e viene scalata all'utente la quantità di token prefissati.
    
   ![Modifica](/imgReadme/modify.jpeg)

• /cpu

    Modifica di una partita da parte della cpu, il corpo della richiesta associata a questa richiesta dovrà contenere i seguenti campi:
 
    {
        "idMatch": 1
    }

    Per questa funzionalità verrà descritta soltanto una parte della sequenza di eventi, il resto è analogo al caso d'uso precedente.
    Questa funzionalità viene attivata solo nel caso in cui l'utente stia giocando contro un bot (random) o contro un'ia(memoria)
    Entrambe implementano la classe astratta Cpu e i loro metodi sono richiamati da altre due classi , 
    rispettivamente IaWorkFlow e BotWorkflow le quali implementano la classe CpuWorkFlow.

    Caso in cui la tipologia della partita sia 'UvBot':
        •MatchAnalyzer: crea un vettore con una dimensione pari al numero di celle e in seguito filtra tutte quelle già colpite.
        •MakeMove: seleziona randomicamente un elemento dal vettore.
    
    Caso in cui la tipologia della partita sia 'UvIa':
        •MatchAnalyzer: -crea un vettore con una dimensione pari al numero di celle e in seguito filtra tutte quelle già colpite.
                        -filtra lo storico delle mosse considerando solo quelle successive all'ultimo esito 'affondato'.
                        -filtra ulteriormente lo storico delle mosse considerando solo quelle successive al primo 'colpito'
        •MakeMove:  -nel caso in cui lo storico filtrato sia vuoto seleziona randomicamente un elemento dal vettore delle celle. 
                    -nel caso in cui lo storico filtrato contenga solo un elemento 'colpito' si seleziona una delle celle adiacenti.
                    -nel caso in cui lo storico filtrato  piu di un elemento 'colpito' si seleziona una delle celle adiacenti
                    (cercando di capire la disposizione della barchetta).
     
   ![Cpu](/imgReadme/cpu.jpeg)
     
• /stopGame

    Terminazione di una partita esistente, il corpo della richiesta associata a questa richiesta dovrà contenere i seguenti campi:
   
    {
        "idMatch": 1
    }

    La richiesta verrà validata innanziatutto dalle classi GameMiddleware e UserMiddleware, esse controllano:
        • Campi contenuti sono quelli richiesti
        • Valore dei campi sia conforme con le regole del gioco.
        • Match selezionato esiste ed l'utente sta partecipando a quella partita.
        • Utente abbia una quantità di token per effettuare una nuova mossa.
    
    In seguito GameController dopo aver recuperato le informazioni generali e sullo stato della partita del giocatore
    mediante la classe game modifier esegue le seguenti operazioni
        • Lo stato della partita viene cambiato a 'game over'.
        • L'elemento nel database viene aggiornato e viene scalata all'utente la quantità di token prestabiliti. 
    
    L'elemento nel database viene aggiornato e viene scalata all'utente la quantità di token prestabiliti. 
    
  ![Stop](/imgReadme/cpu.jpeg)

• /getMatchInfo , /getMatchHistory , /getShips

    Le tre funzionalità hanno una sequenza di eventi analoga per cui verranno descritte generalizzando all'unica funzione get:

    Get partita esistente, il corpo della richiesta associata a questa richiesta dovrà contenere i seguenti campi:
  
    {
        "idMatch": 1
    }
    
        • La classe GameMiddleware controlla se l'utente che effettua la richiesta è uno dei due giocatori.
        • Vengono restituite le informazioni richieste

  ![Info Match](/imgReadme/get.jpeg)
  
• /rechargeToken

    Funzionalità utilizzata dall'admin per ricarica i token degli utenti di livello 0

    Get partita esistente, il corpo della richiesta associata a questa richiesta dovrà contenere i seguenti campi:
  
    {
        "token":10,
        "player":"user3@genericmail.com"
    }
    
        • La classe UserMiddleware controlla il ricevente esiste.
        • I token vengono aggiunti alla quantità già posseduta.

   ![Ricarica Token](/imgReadme/adnim.jpeg)

## RDBMS
Per quanto riguarda la classe che realizza la connessione con la base dati dove sono memorizzati gli utenti,
essa è stata realizzata utilizzando il pattern singleton.
In questo modo l'oggetto connessione è unico per tutta la sessione, evitando cosi potenziali conflitti.

## DOCKER
    • Creare file .env creando la variabile SECRET_KEY con valore mysecretkey.
    • Posizionarsi nella cartella contenente il dockerfile e utilizzare il comando docker-compose up
    • Il database sarà inizializzato con 3 utenti livello 0 (User) e uno di livello 1 (Admin)
        • user1@genericmail.com (con 20 token)
        • user2@genericmail.com (con 10 token)
        • user3@genericmail.com (con 0 token)
        • admin@genericmail.com

