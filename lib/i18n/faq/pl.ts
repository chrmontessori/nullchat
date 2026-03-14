import type { FaqKey } from "../faq-translations";

export const pl: Record<FaqKey, string> = {
  faq_1_title: "Czym jest nullchat?",
  faq_1_body: `nullchat to anonimowy, szyfrowany end-to-end pokój czatowy, który nie wymaga kont, adresów e-mail, numerów telefonu ani żadnych danych osobowych. Wpisujesz wspólny sekret — hasło — i każda osoba, która wpisze to samo hasło, trafia do tego samego pokoju. To wszystko.`,
  faq_2_title: "Jak dołączyć do pokoju?",
  faq_2_body: `Ty i osoba, z którą chcesz rozmawiać, uzgadniacie wcześniej wspólny sekret — osobiście, przez telefon, w dowolny sposób. Oboje wpisujecie ten sekret w nullchat i jesteście w tym samym zaszyfrowanym pokoju. Nie ma listy pokoi, katalogu ani możliwości przeglądania. Jeśli nie znasz sekretu, pokój dla ciebie nie istnieje.`,
  faq_3_title: "Jak wybrać wspólny sekret?",
  faq_3_body: `Twój wspólny sekret to najważniejszy element twojego bezpieczeństwa. Jest zarówno kluczem do pokoju, jak i kluczem do szyfrowania — jeśli ktoś go odgadnie, może przeczytać wszystko. Traktuj go jak hasło do sejfu.

Wybierz coś długiego, losowego i niemożliwego do odgadnięcia. Silny sekret to co najmniej 5–6 losowych słów lub ponad 20 mieszanych znaków. Unikaj imion, dat, popularnych fraz, tekstów piosenek i czegokolwiek, co można znaleźć w mediach społecznościowych. Nigdy nie używaj tego samego sekretu w różnych rozmowach i pokojach.

Udostępniaj sekret przez bezpieczny kanał pozapasmowy — najlepiej osobiście. Rozmowa telefoniczna jest dopuszczalna. Nigdy nie wysyłaj go SMS-em, e-mailem, wiadomością prywatną ani na żadnej platformie, która rejestruje wiadomości. Jeśli podejrzewasz, że sekret został skompromitowany, natychmiast przestań go używać i uzgodnij nowy przez bezpieczny kanał.

Wskaźnik siły na ekranie wejściowym daje przybliżone pojęcie o odporności sekretu na ataki siłowe, ale żaden wskaźnik nie zastąpi rozsądku. W razie wątpliwości — wydłuż i dodaj losowości.`,
  faq_4_title: "Jak działa szyfrowanie?",
  faq_4_body: `Gdy wpisujesz wspólny sekret, dwie rzeczy dzieją się całkowicie w twojej przeglądarce:

1. Sekret jest przetwarzany przez Argon2id — pamięciowo wymagającą funkcję wyprowadzania klucza — z użyciem domeny soli, aby wygenerować identyfikator pokoju. Ten hash jest wysyłany do serwera, aby wiedział, do jakiego pokoju cię połączyć. Serwer nigdy nie widzi twojego właściwego sekretu.

2. Sekret jest przepuszczany przez drugie, niezależne wyprowadzenie Argon2id (64 MiB pamięci, 3 iteracje), aby wygenerować 256-bitowy klucz szyfrowania. Ten klucz nigdy nie opuszcza twojej przeglądarki. Argon2id wymaga dużych bloków pamięci RAM na każdą próbę, co sprawia, że ataki siłowe GPU i ASIC na twoje hasło są o rzędy wielkości trudniejsze niż przy tradycyjnych KDF.

Każda wiadomość, którą wysyłasz, jest szyfrowana za pomocą NaCl secretbox (XSalsa20-Poly1305) przy użyciu tego klucza, zanim opuści twoje urządzenie. Serwer odbiera, przechowuje i przekazuje wyłącznie szyfrogram — zaszyfrowane bloki danych, które bez klucza są bez znaczenia. Nie możemy czytać twoich wiadomości. Nikt nie może, chyba że zna wspólny sekret.`,
  faq_5_title: "Co widzi serwer?",
  faq_5_body: `Serwer widzi:
• Hash wyprowadzony przez Argon2id (identyfikator pokoju) — nie twoje hasło
• Zaszyfrowane bloki szyfrogramu — nie twoje wiadomości
• Liczbę aktywnych połączeń w pokoju
• Znaczniki czasu odbioru zaszyfrowanych bloków

Serwer NIE widzi:
• Twojego wspólnego sekretu / hasła
• Treści twoich wiadomości
• Twojej tożsamości ani nazwy użytkownika (aliasy są zaszyfrowane wewnątrz wiadomości)
• Twojego adresu IP (usuwany na brzegu sieci przez naszego dostawcę hostingu)`,
  faq_6_title: "Czym jest dopełnianie wiadomości?",
  faq_6_body: `Przed szyfrowaniem każda wiadomość jest dopełniana do stałego bloku 8192 bajtów z użyciem 2-bajtowego prefiksu długości, po którym następuje treść wiadomości i losowy szum. Oznacza to, że krótka wiadomość jak „cześć" generuje szyfrogram dokładnie tego samego rozmiaru co wiadomość o maksymalnej długości. Bez dopełniania obserwator mógłby odgadnąć treść wiadomości na podstawie długości szyfrogramu. Losowe wypełnienie szumem (nie zerami) zapewnia brak rozpoznawalnych wzorców w tekście jawnym przed szyfrowaniem. Dopełnianie całkowicie eliminuje ten kanał boczny.`,
  faq_7_title: "Czym jest zaciemnianie znaczników czasu?",
  faq_7_body: `Znaczniki czasu zawarte w wiadomościach są zaokrąglane do najbliższej minuty przed szyfrowaniem. Zapobiega to atakom korelacji czasowej, w których obserwator mógłby dopasować wzorce wiadomości między różnymi kanałami, porównując dokładne znaczniki czasu.`,
  faq_8_title: "Jak długo trwają wiadomości?",
  faq_8_body: `Wiadomości używają wielopoziomowego systemu timerów:

• Dead drop (pierwsza wiadomość): Wiadomość leży zaszyfrowana na serwerze do 24 godzin, czekając na odpowiedź. Nadawca może wyjść i wrócić, aby ją sprawdzić, bez uruchamiania odliczania. Samo wejście do pokoju nie spala wiadomości.

• Obaj użytkownicy obecni: Gdy druga osoba dołączy do pokoju, wszystkie nieprzeczytane wiadomości natychmiast rozpoczynają 5-minutowe odliczanie do spalenia. Każda nowa wiadomość wysłana, gdy obaj użytkownicy są obecni, również automatycznie spala się po 5 minutach. Nie trzeba nic robić — sama obecność potwierdza, że wiadomość jest czytana.

• Przycisk Odebrano: Jeśli odbierzesz wiadomość dead drop będąc sam w pokoju, możesz nacisnąć przycisk „Odebrano", aby ręcznie potwierdzić odbiór i uruchomić 5-minutowe spalanie. Ten przycisk pojawia się tylko raz — podczas początkowego odbioru dead drop — i nie jest dostępny podczas aktywnych rozmów.

• Aktywna rozmowa: Gdy w pokoju były już odpowiedzi, kolejne wiadomości mają 6-godzinne okno, jeśli odbiorca nie jest obecny. Jeśli obaj użytkownicy są połączeni, wiadomości spalają się automatycznie po 5 minutach.

• Twardy limit: Każda nieprzeczytana wiadomość jest usuwana po wygaśnięciu timera (24 godziny dla dead drop, 6 godzin dla aktywnych wiadomości) niezależnie od tego, czy została potwierdzona.

Nie ma archiwum, kopii zapasowej ani sposobu na odzyskanie usuniętej wiadomości.`,
  faq_9_title: "Czym jest dead drop?",
  faq_9_body: `nullchat działa jako cyfrowy dead drop. W tradycyjnym rzemiośle wywiadowczym dead drop to metoda przekazywania informacji między dwiema osobami bez konieczności spotkania lub przebywania w tym samym miejscu o tym samym czasie. nullchat działa dokładnie tak samo.

Wpisujesz wspólny sekret, zostawiasz zaszyfrowaną wiadomość i rozłączasz się. Wiadomość leży na serwerze — zaszyfrowana i nieczytelna dla nikogo, łącznie z nami — przez maksymalnie 24 godziny. Twój kontakt wpisuje ten sam sekret, gdy jest gotowy, i odbiera wiadomość. Gdy odbiorca dołączy i obaj użytkownicy są obecni, wszystkie oczekujące wiadomości natychmiast rozpoczynają 5-minutowe odliczanie do spalenia — sama obecność jest dowodem odbioru. Jeśli odbiorca odbierze wiadomość będąc sam, może nacisnąć jednorazowy przycisk „Odebrano", aby ręcznie potwierdzić odbiór i rozpocząć spalanie, lub po prostu odpowiedzieć. Po rozpoczęciu spalania wiadomość jest trwale zniszczona po 5 minutach.

Nadawca może bezpiecznie połączyć się ponownie w dowolnym momencie, aby sprawdzić, czy wiadomość nadal czeka — bez uruchamiania odliczania, o ile jest jedyną osobą w pokoju. Żadna ze stron nie musi być online w tym samym czasie. Żadna ze stron nie potrzebuje konta. Żadna ze stron nie jest identyfikowalna. Serwer nigdy nie wie, kto zostawił wiadomość ani kto ją odebrał — wie tylko, że zaszyfrowany blok został zapisany i później pobrany. Po spaleniu nie ma dowodu, że wymiana kiedykolwiek miała miejsce.`,
  faq_10_title: "Jak długo istnieją pokoje?",
  faq_10_body: `Pokój istnieje tak długo, jak ma aktywne połączenia lub niewygasłe wiadomości. Gdy ostatnia osoba się rozłączy i wszystkie wiadomości wygasną lub zostaną spalone, pokój znika. Nie ma trwałego stanu pokoju. Jeśli nie wysłano żadnych wiadomości, pokój jest tylko aktywnym połączeniem — nic nie jest przechowywane i znika w momencie, gdy wszyscy go opuszczą.`,
  faq_11_title: "Czym jest przycisk Zakończ?",
  faq_11_body: `Zakończ natychmiast usuwa z serwera każdą wiadomość, którą wysłałeś podczas bieżącej sesji, dla wszystkich w pokoju. Inni uczestnicy zobaczą, jak twoje wiadomości znikają z ich ekranów w czasie rzeczywistym. Następnie zostajesz rozłączony z pokoju. Użyj tego, jeśli musisz wyjść bez śladu.`,
  faq_12_title: "Czym jest przycisk Wyjdź?",
  faq_12_body: `Wyjdź po prostu rozłącza cię z pokoju. Twoje wiadomości pozostają na serwerze — nieprzeczytane wiadomości nadal czekają (do 24 godzin), a już przeczytane kontynuują 5-minutowe odliczanie do spalenia. Jeśli dołączysz ponownie do pokoju później, otrzymasz nowy losowy alias — nie ma sposobu, aby powiązać twoją starą i nową tożsamość.`,
  faq_13_title: "Czym są losowe aliasy?",
  faq_13_body: `Gdy wchodzisz do pokoju, otrzymujesz losowy 8-znakowy kod szesnastkowy (np. „a9f2b71c") jako alias. Ten alias jest generowany w twojej przeglądarce, szyfrowany wewnątrz każdej wiadomości i nigdy nie jest wysyłany do serwera w postaci jawnej. Jeśli się rozłączysz i połączysz ponownie, otrzymasz nowy alias. Nie ma możliwości rezerwacji, wyboru ani zachowania aliasu.`,
  faq_14_title: "Czy istnieje limit uczestników?",
  faq_14_body: `Każdy pokój obsługuje do 50 jednoczesnych połączeń. Jeśli pokój jest pełny, zobaczysz komunikat „Pokój jest pełny". Ten limit istnieje, aby zachować kameralność pokoi i zapobiec nadużyciom.`,
  faq_15_title: "Czy jest ograniczenie częstotliwości?",
  faq_15_body: `Tak. Każde połączenie jest ograniczone do 1 wiadomości na sekundę. Zapobiega to spamowi i nadużyciom bez konieczności weryfikacji tożsamości. Jeśli wysyłasz wiadomości zbyt szybko, zobaczysz krótki komunikat „Zwolnij".`,
  faq_16_title: "Czy mogę korzystać z nullchat przez Tor?",
  faq_16_body_1: `nullchat jest dostępny jako ukryta usługa Tor dla użytkowników w regionach objętych cenzurą lub każdego, kto chce dodatkowej warstwy anonimowości. Otwórz przeglądarkę Tor i przejdź do:`,
  faq_16_body_2: `Domyślnie zarówno wersja clearnet, jak i Tor łączą się z tym samym backendem — użytkownicy obu wersji mogą komunikować się ze sobą w tych samych pokojach, używając tego samego wspólnego sekretu. Usługa .onion kieruje ruch przez sieć Tor bez Cloudflare, bez CDN i bez infrastruktury firm trzecich między tobą a serwerem. Tor kieruje twoje połączenie przez wiele zaszyfrowanych przekaźników, więc ani serwer, ani żaden obserwator nie może ustalić twojego prawdziwego adresu IP ani lokalizacji. Usługa .onion używa zwykłego HTTP, co jest oczekiwane i bezpieczne — sam Tor zapewnia szyfrowanie end-to-end między twoją przeglądarką a serwerem. Całe szyfrowanie na poziomie aplikacji (NaCl secretbox, wyprowadzanie klucza Argon2id) działa ponad tym. Uwaga: przeglądarka Tor musi być ustawiona na poziom bezpieczeństwa „Standard", aby nullchat działał, ponieważ aplikacja wymaga JavaScript.`,
  faq_17_title: "Czym jest pokój tylko dla Tor?",
  faq_17_body: `Gdy korzystasz z nullchat przez ukrytą usługę .onion, masz opcję włączenia „Pokój tylko dla Tor" — przełącznika, który pojawia się na ekranie wpisywania hasła. Po włączeniu twój pokój jest umieszczany w oddzielnej przestrzeni nazw, do której mają dostęp tylko inni użytkownicy Tor z tym samym włączonym przełącznikiem. Użytkownicy clearnet nigdy nie mogą dołączyć do pokoju tylko dla Tor, nawet jeśli znają wspólny sekret.

Zapewnia to wyższy poziom bezpieczeństwa niż domyślne pokoje współdzielone:

• Obie strony są kierowane przez wieloprzeskokową sieć onion Tor — prawdziwy adres IP ani lokalizacja żadnej ze stron nie jest widoczna dla nikogo, w tym serwera.
• Brak zapytań DNS, CDN ani infrastruktury firm trzecich dotykającej połączenia w żadnym punkcie.
• Analiza ruchu jest znacznie trudniejsza, ponieważ obie strony korzystają z dopełniania przekaźnikowego Tor w połączeniu z własnym dopełnianiem połączeń nullchat (losowe puste ramki wysyłane w losowych odstępach).
• Nie ma uczestnika clearnet, którego słabsze metadane połączenia mogłyby być skorelowane z rozmową.

Jesteś tak anonimowy, jak najsłabsze ogniwo w rozmowie. W domyślnym pokoju połączenie uczestnika clearnet dotyka resolverów DNS, infrastruktury CDN i standardowego routingu internetowego — wszystko to może być obserwowane lub wydane na mocy wezwania sądowego w celu uzyskania metadanych o tym, kto się łączył, kiedy i skąd. Przełącznik tylko dla Tor całkowicie eliminuje to ryzyko, zapewniając każdemu uczestnikowi ten sam poziom anonimowości warstwy sieciowej.

Obie strony muszą zgodzić się na włączenie przełącznika — działa to tak samo jak uzgadnianie wspólnego sekretu. Nagłówek czatu wyświetla „TOR ONLY" na zielono, gdy jest aktywny, lub „CLEARNET" na czerwono dla standardowych pokoi, więc zawsze wiesz, w jakim trybie się znajdujesz.`,
  faq_18_title: "Czym jest limit czasu nieaktywności?",
  faq_18_body: `Jeśli jesteś nieaktywny przez 15 minut — bez pisania, dotykania, przewijania — nullchat automatycznie cię rozłączy i wróci do ekranu wpisywania hasła. Ostrzeżenie pojawia się po 13 minutach, dając ci opcję pozostania. Chroni to twoją sesję, gdy odchodzisz od urządzenia, zapobiegając spalaniu wiadomości, gdy nikt ich aktywnie nie czyta, i zapewniając, że czat nie pozostaje widoczny na pozostawionym bez nadzoru ekranie.`,
  faq_19_title: "A co z adresami IP?",
  faq_19_body: `W sieci clearnet (nullchat.org) aplikacja jest hostowana na brzegowej sieci Cloudflare. Twój adres IP jest obsługiwany na poziomie infrastruktury i nigdy nie jest odczytywany, rejestrowany ani przechowywany przez kod aplikacji. Kod serwera nie uzyskuje dostępu do nagłówków IP. Nie mamy mechanizmu identyfikacji cię po adresie sieciowym.

W ukrytej usłudze Tor (.onion) twój adres IP nigdy nie jest widoczny dla serwera — routing onion Tor zapewnia pełną anonimowość na poziomie sieci. Serwer widzi tylko połączenia z sieci Tor, bez możliwości prześledzenia ich do ciebie.`,
  faq_20_title: "Czy są jakieś pliki cookie lub trackery?",
  faq_20_body: `Nie. nullchat nie ustawia plików cookie, nie używa analityki, nie ładuje skryptów firm trzecich, nie osadza pikseli śledzących i nie wykonuje żadnych zewnętrznych żądań. Nagłówki Content Security Policy wymuszają to na poziomie przeglądarki. Możesz to zweryfikować w narzędziach deweloperskich przeglądarki.`,
  faq_21_title: "Dlaczego nie mogę wysyłać linków, obrazów ani plików?",
  faq_21_body: `Z założenia. nullchat obsługuje wyłącznie tekst — nie można wysyłać ani renderować linków, obrazów, załączników ani multimediów jakiegokolwiek rodzaju. To celowa decyzja bezpieczeństwa, nie ograniczenie. Klikalne linki i osadzone multimedia to główna powierzchnia ataku dla exploitów zero-day używanych przez komercyjne oprogramowanie szpiegowskie, takie jak Pegasus, Predator i podobne narzędzia inwigilacji. Jeden złośliwy link lub plik może cicho skompromitować całe urządzenie. Ograniczając czat do czystego tekstu, nullchat całkowicie eliminuje ten wektor ataku. Nie ma nic do kliknięcia, nic do pobrania i nic do renderowania — co oznacza, że nie ma nic do wykorzystania.`,
  faq_22_title: "Czy mogę kopiować lub robić zrzuty ekranu wiadomości?",
  faq_22_body: `nullchat aktywnie utrudnia przechwytywanie treści wiadomości. Zaznaczanie tekstu i kopiowanie są wyłączone w obszarze czatu, menu kontekstowe prawego przycisku myszy jest zablokowane, a popularne skróty klawiszowe do zrzutów ekranu są przechwytywane. Interfejs API Screen Capture przeglądarki jest również zablokowany za pomocą nagłówków Permissions-Policy, co uniemożliwia narzędziom do nagrywania ekranu opartym na przeglądarce przechwytywanie strony.

Są to zabezpieczenia oparte na tarciu, a nie absolutne gwarancje. Zdeterminowany użytkownik zawsze może sfotografować ekran innym urządzeniem lub użyć narzędzi na poziomie systemu operacyjnego, które omijają ograniczenia przeglądarki. Celem jest utrudnienie przypadkowego przechwytywania i wzmocnienie oczekiwania, że rozmowy w nullchat nie są przeznaczone do zapisywania.`,
  faq_23_title: "Czym jest ruch pozorny?",
  faq_23_body: `nullchat automatycznie wysyła zaszyfrowane wiadomości pozorne w losowych odstępach czasu (co 10–60 sekund), gdy jesteś połączony z pokojem. Te wiadomości pozorne są nieodróżnialne od prawdziwych wiadomości — mają ten sam rozmiar (dzięki stałemu dopełnianiu), są szyfrowane tym samym kluczem i przesyłane tą samą ścieżką serwerową. Klient odbiorcy cicho je odrzuca po odszyfrowaniu.

Ruch pozorny pokonuje analizę ruchu. Bez niego obserwator monitorujący ruch sieciowy mógłby określić, kiedy odbywa się prawdziwa komunikacja, na podstawie tego, kiedy wysyłane są zaszyfrowane bloki. Z ruchem pozornym istnieje stały strumień identycznie wyglądającego ruchu, niezależnie od tego, czy ktokolwiek faktycznie pisze — co uniemożliwia odróżnienie prawdziwych wiadomości od szumu.`,
  faq_24_title: "Czym jest dopełnianie połączenia?",
  faq_24_body: `Serwer wysyła ramki binarne o losowej długości (64–512 bajtów losowych danych) do każdego połączonego klienta w losowych odstępach czasu (co 5–30 sekund). Te ramki nie są wiadomościami — to czysty szum, który klient cicho ignoruje. W połączeniu z ruchem pozornym po stronie klienta dopełnianie połączenia zapewnia, że wzorce ruchu sieciowego nie ujawniają niczego o tym, czy odbywa się prawdziwa komunikacja, ile wiadomości jest wymienianych ani kiedy uczestnicy są aktywni.`,
  faq_25_title: "Czym jest klawisz paniki?",
  faq_25_body: `Potrójne naciśnięcie klawisza Escape natychmiast czyści twoją sesję. Po uruchomieniu nullchat wysyła polecenie zakończenia do serwera (usuwając wszystkie twoje wiadomości), zamyka połączenie WebSocket, zeruje klucz szyfrowania w pamięci, czyści DOM, wymazuje sessionStorage i localStorage, czyści schowek i przekierowuje przeglądarkę na google.com. Cały proces trwa mniej niż sekundę. Jeśli przeglądarka próbuje przywrócić stronę z pamięci podręcznej (np. przyciskiem wstecz), czyszczenie jest automatycznie uruchamiane ponownie. Użyj tego, jeśli musisz natychmiast usunąć wszelkie dowody rozmowy z ekranu i przeglądarki.`,
  faq_26_title: "Czym jest tryb steganograficzny?",
  faq_26_body: `Tryb steganograficzny maskuje interfejs nullchat jako edytor dokumentów. Naciśnij Shift pięć razy szybko, aby go aktywować. Cały interfejs się transformuje — ciemny interfejs czatu zostaje zastąpiony znajomo wyglądającym interfejsem edycji dokumentów z paskiem narzędzi i paskiem menu. Wiadomości pojawiają się jako akapity w treści dokumentu, a twój tekst wejściowy wtapia się jako aktywne pisanie. Całe szyfrowanie, timery spalania i funkcje bezpieczeństwa nadal działają normalnie pod spodem.

Jest to przydatne, gdy ktoś patrzy ci przez ramię lub gdy twój ekran jest widoczny dla innych. Na pierwszy rzut oka wygląda to, jakbyś edytował dokument, a nie prowadził zaszyfrowaną rozmowę. Naciśnij Shift pięć razy ponownie, aby wrócić do normalnego widoku czatu.`,
  faq_27_title: "Czy nullchat automatycznie czyści schowek?",
  faq_27_body: `Tak. Jeśli cokolwiek zostanie skopiowane podczas pobytu w pokoju czatowym, nullchat automatycznie czyści twój schowek po 15 sekundach. Schowek jest również czyszczony po zamknięciu karty lub opuszczeniu strony, a także natychmiast po użyciu klawisza paniki. Zapobiega to zaleganiu treści wiadomości w schowku po opuszczeniu rozmowy.`,
  faq_28_title: "Czy możecie czytać moje wiadomości?",
  faq_28_body: `Nie. Serwer jest prostym przekaźnikiem. Odbiera zaszyfrowane bloki i je przekazuje. Klucz szyfrowania jest wyprowadzany z twojego wspólnego sekretu, który nigdy nie opuszcza twojej przeglądarki. Nie mamy klucza. Nie możemy odszyfrować bloków. Nawet gdyby serwer został skompromitowany, atakujący uzyskałby jedynie bezsensowny szyfrogram.`,
  faq_29_title: "Czy agencje rządowe mogą uzyskać dostęp do moich wiadomości?",
  faq_29_body: `Nie możemy dostarczyć tego, czego nie mamy. Nigdzie nie są przechowywane wiadomości w postaci jawnej. Nie ma kont użytkowników do przeszukania. Nie ma logów IP do wydania. Zaszyfrowane bloki są automatycznie usuwane według stałego harmonogramu. Nawet na mocy ważnego nakazu prawnego, jedyne co moglibyśmy przedstawić to kolekcja zaszyfrowanych bloków i hashy pokoi — żadne z nich nie jest użyteczne bez wspólnego sekretu, który znają wyłącznie uczestnicy.`,
  faq_30_title: "Czy nullchat jest open source?",
  faq_30_body_1: `Tak. Cały kod źródłowy — klient, serwer, szyfrowanie i konfiguracja infrastruktury — jest publicznie dostępny do audytu na`,
  faq_30_body_2: `. Możesz zweryfikować, czy kod działający na serwerze odpowiada temu, co jest opublikowane, zbudować go samodzielnie lub uruchomić własną instancję. Przejrzystość nie jest opcjonalna dla narzędzia, które prosi cię o zaufanie w kwestii prywatnej komunikacji.`,
  faq_31_title: "Kto zbudował nullchat?",
  faq_31_body_1: `nullchat jest budowany przez Artorias — firmę technologii wywiadowczych prowadzoną przez weteranów, z siedzibą w Nowym Jorku. Artorias istnieje, aby demontować przestarzałe systemy i wyposażać najważniejsze organizacje i osoby w narzędzia celowo zaprojektowane do działania w ukryciu. U swoich podstaw Artorias dąży do demokratyzacji wywiadu i anonimowości — zapewniając, że zdolność do bezpiecznej komunikacji i działania bez inwigilacji nie jest przywilejem zarezerwowanym dla nielicznych. nullchat jest jednym z wyrazów tej misji: bezpieczna komunikacja okrojona do esencji, bez kompromisów w zakresie integralności kryptograficznej. Dowiedz się więcej na`,

};
