import type { FaqKey } from "../faq-translations";

export const ms: Record<FaqKey, string> = {
  faq_1_title: "Apa itu nullchat?",
  faq_1_body: `nullchat ialah bilik sembang tanpa nama yang disulitkan hujung-ke-hujung, tanpa memerlukan akaun, emel, nombor telefon, atau sebarang maklumat peribadi. Anda memasukkan rahsia kongsi — kata laluan — dan sesiapa yang memasukkan kata laluan yang sama akan berada dalam bilik yang sama. Itu sahaja.`,
  faq_2_title: "Bagaimana saya menyertai bilik?",
  faq_2_body: `Anda dan orang yang ingin anda bercakap bersetuju tentang rahsia kongsi terlebih dahulu — secara bersemuka, melalui panggilan telefon, walau apa cara sekalipun. Kedua-dua pihak menaip rahsia itu ke dalam nullchat dan anda berada dalam bilik yang sama yang disulitkan. Tiada senarai bilik, tiada direktori, tiada cara untuk melayari. Jika anda tidak tahu rahsia itu, bilik itu tidak wujud bagi anda.`,
  faq_3_title: "Bagaimana saya memilih rahsia kongsi?",
  faq_3_body: `Rahsia kongsi anda ialah bahagian paling penting dalam keselamatan anda. Ia adalah kunci kepada bilik anda dan juga kunci kepada penyulitan anda — jika seseorang menekanya, mereka boleh membaca segala-galanya. Anggaplah ia seperti kata laluan kepada peti besi.

Pilih sesuatu yang panjang, rawak, dan tidak boleh diteka. Rahsia yang kuat sekurang-kurangnya mengandungi 5–6 perkataan rawak atau 20+ aksara campuran. Elakkan nama, tarikh, frasa biasa, lirik lagu, atau apa sahaja yang boleh ditemui di media sosial anda. Jangan sekali-kali menggunakan semula rahsia untuk perbualan atau bilik yang berbeza.

Kongsikan rahsia anda melalui saluran luar yang selamat — secara bersemuka adalah yang terbaik. Panggilan telefon boleh diterima. Jangan sekali-kali menghantarnya melalui mesej teks, emel, DM, atau mana-mana platform yang merekodkan mesej. Jika anda mengesyaki rahsia telah terjejas, berhenti menggunakannya serta-merta dan bersetuju tentang rahsia baharu melalui saluran yang selamat.

Penunjuk kekuatan pada skrin masuk memberi anda gambaran kasar tentang sejauh mana rahsia anda tahan terhadap serangan brute-force, tetapi tiada penunjuk yang boleh menggantikan pertimbangan yang baik. Jika ragu-ragu, jadikan ia lebih panjang dan lebih rawak.`,
  faq_4_title: "Bagaimana penyulitan berfungsi?",
  faq_4_body: `Apabila anda memasukkan rahsia kongsi, dua perkara berlaku sepenuhnya dalam pelayar anda:

1. Rahsia diproses melalui Argon2id — fungsi terbitan kunci yang memerlukan memori tinggi — menggunakan salt domain-terpisah untuk menghasilkan ID bilik. Hash ini dihantar ke pelayan supaya ia tahu bilik mana untuk menyambungkan anda. Pelayan tidak pernah melihat rahsia sebenar anda.

2. Rahsia dijalankan melalui terbitan Argon2id kedua yang bebas (memori 64 MiB, 3 iterasi) untuk menghasilkan kunci penyulitan 256-bit. Kunci ini tidak pernah meninggalkan pelayar anda. Argon2id memerlukan blok RAM yang besar bagi setiap tekaan, menjadikan serangan brute-force GPU dan ASIC terhadap kata laluan anda jauh lebih sukar berbanding KDF tradisional.

Setiap mesej yang anda hantar disulitkan dengan NaCl secretbox (XSalsa20-Poly1305) menggunakan kunci itu sebelum ia meninggalkan peranti anda. Pelayan menerima, menyimpan, dan menyampaikan hanya teks sifir — gumpalan yang disulitkan yang tidak bermakna tanpa kunci. Kami tidak boleh membaca mesej anda. Tiada siapa yang boleh, melainkan mereka mengetahui rahsia kongsi.`,
  faq_5_title: "Apa yang pelayan lihat?",
  faq_5_body: `Pelayan melihat:
• Hash terbitan Argon2id (ID bilik) — bukan kata laluan anda
• Gumpalan teks sifir yang disulitkan — bukan mesej anda
• Bilangan sambungan aktif dalam bilik
• Cap masa bila gumpalan yang disulitkan diterima

Pelayan TIDAK melihat:
• Rahsia kongsi / kata laluan anda
• Kandungan mesej anda
• Identiti atau nama pengguna anda (alias disulitkan di dalam mesej)
• Alamat IP anda (dilucutkan di tepi oleh penyedia pengehosan kami)`,
  faq_6_title: "Apa itu padding mesej?",
  faq_6_body: `Sebelum penyulitan, setiap mesej ditambah padding kepada blok tetap 8,192 bait menggunakan awalan panjang 2 bait diikuti oleh kandungan mesej dan hingar rawak. Ini bermakna mesej pendek seperti "hi" menghasilkan saiz teks sifir yang sama persis seperti mesej pada panjang maksimum. Tanpa padding, pemerhati boleh meneka kandungan mesej berdasarkan panjang teks sifir. Pengisian hingar rawak (bukan sifar) memastikan tiada corak yang boleh dibezakan dalam teks biasa sebelum penyulitan. Padding menghapuskan saluran sampingan ini sepenuhnya.`,
  faq_7_title: "Apa itu pengeliruan cap masa?",
  faq_7_body: `Cap masa yang disertakan dalam mesej dibundarkan kepada minit terdekat sebelum penyulitan. Ini menghalang serangan korelasi masa di mana pemerhati boleh memadankan corak mesej merentas saluran yang berbeza dengan membandingkan cap masa yang tepat.`,
  faq_8_title: "Berapa lama mesej bertahan?",
  faq_8_body: `Mesej menggunakan sistem pemasa berperingkat:

• Dead drop (mesej pertama): Mesej disimpan dalam keadaan disulitkan di pelayan sehingga 24 jam, menunggu respons. Pengirim boleh keluar dan kembali untuk memeriksanya tanpa mencetuskan sebarang kira detik. Hanya memasuki bilik tidak membakar mesej.

• Kedua-dua pengguna hadir: Apabila orang kedua menyertai bilik, semua mesej yang belum dibaca segera memulakan kira detik pembakaran 5 minit. Setiap mesej baharu yang dihantar semasa kedua-dua pengguna hadir juga dibakar secara automatik dalam 5 minit. Tiada tindakan diperlukan — kehadiran sahaja mengesahkan mesej sedang dibaca.

• Butang Diterima: Jika anda mengambil mesej dead drop semasa bersendirian dalam bilik, anda boleh menekan butang "Diterima" untuk mengesahkan penerimaan secara manual dan memulakan pembakaran 5 minit. Butang ini hanya muncul sekali — semasa pengambilan dead drop awal — dan tidak tersedia semasa perbualan aktif.

• Perbualan aktif: Setelah bilik mempunyai balasan, mesej berikutnya mempunyai tetingkap 6 jam jika penerima tiada. Jika kedua-dua pengguna disambungkan, mesej dibakar dalam 5 minit secara automatik.

• Had maksimum: Mana-mana mesej yang belum dibaca dipadam selepas pemasanya tamat (24 jam untuk dead drop, 6 jam untuk mesej aktif) tanpa mengira sama ada ia telah diakui.

Tiada arkib, tiada sandaran, tiada cara untuk memulihkan mesej yang dipadam.`,
  faq_9_title: "Apa itu dead drop?",
  faq_9_body: `nullchat berfungsi sebagai dead drop digital. Dalam tradisi perisikan tradisional, dead drop ialah kaedah menyampaikan maklumat antara dua orang tanpa mereka perlu bertemu atau berada di tempat yang sama pada masa yang sama. nullchat berfungsi dengan cara yang sama.

Anda memasukkan rahsia kongsi, meninggalkan mesej yang disulitkan, dan memutuskan sambungan. Mesej itu kekal di pelayan — disulitkan dan tidak boleh dibaca oleh sesiapa, termasuk kami — sehingga 24 jam. Kenalan anda memasukkan rahsia yang sama bila mereka bersedia, dan mengambil mesej itu. Apabila penerima menyertai dan kedua-dua pengguna hadir, semua mesej yang menunggu segera memulakan kira detik pembakaran 5 minit — kehadiran sahaja adalah bukti penerimaan. Jika penerima mengambil mesej semasa bersendirian, mereka boleh menekan butang "Diterima" sekali sahaja untuk mengesahkan penerimaan secara manual dan memulakan pembakaran, atau hanya membalas. Setelah pembakaran bermula, mesej dimusnahkan secara kekal selepas 5 minit.

Pengirim boleh menyambung semula dengan selamat pada bila-bila masa untuk memeriksa sama ada mesej mereka masih menunggu — tanpa mencetuskan sebarang kira detik, selagi mereka seorang sahaja dalam bilik. Tiada pihak perlu dalam talian pada masa yang sama. Tiada pihak memerlukan akaun. Tiada pihak boleh dikenal pasti. Pelayan tidak pernah tahu siapa yang meninggalkan mesej atau siapa yang mengambilnya — hanya bahawa gumpalan yang disulitkan telah disimpan dan kemudian diambil. Selepas pembakaran, tiada bukti bahawa pertukaran itu pernah berlaku.`,
  faq_10_title: "Berapa lama bilik bertahan?",
  faq_10_body: `Bilik wujud selagi ia mempunyai sambungan aktif atau mesej yang belum tamat tempoh. Setelah orang terakhir memutuskan sambungan dan semua mesej telah tamat tempoh atau dibakar, bilik itu hilang. Tiada keadaan bilik yang kekal. Jika tiada mesej yang pernah dihantar, bilik itu hanyalah sambungan langsung — tiada apa yang disimpan, dan ia hilang sebaik sahaja semua orang keluar.`,
  faq_11_title: "Apa itu butang Tamatkan?",
  faq_11_body: `Tamatkan segera memadam setiap mesej yang anda hantar semasa sesi semasa anda dari pelayan untuk semua orang dalam bilik. Peserta lain akan melihat mesej anda hilang dari skrin mereka secara masa nyata. Anda kemudian diputuskan sambungan dari bilik. Gunakan ini jika anda perlu keluar tanpa meninggalkan jejak.`,
  faq_12_title: "Apa itu butang Keluar?",
  faq_12_body: `Keluar hanya memutuskan sambungan anda dari bilik. Mesej anda kekal di pelayan — mesej yang belum dibaca terus menunggu (sehingga 24 jam), dan mesej yang sudah dibaca meneruskan kira detik pembakaran 5 minit mereka. Jika anda menyertai semula bilik kemudian, anda akan mendapat alias rawak baharu — tiada cara untuk menghubungkan identiti lama dan baharu anda.`,
  faq_13_title: "Apa itu alias rawak?",
  faq_13_body: `Apabila anda memasuki bilik, anda diberikan kod hex rawak 8 aksara (seperti "a9f2b71c") sebagai alias anda. Alias ini dijana dalam pelayar anda, disulitkan di dalam setiap mesej, dan tidak pernah dihantar ke pelayan dalam teks biasa. Jika anda memutuskan sambungan dan menyambung semula, anda mendapat alias baharu. Tiada cara untuk menempah, memilih, atau mengekalkan alias.`,
  faq_14_title: "Adakah had peserta?",
  faq_14_body: `Setiap bilik menyokong sehingga 50 sambungan serentak. Jika bilik penuh, anda akan melihat mesej "Bilik penuh". Had ini wujud untuk mengekalkan bilik yang intim dan untuk mencegah penyalahgunaan.`,
  faq_15_title: "Adakah pengehadan kadar?",
  faq_15_body: `Ya. Setiap sambungan dihadkan kepada 1 mesej sesaat. Ini menghalang spam dan penyalahgunaan tanpa memerlukan sebarang pengesahan identiti. Jika anda menghantar mesej terlalu cepat, anda akan melihat notis ringkas "Perlahan".`,
  faq_16_title: "Bolehkah saya mengakses nullchat melalui Tor?",
  faq_16_body_1: `nullchat tersedia sebagai perkhidmatan tersembunyi Tor untuk pengguna di kawasan yang ditapis atau sesiapa yang mahukan lapisan kerahsiaan tambahan. Buka Tor Browser dan navigasi ke:`,
  faq_16_body_2: `Secara lalai, kedua-dua versi clearnet dan Tor menyambung ke bahagian belakang yang sama — pengguna di mana-mana satu boleh berkomunikasi antara satu sama lain dalam bilik yang sama menggunakan rahsia kongsi yang sama. Perkhidmatan .onion melalui rangkaian Tor tanpa Cloudflare, tiada CDN, dan tiada infrastruktur pihak ketiga antara anda dan pelayan. Tor menghalakan sambungan anda melalui pelbagai geganti yang disulitkan, jadi pelayan mahupun pemerhati tidak dapat menentukan alamat IP sebenar atau lokasi anda. Perkhidmatan .onion menggunakan HTTP biasa, yang dijangka dan selamat — Tor sendiri menyediakan penyulitan hujung-ke-hujung antara pelayar anda dan pelayan. Semua penyulitan peringkat aplikasi yang sama (NaCl secretbox, terbitan kunci Argon2id) digunakan di atasnya. Nota: Tor Browser mesti ditetapkan ke tahap keselamatan "Standard" untuk nullchat berfungsi, kerana aplikasi memerlukan JavaScript.`,
  faq_17_title: "Apa itu bilik Tor sahaja?",
  faq_17_body: `Apabila mengakses nullchat melalui perkhidmatan tersembunyi .onion, anda mempunyai pilihan untuk mengaktifkan "Bilik Tor sahaja" — suis togol yang muncul pada skrin masuk kata laluan. Apabila diaktifkan, bilik anda diletakkan dalam ruang nama berasingan yang hanya pengguna Tor lain dengan togol yang sama diaktifkan boleh akses. Pengguna clearnet tidak boleh menyertai bilik Tor sahaja, walaupun mereka tahu rahsia kongsi.

Ini menyediakan tahap keselamatan yang lebih tinggi daripada bilik kongsi lalai:

• Kedua-dua pihak dihalakan melalui rangkaian onion pelbagai lompatan Tor — alamat IP sebenar atau lokasi kedua-dua pihak tidak kelihatan kepada sesiapa, termasuk pelayan.
• Tiada carian DNS, tiada CDN, dan tiada infrastruktur pihak ketiga menyentuh sambungan pada mana-mana titik.
• Analisis trafik jauh lebih sukar kerana kedua-dua pihak mendapat manfaat daripada padding geganti Tor digabungkan dengan padding sambungan nullchat sendiri (bingkai tiruan rawak dihantar pada selang rawak).
• Tiada peserta clearnet yang metadata sambungan lebih lemah boleh dikaitkan dengan perbualan.

Anda hanya setanpa nama seperti pautan paling lemah dalam perbualan. Dalam bilik lalai, sambungan peserta clearnet menyentuh penyelesai DNS, infrastruktur CDN, dan penghalaan internet standard — semua yang boleh dipantau atau disepina untuk metadata tentang siapa yang disambungkan, bila, dan dari mana. Togol Tor sahaja menghapuskan risiko ini sepenuhnya dengan memastikan setiap peserta mempunyai tahap kerahsiaan lapisan rangkaian yang sama.

Kedua-dua pihak mesti bersetuju untuk mengaktifkan togol — ia berfungsi dengan cara yang sama seperti bersetuju tentang rahsia kongsi. Pengepala sembang memaparkan "TOR SAHAJA" dalam hijau apabila aktif, atau "CLEARNET" dalam merah untuk bilik standard, supaya anda sentiasa tahu mod mana anda berada.`,
  faq_18_title: "Apa itu tamat masa tidak aktif?",
  faq_18_body: `Jika anda tidak aktif selama 15 minit — tiada menaip, tiada mengetuk, tiada menatal — nullchat akan memutuskan sambungan anda secara automatik dan mengembalikan anda ke skrin masuk kata laluan. Amaran muncul pada minit ke-13 memberi anda pilihan untuk kekal. Ini melindungi sesi anda jika anda meninggalkan peranti anda, menghalang mesej daripada terbakar semasa tiada siapa yang membaca secara aktif, dan memastikan sembang tidak dibiarkan kelihatan pada skrin yang tidak dijaga.`,
  faq_19_title: "Bagaimana dengan alamat IP?",
  faq_19_body: `Di clearnet (nullchat.org), aplikasi dihoskan di rangkaian tepi Cloudflare. Alamat IP anda dikendalikan di lapisan infrastruktur dan tidak pernah dibaca, direkod, atau disimpan oleh kod aplikasi. Kod pelayan tidak mengakses pengepala IP. Kami tidak mempunyai mekanisme untuk mengenal pasti anda melalui alamat rangkaian.

Di perkhidmatan tersembunyi Tor (.onion), alamat IP anda tidak pernah kelihatan kepada pelayan sama sekali — penghalaan onion Tor memastikan kerahsiaan peringkat rangkaian yang lengkap. Pelayan hanya melihat sambungan dari rangkaian Tor, tanpa cara untuk mengesannya kembali kepada anda.`,
  faq_20_title: "Adakah sebarang kuki atau penjejak?",
  faq_20_body: `Tidak. nullchat tidak menetapkan kuki, tidak menggunakan analitik, tidak memuatkan skrip pihak ketiga, tidak membenamkan piksel penjejakan, dan tidak membuat permintaan luaran. Pengepala Content Security Policy menguatkuasakan ini di peringkat pelayar. Anda boleh mengesahkan ini dalam alat pembangun pelayar anda.`,
  faq_21_title: "Mengapa saya tidak boleh menghantar pautan, imej, atau fail?",
  faq_21_body: `Secara reka bentuk. nullchat hanya teks — tiada pautan, imej, lampiran fail, atau media apa-apa jenis boleh dihantar atau dipaparkan. Ini adalah keputusan keselamatan yang disengajakan, bukan kekangan. Pautan boleh klik dan media terbenam adalah permukaan serangan utama untuk eksploitasi sifar hari yang digunakan oleh perisian pengintip komersial seperti Pegasus, Predator, dan alat pengawasan yang serupa. Satu pautan atau fail berniat jahat boleh menjejaskan seluruh peranti secara senyap. Dengan melucutkan sembang kepada teks biasa sahaja, nullchat menghapuskan vektor serangan ini sepenuhnya. Tiada apa untuk diklik, tiada apa untuk dimuat turun, dan tiada apa untuk dipaparkan — yang bermakna tiada apa untuk dieksploitasi.`,
  faq_22_title: "Bolehkah saya menyalin atau menangkap skrin mesej?",
  faq_22_body: `nullchat secara aktif menghalang penangkapan kandungan mesej. Pemilihan teks dan penyalinan dilumpuhkan di kawasan sembang, menu konteks klik kanan disekat, dan pintasan papan kekunci tangkapan skrin biasa dipintas. API Tangkapan Skrin pelayar juga disekat melalui pengepala Permissions-Policy, menghalang alat rakaman skrin berasaskan web daripada menangkap halaman.

Ini adalah perlindungan berasaskan geseran, bukan jaminan mutlak. Pengguna yang bertekad sentiasa boleh mengambil gambar skrin mereka dengan peranti lain atau menggunakan alat peringkat OS yang memintas sekatan pelayar. Matlamatnya adalah menjadikan tangkapan kasual sukar dan mengukuhkan jangkaan bahawa perbualan dalam nullchat tidak dimaksudkan untuk disimpan.`,
  faq_23_title: "Apa itu trafik umpan?",
  faq_23_body: `nullchat menghantar mesej tiruan yang disulitkan secara automatik pada selang rawak (setiap 10–60 saat) semasa anda disambungkan ke bilik. Mesej umpan ini tidak boleh dibezakan daripada mesej sebenar — saiznya sama (terima kasih kepada padding tetap), disulitkan dengan kunci yang sama, dan disampaikan melalui laluan pelayan yang sama. Klien penerima membuangnya secara senyap selepas penyahsulitan.

Trafik umpan mengalahkan analisis trafik. Tanpanya, pemerhati yang memantau trafik rangkaian boleh menentukan bila komunikasi sebenar berlaku berdasarkan bila gumpalan yang disulitkan dihantar. Dengan umpan, terdapat aliran berterusan trafik yang kelihatan sama tanpa mengira sama ada sesiapa sebenarnya sedang menaip — menjadikannya mustahil untuk membezakan mesej sebenar daripada hingar.`,
  faq_24_title: "Apa itu padding sambungan?",
  faq_24_body: `Pelayan menghantar bingkai binari panjang rawak (64–512 bait data rawak) kepada setiap klien yang disambungkan pada selang rawak (setiap 5–30 saat). Bingkai ini bukan mesej — ia adalah hingar tulen yang klien abaikan secara senyap. Digabungkan dengan trafik umpan sisi klien, padding sambungan memastikan bahawa corak trafik rangkaian tidak mendedahkan apa-apa tentang sama ada komunikasi sebenar berlaku, berapa banyak mesej yang ditukar, atau bila peserta aktif.`,
  faq_25_title: "Apa itu kekunci panik?",
  faq_25_body: `Mengetuk tiga kali kekunci Escape memadam sesi anda serta-merta. Apabila dicetuskan, nullchat menghantar arahan tamatkan ke pelayan (memadam semua mesej anda), menutup sambungan WebSocket, menyifarkan kunci penyulitan dalam memori, mengosongkan DOM, menghapuskan sessionStorage dan localStorage, mengosongkan papan keratan, dan mengalihkan pelayar anda ke google.com. Keseluruhan proses mengambil masa kurang daripada satu saat. Jika pelayar cuba memulihkan halaman dari cache (contohnya, melalui butang kembali), penghapusan dicetuskan semula secara automatik. Gunakan ini jika anda perlu memadam segera semua bukti perbualan dari skrin dan pelayar anda.`,
  faq_26_title: "Apa itu mod steganografi?",
  faq_26_body: `Mod steganografi menyamarkan antara muka nullchat sebagai editor dokumen. Tekan Shift lima kali dengan cepat untuk mengaktifkannya. Seluruh UI berubah — antara muka sembang gelap digantikan dengan antara muka pengeditan dokumen yang biasa lengkap dengan bar alat dan bar menu. Mesej muncul sebagai perenggan dalam badan dokumen, dan input anda menyerupai penaipan aktif. Semua penyulitan, pemasa pembakaran, dan ciri keselamatan terus beroperasi secara normal di bawahnya.

Ini berguna jika seseorang sedang melihat dari belakang bahu anda atau jika skrin anda kelihatan kepada orang lain. Pada pandangan sekilas, ia kelihatan seperti anda sedang mengedit dokumen, bukan menjalankan perbualan yang disulitkan. Tekan Shift lima kali lagi untuk kembali ke paparan sembang biasa.`,
  faq_27_title: "Adakah nullchat membersihkan papan keratan secara automatik?",
  faq_27_body: `Ya. Jika apa-apa disalin semasa anda berada dalam bilik sembang, nullchat membersihkan papan keratan anda secara automatik selepas 15 saat. Papan keratan juga dihapuskan apabila anda menutup tab atau menavigasi keluar, dan serta-merta jika anda menggunakan kekunci panik. Ini menghalang kandungan mesej daripada kekal dalam papan keratan anda selepas anda meninggalkan perbualan.`,
  faq_28_title: "Bolehkah anda membaca mesej saya?",
  faq_28_body: `Tidak. Pelayan hanyalah geganti bodoh. Ia menerima gumpalan yang disulitkan dan meneruskannya. Kunci penyulitan diperoleh daripada rahsia kongsi anda, yang tidak pernah meninggalkan pelayar anda. Kami tidak mempunyai kunci. Kami tidak boleh menyahsulit gumpalan. Walaupun pelayan terjejas, penyerang hanya akan memperoleh teks sifir yang tidak bermakna.`,
  faq_29_title: "Bolehkah agensi kerajaan mengakses mesej saya?",
  faq_29_body: `Kami tidak boleh memberikan apa yang kami tidak mempunyai. Tiada mesej teks biasa disimpan di mana-mana. Tiada akaun pengguna untuk dicari. Tiada log IP untuk diserahkan. Gumpalan yang disulitkan dipadam secara automatik mengikut jadual tetap. Walaupun di bawah perintah undang-undang yang sah, paling banyak yang kami boleh hasilkan ialah koleksi gumpalan yang disulitkan dan hash bilik — tiada satu pun yang berguna tanpa rahsia kongsi yang hanya diketahui oleh peserta.`,
  faq_30_title: "Adakah nullchat sumber terbuka?",
  faq_30_body_1: `Ya. Keseluruhan pangkalan kod — klien, pelayan, penyulitan, dan konfigurasi infrastruktur — tersedia secara umum untuk audit di`,
  faq_30_body_2: `. Anda boleh mengesahkan bahawa kod yang berjalan di pelayan sepadan dengan apa yang diterbitkan, membinanya sendiri, atau mengehoskan instans anda sendiri. Ketelusan bukan pilihan untuk alat yang meminta anda mempercayainya dengan komunikasi peribadi anda.`,
  faq_31_title: "Siapa yang membina nullchat?",
  faq_31_body_1: `nullchat dibina oleh Artorias — sebuah syarikat teknologi perisikan yang dikendalikan oleh veteran berpangkalan di New York City. Artorias wujud untuk membongkar sistem usang dan melengkapkan organisasi dan individu yang paling penting dengan alat yang dibina khas untuk beroperasi dalam kegelapan. Pada terasnya, Artorias adalah tentang mendemokrasikan perisikan dan kerahsiaan — memastikan keupayaan untuk berkomunikasi secara selamat dan beroperasi tanpa pengawasan bukan keistimewaan yang dikhaskan untuk segelintir sahaja. nullchat ialah satu ungkapan misi itu: komunikasi selamat yang dilucutkan kepada intipatinya, tanpa kompromi terhadap integriti kriptografi. Ketahui lebih lanjut di`,
  faq_32_title: "Bolehkah saya menambah nullchat ke skrin utama saya?",
  faq_32_body: `Ya. nullchat menyokong Tambah ke Skrin Utama pada iOS dan Android. Pada iOS Safari, ketuk butang kongsi dan pilih "Add to Home Screen." Pada Android Chrome, ketuk menu dan pilih "Add to Home Screen" atau "Install app." Ini mencipta pintasan kendiri yang membuka nullchat tanpa bingkai pelayar — tiada bar alamat, tiada tab. Ia kelihatan dan terasa seperti aplikasi asli.

Penting: nullchat sengaja tidak menggunakan service worker atau menyimpan sebarang data luar talian. Tiada mod luar talian. Pintasan skrin utama hanya membuka laman langsung — tiada apa yang disimpan pada peranti anda selain pintasan itu sendiri. Ini adalah keputusan keselamatan: menyimpan cache halaman sembang yang disulitkan atau skrip service worker pada peranti akan mencipta bukti forensik bahawa nullchat telah digunakan. Pintasan tidak meninggalkan jejak selain ikonnya sendiri, yang boleh dipadam pada bila-bila masa.`,
};
