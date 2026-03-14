import type { FaqKey } from "../faq-translations";

export const sw: Record<FaqKey, string> = {
  faq_1_title: "nullchat ni nini?",
  faq_1_body: `nullchat ni chumba cha mazungumzo kisichojulikana, kilichosimbwa fiche kutoka mwanzo hadi mwisho ambacho hakihitaji akaunti, barua pepe, nambari za simu, wala taarifa yoyote ya kibinafsi. Unaingiza siri iliyoshirikiwa — nenosiri — na mtu yeyote mwingine anayeingiza nenosiri hilohilo anaingia chumba kilekile. Ndiyo tu.`,
  faq_2_title: "Ninajiunga vipi na chumba?",
  faq_2_body: `Wewe na mtu unayetaka kuzungumza naye mnakubaliana kuhusu siri iliyoshirikiwa mapema — ana kwa ana, kupitia simu, jinsi yoyote mtakavyo. Wote wawili mnaandika siri hiyo kwenye nullchat na mnakuwa katika chumba kilekile kilichosimbwa fiche. Hakuna orodha ya vyumba, hakuna saraka, hakuna njia ya kutafuta. Ikiwa hujui siri hiyo, chumba hakipo kwako.`,
  faq_3_title: "Nichague vipi siri iliyoshirikiwa?",
  faq_3_body: `Siri yako iliyoshirikiwa ndiyo kipengele muhimu zaidi cha usalama wako. Ni ufunguo wa chumba chako na pia ufunguo wa usimbaji fiche wako — ikiwa mtu ataigundua, anaweza kusoma kila kitu. Ichukulie kama nenosiri la kasiki.

Chagua kitu kirefu, kisichokuwa na mpangilio, na kisichoweza kukisiwa. Siri imara ina angalau maneno 5–6 ya nasibu au herufi 20+ mchanganyiko. Epuka majina, tarehe, misemo ya kawaida, maneno ya nyimbo, au chochote ambacho mtu anaweza kupata kwenye mitandao yako ya kijamii. Usitumie tena siri katika mazungumzo au vyumba tofauti.

Shiriki siri yako kupitia njia salama nje ya mtandao — ana kwa ana ndiyo bora zaidi. Simu inakubalika. Usitume kamwe kupitia ujumbe mfupi, barua pepe, ujumbe wa moja kwa moja, au jukwaa lolote linalohifadhi ujumbe. Ukishuku siri imevunjwa, acha kuitumia mara moja na kukubaliane kuhusu siri mpya kupitia njia salama.

Kiashiria cha nguvu kwenye skrini ya kuingia kinakupa makadirio ya jinsi siri yako inavyostahimili mashambulizi ya nguvu, lakini hakuna kiashiria kinachoweza kuchukua nafasi ya uamuzi mzuri. Ukiwa na shaka, ifanye ndefu zaidi na isiyo na mpangilio zaidi.`,
  faq_4_title: "Usimbaji fiche unafanya kazi vipi?",
  faq_4_body: `Unapoingiza siri yako iliyoshirikiwa, mambo mawili hutokea ndani ya kivinjari chako:

1. Siri inasindikwa kupitia Argon2id — kazi ya kupata ufunguo inayohitaji kumbukumbu kubwa — ikitumia chumvi iliyotengwa kwa kikoa ili kutoa kitambulisho cha chumba. Hashi hii inatumwa kwa seva ili ijue chumba kipi cha kukuunganisha. Seva haioni siri yako halisi kamwe.

2. Siri inaendeshwa kupitia uondoaji wa pili, huru wa Argon2id (kumbukumbu ya 64 MiB, marudio 3) kutoa ufunguo wa usimbaji fiche wa biti 256. Ufunguo huu hauondoki kwenye kivinjari chako kamwe. Argon2id inahitaji vitalu vikubwa vya RAM kwa kila jaribio la kukisia, na kufanya mashambulizi ya nguvu ya GPU na ASIC kwenye nenosiri lako kuwa magumu zaidi kuliko KDF za kitamaduni.

Kila ujumbe unaotuma unasimbwa fiche kwa NaCl secretbox (XSalsa20-Poly1305) ukitumia ufunguo huo kabla ya kuondoka kwenye kifaa chako. Seva inapokea, kuhifadhi, na kupeleka maandishi yaliyosimbwa fiche pekee — vipande visivyoeleweka bila ufunguo. Hatuwezi kusoma ujumbe wako. Hakuna mtu anayeweza, isipokuwa anajua siri iliyoshirikiwa.`,
  faq_5_title: "Seva inaona nini?",
  faq_5_body: `Seva inaona:
• Hashi iliyotolewa na Argon2id (kitambulisho cha chumba) — si nenosiri lako
• Vipande vya maandishi yaliyosimbwa fiche — si ujumbe wako
• Idadi ya miunganisho hai katika chumba
• Muda wa vipande vilivyosimbwa fiche vilipopokewa

Seva HAIONI:
• Siri yako iliyoshirikiwa / nenosiri
• Maudhui ya ujumbe wako
• Utambulisho wako au jina la mtumiaji (majina bandia yanasimbwa fiche ndani ya ujumbe)
• Anwani yako ya IP (inaondolewa pembezoni na mtoa huduma wetu wa kupangisha)`,
  faq_6_title: "Ujazaji wa ujumbe ni nini?",
  faq_6_body: `Kabla ya usimbaji fiche, kila ujumbe unajazwa hadi kizuizi cha baiti 8,192 kisichobadilika kwa kutumia kiambishi cha urefu cha baiti 2 kikifuatiwa na maudhui ya ujumbe na kelele za nasibu. Hii inamaanisha ujumbe mfupi kama "hujambo" hutoa maandishi yaliyosimbwa fiche ya ukubwa sawa na ujumbe wa urefu wa juu. Bila ujazaji, mwangalizi angeweza kukisia maudhui ya ujumbe kulingana na urefu wa maandishi yaliyosimbwa fiche. Kujaza kwa kelele za nasibu (si sufuri) kunahakikisha hakuna muundo unaotambulika katika maandishi kabla ya usimbaji fiche. Ujazaji unaondoa njia hii ya upande kabisa.`,
  faq_7_title: "Uficho wa muda ni nini?",
  faq_7_body: `Muda uliojumuishwa katika ujumbe unakaribishwa hadi dakika ya karibu kabla ya usimbaji fiche. Hii inazuia mashambulizi ya uhusiano wa muda ambapo mwangalizi anaweza kulinganisha mifumo ya ujumbe katika njia tofauti kwa kulinganisha muda halisi.`,
  faq_8_title: "Ujumbe unadumu kwa muda gani?",
  faq_8_body: `Ujumbe hutumia mfumo wa vipima muda vilivyopangwa:

• Kisanduku cha siri (ujumbe wa kwanza): Ujumbe unakaa umesimbwa fiche kwenye seva kwa hadi saa 24, ukisubiri jibu. Mtumaji anaweza kuondoka na kurudi kuangalia bila kusababisha mhesabu wowote wa muda. Kuingia tu kwenye chumba hakuunguzi ujumbe.

• Watumiaji wote wawili wapo: Mtu wa pili anapojiunga na chumba, ujumbe wote usiosomwa huanza mara moja mhesabu wa kuungua wa dakika 5. Kila ujumbe mpya unaotumwa wakati watumiaji wote wapo pia huungua kiotomatiki baada ya dakika 5. Hakuna hatua inayohitajika — uwepo pekee unathibitisha ujumbe unasomwa.

• Kitufe cha Imepokelewa: Ukipokea ujumbe wa kisanduku cha siri ukiwa peke yako chumbani, unaweza kubonyeza kitufe cha "Imepokelewa" kuthibitisha kupokea kwa mkono na kuanza kuungua kwa dakika 5. Kitufe hiki kinaonekana mara moja tu — wakati wa kupokea kisanduku cha siri kwa mara ya kwanza — na hakipatikani wakati wa mazungumzo hai.

• Mazungumzo hai: Chumba kikishaona majibu, ujumbe unaofuata una dirisha la saa 6 ikiwa mpokeaji hayupo. Watumiaji wote wakiunganishwa, ujumbe huungua kiotomatiki baada ya dakika 5.

• Kikomo cha juu: Ujumbe wowote usiosomwa unafutwa baada ya kipima muda chake kuisha (saa 24 kwa visanduku vya siri, saa 6 kwa ujumbe hai) bila kujali kama ulithibitishwa au la.

Hakuna hifadhi, hakuna nakala, hakuna njia ya kurejesha ujumbe uliofutwa.`,
  faq_9_title: "Kisanduku cha siri ni nini?",
  faq_9_body: `nullchat inafanya kazi kama kisanduku cha siri cha kidijitali. Katika mbinu za kitamaduni za ujasusi, kisanduku cha siri ni njia ya kupitisha taarifa kati ya watu wawili bila wao kuhitaji kukutana au kuwa mahali pamoja kwa wakati mmoja. nullchat inafanya kazi kwa njia ileile.

Unaingiza siri iliyoshirikiwa, unaacha ujumbe uliosimbwa fiche, na kukatisha muunganisho. Ujumbe unakaa kwenye seva — umesimbwa fiche na hauwezi kusomwa na mtu yeyote, ikiwa ni pamoja na sisi — kwa hadi saa 24. Mwasiliani wako anaingiza siri ileile wakati wowote anapokuwa tayari, na kupokea ujumbe. Mpokeaji anapojiunga na watumiaji wote wapo, ujumbe wote unaosubiri huanza mara moja mhesabu wa kuungua wa dakika 5 — uwepo pekee ni uthibitisho wa kupokea. Mpokeaji akipokea ujumbe akiwa peke yake, anaweza kubonyeza kitufe cha "Imepokelewa" cha mara moja kuthibitisha kupokea na kuanza kuungua, au kujibu tu. Kuungua kunapoanza, ujumbe unaharibiwa kabisa baada ya dakika 5.

Mtumaji anaweza kuunganisha tena salama wakati wowote kuangalia kama ujumbe wao bado unasubiri — bila kusababisha mhesabu wowote wa muda, maadamu yuko peke yake chumbani. Hakuna upande unaohitaji kuwa mtandaoni kwa wakati mmoja. Hakuna upande unaohitaji akaunti. Hakuna upande unaotambulika. Seva haijui kamwe ni nani aliyeacha ujumbe au ni nani aliyeupokea — inajua tu kwamba kipande kilichosimbwa fiche kilihifadhiwa na baadaye kuchukuliwa. Baada ya kuungua, hakuna ushahidi kwamba ubadilishanaji uliwahi kutokea.`,
  faq_10_title: "Vyumba vinadumu kwa muda gani?",
  faq_10_body: `Chumba kipo maadamu kina miunganisho hai au ujumbe ambao haujamalizika muda wake. Mtu wa mwisho anapokatisha muunganisho na ujumbe wote umeisha muda wake au kuungua, chumba kinapotea. Hakuna hali ya chumba inayoendelea. Ikiwa hakuna ujumbe uliotumwa, chumba ni muunganisho wa moja kwa moja tu — hakuna kinachohifadhiwa, na kinapotea mara tu kila mtu anapoondoka.`,
  faq_11_title: "Kitufe cha Maliza ni nini?",
  faq_11_body: `Maliza inafuta mara moja kila ujumbe uliotuma wakati wa kikao chako cha sasa kutoka kwenye seva kwa kila mtu chumbani. Washiriki wengine wataona ujumbe wako ukitoweka kutoka kwenye skrini yao kwa wakati halisi. Kisha unakatishwa muunganisho kutoka kwenye chumba. Tumia hii ikiwa unahitaji kuondoka bila kuacha alama.`,
  faq_12_title: "Kitufe cha Ondoka ni nini?",
  faq_12_body: `Ondoka inakukatisha muunganisho tu kutoka kwenye chumba. Ujumbe wako unabaki kwenye seva — ujumbe usiosomwa unaendelea kusubiri (hadi saa 24), na ujumbe uliosomwa tayari unaendelea mhesabu wao wa kuungua wa dakika 5. Ukijiunga tena na chumba baadaye, utapata jina bandia jipya la nasibu — hakuna njia ya kuunganisha utambulisho wako wa zamani na mpya.`,
  faq_13_title: "Majina bandia ya nasibu ni nini?",
  faq_13_body: `Unapoingia chumbani, unapewa msimbo wa hex wa herufi 8 za nasibu (kama "a9f2b71c") kama jina lako bandia. Jina hili bandia linazalishwa katika kivinjari chako, linasimbwa fiche ndani ya kila ujumbe, na halitumwi kamwe kwa seva kwa maandishi wazi. Ukikatisha muunganisho na kuunganisha tena, unapata jina bandia jipya. Hakuna njia ya kuhifadhi, kuchagua, au kudumisha jina bandia.`,
  faq_14_title: "Kuna kikomo cha washiriki?",
  faq_14_body: `Kila chumba kinasaidia hadi miunganisho 50 kwa wakati mmoja. Chumba kikiwa kimejaa, utaona ujumbe wa "Chumba kimejaa". Kikomo hiki kipo ili kuweka vyumba kuwa vya karibu na kuzuia matumizi mabaya.`,
  faq_15_title: "Kuna udhibiti wa kasi?",
  faq_15_body: `Ndiyo. Kila muunganisho una kikomo cha ujumbe 1 kwa sekunde. Hii inazuia taka na matumizi mabaya bila kuhitaji uthibitishaji wowote wa utambulisho. Ukituma ujumbe haraka sana, utaona taarifa fupi ya "Pole pole".`,
  faq_16_title: "Ninaweza kufikia nullchat kupitia Tor?",
  faq_16_body_1: `nullchat inapatikana kama huduma ya siri ya Tor kwa watumiaji katika maeneo yaliyodhibitiwa au mtu yeyote anayetaka safu ya ziada ya kutokujulikana. Fungua Tor Browser na uende kwenye:`,
  faq_16_body_2: `Kwa chaguo-msingi, matoleo ya clearnet na Tor yanaunganishwa na seva ile ile — watumiaji katika yoyote wanaweza kuwasiliana katika vyumba vilevile kwa kutumia siri iliyoshirikiwa ileile. Huduma ya .onion inapitia mtandao wa Tor bila Cloudflare, bila CDN, na bila miundombinu ya wahusika wengine kati yako na seva. Tor inaelekeza muunganisho wako kupitia vituo vingi vilivyosimbwa fiche, hivyo seva wala mwangalizi yeyote hawezi kutambua anwani yako halisi ya IP au mahali ulipo. Huduma ya .onion inatumia HTTP wazi, ambayo ni ya kawaida na salama — Tor yenyewe hutoa usimbaji fiche wa mwanzo hadi mwisho kati ya kivinjari chako na seva. Usimbaji fiche wote wa kiwango cha programu (NaCl secretbox, uondoaji wa ufunguo wa Argon2id) unatumika juu ya hilo. Kumbuka: Tor Browser lazima iwekwe kwa kiwango cha usalama cha "Standard" ili nullchat ifanye kazi, kwani programu inahitaji JavaScript.`,
  faq_17_title: "Chumba cha Tor pekee ni nini?",
  faq_17_body: `Unapofika nullchat kupitia huduma ya siri ya .onion, una chaguo la kuwasha "Chumba cha Tor pekee" — kitufe cha kubadilisha kinachoonekana kwenye skrini ya kuingiza nenosiri. Kikiwashwa, chumba chako kinawekwa katika nafasi tofauti ambayo watumiaji wengine wa Tor tu wenye kitufe kilekile kilichowashwa wanaweza kufikia. Watumiaji wa clearnet hawawezi kamwe kujiunga na chumba cha Tor pekee, hata wakijua siri iliyoshirikiwa.

Hii inatoa kiwango cha juu cha usalama kuliko vyumba vya chaguo-msingi vilivyoshirikiwa:

• Pande zote mbili zinapitishwa kupitia mtandao wa onion wa Tor wenye vituo vingi — anwani halisi ya IP au mahali pa upande wowote haionekani kwa mtu yeyote, ikiwa ni pamoja na seva.
• Hakuna utafutaji wa DNS, hakuna CDN, na hakuna miundombinu ya wahusika wengine inayogusa muunganisho wakati wowote.
• Uchambuzi wa trafiki ni mgumu zaidi kwa sababu pande zote zinafaidika na ujazaji wa vituo vya Tor pamoja na ujazaji wa muunganisho wa nullchat yenyewe (fremu za nasibu zisizo na maana zinazotumwa kwa vipindi vya nasibu).
• Hakuna mshiriki wa clearnet ambaye metadata yake dhaifu ya muunganisho inaweza kuhusishwa na mazungumzo.

Wewe ni salama kama kiungo dhaifu zaidi katika mazungumzo. Katika chumba cha chaguo-msingi, muunganisho wa mshiriki wa clearnet unagusa visuluhishi vya DNS, miundombinu ya CDN, na uelekezaji wa kawaida wa mtandao — ambavyo vyote vinaweza kuangaliwa au kuamriwa kisheria kwa metadata kuhusu ni nani aliyeunganisha, lini, na kutoka wapi. Kitufe cha Tor pekee kinaondoa hatari hii kabisa kwa kuhakikisha kila mshiriki ana kiwango sawa cha kutokujulikana kwa safu ya mtandao.

Pande zote mbili lazima zikubaliane kuwasha kitufe — inafanya kazi kwa njia ileile kama kukubaliana kuhusu siri iliyoshirikiwa. Kichwa cha mazungumzo kinaonyesha "TOR PEKEE" kwa kijani kikiwashwa, au "CLEARNET" kwa nyekundu kwa vyumba vya kawaida, hivyo unajua kila wakati uko katika hali ipi.`,
  faq_18_title: "Muda wa kutokuwa na shughuli ni nini?",
  faq_18_body: `Ukiwa bila shughuli kwa dakika 15 — hakuna kuandika, hakuna kubonyeza, hakuna kusogeza — nullchat itakukatisha muunganisho kiotomatiki na kukurudisha kwenye skrini ya kuingiza nenosiri. Onyo linaonekana dakika ya 13 likikupa chaguo la kubaki. Hii inalinda kikao chako ukiondoka kwenye kifaa chako, kuzuia ujumbe kuungua wakati hakuna mtu anayesoma kwa bidii, na kuhakikisha mazungumzo hayaachwi yakionekana kwenye skrini isiyoangaliwa.`,
  faq_19_title: "Vipi kuhusu anwani za IP?",
  faq_19_body: `Kwenye clearnet (nullchat.org), programu inapangishwa kwenye mtandao wa pembezoni wa Cloudflare. Anwani yako ya IP inashughulikiwa katika safu ya miundombinu na haisomwi, kurekodiwa, au kuhifadhiwa na msimbo wa programu kamwe. Msimbo wa seva haufikii vichwa vya IP. Hatuna utaratibu wa kukutambua kwa anwani ya mtandao.

Kwenye huduma ya siri ya Tor (.onion), anwani yako ya IP haionekani kwa seva kamwe — uelekezaji wa onion wa Tor unahakikisha kutokujulikana kamili kwa kiwango cha mtandao. Seva inaona miunganisho kutoka kwenye mtandao wa Tor tu, bila njia ya kukufuatilia.`,
  faq_20_title: "Kuna vidakuzi au vifuatiliaji?",
  faq_20_body: `Hapana. nullchat haiweki vidakuzi, haitumii uchanganuzi, haipakii hati za wahusika wengine, haijumuishi pikseli za ufuatiliaji, na haifanyi maombi ya nje. Vichwa vya Sera ya Usalama wa Maudhui vinatekeleza hili kwa kiwango cha kivinjari. Unaweza kuthibitisha hili katika zana za msanidi wa kivinjari chako.`,
  faq_21_title: "Kwa nini siwezi kutuma viungo, picha, au faili?",
  faq_21_body: `Kwa makusudi. nullchat ni ya maandishi pekee — hakuna viungo, picha, viambatisho vya faili, au media ya aina yoyote inayoweza kutumwa au kuonyeshwa. Hii ni uamuzi wa usalama wa makusudi, si kikomo. Viungo vinavyobonyezeka na media iliyojumuishwa ndio sehemu kuu ya mashambulizi ya matumizi ya siku-sifuri yanayotumiwa na programu za kijasusi za kibiashara kama Pegasus, Predator, na zana kama hizo za ufuatiliaji. Kiungo kimoja au faili hatari inaweza kuhatarisha kifaa kizima kwa siri. Kwa kuondoa mazungumzo hadi maandishi wazi pekee, nullchat inaondoa njia hii ya mashambulizi kabisa. Hakuna cha kubonyeza, hakuna cha kupakua, na hakuna cha kuonyesha — ambayo inamaanisha hakuna cha kutumia vibaya.`,
  faq_22_title: "Ninaweza kunakili au kupiga picha ya skrini ya ujumbe?",
  faq_22_body: `nullchat inazuia kikamilifu kunasa maudhui ya ujumbe. Kuchagua na kunakili maandishi kumezimwa katika eneo la mazungumzo, menyu za muktadha za kubonyeza-kulia zimezuiwa, na njia za mkato za kawaida za kupiga picha ya skrini zinazuiliwa. API ya Kunasa Skrini ya kivinjari pia imezuiwa kupitia vichwa vya Sera ya Ruhusa, kuzuia zana za kurekodi skrini za wavuti kunasa ukurasa.

Hizi ni ulinzi wa msuguano, si dhamana kamili. Mtumiaji aliyeazimia anaweza kila wakati kupiga picha ya skrini yake kwa kifaa kingine au kutumia zana za kiwango cha mfumo wa uendeshaji zinazopita vizuizi vya kivinjari. Lengo ni kufanya kunasa kwa kawaida kuwa vigumu na kuimarisha matarajio kwamba mazungumzo katika nullchat hayakusudiwi kuhifadhiwa.`,
  faq_23_title: "Trafiki bandia ni nini?",
  faq_23_body: `nullchat inatuma kiotomatiki ujumbe bandia uliosimbwa fiche kwa vipindi vya nasibu (kila sekunde 10–60) wakati umeunganishwa kwenye chumba. Ujumbe huu bandia hauwezi kutofautishwa na ujumbe halisi — una ukubwa sawa (shukrani kwa ujazaji uliowekwa), umesimbwa fiche kwa ufunguo uleule, na unapitishwa kupitia njia ileile ya seva. Programu ya mpokeaji inaiondoa kimya baada ya usimbaji fiche kufunguliwa.

Trafiki bandia inashinda uchambuzi wa trafiki. Bila hiyo, mwangalizi anayefuatilia trafiki ya mtandao angeweza kutambua wakati mawasiliano halisi yanatokea kulingana na wakati vipande vilivyosimbwa fiche vinatumwa. Na trafiki bandia, kuna mkondo unaoendelea wa trafiki inayoonekana sawa bila kujali kama mtu yeyote anaandika kweli — na kufanya iwezekane kutofautisha ujumbe halisi na kelele.`,
  faq_24_title: "Ujazaji wa muunganisho ni nini?",
  faq_24_body: `Seva inatuma fremu za binary za urefu wa nasibu (baiti 64–512 za data ya nasibu) kwa kila mteja aliyeunganishwa kwa vipindi vya nasibu (kila sekunde 5–30). Fremu hizi si ujumbe — ni kelele tupu ambazo mteja anazipuuza kimya. Pamoja na trafiki bandia ya upande wa mteja, ujazaji wa muunganisho unahakikisha kwamba mifumo ya trafiki ya mtandao haifichua chochote kuhusu kama mawasiliano halisi yanatokea, ujumbe ngapi unabadilishwa, au washiriki wako hai lini.`,
  faq_25_title: "Kitufe cha hofu ni nini?",
  faq_25_body: `Kubonyeza haraka kitufe cha Escape mara tatu kunafuta kikao chako mara moja. Inapowashwa, nullchat inatuma amri ya kumaliza kwa seva (kufuta ujumbe wako wote), kufunga muunganisho wa WebSocket, kufuta ufunguo wa usimbaji fiche kwenye kumbukumbu, kusafisha DOM, kufuta sessionStorage na localStorage, kusafisha clipboard, na kuelekeza kivinjari chako kwenye google.com. Mchakato wote unachukua chini ya sekunde moja. Ikiwa kivinjari kinajaribu kurejesha ukurasa kutoka kwenye kashe (k.m., kupitia kitufe cha kurudi nyuma), ufutaji unasababishwa tena kiotomatiki. Tumia hii ikiwa unahitaji kufuta mara moja ushahidi wote wa mazungumzo kutoka kwenye skrini na kivinjari chako.`,
  faq_26_title: "Hali ya steganografia ni nini?",
  faq_26_body: `Hali ya steganografia inabadilisha kiolesura cha nullchat kuonekana kama kihariri cha hati. Bonyeza Shift mara tano haraka kuiwasha. Kiolesura kizima kinabadilika — kiolesura cha giza cha mazungumzo kinabadilishwa na kiolesura kinachojulikana cha kuhariri hati chenye upau wa zana na upau wa menyu. Ujumbe unaonekana kama aya katika mwili wa hati, na maandishi yako yanachanganyika kama uandikaji hai. Usimbaji fiche wote, vipima muda vya kuungua, na vipengele vya usalama vinaendelea kufanya kazi kwa kawaida chini yake.

Hii ni muhimu ikiwa mtu anakuangalia au skrini yako inaonekana kwa wengine. Kwa mtazamo wa haraka, inaonekana kama unahariri hati, si kufanya mazungumzo yaliyosimbwa fiche. Bonyeza Shift mara tano tena kurudi kwenye mtazamo wa kawaida wa mazungumzo.`,
  faq_27_title: "nullchat inasafisha clipboard kiotomatiki?",
  faq_27_body: `Ndiyo. Kitu chochote kikinakiliwa ukiwa kwenye chumba cha mazungumzo, nullchat inasafisha clipboard yako kiotomatiki baada ya sekunde 15. Clipboard pia inafutwa unapofunga kichupo au kuondoka kwenye ukurasa, na mara moja ukitumia kitufe cha hofu. Hii inazuia maudhui ya ujumbe kubaki kwenye clipboard yako baada ya kuondoka kwenye mazungumzo.`,
  faq_28_title: "Mnaweza kusoma ujumbe wangu?",
  faq_28_body: `Hapana. Seva ni kipitishio butu. Inapokea vipande vilivyosimbwa fiche na kuvipeleka. Ufunguo wa usimbaji fiche unatokana na siri yako iliyoshirikiwa, ambayo haiondoki kwenye kivinjari chako kamwe. Hatuna ufunguo. Hatuwezi kufungua vipande hivyo. Hata seva ikivunjwa, mshambuliaji angepata maandishi yaliyosimbwa fiche yasiyo na maana tu.`,
  faq_29_title: "Mashirika ya serikali yanaweza kufikia ujumbe wangu?",
  faq_29_body: `Hatuwezi kutoa kile ambacho hatuna. Hakuna ujumbe wa maandishi wazi uliohifadhiwa popote. Hakuna akaunti za watumiaji za kutafuta. Hakuna kumbukumbu za IP za kukabidhi. Vipande vilivyosimbwa fiche vinajifuta kiotomatiki kwa ratiba iliyowekwa. Hata chini ya amri halali ya kisheria, kiwango cha juu tunachoweza kutoa ni mkusanyiko wa vipande vilivyosimbwa fiche na hashi za vyumba — hakuna kimojawapo kinachofaa bila siri iliyoshirikiwa ambayo washiriki pekee wanaijua.`,
  faq_30_title: "nullchat ni chanzo wazi?",
  faq_30_body_1: `Ndiyo. Msimbo wote — mteja, seva, usimbaji fiche, na usanidi wa miundombinu — unapatikana hadharani kwa ukaguzi kwenye`,
  faq_30_body_2: `. Unaweza kuthibitisha kwamba msimbo unaoendesha kwenye seva unalingana na uliochapishwa, kuujenga mwenyewe, au kupangisha mfano wako mwenyewe. Uwazi si hiari kwa zana inayokuomba kuiamini na mawasiliano yako ya faragha.`,
  faq_31_title: "Ni nani alijenga nullchat?",
  faq_31_body_1: `nullchat imejengwa na Artorias — kampuni ya teknolojia ya ujasusi inayoendeshwa na maveterani yenye makao yake New York City. Artorias ipo kuvunja mifumo ya zamani na kuandaa mashirika na watu muhimu zaidi kwa zana zilizojengwa mahususi kwa kufanya kazi gizani. Katika msingi wake, Artorias inahusu kudemokratisha ujasusi na kutokujulikana — kuhakikisha kwamba uwezo wa kuwasiliana kwa usalama na kufanya kazi bila ufuatiliaji si haki iliyohifadhiwa kwa wachache. nullchat ni udhihirisho mmoja wa dhamira hiyo: mawasiliano salama yaliyopunguzwa hadi kiini chake, bila maelewano juu ya uadilifu wa kriptografia. Jifunze zaidi kwenye`,
  faq_32_title: "Ninaweza kuongeza nullchat kwenye skrini yangu ya nyumbani?",
  faq_32_body: `Ndiyo. nullchat inasaidia Ongeza kwenye Skrini ya Nyumbani kwenye iOS na Android zote mbili. Kwenye iOS Safari, bonyeza kitufe cha kushiriki na uchague "Ongeza kwenye Skrini ya Nyumbani." Kwenye Android Chrome, bonyeza menyu na uchague "Ongeza kwenye Skrini ya Nyumbani" au "Sakinisha programu." Hii inaunda njia ya mkato ya pekee inayofungua nullchat bila mapambo ya kivinjari — hakuna upau wa anwani, hakuna vichupo. Inaonekana na kuhisi kama programu asilia.

Muhimu: nullchat kwa makusudi haitumii service worker au kuhifadhi data yoyote nje ya mtandao. Hakuna hali ya nje ya mtandao. Njia ya mkato ya skrini ya nyumbani inafungua tu tovuti hai — hakuna kinachohifadhiwa kwenye kifaa chako zaidi ya njia ya mkato yenyewe. Hii ni uamuzi wa usalama: kuhifadhi kurasa za mazungumzo zilizosimbwa fiche au hati za service worker kwenye kifaa kungeunda ushahidi wa kiforensiki kwamba nullchat ilitumika. Njia ya mkato haiachi alama zaidi ya ikoni yake, ambayo inaweza kufutwa wakati wowote.`,
};
