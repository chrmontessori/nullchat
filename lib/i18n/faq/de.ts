import type { FaqKey } from "../faq-translations";

export const de: Record<FaqKey, string> = {
  faq_1_title: "Was ist nullchat?",
  faq_1_body: `nullchat ist ein anonymer, Ende-zu-Ende-verschlüsselter Chatraum, der keine Konten, keine E-Mails, keine Telefonnummern und keinerlei persönliche Daten erfordert. Du gibst ein gemeinsames Geheimnis ein — ein Passwort — und jeder, der dasselbe Passwort eingibt, landet im selben Raum. Das war's.`,
  faq_2_title: "Wie trete ich einem Raum bei?",
  faq_2_body: `Du und die Person, mit der du sprechen möchtest, vereinbart vorab ein gemeinsames Geheimnis — persönlich, per Telefonat, wie auch immer. Ihr gebt beide dieses Geheimnis in nullchat ein und seid im selben verschlüsselten Raum. Es gibt keine Raumliste, kein Verzeichnis, keine Möglichkeit zu durchsuchen. Wenn du das Geheimnis nicht kennst, existiert der Raum für dich nicht.`,
  faq_3_title: "Wie sollte ich ein gemeinsames Geheimnis wählen?",
  faq_3_body: `Dein gemeinsames Geheimnis ist das wichtigste Element deiner Sicherheit. Es ist sowohl der Schlüssel zu deinem Raum als auch der Schlüssel zu deiner Verschlüsselung — wenn jemand es errät, kann er alles lesen. Behandle es wie das Passwort zu einem Tresor.

Wähle etwas Langes, Zufälliges und Unerratbares. Ein starkes Geheimnis besteht aus mindestens 5–6 zufälligen Wörtern oder 20+ gemischten Zeichen. Vermeide Namen, Daten, gängige Phrasen, Liedtexte oder alles, was jemand in deinen sozialen Medien finden könnte. Verwende ein Geheimnis niemals für verschiedene Unterhaltungen oder Räume wieder.

Teile dein Geheimnis über einen sicheren, separaten Kanal — persönlich ist am besten. Ein Telefonat ist akzeptabel. Sende es niemals per SMS, E-Mail, Direktnachricht oder über eine Plattform, die Nachrichten protokolliert. Wenn du vermutest, dass ein Geheimnis kompromittiert wurde, verwende es sofort nicht mehr und vereinbare ein neues über einen sicheren Kanal.

Die Stärkeanzeige auf dem Eingabebildschirm gibt dir einen ungefähren Eindruck, wie widerstandsfähig dein Geheimnis gegen Brute-Force-Angriffe ist, aber keine Anzeige ersetzt gutes Urteilsvermögen. Im Zweifel: länger und zufälliger.`,
  faq_4_title: "Wie funktioniert die Verschlüsselung?",
  faq_4_body: `Wenn du dein gemeinsames Geheimnis eingibst, passieren zwei Dinge vollständig in deinem Browser:

1. Das Geheimnis wird durch Argon2id verarbeitet — eine speicherintensive Schlüsselableitungsfunktion — unter Verwendung eines domänenseparierten Salts, um eine Raum-ID zu erzeugen. Dieser Hash wird an den Server gesendet, damit er weiß, mit welchem Raum er dich verbinden soll. Der Server sieht niemals dein tatsächliches Geheimnis.

2. Das Geheimnis wird durch eine zweite, unabhängige Argon2id-Ableitung (16 MiB Speicher, 3 Iterationen) verarbeitet, um einen 256-Bit-Verschlüsselungsschlüssel zu erzeugen. Dieser Schlüssel verlässt niemals deinen Browser. Argon2id erfordert große Speicherblöcke pro Versuch, wodurch GPU- und ASIC-Brute-Force-Angriffe auf dein Passwort um Größenordnungen schwieriger werden als bei herkömmlichen KDFs.

Jede Nachricht, die du sendest, wird mit NaCl secretbox (XSalsa20-Poly1305) unter Verwendung dieses Schlüssels verschlüsselt, bevor sie dein Gerät verlässt. Der Server empfängt, speichert und leitet nur Chiffretext weiter — verschlüsselte Blobs, die ohne den Schlüssel bedeutungslos sind. Wir können deine Nachrichten nicht lesen. Niemand kann es, es sei denn, er kennt das gemeinsame Geheimnis.`,
  faq_5_title: "Was sieht der Server?",
  faq_5_body: `Der Server sieht:
• Einen Argon2id-abgeleiteten Hash (die Raum-ID) — nicht dein Passwort
• Verschlüsselte Chiffretext-Blobs — nicht deine Nachrichten
• Die Anzahl aktiver Verbindungen in einem Raum
• Zeitstempel, wann verschlüsselte Blobs empfangen wurden

Der Server sieht NICHT:
• Dein gemeinsames Geheimnis / Passwort
• Deine Nachrichteninhalte
• Deine Identität oder deinen Benutzernamen (Aliase sind in den Nachrichten verschlüsselt)
• Deine IP-Adresse (wird am Edge von unserem Hosting-Anbieter entfernt)`,
  faq_6_title: "Was ist Nachrichten-Padding?",
  faq_6_body: `Vor der Verschlüsselung wird jede Nachricht auf einen festen 8.192-Byte-Block aufgefüllt, bestehend aus einem 2-Byte-Längenpräfix, gefolgt vom Nachrichteninhalt und zufälligem Rauschen. Das bedeutet, eine kurze Nachricht wie „hi" erzeugt exakt denselben Chiffretext wie eine Nachricht maximaler Länge. Ohne Padding könnte ein Beobachter den Nachrichteninhalt anhand der Chiffretextlänge erraten. Die zufällige Rauschfüllung (keine Nullen) stellt sicher, dass es kein erkennbares Muster im Klartext vor der Verschlüsselung gibt. Padding eliminiert diesen Seitenkanal vollständig.`,
  faq_7_title: "Was ist Zeitstempel-Verschleierung?",
  faq_7_body: `Zeitstempel in Nachrichten werden vor der Verschlüsselung auf die nächste Minute gerundet. Dies verhindert Timing-Korrelationsangriffe, bei denen ein Beobachter Nachrichtenmuster über verschiedene Kanäle hinweg durch den Vergleich exakter Zeitstempel abgleichen könnte.`,
  faq_8_title: "Wie lange bleiben Nachrichten bestehen?",
  faq_8_body: `Nachrichten verwenden ein gestuftes Timer-System:

• Dead Drop (erste Nachricht): Eine Nachricht liegt verschlüsselt auf dem Server für bis zu 24 Stunden und wartet auf eine Antwort. Der Absender kann den Raum verlassen und zurückkehren, um nachzusehen, ohne einen Countdown auszulösen. Das bloße Betreten des Raums löscht die Nachricht nicht.

• Beide Nutzer anwesend: Wenn eine zweite Person dem Raum beitritt, beginnen alle ungelesenen Nachrichten sofort einen 5-Minuten-Lösch-Countdown. Jede neue Nachricht, die gesendet wird, während beide Nutzer anwesend sind, wird ebenfalls nach 5 Minuten automatisch gelöscht. Es ist keine Aktion erforderlich — Anwesenheit allein bestätigt, dass die Nachricht gelesen wird.

• Empfangen-Schaltfläche: Wenn du eine Dead-Drop-Nachricht abholst, während du allein im Raum bist, kannst du die „Empfangen"-Schaltfläche drücken, um den Empfang manuell zu bestätigen und den 5-Minuten-Lösch-Countdown zu starten. Diese Schaltfläche erscheint nur einmal — beim erstmaligen Abholen des Dead Drops — und ist während aktiver Unterhaltungen nicht verfügbar.

• Aktive Unterhaltung: Sobald ein Raum Antworten gesehen hat, haben nachfolgende Nachrichten ein 6-Stunden-Fenster, wenn der Empfänger nicht anwesend ist. Wenn beide Nutzer verbunden sind, werden Nachrichten automatisch nach 5 Minuten gelöscht.

• Absolute Obergrenze: Jede ungelesene Nachricht wird nach Ablauf ihres Timers gelöscht (24 Stunden für Dead Drops, 6 Stunden für aktive Nachrichten), unabhängig davon, ob sie bestätigt wurde.

Es gibt kein Archiv, kein Backup, keine Möglichkeit, eine gelöschte Nachricht wiederherzustellen.`,
  faq_9_title: "Was ist der Dead Drop?",
  faq_9_body: `nullchat funktioniert als digitaler Dead Drop. In der traditionellen Geheimdienstpraxis ist ein Dead Drop eine Methode, Informationen zwischen zwei Personen auszutauschen, ohne dass sie sich jemals treffen oder zur gleichen Zeit am selben Ort sein müssen. nullchat funktioniert genauso.

Du gibst das gemeinsame Geheimnis ein, hinterlässt eine verschlüsselte Nachricht und trennst die Verbindung. Die Nachricht liegt auf dem Server — verschlüsselt und für niemanden lesbar, auch nicht für uns — für bis zu 24 Stunden. Dein Kontakt gibt dasselbe Geheimnis ein, wann immer er bereit ist, und holt die Nachricht ab. Wenn der Empfänger beitritt und beide Nutzer anwesend sind, beginnen alle wartenden Nachrichten sofort einen 5-Minuten-Lösch-Countdown — Anwesenheit allein ist der Beweis des Empfangs. Wenn der Empfänger die Nachricht allein abholt, kann er die einmalige „Empfangen"-Schaltfläche drücken, um den Empfang manuell zu bestätigen und die Löschung zu starten, oder einfach antworten. Sobald die Löschung beginnt, wird die Nachricht nach 5 Minuten unwiderruflich zerstört.

Der Absender kann sich jederzeit sicher erneut verbinden, um zu prüfen, ob seine Nachricht noch wartet — ohne einen Countdown auszulösen, solange er der Einzige im Raum ist. Keine der beiden Parteien muss gleichzeitig online sein. Keine der beiden Parteien braucht ein Konto. Keine der beiden Parteien ist identifizierbar. Der Server weiß nie, wer die Nachricht hinterlassen hat oder wer sie abgeholt hat — nur dass ein verschlüsselter Blob gespeichert und später abgerufen wurde. Nach der Löschung gibt es keinen Beweis, dass der Austausch jemals stattgefunden hat.`,
  faq_10_title: "Wie lange bestehen Räume?",
  faq_10_body: `Ein Raum existiert, solange er aktive Verbindungen oder nicht abgelaufene Nachrichten hat. Sobald die letzte Person die Verbindung trennt und alle Nachrichten abgelaufen oder gelöscht sind, ist der Raum verschwunden. Es gibt keinen persistenten Raumzustand. Wenn nie Nachrichten gesendet werden, ist der Raum nur eine Live-Verbindung — nichts wird gespeichert, und er verschwindet in dem Moment, in dem alle gehen.`,
  faq_11_title: "Was ist die Beenden-Schaltfläche?",
  faq_11_body: `Beenden löscht sofort jede Nachricht, die du während deiner aktuellen Sitzung gesendet hast, vom Server für alle im Raum. Andere Teilnehmer sehen, wie deine Nachrichten in Echtzeit von ihrem Bildschirm verschwinden. Danach wird deine Verbindung zum Raum getrennt. Verwende dies, wenn du ohne Spuren gehen musst.`,
  faq_12_title: "Was ist die Verlassen-Schaltfläche?",
  faq_12_body: `Verlassen trennt dich einfach vom Raum. Deine Nachrichten bleiben auf dem Server — ungelesene Nachrichten warten weiter (bis zu 24 Stunden), und bereits gelesene Nachrichten setzen ihren 5-Minuten-Lösch-Countdown fort. Wenn du dem Raum später wieder beitrittst, erhältst du einen neuen zufälligen Alias — es gibt keine Möglichkeit, deine alte und neue Identität zu verknüpfen.`,
  faq_13_title: "Was sind die zufälligen Aliase?",
  faq_13_body: `Wenn du einen Raum betrittst, wird dir ein zufälliger 8-Zeichen-Hex-Code (wie „a9f2b71c") als Alias zugewiesen. Dieser Alias wird in deinem Browser generiert, in jeder Nachricht verschlüsselt und niemals im Klartext an den Server gesendet. Wenn du die Verbindung trennst und dich erneut verbindest, erhältst du einen neuen Alias. Es gibt keine Möglichkeit, einen Alias zu reservieren, auszuwählen oder beizubehalten.`,
  faq_14_title: "Gibt es ein Teilnehmerlimit?",
  faq_14_body: `Jeder Raum unterstützt bis zu 50 gleichzeitige Verbindungen. Wenn der Raum voll ist, siehst du eine „Raum ist voll"-Meldung. Dieses Limit existiert, um Räume überschaubar zu halten und Missbrauch zu verhindern.`,
  faq_15_title: "Gibt es eine Ratenbegrenzung?",
  faq_15_body: `Ja. Jede Verbindung ist auf 1 Nachricht pro Sekunde begrenzt. Dies verhindert Spam und Missbrauch, ohne eine Identitätsverifizierung zu erfordern. Wenn du zu schnell Nachrichten sendest, siehst du einen kurzen „Langsamer"-Hinweis.`,
  faq_16_title: "Kann ich nullchat über Tor nutzen?",
  faq_16_body_1: `nullchat ist als Tor Hidden Service für Nutzer in zensierten Regionen oder für jeden verfügbar, der eine zusätzliche Ebene der Anonymität wünscht. Öffne den Tor Browser und navigiere zu:`,
  faq_16_body_2: `Standardmäßig verbinden sich sowohl die Clearnet- als auch die Tor-Version mit demselben Backend — Nutzer auf beiden Seiten können in denselben Räumen mit demselben gemeinsamen Geheimnis miteinander kommunizieren. Der .onion-Dienst leitet über Tor's Netzwerk ohne Cloudflare, ohne CDN und ohne Drittanbieter-Infrastruktur zwischen dir und dem Server. Tor leitet deine Verbindung über mehrere verschlüsselte Relays, sodass weder der Server noch ein Beobachter deine echte IP-Adresse oder deinen Standort bestimmen kann. Der .onion-Dienst verwendet reines HTTP, was erwartet und sicher ist — Tor selbst bietet Ende-zu-Ende-Verschlüsselung zwischen deinem Browser und dem Server. Die gesamte Verschlüsselung auf Anwendungsebene (NaCl secretbox, Argon2id-Schlüsselableitung) wird zusätzlich darauf angewendet. Hinweis: Der Tor Browser muss auf die Sicherheitsstufe „Standard" eingestellt sein, damit nullchat funktioniert, da die App JavaScript erfordert.`,
  faq_17_title: "Was ist ein Nur-Tor-Raum?",
  faq_17_body: `Wenn du nullchat über den .onion Hidden Service aufrufst, hast du die Möglichkeit, „Nur-Tor-Raum" zu aktivieren — ein Schalter, der auf dem Passworteingabe-Bildschirm erscheint. Wenn aktiviert, wird dein Raum in einen separaten Namensraum platziert, auf den nur andere Tor-Nutzer mit demselben aktivierten Schalter zugreifen können. Clearnet-Nutzer können einem Nur-Tor-Raum niemals beitreten, selbst wenn sie das gemeinsame Geheimnis kennen.

Dies bietet ein höheres Sicherheitsniveau als die standardmäßigen gemeinsamen Räume:

• Beide Parteien werden über Tor's Multi-Hop-Onion-Netzwerk geleitet — weder die echte IP-Adresse noch der Standort einer Partei ist für irgendjemanden sichtbar, einschließlich des Servers.
• Keine DNS-Abfragen, kein CDN und keine Drittanbieter-Infrastruktur berührt die Verbindung an irgendeinem Punkt.
• Verkehrsanalyse ist deutlich schwieriger, da beide Seiten von Tor's Relay-Padding in Kombination mit nullchats eigenem Verbindungs-Padding (zufällige Dummy-Frames in zufälligen Intervallen) profitieren.
• Es gibt keinen Clearnet-Teilnehmer, dessen schwächere Verbindungsmetadaten mit der Unterhaltung korreliert werden könnten.

Du bist nur so anonym wie das schwächste Glied in der Unterhaltung. In einem Standardraum berührt die Verbindung eines Clearnet-Teilnehmers DNS-Resolver, CDN-Infrastruktur und Standard-Internetrouting — all das kann auf Metadaten darüber, wer sich wann und von wo verbunden hat, beobachtet oder per Gerichtsbeschluss angefordert werden. Der Nur-Tor-Schalter eliminiert dieses Risiko vollständig, indem sichergestellt wird, dass jeder Teilnehmer das gleiche Maß an Anonymität auf Netzwerkebene hat.

Beide Parteien müssen sich auf die Aktivierung des Schalters einigen — es funktioniert genauso wie die Vereinbarung des gemeinsamen Geheimnisses. Der Chat-Header zeigt „TOR ONLY" in Grün an, wenn aktiv, oder „CLEARNET" in Rot für Standardräume, sodass du immer weißt, in welchem Modus du dich befindest.`,
  faq_18_title: "Was ist das Inaktivitäts-Timeout?",
  faq_18_body: `Wenn du 15 Minuten inaktiv bist — kein Tippen, kein Antippen, kein Scrollen — trennt nullchat automatisch deine Verbindung und kehrt zum Passworteingabe-Bildschirm zurück. Eine Warnung erscheint nach 13 Minuten und gibt dir die Möglichkeit zu bleiben. Dies schützt deine Sitzung, wenn du dein Gerät unbeaufsichtigt lässt, verhindert, dass Nachrichten gelöscht werden, während niemand aktiv liest, und stellt sicher, dass der Chat nicht auf einem unbeaufsichtigten Bildschirm sichtbar bleibt.`,
  faq_19_title: "Was ist mit IP-Adressen?",
  faq_19_body: `Im Clearnet (nullchat.org) wird die Anwendung auf Cloudflare's Edge-Netzwerk gehostet. Deine IP-Adresse wird auf der Infrastrukturebene verarbeitet und wird vom Anwendungscode niemals gelesen, protokolliert oder gespeichert. Der Servercode greift nicht auf IP-Header zu. Wir haben keinen Mechanismus, dich anhand deiner Netzwerkadresse zu identifizieren.

Auf dem Tor Hidden Service (.onion) ist deine IP-Adresse für den Server überhaupt nicht sichtbar — Tor's Onion-Routing gewährleistet vollständige Anonymität auf Netzwerkebene. Der Server sieht nur Verbindungen aus dem Tor-Netzwerk, ohne die Möglichkeit, sie zu dir zurückzuverfolgen.`,
  faq_20_title: "Gibt es Cookies oder Tracker?",
  faq_20_body: `Nein. nullchat setzt keine Cookies, verwendet keine Analysetools, lädt keine Drittanbieter-Skripte, bettet keine Tracking-Pixel ein und stellt keine externen Anfragen. Die Content-Security-Policy-Header erzwingen dies auf Browserebene. Du kannst dies in den Entwicklertools deines Browsers überprüfen.`,
  faq_21_title: "Warum kann ich keine Links, Bilder oder Dateien senden?",
  faq_21_body: `Absichtlich. nullchat ist rein textbasiert — keine Links, Bilder, Dateianhänge oder Medien jeglicher Art können gesendet oder dargestellt werden. Dies ist eine bewusste Sicherheitsentscheidung, keine Einschränkung. Anklickbare Links und eingebettete Medien sind die primäre Angriffsfläche für Zero-Day-Exploits, die von kommerzieller Spyware wie Pegasus, Predator und ähnlichen Überwachungswerkzeugen genutzt werden. Ein einziger bösartiger Link oder eine Datei kann ein gesamtes Gerät unbemerkt kompromittieren. Indem der Chat auf reinen Klartext reduziert wird, eliminiert nullchat diesen Angriffsvektor vollständig. Es gibt nichts zum Anklicken, nichts zum Herunterladen und nichts zum Rendern — was bedeutet: nichts zum Ausnutzen.`,
  faq_22_title: "Kann ich Nachrichten kopieren oder screenshotten?",
  faq_22_body: `nullchat erschwert aktiv das Erfassen von Nachrichteninhalten. Textauswahl und Kopieren sind im Chatbereich deaktiviert, Rechtsklick-Kontextmenüs sind blockiert und gängige Screenshot-Tastenkombinationen werden abgefangen. Die Screen-Capture-API des Browsers wird ebenfalls über Permissions-Policy-Header blockiert, wodurch webbasierte Bildschirmaufnahme-Tools daran gehindert werden, die Seite aufzuzeichnen.

Dies sind reibungsbasierte Schutzmaßnahmen, keine absoluten Garantien. Ein entschlossener Nutzer kann seinen Bildschirm immer mit einem anderen Gerät fotografieren oder Werkzeuge auf Betriebssystemebene verwenden, die Browser-Beschränkungen umgehen. Das Ziel ist, gelegentliches Erfassen zu erschweren und die Erwartung zu verstärken, dass Unterhaltungen in nullchat nicht dazu bestimmt sind, gespeichert zu werden.`,
  faq_23_title: "Was ist Täuschungsverkehr?",
  faq_23_body: `nullchat sendet automatisch verschlüsselte Dummy-Nachrichten in zufälligen Intervallen (alle 10–60 Sekunden), während du mit einem Raum verbunden bist. Diese Täuschungsnachrichten sind von echten Nachrichten nicht zu unterscheiden — sie haben dieselbe Größe (dank festem Padding), werden mit demselben Schlüssel verschlüsselt und über denselben Serverpfad weitergeleitet. Der Client des Empfängers verwirft sie nach der Entschlüsselung stillschweigend.

Täuschungsverkehr verhindert Verkehrsanalyse. Ohne ihn könnte ein Beobachter, der den Netzwerkverkehr überwacht, feststellen, wann echte Kommunikation stattfindet, basierend darauf, wann verschlüsselte Blobs gesendet werden. Mit Täuschungsverkehr gibt es einen konstanten Strom identisch aussehender Daten, unabhängig davon, ob tatsächlich jemand tippt — wodurch es unmöglich wird, echte Nachrichten von Rauschen zu unterscheiden.`,
  faq_24_title: "Was ist Verbindungs-Padding?",
  faq_24_body: `Der Server sendet binäre Frames zufälliger Länge (64–512 Bytes zufälliger Daten) an jeden verbundenen Client in zufälligen Intervallen (alle 5–30 Sekunden). Diese Frames sind keine Nachrichten — sie sind reines Rauschen, das der Client stillschweigend ignoriert. In Kombination mit clientseitigem Täuschungsverkehr stellt Verbindungs-Padding sicher, dass Netzwerkverkehrsmuster nichts darüber verraten, ob echte Kommunikation stattfindet, wie viele Nachrichten ausgetauscht werden oder wann Teilnehmer aktiv sind.`,
  faq_25_title: "Was ist die Paniktaste?",
  faq_25_body: `Dreimaliges schnelles Drücken der Escape-Taste löscht sofort deine Sitzung. Bei Auslösung sendet nullchat einen Beenden-Befehl an den Server (löscht alle deine Nachrichten), schließt die WebSocket-Verbindung, überschreibt den Verschlüsselungsschlüssel im Speicher mit Nullen, leert das DOM, löscht sessionStorage und localStorage, leert die Zwischenablage und leitet deinen Browser auf google.com um. Der gesamte Vorgang dauert weniger als eine Sekunde. Wenn der Browser versucht, die Seite aus dem Cache wiederherzustellen (z. B. über die Zurück-Taste), wird die Löschung automatisch erneut ausgelöst. Verwende dies, wenn du sofort alle Beweise der Unterhaltung von deinem Bildschirm und Browser entfernen musst.`,
  faq_26_title: "Was ist der steganografische Modus?",
  faq_26_body: `Der steganografische Modus tarnt die nullchat-Oberfläche als Texteditor. Drücke fünfmal schnell Shift, um ihn zu aktivieren. Die gesamte Benutzeroberfläche verwandelt sich — die dunkle Chat-Oberfläche wird durch eine vertraut aussehende Dokumenten-Bearbeitungsoberfläche mit Symbolleiste und Menüleiste ersetzt. Nachrichten erscheinen als Absätze im Dokumentkörper, und deine Eingabe fügt sich als aktives Tippen ein. Alle Verschlüsselungs-, Lösch-Timer- und Sicherheitsfunktionen arbeiten darunter normal weiter.

Dies ist nützlich, wenn dir jemand über die Schulter schaut oder dein Bildschirm für andere sichtbar ist. Auf den ersten Blick sieht es aus, als würdest du ein Dokument bearbeiten, nicht eine verschlüsselte Unterhaltung führen. Drücke erneut fünfmal Shift, um zur normalen Chat-Ansicht zurückzukehren.`,
  faq_27_title: "Löscht nullchat die Zwischenablage automatisch?",
  faq_27_body: `Ja. Wenn etwas kopiert wird, während du in einem Chatraum bist, löscht nullchat automatisch deine Zwischenablage nach 15 Sekunden. Die Zwischenablage wird auch geleert, wenn du den Tab schließt oder die Seite verlässt, und sofort, wenn du die Paniktaste verwendest. Dies verhindert, dass Nachrichteninhalte in deiner Zwischenablage verbleiben, nachdem du die Unterhaltung verlassen hast.`,
  faq_28_title: "Könnt ihr meine Nachrichten lesen?",
  faq_28_body: `Nein. Der Server ist ein einfacher Vermittler. Er empfängt verschlüsselte Blobs und leitet sie weiter. Der Verschlüsselungsschlüssel wird aus deinem gemeinsamen Geheimnis abgeleitet, das niemals deinen Browser verlässt. Wir haben den Schlüssel nicht. Wir können die Blobs nicht entschlüsseln. Selbst wenn der Server kompromittiert würde, würde der Angreifer nur bedeutungslosen Chiffretext erhalten.`,
  faq_29_title: "Können Regierungsbehörden auf meine Nachrichten zugreifen?",
  faq_29_body: `Wir können nicht herausgeben, was wir nicht haben. Es gibt nirgendwo gespeicherte Klartextnachrichten. Es gibt keine Benutzerkonten zum Nachschlagen. Es gibt keine IP-Protokolle zum Aushändigen. Die verschlüsselten Blobs löschen sich automatisch nach einem festen Zeitplan. Selbst bei einer gültigen gerichtlichen Anordnung könnten wir höchstens eine Sammlung verschlüsselter Blobs und Raum-Hashes vorlegen — von denen keiner ohne das gemeinsame Geheimnis, das nur die Teilnehmer kennen, nützlich ist.`,
  faq_30_title: "Ist nullchat Open Source?",
  faq_30_body_1: `Ja. Die gesamte Codebasis — Client, Server, Verschlüsselung und Infrastrukturkonfiguration — ist öffentlich zur Prüfung verfügbar unter`,
  faq_30_body_2: `. Du kannst überprüfen, ob der auf dem Server laufende Code mit dem veröffentlichten übereinstimmt, ihn selbst bauen oder deine eigene Instanz hosten. Transparenz ist nicht optional für ein Werkzeug, das dein Vertrauen für private Kommunikation verlangt.`,
  faq_31_title: "Wer hat nullchat gebaut?",
  faq_31_body_1: `nullchat wird von Artorias gebaut — einem von Veteranen geführten Nachrichtentechnologie-Unternehmen mit Sitz in New York City. Artorias existiert, um veraltete Systeme abzubauen und die wichtigsten Organisationen und Einzelpersonen mit Werkzeugen auszustatten, die speziell für den Betrieb im Verborgenen entwickelt wurden. Im Kern geht es bei Artorias darum, Nachrichtendienst und Anonymität zu demokratisieren — sicherzustellen, dass die Fähigkeit, sicher zu kommunizieren und ohne Überwachung zu agieren, kein Privileg weniger bleibt. nullchat ist ein Ausdruck dieser Mission: sichere Kommunikation auf das Wesentliche reduziert, ohne Kompromisse bei der kryptografischen Integrität. Mehr erfahren unter`,

};
