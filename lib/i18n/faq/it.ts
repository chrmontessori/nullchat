import type { FaqKey } from "../faq-translations";

export const it: Record<FaqKey, string> = {
  faq_1_title: "Cos'è nullchat?",
  faq_1_body: `nullchat è una chat room anonima, crittografata end-to-end, che non richiede account, email, numeri di telefono né informazioni personali di alcun tipo. Inserisci un segreto condiviso — una password — e chiunque altro inserisca la stessa password entra nella stessa stanza. Tutto qui.`,
  faq_2_title: "Come entro in una stanza?",
  faq_2_body: `Tu e la persona con cui vuoi parlare concordate in anticipo un segreto condiviso — di persona, al telefono, come preferite. Entrambi digitate quel segreto in nullchat e vi trovate nella stessa stanza crittografata. Non esiste un elenco di stanze, nessuna directory, nessun modo per navigare. Se non conosci il segreto, la stanza per te non esiste.`,
  faq_3_title: "Come scelgo un segreto condiviso?",
  faq_3_body: `Il tuo segreto condiviso è l'elemento più importante della tua sicurezza. È sia la chiave della tua stanza che la chiave della tua crittografia — se qualcuno lo indovina, può leggere tutto. Trattalo come la combinazione di una cassaforte.

Scegli qualcosa di lungo, casuale e impossibile da indovinare. Un segreto forte è composto da almeno 5–6 parole casuali o più di 20 caratteri misti. Evita nomi, date, frasi comuni, testi di canzoni o qualsiasi cosa che qualcuno potrebbe trovare sui tuoi social media. Non riutilizzare mai un segreto in conversazioni o stanze diverse.

Condividi il tuo segreto attraverso un canale sicuro fuori banda — di persona è la cosa migliore. Una telefonata è accettabile. Non inviarlo mai via SMS, email, messaggio diretto o su qualsiasi piattaforma che registra i messaggi. Se sospetti che un segreto sia stato compromesso, smetti immediatamente di usarlo e concordane uno nuovo attraverso un canale sicuro.

L'indicatore di robustezza nella schermata di ingresso ti dà un'idea approssimativa di quanto il tuo segreto sia resistente agli attacchi di forza bruta, ma nessun indicatore sostituisce il buon senso. Nel dubbio, rendilo più lungo e più casuale.`,
  faq_4_title: "Come funziona la crittografia?",
  faq_4_body: `Quando inserisci il tuo segreto condiviso, due cose accadono interamente nel tuo browser:

1. Il segreto viene elaborato tramite Argon2id — una funzione di derivazione della chiave ad alto consumo di memoria — utilizzando un salt separato per dominio per produrre un ID stanza. Questo hash viene inviato al server affinché sappia a quale stanza connetterti. Il server non vede mai il tuo segreto effettivo.

2. Il segreto viene sottoposto a una seconda derivazione Argon2id indipendente (64 MiB di memoria, 3 iterazioni) per produrre una chiave di crittografia a 256 bit. Questa chiave non lascia mai il tuo browser. Argon2id richiede grandi blocchi di RAM per ogni tentativo, rendendo gli attacchi di forza bruta con GPU e ASIC sulla tua password di ordini di grandezza più difficili rispetto ai KDF tradizionali.

Ogni messaggio che invii viene crittografato con NaCl secretbox (XSalsa20-Poly1305) utilizzando quella chiave prima di lasciare il tuo dispositivo. Il server riceve, memorizza e inoltra solo testo cifrato — blocchi crittografati privi di significato senza la chiave. Non possiamo leggere i tuoi messaggi. Nessuno può, a meno che non conosca il segreto condiviso.`,
  faq_5_title: "Cosa vede il server?",
  faq_5_body: `Il server vede:
• Un hash derivato da Argon2id (l'ID stanza) — non la tua password
• Blocchi di testo cifrato crittografato — non i tuoi messaggi
• Il numero di connessioni attive in una stanza
• I timestamp di ricezione dei blocchi crittografati

Il server NON vede:
• Il tuo segreto condiviso / password
• Il contenuto dei tuoi messaggi
• La tua identità o nome utente (gli alias sono crittografati all'interno dei messaggi)
• Il tuo indirizzo IP (rimosso al bordo della rete dal nostro provider di hosting)`,
  faq_6_title: "Cos'è il padding dei messaggi?",
  faq_6_body: `Prima della crittografia, ogni messaggio viene imbottito fino a un blocco fisso di 8.192 byte utilizzando un prefisso di lunghezza di 2 byte seguito dal contenuto del messaggio e rumore casuale. Ciò significa che un messaggio breve come "ciao" produce un testo cifrato esattamente della stessa dimensione di un messaggio alla lunghezza massima. Senza il padding, un osservatore potrebbe indovinare il contenuto del messaggio in base alla lunghezza del testo cifrato. Il riempimento con rumore casuale (non zeri) garantisce che non ci siano pattern distinguibili nel testo in chiaro prima della crittografia. Il padding elimina completamente questo canale laterale.`,
  faq_7_title: "Cos'è l'offuscamento dei timestamp?",
  faq_7_body: `I timestamp inclusi nei messaggi vengono arrotondati al minuto più vicino prima della crittografia. Ciò impedisce attacchi di correlazione temporale in cui un osservatore potrebbe abbinare i pattern dei messaggi tra diversi canali confrontando i timestamp esatti.`,
  faq_8_title: "Quanto durano i messaggi?",
  faq_8_body: `I messaggi utilizzano un sistema di timer a livelli:

• Dead drop (primo messaggio): Un messaggio resta crittografato sul server per un massimo di 24 ore, in attesa di una risposta. Il mittente può uscire e tornare a controllarlo senza attivare alcun conto alla rovescia. Il semplice ingresso nella stanza non brucia il messaggio.

• Entrambi gli utenti presenti: Quando una seconda persona entra nella stanza, tutti i messaggi non letti iniziano immediatamente un conto alla rovescia di 5 minuti prima della distruzione. Ogni nuovo messaggio inviato mentre entrambi gli utenti sono presenti si autodistrugge anch'esso in 5 minuti. Non è richiesta alcuna azione — la sola presenza conferma che il messaggio viene letto.

• Pulsante Ricevuto: Se raccogli un messaggio dead drop mentre sei solo nella stanza, puoi premere il pulsante "Ricevuto" per confermare manualmente la ricezione e avviare la distruzione in 5 minuti. Questo pulsante appare solo una volta — durante il ritiro iniziale del dead drop — e non è disponibile durante le conversazioni attive.

• Conversazione attiva: Una volta che nella stanza ci sono state risposte, i messaggi successivi hanno una finestra di 6 ore se il destinatario non è presente. Se entrambi gli utenti sono connessi, i messaggi si autodistruggono in 5 minuti automaticamente.

• Limite massimo: Qualsiasi messaggio non letto viene eliminato dopo la scadenza del timer (24 ore per i dead drop, 6 ore per i messaggi attivi) indipendentemente dal fatto che sia stato confermato.

Non esiste archivio, nessun backup, nessun modo per recuperare un messaggio eliminato.`,
  faq_9_title: "Cos'è il dead drop?",
  faq_9_body: `nullchat funziona come un dead drop digitale. Nel tradizionale mestiere dell'intelligence, un dead drop è un metodo per passare informazioni tra due persone senza che debbano mai incontrarsi o trovarsi nello stesso posto allo stesso momento. nullchat funziona allo stesso modo.

Inserisci il segreto condiviso, lasci un messaggio crittografato e ti disconnetti. Il messaggio resta sul server — crittografato e illeggibile da chiunque, noi compresi — per un massimo di 24 ore. Il tuo contatto inserisce lo stesso segreto quando è pronto e ritira il messaggio. Quando il destinatario entra ed entrambi gli utenti sono presenti, tutti i messaggi in attesa iniziano immediatamente un conto alla rovescia di 5 minuti — la sola presenza è la prova della ricezione. Se il destinatario ritira il messaggio mentre è solo, può premere il pulsante una tantum "Ricevuto" per confermare manualmente la ricezione e avviare la distruzione, oppure semplicemente rispondere. Una volta avviata la distruzione, il messaggio viene permanentemente eliminato dopo 5 minuti.

Il mittente può riconnettersi in sicurezza in qualsiasi momento per verificare se il messaggio è ancora in attesa — senza attivare alcun conto alla rovescia, purché sia l'unica persona nella stanza. Nessuna delle due parti deve essere online contemporaneamente. Nessuna delle due parti ha bisogno di un account. Nessuna delle due parti è identificabile. Il server non sa mai chi ha lasciato il messaggio né chi l'ha ritirato — sa solo che un blocco crittografato è stato memorizzato e successivamente recuperato. Dopo la distruzione, non c'è alcuna prova che lo scambio sia mai avvenuto.`,
  faq_10_title: "Quanto durano le stanze?",
  faq_10_body: `Una stanza esiste finché ha connessioni attive o messaggi non scaduti. Una volta che l'ultima persona si disconnette e tutti i messaggi sono scaduti o distrutti, la stanza scompare. Non esiste uno stato persistente della stanza. Se non vengono mai inviati messaggi, la stanza è solo una connessione attiva — nulla viene memorizzato e svanisce nel momento in cui tutti la abbandonano.`,
  faq_11_title: "Cos'è il pulsante Termina?",
  faq_11_body: `Termina elimina immediatamente dal server ogni messaggio che hai inviato durante la sessione corrente per tutti nella stanza. Gli altri partecipanti vedranno i tuoi messaggi scomparire dal loro schermo in tempo reale. Successivamente verrai disconnesso dalla stanza. Usalo se hai bisogno di uscire senza lasciare traccia.`,
  faq_12_title: "Cos'è il pulsante Esci?",
  faq_12_body: `Esci semplicemente ti disconnette dalla stanza. I tuoi messaggi rimangono sul server — i messaggi non letti continuano ad attendere (fino a 24 ore) e i messaggi già letti continuano il loro conto alla rovescia di 5 minuti. Se rientri nella stanza più tardi, riceverai un nuovo alias casuale — non c'è modo di collegare la tua vecchia e nuova identità.`,
  faq_13_title: "Cosa sono gli alias casuali?",
  faq_13_body: `Quando entri in una stanza, ti viene assegnato un codice esadecimale casuale di 8 caratteri (come "a9f2b71c") come alias. Questo alias viene generato nel tuo browser, crittografato all'interno di ogni messaggio e non viene mai inviato al server in chiaro. Se ti disconnetti e ti riconnetti, ricevi un nuovo alias. Non c'è modo di riservare, scegliere o mantenere un alias.`,
  faq_14_title: "C'è un limite di partecipanti?",
  faq_14_body: `Ogni stanza supporta fino a 50 connessioni simultanee. Se la stanza è piena, vedrai un messaggio "La stanza è piena". Questo limite esiste per mantenere le stanze intime e prevenire abusi.`,
  faq_15_title: "C'è un limite di frequenza?",
  faq_15_body: `Sì. Ogni connessione è limitata a 1 messaggio al secondo. Ciò previene lo spam e gli abusi senza richiedere alcuna verifica dell'identità. Se invii messaggi troppo rapidamente, vedrai un breve avviso "Rallenta".`,
  faq_16_title: "Posso accedere a nullchat tramite Tor?",
  faq_16_body_1: `nullchat è disponibile come servizio nascosto Tor per gli utenti in regioni censurate o per chiunque desideri un ulteriore livello di anonimato. Apri il Tor Browser e naviga su:`,
  faq_16_body_2: `Per impostazione predefinita, sia la versione clearnet che quella Tor si connettono allo stesso backend — gli utenti di entrambe possono comunicare tra loro nelle stesse stanze utilizzando lo stesso segreto condiviso. Il servizio .onion instrada il traffico attraverso la rete Tor senza Cloudflare, nessun CDN e nessuna infrastruttura di terze parti tra te e il server. Tor instrada la tua connessione attraverso molteplici relay crittografati, quindi né il server né alcun osservatore può determinare il tuo vero indirizzo IP o la tua posizione. Il servizio .onion utilizza HTTP semplice, il che è previsto e sicuro — Tor stesso fornisce crittografia end-to-end tra il tuo browser e il server. Tutta la stessa crittografia a livello applicativo (NaCl secretbox, derivazione della chiave Argon2id) si applica sopra di essa. Nota: il Tor Browser deve essere impostato sul livello di sicurezza "Standard" affinché nullchat funzioni, poiché l'applicazione richiede JavaScript.`,
  faq_17_title: "Cos'è una stanza solo Tor?",
  faq_17_body: `Quando accedi a nullchat attraverso il servizio nascosto .onion, hai l'opzione di abilitare "Stanza solo Tor" — un interruttore che appare nella schermata di inserimento della password. Quando è abilitato, la tua stanza viene collocata in uno spazio dei nomi separato a cui possono accedere solo altri utenti Tor con lo stesso interruttore abilitato. Gli utenti clearnet non possono mai entrare in una stanza solo Tor, anche se conoscono il segreto condiviso.

Ciò fornisce un livello di sicurezza superiore rispetto alle stanze condivise predefinite:

• Entrambe le parti sono instradate attraverso la rete onion multi-hop di Tor — il vero indirizzo IP o la posizione di nessuna delle parti è visibile a nessuno, incluso il server.
• Nessuna ricerca DNS, nessun CDN e nessuna infrastruttura di terze parti tocca la connessione in alcun punto.
• L'analisi del traffico è significativamente più difficile perché entrambe le parti beneficiano del padding dei relay di Tor combinato con il padding delle connessioni di nullchat (frame fittizi casuali inviati a intervalli casuali).
• Non c'è un partecipante clearnet i cui metadati di connessione più deboli potrebbero essere correlati con la conversazione.

Sei anonimo tanto quanto l'anello più debole nella conversazione. In una stanza predefinita, la connessione di un partecipante clearnet tocca resolver DNS, infrastruttura CDN e routing internet standard — tutto ciò può essere osservato o richiesto tramite mandato per ottenere metadati su chi si è connesso, quando e da dove. L'interruttore solo Tor elimina completamente questo rischio assicurando che ogni partecipante abbia lo stesso livello di anonimato a livello di rete.

Entrambe le parti devono concordare di abilitare l'interruttore — funziona allo stesso modo della concordanza del segreto condiviso. L'intestazione della chat mostra "TOR ONLY" in verde quando è attivo, o "CLEARNET" in rosso per le stanze standard, così sai sempre in quale modalità ti trovi.`,
  faq_18_title: "Cos'è il timeout di inattività?",
  faq_18_body: `Se sei inattivo per 15 minuti — nessuna digitazione, nessun tocco, nessuno scorrimento — nullchat ti disconnetterà automaticamente e ti riporterà alla schermata di inserimento della password. Un avviso appare a 13 minuti dandoti la possibilità di restare. Ciò protegge la tua sessione se ti allontani dal dispositivo, impedendo che i messaggi si autodistruggano mentre nessuno li sta leggendo attivamente e assicurando che la chat non resti visibile su uno schermo incustodito.`,
  faq_19_title: "E gli indirizzi IP?",
  faq_19_body: `Sulla rete clearnet (nullchat.org), l'applicazione è ospitata sulla rete edge di Cloudflare. Il tuo indirizzo IP viene gestito a livello di infrastruttura e non viene mai letto, registrato o memorizzato dal codice dell'applicazione. Il codice del server non accede agli header IP. Non abbiamo alcun meccanismo per identificarti tramite indirizzo di rete.

Sul servizio nascosto Tor (.onion), il tuo indirizzo IP non è mai visibile al server — il routing onion di Tor garantisce un anonimato completo a livello di rete. Il server vede solo connessioni dalla rete Tor, senza alcun modo di risalire a te.`,
  faq_20_title: "Ci sono cookie o tracker?",
  faq_20_body: `No. nullchat non imposta cookie, non utilizza analytics, non carica script di terze parti, non incorpora pixel di tracciamento e non effettua richieste esterne. Gli header Content Security Policy lo impongono a livello di browser. Puoi verificarlo negli strumenti per sviluppatori del tuo browser.`,
  faq_21_title: "Perché non posso inviare link, immagini o file?",
  faq_21_body: `Per progettazione. nullchat è solo testo — nessun link, immagine, allegato o contenuto multimediale di alcun tipo può essere inviato o visualizzato. Questa è una decisione di sicurezza deliberata, non una limitazione. I link cliccabili e i contenuti multimediali incorporati sono la principale superficie di attacco per exploit zero-day utilizzati da spyware commerciali come Pegasus, Predator e strumenti di sorveglianza simili. Un singolo link o file malevolo può compromettere silenziosamente un intero dispositivo. Riducendo la chat al solo testo, nullchat elimina completamente questo vettore di attacco. Non c'è nulla da cliccare, nulla da scaricare e nulla da visualizzare — il che significa nulla da sfruttare.`,
  faq_22_title: "Posso copiare o fare screenshot dei messaggi?",
  faq_22_body: `nullchat scoraggia attivamente la cattura del contenuto dei messaggi. La selezione e la copia del testo sono disabilitate nell'area della chat, i menu contestuali del tasto destro sono bloccati e le scorciatoie da tastiera comuni per gli screenshot vengono intercettate. L'API Screen Capture del browser è anch'essa bloccata tramite header Permissions-Policy, impedendo agli strumenti di registrazione dello schermo basati sul web di catturare la pagina.

Queste sono protezioni basate sull'attrito, non garanzie assolute. Un utente determinato può sempre fotografare il suo schermo con un altro dispositivo o utilizzare strumenti a livello di sistema operativo che aggirano le restrizioni del browser. L'obiettivo è rendere difficile la cattura casuale e rafforzare l'aspettativa che le conversazioni su nullchat non siano destinate a essere salvate.`,
  faq_23_title: "Cos'è il traffico esca?",
  faq_23_body: `nullchat invia automaticamente messaggi fittizi crittografati a intervalli casuali (ogni 10–60 secondi) mentre sei connesso a una stanza. Questi messaggi esca sono indistinguibili dai messaggi reali — hanno la stessa dimensione (grazie al padding fisso), sono crittografati con la stessa chiave e inoltrati attraverso lo stesso percorso del server. Il client del destinatario li scarta silenziosamente dopo la decrittazione.

Il traffico esca sconfigge l'analisi del traffico. Senza di esso, un osservatore che monitora il traffico di rete potrebbe determinare quando avviene una comunicazione reale in base a quando vengono inviati blocchi crittografati. Con le esche, c'è un flusso costante di traffico dall'aspetto identico indipendentemente dal fatto che qualcuno stia effettivamente digitando — rendendo impossibile distinguere i messaggi reali dal rumore.`,
  faq_24_title: "Cos'è il padding della connessione?",
  faq_24_body: `Il server invia frame binari di lunghezza casuale (64–512 byte di dati casuali) a ogni client connesso a intervalli casuali (ogni 5–30 secondi). Questi frame non sono messaggi — sono puro rumore che il client ignora silenziosamente. Combinato con il traffico esca lato client, il padding della connessione garantisce che i pattern del traffico di rete non rivelino nulla su se una comunicazione reale stia avvenendo, quanti messaggi vengano scambiati o quando i partecipanti siano attivi.`,
  faq_25_title: "Cos'è il tasto panico?",
  faq_25_body: `Premere tre volte il tasto Escape cancella istantaneamente la tua sessione. Quando attivato, nullchat invia un comando di terminazione al server (eliminando tutti i tuoi messaggi), chiude la connessione WebSocket, azzera la chiave di crittografia in memoria, cancella il DOM, elimina sessionStorage e localStorage, cancella gli appunti e reindirizza il browser su google.com. L'intero processo richiede meno di un secondo. Se il browser tenta di ripristinare la pagina dalla cache (ad esempio tramite il pulsante indietro), la cancellazione viene automaticamente riattivata. Usalo se hai bisogno di eliminare immediatamente ogni prova della conversazione dal tuo schermo e browser.`,
  faq_26_title: "Cos'è la modalità steganografica?",
  faq_26_body: `La modalità steganografica maschera l'interfaccia di nullchat come un editor di documenti. Premi Shift cinque volte rapidamente per attivarla. L'intera interfaccia si trasforma — l'interfaccia scura della chat viene sostituita con un'interfaccia di editing documenti dall'aspetto familiare, completa di barra degli strumenti e barra dei menu. I messaggi appaiono come paragrafi nel corpo del documento e il tuo input si mimetizza come digitazione attiva. Tutta la crittografia, i timer di distruzione e le funzionalità di sicurezza continuano a operare normalmente sotto la superficie.

Questo è utile se qualcuno sta guardando sopra la tua spalla o se il tuo schermo è visibile ad altri. A prima vista, sembra che tu stia modificando un documento, non avendo una conversazione crittografata. Premi Shift cinque volte di nuovo per tornare alla vista normale della chat.`,
  faq_27_title: "nullchat cancella automaticamente gli appunti?",
  faq_27_body: `Sì. Se qualsiasi cosa viene copiata mentre sei in una stanza, nullchat cancella automaticamente i tuoi appunti dopo 15 secondi. Gli appunti vengono cancellati anche quando chiudi la scheda o navighi altrove, e immediatamente se usi il tasto panico. Ciò impedisce che il contenuto dei messaggi resti nei tuoi appunti dopo aver lasciato la conversazione.`,
  faq_28_title: "Potete leggere i miei messaggi?",
  faq_28_body: `No. Il server è un semplice relay. Riceve blocchi crittografati e li inoltra. La chiave di crittografia è derivata dal tuo segreto condiviso, che non lascia mai il tuo browser. Non abbiamo la chiave. Non possiamo decrittare i blocchi. Anche se il server venisse compromesso, l'attaccante otterrebbe solo testo cifrato privo di significato.`,
  faq_29_title: "Le agenzie governative possono accedere ai miei messaggi?",
  faq_29_body: `Non possiamo fornire ciò che non abbiamo. Non ci sono messaggi in chiaro memorizzati da nessuna parte. Non ci sono account utente da consultare. Non ci sono log IP da consegnare. I blocchi crittografati si eliminano automaticamente secondo una pianificazione fissa. Anche sotto un ordine legale valido, il massimo che potremmo produrre è una raccolta di blocchi crittografati e hash delle stanze — nessuno dei quali è utile senza il segreto condiviso che solo i partecipanti conoscono.`,
  faq_30_title: "nullchat è open source?",
  faq_30_body_1: `Sì. L'intero codice sorgente — client, server, crittografia e configurazione dell'infrastruttura — è pubblicamente disponibile per l'audit su`,
  faq_30_body_2: `. Puoi verificare che il codice in esecuzione sul server corrisponda a quello pubblicato, compilarlo tu stesso o ospitare la tua istanza. La trasparenza non è opzionale per uno strumento che ti chiede di affidargli le tue comunicazioni private.`,
  faq_31_title: "Chi ha creato nullchat?",
  faq_31_body_1: `nullchat è creato da Artorias — un'azienda di tecnologia dell'intelligence gestita da veterani con sede a New York. Artorias esiste per smantellare sistemi obsoleti e dotare le organizzazioni e gli individui più importanti di strumenti progettati appositamente per operare nell'ombra. Alla sua essenza, Artorias mira a democratizzare l'intelligence e l'anonimato — assicurando che la capacità di comunicare in sicurezza e operare senza sorveglianza non sia un privilegio riservato a pochi. nullchat è un'espressione di quella missione: comunicazione sicura ridotta alla sua essenza, senza compromessi sull'integrità crittografica. Scopri di più su`,
  faq_32_title: "Posso aggiungere nullchat alla schermata iniziale?",
  faq_32_body: `Sì. nullchat supporta l'aggiunta alla schermata iniziale sia su iOS che su Android. Su Safari per iOS, tocca il pulsante di condivisione e seleziona "Aggiungi alla schermata Home". Su Chrome per Android, tocca il menu e seleziona "Aggiungi alla schermata Home" o "Installa app". Questo crea un collegamento autonomo che apre nullchat senza l'interfaccia del browser — nessuna barra degli indirizzi, nessuna scheda. Ha l'aspetto e il comportamento di un'app nativa.

Importante: nullchat deliberatamente non utilizza un service worker e non memorizza nella cache alcun dato offline. Non esiste una modalità offline. Il collegamento nella schermata iniziale apre semplicemente il sito live — nulla viene memorizzato sul tuo dispositivo oltre al collegamento stesso. Questa è una decisione di sicurezza: memorizzare nella cache pagine di chat crittografate o script del service worker sul dispositivo creerebbe prove forensi dell'utilizzo di nullchat. Il collegamento non lascia alcuna traccia oltre alla propria icona, che può essere eliminata in qualsiasi momento.`,
};
