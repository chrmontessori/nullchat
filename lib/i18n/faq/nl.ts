import type { FaqKey } from "../faq-translations";

export const nl: Record<FaqKey, string> = {
  faq_1_title: "Wat is nullchat?",
  faq_1_body: `nullchat is een anonieme, end-to-end versleutelde chatroom die geen accounts, geen e-mailadressen, geen telefoonnummers en geen persoonlijke informatie van welke aard dan ook vereist. Je voert een gedeeld geheim in — een wachtwoord — en iedereen die hetzelfde wachtwoord invoert, komt in dezelfde kamer terecht. Dat is alles.`,
  faq_2_title: "Hoe kom ik in een kamer?",
  faq_2_body: `Jij en de persoon met wie je wilt praten spreken van tevoren een gedeeld geheim af — persoonlijk, via een telefoongesprek, hoe je maar wilt. Jullie typen allebei dat geheim in nullchat en je zit in dezelfde versleutelde kamer. Er is geen kamerlijst, geen gids, geen manier om te bladeren. Om binnen te komen moet je browser aan de server bewijzen dat hij het geheim kent, dus alleen de identificatie van een kamer kennen is op zichzelf niet genoeg. Als je het geheim niet kent, bestaat de kamer niet voor jou.`,
  faq_3_title: "Hoe kies ik een goed gedeeld geheim?",
  faq_3_body: `Je gedeelde geheim is het allerbelangrijkste onderdeel van je beveiliging. Het is zowel de sleutel tot je kamer als de sleutel tot je versleuteling — als iemand het raadt, kan diegene alles lezen. Behandel het als het wachtwoord van een kluis.

Kies iets lang, willekeurig en niet te raden. Een sterk geheim bevat minstens 5–6 willekeurige woorden of 20+ gemengde tekens. Vermijd namen, datums, veelgebruikte zinnen, songteksten of alles wat iemand op je sociale media zou kunnen vinden. Hergebruik nooit een geheim voor verschillende gesprekken of kamers.

Deel je geheim via een veilig, out-of-band kanaal — persoonlijk is het beste. Een telefoongesprek is acceptabel. Verstuur het nooit via sms, e-mail, DM of een platform dat berichten opslaat. Als je vermoedt dat een geheim is gecompromitteerd, stop dan onmiddellijk met het gebruik ervan en spreek een nieuw geheim af via een veilig kanaal.

De sterkte-indicator op het invoerscherm geeft je een ruwe inschatting van hoe bestand je geheim is tegen brute-force-aanvallen, maar geen indicator is een vervanging voor gezond verstand. Bij twijfel: maak het langer en willekeuriger.`,
  faq_4_title: "Hoe werkt de versleuteling?",
  faq_4_body: `Wanneer je je gedeelde geheim invoert, haalt je browser het door Argon2id, een geheugenintensieve sleutelafleidingsfunctie, in twee afzonderlijke afleidingen. Elke afleiding heeft een eigen salt en gebruikt 16 MiB geheugen en 3 iteraties. Dit alles gebeurt op je eigen apparaat.

1. De eerste afleiding produceert de kamer-ID. Die wordt naar de server gestuurd, zodat de server weet met welke kamer je verbonden moet worden. De server ziet nooit je werkelijke geheim.

2. De tweede afleiding produceert in één keer 64 bytes, die in tweeën worden gesplitst: een 256-bits versleutelingssleutel en een kamertoegangsgeheim. De versleutelingssleutel verlaat nooit je browser. Met het kamertoegangsgeheim bewijst je browser aan de server dat je het gedeelde geheim kent. Daarom is alleen de kamer-ID kennen niet genoeg om een kamer binnen te komen.

Omdat Argon2id voor elke poging een groot blok RAM nodig heeft, wordt het met brute force raden van je wachtwoord op GPU's en ASIC's veel moeilijker dan bij oudere sleutelafleidingsfuncties.

Elk bericht wordt versleuteld met NaCl secretbox (XSalsa20-Poly1305) met de versleutelingssleutel voordat het je apparaat verlaat. De server ontvangt, slaat op en stuurt alleen versleutelde tekst door, die zonder de sleutel betekenisloos is. Wij kunnen je berichten niet lezen, en niemand kan dat, tenzij diegene het gedeelde geheim kent.`,
  faq_5_title: "Wat ziet de server?",
  faq_5_body: `De server ziet:
• Een Argon2id-afgeleide hash (de kamer-ID) — niet je wachtwoord
• Een waarde die met Argon2id uit je gedeelde geheim is afgeleid en bewijst dat je het kent. De server bewaart er alleen een hash van, en de waarde onthult noch het geheim noch de versleutelingssleutel.
• Versleutelde ciphertext-blobs — niet je berichten
• Het aantal actieve verbindingen in een kamer
• Tijdstempels van wanneer versleutelde blobs zijn ontvangen

De server ziet NIET:
• Je gedeelde geheim / wachtwoord
• De inhoud van je berichten
• Je identiteit of gebruikersnaam (aliassen zijn versleuteld in berichten)
• Je IP-adres (de nullchat-applicatie ontvangt het nooit; zie "Hoe zit het met IP-adressen?" hieronder)`,
  faq_6_title: "Wat is berichtpadding?",
  faq_6_body: `Vóór versleuteling wordt elk bericht opgevuld tot een vast blok van 16.384 bytes met een 2-byte lengteprefix gevolgd door de berichtinhoud en willekeurige ruis. Dit betekent dat een kort bericht zoals "hoi" exact dezelfde grootte ciphertext oplevert als een bericht van de maximale lengte. Zonder padding zou een waarnemer de berichtinhoud kunnen raden op basis van de lengte van de ciphertext. De willekeurige ruisvulling (geen nullen) zorgt ervoor dat er geen herkenbaar patroon is in de platte tekst vóór versleuteling. Padding elimineert dit zijkanaal volledig.`,
  faq_7_title: "Wat is tijdstempelvervorming?",
  faq_7_body: `Tijdstempels in berichten worden vóór versleuteling afgerond naar de dichtstbijzijnde minuut. Dit voorkomt timingcorrelatieaanvallen waarbij een waarnemer berichtpatronen over verschillende kanalen zou kunnen matchen door exacte tijdstempels te vergelijken.`,
  faq_8_title: "Hoe lang blijven berichten bestaan?",
  faq_8_body: `Berichten gebruiken een gelaagd timersysteem:

• Dead drop (eerste bericht): Een bericht staat versleuteld op de server voor maximaal 24 uur, wachtend op een reactie. De afzender kan vertrekken en terugkomen om het te controleren zonder een aftelling te activeren. Simpelweg de kamer betreden verbrandt het bericht niet.

• Beide gebruikers aanwezig: Wanneer een tweede persoon de kamer betreedt, begint voor alle ongelezen berichten onmiddellijk een brandaftelling van 5 minuten. Elk nieuw bericht dat wordt verzonden terwijl beide gebruikers aanwezig zijn, wordt ook automatisch na 5 minuten vernietigd. Er is geen actie nodig — aanwezigheid alleen bevestigt dat het bericht wordt gelezen.

• Ontvangen-knop: Als je een dead-drop-bericht oppikt terwijl je alleen in de kamer bent, kun je op de "Ontvangen"-knop drukken om de ontvangst handmatig te bevestigen en de brandaftelling van 5 minuten te starten. Deze knop verschijnt slechts één keer — bij het eerste ophalen van de dead drop — en is niet beschikbaar tijdens actieve gesprekken.

• Actief gesprek: Zodra een kamer reacties heeft gezien, hebben volgende berichten een venster van 6 uur als de ontvanger niet aanwezig is. Als beide gebruikers verbonden zijn, worden berichten automatisch na 5 minuten vernietigd.

• Harde limiet: Elk ongelezen bericht wordt verwijderd nadat de timer is verlopen (24 uur voor dead drops, 6 uur voor actieve berichten), ongeacht of het is bevestigd.

Er is geen archief, geen back-up, geen manier om een verwijderd bericht te herstellen.`,
  faq_9_title: "Wat is de dead drop?",
  faq_9_body: `nullchat functioneert als een digitale dead drop. In traditionele inlichtingenwereld is een dead drop een methode om informatie tussen twee personen door te geven zonder dat ze ooit hoeven af te spreken of op dezelfde plek op hetzelfde moment hoeven te zijn. nullchat werkt op dezelfde manier.

Je voert het gedeelde geheim in, laat een versleuteld bericht achter en verbreekt de verbinding. Het bericht staat op de server — versleuteld en onleesbaar voor iedereen, inclusief ons — voor maximaal 24 uur. Je contactpersoon voert hetzelfde geheim in wanneer het hem of haar uitkomt, en haalt het bericht op. Wanneer de ontvanger deelneemt en beide gebruikers aanwezig zijn, begint voor alle wachtende berichten onmiddellijk een brandaftelling van 5 minuten — aanwezigheid alleen is bewijs van ontvangst. Als de ontvanger het bericht oppikt terwijl hij of zij alleen is, kan diegene op de eenmalige "Ontvangen"-knop drukken om de ontvangst handmatig te bevestigen en de vernietiging te starten, of simpelweg antwoorden. Zodra de vernietiging begint, wordt het bericht na 5 minuten permanent vernietigd.

De afzender kan op elk moment veilig opnieuw verbinden om te controleren of het bericht nog wacht — zonder een aftelling te activeren, zolang hij of zij de enige in de kamer is. Geen van beide partijen hoeft tegelijkertijd online te zijn. Geen van beide partijen heeft een account nodig. Geen van beide partijen is identificeerbaar. De server weet nooit wie het bericht heeft achtergelaten of wie het heeft opgehaald — alleen dat een versleutelde blob is opgeslagen en later opgehaald. Na de vernietiging is er geen bewijs dat de uitwisseling ooit heeft plaatsgevonden.`,
  faq_10_title: "Hoe lang bestaan kamers?",
  faq_10_body: `Een kamer bestaat zolang er actieve verbindingen of niet-verlopen berichten zijn. Zodra de laatste persoon de verbinding verbreekt en alle berichten zijn verlopen of vernietigd, is de kamer verdwenen. Er wordt niets van bewaard. Als er nooit berichten worden verzonden, is de kamer slechts een live verbinding — er wordt niets opgeslagen, en het verdwijnt op het moment dat iedereen vertrekt.`,
  faq_11_title: "Wat is de Beëindigen-knop?",
  faq_11_body: `Beëindigen verwijdert onmiddellijk elk bericht dat je tijdens je huidige sessie hebt verzonden van de server voor iedereen in de kamer. Andere deelnemers zien je berichten in realtime van hun scherm verdwijnen. Vervolgens wordt de verbinding met de kamer verbroken. Gebruik dit als je wilt vertrekken zonder een spoor achter te laten.`,
  faq_12_title: "Wat is de Verlaten-knop?",
  faq_12_body: `Verlaten verbreekt simpelweg je verbinding met de kamer. Je berichten blijven op de server staan — ongelezen berichten blijven wachten (maximaal 24 uur), en reeds gelezen berichten gaan door met hun brandaftelling van 5 minuten. Als je later opnieuw deelneemt aan de kamer, krijg je een nieuwe willekeurige alias — er is geen manier om je oude en nieuwe identiteiten aan elkaar te koppelen.`,
  faq_13_title: "Wat zijn de willekeurige aliassen?",
  faq_13_body: `Wanneer je een kamer betreedt, krijg je een willekeurige 8-teken hexadecimale code (zoals "a9f2b71c") als alias toegewezen. Deze alias wordt in je browser gegenereerd, versleuteld in elk bericht opgenomen, en wordt nooit in platte tekst naar de server gestuurd. Als je de verbinding verbreekt en opnieuw verbindt, krijg je een nieuwe alias. Er is geen manier om een alias te reserveren, te kiezen of te behouden.

Een alias is een label, geen geverifieerde identiteit. Iedereen die het gedeelde geheim kent, kan de kamer betreden en zijn alias op alles instellen wat hij wil. Beschouw daarom iedereen in een kamer als iemand die het geheim heeft. Als je zeker wilt weten met wie je praat, controleer dat dan out-of-band, bijvoorbeeld door vooraf een codewoord af te spreken. Deel een geheim alleen met mensen die je vertrouwt.`,
  faq_14_title: "Is er een deelnemerslimiet?",
  faq_14_body: `Elke kamer ondersteunt maximaal 50 gelijktijdige verbindingen. Als de kamer vol is, zie je het bericht "Kamer is vol". Ook de server als geheel heeft een limiet op het aantal verbindingen dat hij tegelijk accepteert. Deze limieten bestaan om kamers intiem te houden en misbruik te voorkomen.`,
  faq_15_title: "Is er een snelheidslimiet?",
  faq_15_body: `Ja. Elke verbinding is beperkt tot 1 bericht per seconde. Elke kamer heeft daarnaast een floodlimiet voor het totale aantal berichten dat binnen korte tijd kan worden verzonden. Dit voorkomt spam en misbruik zonder enige identiteitsverificatie. Als je te snel berichten verstuurt, zie je een korte melding "Rustig aan".

Ook nieuwe verbindingen zijn beperkt. Op het clearnet beperkt de reverse proxy vóór de server hoeveel verbindingen elk netwerkadres kan openen. De Tor-dienst wordt beschermd door de proof-of-work-verdediging van Tor voor onion-diensten, die het duur maakt om de dienst met verbindingen te overspoelen. Geen van beide vereist dat de nullchat-applicatie je IP-adres ontvangt of opslaat.`,
  faq_16_title: "Kan ik nullchat via Tor gebruiken?",
  faq_16_body_1: `nullchat is beschikbaar als een Tor hidden service voor gebruikers in gecensureerde regio's of iedereen die een extra laag anonimiteit wil. Open Tor Browser en navigeer naar:`,
  faq_16_body_2: `Standaard verbinden zowel de clearnet- als de Tor-versie met dezelfde backend — gebruikers op beide kunnen met elkaar communiceren in dezelfde kamers met hetzelfde gedeelde geheim. De .onion-dienst routeert via het netwerk van Tor zonder Cloudflare, geen CDN en geen infrastructuur van derden tussen jou en de server. Tor routeert je verbinding via meerdere versleutelde relays, zodat noch de server noch een waarnemer je werkelijke IP-adres of locatie kan bepalen. De .onion-dienst gebruikt gewoon HTTP, wat verwacht en veilig is — Tor zelf biedt end-to-end versleuteling tussen je browser en de server. Alle dezelfde versleuteling op applicatieniveau (NaCl secretbox, Argon2id-sleutelafleiding) is daar bovenop van toepassing. Let op: Tor Browser moet op "Standaard" beveiligingsniveau staan om nullchat te laten werken, aangezien de app JavaScript vereist.`,
  faq_17_title: "Wat is een alleen-Tor-kamer?",
  faq_17_body: `Bij toegang tot nullchat via de .onion hidden service heb je de optie om "Alleen-Tor-kamer" in te schakelen — een schakelaar die op het wachtwoordinvoerscherm verschijnt. Wanneer ingeschakeld, wordt je kamer in een aparte namespace geplaatst die alleen andere Tor-gebruikers met dezelfde schakelaar ingeschakeld kunnen bereiken. Clearnet-gebruikers kunnen nooit een alleen-Tor-kamer betreden, zelfs niet als ze het gedeelde geheim kennen.

Dit biedt een hoger beveiligingsniveau dan de standaard gedeelde kamers:

• Beide partijen worden gerouteerd via het multi-hop onion-netwerk van Tor — het werkelijke IP-adres of de locatie van geen van beide partijen is zichtbaar voor iemand, inclusief de server.
• Geen DNS-lookups, geen CDN en geen infrastructuur van derden raakt de verbinding op enig moment.
• Verkeersanalyse is aanzienlijk moeilijker omdat beide zijden profiteren van de relay-padding van Tor in combinatie met de eigen verbindingspadding van nullchat (willekeurige dummy-frames verzonden op willekeurige intervallen).
• Er is geen clearnet-deelnemer wiens zwakkere verbindingsmetadata gecorreleerd zou kunnen worden met het gesprek.

Je bent slechts zo anoniem als de zwakste schakel in het gesprek. In een standaardkamer raakt de verbinding van een clearnet-deelnemer DNS-resolvers, CDN-infrastructuur en standaard internetrouting — die allemaal kunnen worden geobserveerd of gedagvaard voor metadata over wie er verbinding maakte, wanneer en vanwaar. De alleen-Tor-schakelaar elimineert dit risico volledig door ervoor te zorgen dat elke deelnemer hetzelfde niveau van netwerklaaganonimiteit heeft.

Beide partijen moeten overeenkomen om de schakelaar in te schakelen — het werkt op dezelfde manier als het afspreken van het gedeelde geheim. De chatheader toont "ALLEEN TOR" in groen wanneer actief, of "CLEARNET" in rood voor standaardkamers, zodat je altijd weet in welke modus je zit.`,
  faq_18_title: "Wat is de inactiviteitstime-out?",
  faq_18_body: `Als je 15 minuten inactief bent — niet typen, niet tikken, niet scrollen — verbreekt nullchat automatisch je verbinding en keert terug naar het wachtwoordinvoerscherm. Een waarschuwing verschijnt na 13 minuten met de optie om te blijven. Dit beschermt je sessie als je wegloopt van je apparaat, voorkomt dat berichten worden vernietigd terwijl niemand actief leest, en zorgt ervoor dat de chat niet zichtbaar blijft op een onbeheerd scherm.`,
  faq_19_title: "Hoe zit het met IP-adressen?",
  faq_19_body: `Op het clearnet (nullchat.org) wordt de webpagina geleverd door Vercel, en de chatverbinding loopt via een nginx-reverse proxy naar onze server op ws.nullchat.org. Zoals bij elke website zien de paginahost en de reverse proxy noodzakelijkerwijs het IP-adres waarmee je verbinding maakt, op het moment dat je verbinding maakt. nginx geeft je adres niet door aan de nullchat-applicatie en logt het niet, dus de applicatie ontvangt of bewaart nooit IP-adressen van clients. Wil je niet dat de paginahost of onze server je IP-adres ziet, gebruik dan Tor.

Op de Tor hidden service (.onion) is je IP-adres helemaal nooit zichtbaar voor de server — de onion-routing van Tor garandeert volledige anonimiteit op netwerkniveau. De server ziet alleen verbindingen vanuit het Tor-netwerk, zonder mogelijkheid om ze naar jou te herleiden.`,
  faq_20_title: "Zijn er cookies of trackers?",
  faq_20_body: `Nee. nullchat plaatst geen cookies, gebruikt geen analytics, laadt geen scripts van derden, bevat geen trackingpixels en doet geen externe verzoeken. De Content Security Policy-headers handhaven dit op browserniveau. Je kunt dit verifiëren in de ontwikkelaarstools van je browser.

Je taalkeuze wordt alleen voor het huidige tabblad in sessionStorage bewaard en wordt gewist wanneer je het tabblad sluit.`,
  faq_21_title: "Waarom kan ik geen links, afbeeldingen of bestanden versturen?",
  faq_21_body: `Met opzet. nullchat is alleen tekst — er kunnen geen links, afbeeldingen, bestandsbijlagen of media van welke aard dan ook worden verzonden of weergegeven. Dit is een bewuste beveiligingsbeslissing, geen beperking. Klikbare links en ingesloten media zijn het primaire aanvalsoppervlak voor zero-day-exploits die worden gebruikt door commerciële spyware zoals Pegasus, Predator en vergelijkbare surveillancetools. Een enkele kwaadaardige link of bestand kan een heel apparaat stilletjes compromitteren. Door de chat tot platte tekst te beperken, elimineert nullchat deze aanvalsvector volledig. Er is niets om op te klikken, niets om te downloaden en niets om weer te geven — wat betekent dat er niets te exploiteren valt.`,
  faq_22_title: "Kan ik berichten kopiëren of screenshotten?",
  faq_22_body: `nullchat ontmoedigt actief het vastleggen van berichtinhoud. Tekstselectie en kopiëren zijn uitgeschakeld in het chatgebied, rechtsklikmenu's zijn geblokkeerd en veelgebruikte screenshot-sneltoetsen worden onderschept. De Screen Capture API van de browser is ook geblokkeerd via Permissions-Policy-headers, waardoor webgebaseerde schermopnametools de pagina niet kunnen vastleggen.

Dit zijn wrijvingsgebaseerde beschermingen, geen absolute garanties. Een vastberaden gebruiker kan altijd zijn scherm fotograferen met een ander apparaat of OS-tools gebruiken die browserbeperkingen omzeilen. Het doel is om casual vastlegging moeilijk te maken en de verwachting te versterken dat gesprekken in nullchat niet bedoeld zijn om te worden bewaard.`,
  faq_23_title: "Wat is lokverkeer?",
  faq_23_body: `nullchat verstuurt automatisch versleutelde dummyberichten op willekeurige intervallen (elke 10–60 seconden) terwijl je verbonden bent met een kamer. Deze lokberichten zijn niet te onderscheiden van echte berichten — ze zijn even groot (dankzij vaste padding), versleuteld met dezelfde sleutel, doorgestuurd via hetzelfde serverpad, en ze leveren tussen je browser en de server dezelfde reeks frames op als een echt bericht. De client van de ontvanger verwerpt ze stilletjes na ontsleuteling.

Lokverkeer verslaat verkeersanalyse. Zonder lokverkeer zou een waarnemer die het netwerkverkeer monitort, kunnen bepalen wanneer er echte communicatie plaatsvindt op basis van wanneer versleutelde blobs worden verzonden. Met lokverkeer is er een constante stroom van identiek uitziend verkeer, ongeacht of iemand daadwerkelijk typt — waardoor het onmogelijk wordt om echte berichten van ruis te onderscheiden.`,
  faq_24_title: "Wat is verbindingspadding?",
  faq_24_body: `De server stuurt binaire frames van willekeurige lengte (64–512 bytes willekeurige data) naar elke verbonden client op willekeurige intervallen (elke 5–30 seconden). Deze frames zijn geen berichten — het is pure ruis die de client stilletjes negeert. In combinatie met lokverkeer aan de clientzijde zorgt verbindingspadding ervoor dat netwerkverkeerspatronen niets onthullen over of er echte communicatie plaatsvindt, hoeveel berichten er worden uitgewisseld of wanneer deelnemers actief zijn.`,
  faq_25_title: "Wat is de paniektoets?",
  faq_25_body: `Drie keer snel op Escape tikken wist je sessie onmiddellijk. Wanneer geactiveerd, stuurt nullchat een beëindigingscommando naar de server (verwijdert al je berichten), sluit de WebSocket-verbinding, wist de versleutelingssleutel in het geheugen, wist de DOM, wist sessionStorage en localStorage, wist het klembord en stuurt je browser door naar google.com. Het hele proces duurt minder dan een seconde. Als de browser probeert de pagina uit de cache te herstellen (bijv. via de terugknop), wordt het wissen automatisch opnieuw geactiveerd. Gebruik dit als je onmiddellijk alle sporen van het gesprek van je scherm en browser moet wissen.`,
  faq_26_title: "Wat is de steganografische modus?",
  faq_26_body: `De steganografische modus vermomt de nullchat-interface als een documenteditor. Druk vijf keer snel op Shift om het te activeren. De hele UI verandert — de donkere chatinterface wordt vervangen door een vertrouwd uitziende documentbewerkingsinterface compleet met werkbalk en menubalk. Berichten verschijnen als alinea's in de documentinhoud en je invoer gaat naadloos op in actief typen. Alle versleuteling, brandtimers en beveiligingsfuncties blijven normaal functioneren eronder.

Dit is handig als iemand over je schouder meekijkt of als je scherm zichtbaar is voor anderen. Op het eerste gezicht lijkt het alsof je een document bewerkt, niet dat je een versleuteld gesprek voert. Druk nogmaals vijf keer op Shift om terug te keren naar de normale chatweergave.`,
  faq_27_title: "Wist nullchat automatisch het klembord?",
  faq_27_body: `Ja. Als er iets wordt gekopieerd terwijl je in een chatroom bent, wist nullchat automatisch je klembord na 15 seconden. Het klembord wordt ook gewist wanneer je het tabblad sluit of wegnavigeert, en onmiddellijk als je de paniektoets gebruikt. Dit voorkomt dat berichtinhoud op je klembord achterblijft nadat je het gesprek hebt verlaten.`,
  faq_28_title: "Kun je mijn berichten lezen?",
  faq_28_body: `Nee. De server is een domme doorgeefluik. Hij ontvangt versleutelde blobs en stuurt ze door. De versleutelingssleutel is afgeleid van je gedeelde geheim, dat nooit je browser verlaat. Wij hebben de sleutel niet. Wij kunnen de blobs niet ontsleutelen. Zelfs als de server gecompromitteerd zou worden, zou de aanvaller alleen betekenisloze ciphertext verkrijgen.`,
  faq_29_title: "Kunnen overheidsdiensten mijn berichten inzien?",
  faq_29_body: `We kunnen niet verschaffen wat we niet hebben. Er zijn nergens platte-tekstberichten opgeslagen. Er zijn geen gebruikersaccounts om op te zoeken. Er zijn geen IP-logs om over te dragen. De versleutelde blobs worden automatisch verwijderd volgens een vast schema. Zelfs bij een geldig gerechtelijk bevel is het meeste wat we zouden kunnen produceren een verzameling versleutelde blobs en kamerhashes — geen van alle bruikbaar zonder het gedeelde geheim dat alleen de deelnemers kennen.`,
  faq_30_title: "Is nullchat open source?",
  faq_30_body_1: `Ja. De volledige codebase — client, server, versleuteling en infrastructuurconfiguratie — is publiek beschikbaar voor audit op`,
  faq_30_body_2: `. Je kunt verifiëren dat de code die op de server draait overeenkomt met wat is gepubliceerd, het zelf bouwen of je eigen instantie hosten. Transparantie is niet optioneel voor een tool die je vraagt om het te vertrouwen met je privécommunicatie.`,
  faq_31_title: "Wie heeft nullchat gebouwd?",
  faq_31_body_1: `nullchat is gebouwd door Artorias — een door veteranen gerund inlichtingentechnologiebedrijf gevestigd in New York City. Artorias bestaat om verouderde systemen te ontmantelen en de belangrijkste organisaties en individuen te bewapenen met tools die speciaal zijn gebouwd om in het duister te opereren. In de kern draait Artorias om het democratiseren van inlichtingen en anonimiteit — ervoor zorgen dat het vermogen om veilig te communiceren en zonder surveillance te opereren geen privilege is dat is voorbehouden aan enkelen. nullchat is één uiting van die missie: veilige communicatie ontdaan van alles behalve de essentie, zonder compromis op cryptografische integriteit. Meer informatie op`,

};
