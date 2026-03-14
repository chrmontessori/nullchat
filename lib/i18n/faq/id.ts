import type { FaqKey } from "../faq-translations";

export const id: Record<FaqKey, string> = {
  faq_1_title: "Apa itu nullchat?",
  faq_1_body: `nullchat adalah ruang obrolan terenkripsi ujung-ke-ujung yang anonim, tidak memerlukan akun, email, nomor telepon, maupun informasi pribadi dalam bentuk apa pun. Anda memasukkan rahasia bersama — sebuah kata sandi — dan siapa pun yang memasukkan kata sandi yang sama akan masuk ke ruangan yang sama. Sesederhana itu.`,
  faq_2_title: "Bagaimana cara bergabung ke ruangan?",
  faq_2_body: `Anda dan orang yang ingin Anda ajak bicara menyepakati rahasia bersama terlebih dahulu — secara langsung, melalui telepon, atau cara apa pun yang Anda inginkan. Anda berdua mengetikkan rahasia tersebut ke nullchat dan Anda berada di ruangan terenkripsi yang sama. Tidak ada daftar ruangan, tidak ada direktori, tidak ada cara untuk menelusuri. Jika Anda tidak tahu rahasianya, ruangan itu tidak ada bagi Anda.`,
  faq_3_title: "Bagaimana cara memilih rahasia bersama?",
  faq_3_body: `Rahasia bersama Anda adalah bagian terpenting dari keamanan Anda. Rahasia ini adalah kunci ke ruangan Anda sekaligus kunci enkripsi Anda — jika seseorang menebaknya, mereka bisa membaca semuanya. Perlakukan seperti kata sandi brankas.

Pilih sesuatu yang panjang, acak, dan tidak bisa ditebak. Rahasia yang kuat setidaknya terdiri dari 5–6 kata acak atau 20+ karakter campuran. Hindari nama, tanggal, frasa umum, lirik lagu, atau apa pun yang bisa ditemukan seseorang di media sosial Anda. Jangan pernah menggunakan ulang rahasia untuk percakapan atau ruangan yang berbeda.

Bagikan rahasia Anda melalui saluran aman di luar jaringan — secara langsung adalah yang terbaik. Telepon bisa diterima. Jangan pernah mengirimnya melalui pesan teks, email, DM, atau platform apa pun yang mencatat pesan. Jika Anda mencurigai rahasia telah bocor, segera berhenti menggunakannya dan sepakati rahasia baru melalui saluran yang aman.

Indikator kekuatan di layar masuk memberi Anda gambaran kasar seberapa tahan rahasia Anda terhadap serangan brute-force, tetapi tidak ada indikator yang bisa menggantikan penilaian yang baik. Jika ragu, buat lebih panjang dan lebih acak.`,
  faq_4_title: "Bagaimana cara kerja enkripsi?",
  faq_4_body: `Saat Anda memasukkan rahasia bersama, dua hal terjadi sepenuhnya di browser Anda:

1. Rahasia diproses melalui Argon2id — fungsi derivasi kunci yang membutuhkan memori besar — menggunakan salt terpisah domain untuk menghasilkan room ID. Hash ini dikirim ke server agar server tahu ruangan mana yang harus menghubungkan Anda. Server tidak pernah melihat rahasia Anda yang sebenarnya.

2. Rahasia dijalankan melalui derivasi Argon2id kedua yang independen (memori 64 MiB, 3 iterasi) untuk menghasilkan kunci enkripsi 256-bit. Kunci ini tidak pernah meninggalkan browser Anda. Argon2id memerlukan blok RAM besar per tebakan, membuat serangan brute-force GPU dan ASIC terhadap kata sandi Anda jauh lebih sulit dibandingkan KDF tradisional.

Setiap pesan yang Anda kirim dienkripsi dengan NaCl secretbox (XSalsa20-Poly1305) menggunakan kunci tersebut sebelum meninggalkan perangkat Anda. Server menerima, menyimpan, dan meneruskan hanya ciphertext — gumpalan terenkripsi yang tidak bermakna tanpa kunci. Kami tidak bisa membaca pesan Anda. Tidak ada yang bisa, kecuali mereka mengetahui rahasia bersama.`,
  faq_5_title: "Apa yang dilihat server?",
  faq_5_body: `Server melihat:
• Hash turunan Argon2id (room ID) — bukan kata sandi Anda
• Gumpalan ciphertext terenkripsi — bukan pesan Anda
• Jumlah koneksi aktif di ruangan
• Stempel waktu saat gumpalan terenkripsi diterima

Server TIDAK melihat:
• Rahasia bersama / kata sandi Anda
• Isi pesan Anda
• Identitas atau nama pengguna Anda (alias dienkripsi di dalam pesan)
• Alamat IP Anda (dihapus di edge oleh penyedia hosting kami)`,
  faq_6_title: "Apa itu padding pesan?",
  faq_6_body: `Sebelum enkripsi, setiap pesan di-padding ke blok tetap 8.192 byte menggunakan prefiks panjang 2 byte diikuti konten pesan dan noise acak. Ini berarti pesan pendek seperti "hi" menghasilkan ciphertext berukuran persis sama dengan pesan sepanjang maksimum. Tanpa padding, pengamat bisa menebak isi pesan berdasarkan panjang ciphertext. Pengisian noise acak (bukan nol) memastikan tidak ada pola yang bisa dibedakan dalam plaintext sebelum enkripsi. Padding menghilangkan saluran samping ini sepenuhnya.`,
  faq_7_title: "Apa itu pengaburan stempel waktu?",
  faq_7_body: `Stempel waktu yang disertakan dalam pesan dibulatkan ke menit terdekat sebelum enkripsi. Ini mencegah serangan korelasi waktu di mana pengamat bisa mencocokkan pola pesan di berbagai saluran dengan membandingkan stempel waktu yang tepat.`,
  faq_8_title: "Berapa lama pesan bertahan?",
  faq_8_body: `Pesan menggunakan sistem timer bertingkat:

• Dead drop (pesan pertama): Pesan tersimpan terenkripsi di server hingga 24 jam, menunggu balasan. Pengirim bisa pergi dan kembali untuk memeriksanya tanpa memicu hitungan mundur apa pun. Sekadar memasuki ruangan tidak menghapus pesan.

• Kedua pengguna hadir: Saat orang kedua bergabung ke ruangan, semua pesan yang belum dibaca langsung memulai hitungan mundur 5 menit untuk penghapusan. Setiap pesan baru yang dikirim saat kedua pengguna hadir juga otomatis terhapus dalam 5 menit. Tidak perlu tindakan apa pun — kehadiran saja sudah mengonfirmasi bahwa pesan sedang dibaca.

• Tombol Diterima: Jika Anda mengambil pesan dead drop saat sendirian di ruangan, Anda bisa menekan tombol "Diterima" untuk mengonfirmasi penerimaan secara manual dan memulai penghapusan 5 menit. Tombol ini hanya muncul sekali — saat pengambilan dead drop awal — dan tidak tersedia selama percakapan aktif.

• Percakapan aktif: Setelah ruangan memiliki balasan, pesan berikutnya memiliki jendela 6 jam jika penerima tidak hadir. Jika kedua pengguna terhubung, pesan terhapus otomatis dalam 5 menit.

• Batas maksimum: Pesan yang belum dibaca dihapus setelah timernya berakhir (24 jam untuk dead drop, 6 jam untuk pesan aktif) terlepas dari apakah pesan tersebut telah dikonfirmasi.

Tidak ada arsip, tidak ada cadangan, tidak ada cara untuk memulihkan pesan yang telah dihapus.`,
  faq_9_title: "Apa itu dead drop?",
  faq_9_body: `nullchat berfungsi sebagai dead drop digital. Dalam tradisi intelijen tradisional, dead drop adalah metode penyampaian informasi antara dua orang tanpa perlu bertemu atau berada di tempat yang sama pada waktu yang sama. nullchat bekerja dengan cara yang sama.

Anda memasukkan rahasia bersama, meninggalkan pesan terenkripsi, dan memutuskan koneksi. Pesan tersebut tersimpan di server — terenkripsi dan tidak bisa dibaca oleh siapa pun, termasuk kami — hingga 24 jam. Kontak Anda memasukkan rahasia yang sama kapan pun mereka siap, dan mengambil pesan tersebut. Saat penerima bergabung dan kedua pengguna hadir, semua pesan yang menunggu langsung memulai hitungan mundur 5 menit — kehadiran saja sudah menjadi bukti penerimaan. Jika penerima mengambil pesan saat sendirian, mereka bisa menekan tombol "Diterima" satu kali untuk mengonfirmasi penerimaan secara manual dan memulai penghapusan, atau cukup membalas. Setelah penghapusan dimulai, pesan dihancurkan secara permanen setelah 5 menit.

Pengirim bisa terhubung kembali dengan aman kapan saja untuk memeriksa apakah pesan mereka masih menunggu — tanpa memicu hitungan mundur apa pun, selama mereka satu-satunya orang di ruangan. Tidak ada pihak yang perlu online pada waktu yang sama. Tidak ada pihak yang memerlukan akun. Tidak ada pihak yang bisa diidentifikasi. Server tidak pernah tahu siapa yang meninggalkan pesan atau siapa yang mengambilnya — hanya bahwa gumpalan terenkripsi disimpan dan kemudian diambil. Setelah penghapusan, tidak ada bukti bahwa pertukaran pernah terjadi.`,
  faq_10_title: "Berapa lama ruangan bertahan?",
  faq_10_body: `Ruangan ada selama memiliki koneksi aktif atau pesan yang belum kedaluwarsa. Setelah orang terakhir memutuskan koneksi dan semua pesan telah kedaluwarsa atau terhapus, ruangan hilang. Tidak ada status ruangan yang persisten. Jika tidak ada pesan yang pernah dikirim, ruangan hanyalah koneksi langsung — tidak ada yang tersimpan, dan ruangan menghilang begitu semua orang pergi.`,
  faq_11_title: "Apa itu tombol Akhiri?",
  faq_11_body: `Akhiri langsung menghapus setiap pesan yang Anda kirim selama sesi saat ini dari server untuk semua orang di ruangan. Peserta lain akan melihat pesan Anda menghilang dari layar mereka secara real-time. Anda kemudian diputuskan dari ruangan. Gunakan ini jika Anda perlu pergi tanpa meninggalkan jejak.`,
  faq_12_title: "Apa itu tombol Keluar?",
  faq_12_body: `Keluar hanya memutuskan koneksi Anda dari ruangan. Pesan Anda tetap ada di server — pesan yang belum dibaca terus menunggu (hingga 24 jam), dan pesan yang sudah dibaca melanjutkan hitungan mundur 5 menit mereka. Jika Anda bergabung kembali ke ruangan nanti, Anda akan mendapatkan alias acak baru — tidak ada cara untuk menghubungkan identitas lama dan baru Anda.`,
  faq_13_title: "Apa itu alias acak?",
  faq_13_body: `Saat Anda memasuki ruangan, Anda diberi kode hex 8 karakter acak (seperti "a9f2b71c") sebagai alias Anda. Alias ini dibuat di browser Anda, dienkripsi di dalam setiap pesan, dan tidak pernah dikirim ke server dalam bentuk plaintext. Jika Anda memutuskan koneksi dan terhubung kembali, Anda mendapatkan alias baru. Tidak ada cara untuk memesan, memilih, atau mempertahankan alias.`,
  faq_14_title: "Apakah ada batas peserta?",
  faq_14_body: `Setiap ruangan mendukung hingga 50 koneksi bersamaan. Jika ruangan penuh, Anda akan melihat pesan "Ruangan penuh". Batas ini ada untuk menjaga ruangan tetap intim dan mencegah penyalahgunaan.`,
  faq_15_title: "Apakah ada pembatasan kecepatan?",
  faq_15_body: `Ya. Setiap koneksi dibatasi 1 pesan per detik. Ini mencegah spam dan penyalahgunaan tanpa memerlukan verifikasi identitas apa pun. Jika Anda mengirim pesan terlalu cepat, Anda akan melihat pemberitahuan singkat "Pelan-pelan".`,
  faq_16_title: "Bisakah saya mengakses nullchat melalui Tor?",
  faq_16_body_1: `nullchat tersedia sebagai Tor hidden service untuk pengguna di wilayah yang disensor atau siapa pun yang menginginkan lapisan anonimitas tambahan. Buka Tor Browser dan navigasikan ke:`,
  faq_16_body_2: `Secara default, baik versi clearnet maupun Tor terhubung ke backend yang sama — pengguna dari kedua sisi bisa berkomunikasi satu sama lain di ruangan yang sama menggunakan rahasia bersama yang sama. Layanan .onion merutekan melalui jaringan Tor tanpa Cloudflare, tanpa CDN, dan tanpa infrastruktur pihak ketiga antara Anda dan server. Tor merutekan koneksi Anda melalui beberapa relay terenkripsi, sehingga baik server maupun pengamat mana pun tidak bisa menentukan alamat IP asli atau lokasi Anda. Layanan .onion menggunakan HTTP biasa, yang memang diharapkan dan aman — Tor sendiri menyediakan enkripsi ujung-ke-ujung antara browser dan server Anda. Semua enkripsi tingkat aplikasi yang sama (NaCl secretbox, derivasi kunci Argon2id) berlaku di atasnya. Catatan: Tor Browser harus diatur ke tingkat keamanan "Standard" agar nullchat berfungsi, karena aplikasi memerlukan JavaScript.`,
  faq_17_title: "Apa itu ruangan khusus Tor?",
  faq_17_body: `Saat mengakses nullchat melalui .onion hidden service, Anda memiliki opsi untuk mengaktifkan "ruangan khusus Tor" — toggle yang muncul di layar masuk kata sandi. Saat diaktifkan, ruangan Anda ditempatkan di namespace terpisah yang hanya bisa diakses oleh pengguna Tor lain dengan toggle yang sama diaktifkan. Pengguna clearnet tidak pernah bisa bergabung ke ruangan khusus Tor, bahkan jika mereka mengetahui rahasia bersama.

Ini memberikan tingkat keamanan yang lebih tinggi dari ruangan bersama default:

• Kedua pihak dirutekan melalui jaringan onion multi-hop Tor — alamat IP asli atau lokasi kedua pihak tidak terlihat oleh siapa pun, termasuk server.
• Tidak ada pencarian DNS, tidak ada CDN, dan tidak ada infrastruktur pihak ketiga yang menyentuh koneksi di titik mana pun.
• Analisis lalu lintas jauh lebih sulit karena kedua sisi mendapat manfaat dari padding relay Tor yang dikombinasikan dengan padding koneksi nullchat sendiri (frame dummy acak yang dikirim pada interval acak).
• Tidak ada peserta clearnet yang metadata koneksinya yang lebih lemah bisa dikorelasikan dengan percakapan.

Anda hanya seanonim tautan terlemah dalam percakapan. Di ruangan default, koneksi peserta clearnet menyentuh DNS resolver, infrastruktur CDN, dan routing internet standar — semuanya bisa diamati atau diminta secara hukum untuk metadata tentang siapa yang terhubung, kapan, dan dari mana. Toggle ruangan khusus Tor menghilangkan risiko ini sepenuhnya dengan memastikan setiap peserta memiliki tingkat anonimitas lapisan jaringan yang sama.

Kedua pihak harus setuju untuk mengaktifkan toggle — cara kerjanya sama seperti menyepakati rahasia bersama. Header obrolan menampilkan "TOR ONLY" berwarna hijau saat aktif, atau "CLEARNET" berwarna merah untuk ruangan standar, sehingga Anda selalu tahu mode mana yang Anda gunakan.`,
  faq_18_title: "Apa itu batas waktu tidak aktif?",
  faq_18_body: `Jika Anda tidak aktif selama 15 menit — tidak mengetik, tidak mengetuk, tidak menggulir — nullchat akan otomatis memutuskan koneksi Anda dan mengembalikan Anda ke layar masuk kata sandi. Peringatan muncul pada menit ke-13 memberi Anda opsi untuk tetap tinggal. Ini melindungi sesi Anda jika Anda meninggalkan perangkat, mencegah pesan terhapus saat tidak ada yang aktif membaca, dan memastikan obrolan tidak dibiarkan terlihat di layar yang tidak dijaga.`,
  faq_19_title: "Bagaimana dengan alamat IP?",
  faq_19_body: `Di clearnet (nullchat.org), aplikasi di-hosting di jaringan edge Cloudflare. Alamat IP Anda ditangani di lapisan infrastruktur dan tidak pernah dibaca, dicatat, atau disimpan oleh kode aplikasi. Kode server tidak mengakses header IP. Kami tidak memiliki mekanisme untuk mengidentifikasi Anda berdasarkan alamat jaringan.

Di Tor hidden service (.onion), alamat IP Anda tidak pernah terlihat oleh server sama sekali — routing onion Tor memastikan anonimitas tingkat jaringan yang lengkap. Server hanya melihat koneksi dari jaringan Tor, tanpa cara untuk melacaknya kembali ke Anda.`,
  faq_20_title: "Apakah ada cookie atau pelacak?",
  faq_20_body: `Tidak. nullchat tidak memasang cookie, tidak menggunakan analitik, tidak memuat skrip pihak ketiga, tidak menyematkan piksel pelacakan, dan tidak membuat permintaan eksternal. Header Content Security Policy memberlakukan ini di tingkat browser. Anda bisa memverifikasi ini di alat pengembang browser Anda.`,
  faq_21_title: "Mengapa saya tidak bisa mengirim tautan, gambar, atau file?",
  faq_21_body: `Memang dirancang begitu. nullchat hanya teks — tidak ada tautan, gambar, lampiran file, atau media dalam bentuk apa pun yang bisa dikirim atau ditampilkan. Ini adalah keputusan keamanan yang disengaja, bukan keterbatasan. Tautan yang bisa diklik dan media tertanam adalah permukaan serangan utama untuk eksploitasi zero-day yang digunakan oleh spyware komersial seperti Pegasus, Predator, dan alat pengawasan serupa. Satu tautan atau file berbahaya bisa secara diam-diam mengkompromikan seluruh perangkat. Dengan mengurangi obrolan menjadi plaintext saja, nullchat menghilangkan vektor serangan ini sepenuhnya. Tidak ada yang bisa diklik, tidak ada yang bisa diunduh, dan tidak ada yang bisa ditampilkan — yang berarti tidak ada yang bisa dieksploitasi.`,
  faq_22_title: "Bisakah saya menyalin atau mengambil tangkapan layar pesan?",
  faq_22_body: `nullchat secara aktif mencegah pengambilan konten pesan. Pemilihan teks dan penyalinan dinonaktifkan di area obrolan, menu konteks klik kanan diblokir, dan pintasan keyboard tangkapan layar umum dicegat. Screen Capture API browser juga diblokir melalui header Permissions-Policy, mencegah alat perekam layar berbasis web menangkap halaman.

Ini adalah perlindungan berbasis gesekan, bukan jaminan absolut. Pengguna yang bertekad selalu bisa memotret layar mereka dengan perangkat lain atau menggunakan alat tingkat OS yang melewati pembatasan browser. Tujuannya adalah membuat pengambilan kasual menjadi sulit dan memperkuat ekspektasi bahwa percakapan di nullchat tidak dimaksudkan untuk disimpan.`,
  faq_23_title: "Apa itu lalu lintas umpan?",
  faq_23_body: `nullchat secara otomatis mengirim pesan dummy terenkripsi pada interval acak (setiap 10–60 detik) selama Anda terhubung ke ruangan. Pesan umpan ini tidak bisa dibedakan dari pesan asli — ukurannya sama (berkat padding tetap), dienkripsi dengan kunci yang sama, dan diteruskan melalui jalur server yang sama. Klien penerima secara diam-diam membuangnya setelah dekripsi.

Lalu lintas umpan mengalahkan analisis lalu lintas. Tanpanya, pengamat yang memantau lalu lintas jaringan bisa menentukan kapan komunikasi nyata terjadi berdasarkan kapan gumpalan terenkripsi dikirim. Dengan umpan, ada aliran lalu lintas yang tampak identik secara konstan terlepas dari apakah ada yang benar-benar mengetik — membuat mustahil untuk membedakan pesan asli dari noise.`,
  faq_24_title: "Apa itu padding koneksi?",
  faq_24_body: `Server mengirim frame biner dengan panjang acak (data acak 64–512 byte) ke setiap klien yang terhubung pada interval acak (setiap 5–30 detik). Frame ini bukan pesan — ini adalah noise murni yang klien abaikan secara diam-diam. Dikombinasikan dengan lalu lintas umpan sisi klien, padding koneksi memastikan bahwa pola lalu lintas jaringan tidak mengungkapkan apa pun tentang apakah komunikasi nyata sedang terjadi, berapa banyak pesan yang dipertukarkan, atau kapan peserta aktif.`,
  faq_25_title: "Apa itu tombol panik?",
  faq_25_body: `Mengetuk tombol Escape tiga kali secara cepat langsung menghapus sesi Anda. Saat dipicu, nullchat mengirim perintah akhiri ke server (menghapus semua pesan Anda), menutup koneksi WebSocket, menghapus kunci enkripsi di memori menjadi nol, membersihkan DOM, menghapus sessionStorage dan localStorage, membersihkan clipboard, dan mengarahkan browser Anda ke google.com. Seluruh proses memakan waktu kurang dari satu detik. Jika browser mencoba memulihkan halaman dari cache (misalnya melalui tombol kembali), penghapusan otomatis dipicu kembali. Gunakan ini jika Anda perlu segera menghapus semua bukti percakapan dari layar dan browser Anda.`,
  faq_26_title: "Apa itu mode steganografi?",
  faq_26_body: `Mode steganografi menyamarkan antarmuka nullchat sebagai editor dokumen. Tekan Shift lima kali secara cepat untuk mengaktifkannya. Seluruh UI berubah — antarmuka obrolan gelap digantikan dengan antarmuka editor dokumen yang tampak familiar lengkap dengan toolbar dan menu bar. Pesan muncul sebagai paragraf di badan dokumen, dan ketikan Anda menyatu sebagai pengetikan aktif. Semua enkripsi, timer penghapusan, dan fitur keamanan terus beroperasi normal di bawahnya.

Ini berguna jika seseorang melihat dari belakang bahu Anda atau jika layar Anda terlihat oleh orang lain. Sekilas, tampak seperti Anda sedang mengedit dokumen, bukan melakukan percakapan terenkripsi. Tekan Shift lima kali lagi untuk kembali ke tampilan obrolan normal.`,
  faq_27_title: "Apakah nullchat otomatis membersihkan clipboard?",
  faq_27_body: `Ya. Jika ada yang disalin saat Anda berada di ruang obrolan, nullchat secara otomatis membersihkan clipboard Anda setelah 15 detik. Clipboard juga dihapus saat Anda menutup tab atau menavigasi keluar, dan langsung jika Anda menggunakan tombol panik. Ini mencegah konten pesan tertinggal di clipboard Anda setelah Anda meninggalkan percakapan.`,
  faq_28_title: "Bisakah Anda membaca pesan saya?",
  faq_28_body: `Tidak. Server hanyalah relay bodoh. Server menerima gumpalan terenkripsi dan meneruskannya. Kunci enkripsi diturunkan dari rahasia bersama Anda, yang tidak pernah meninggalkan browser Anda. Kami tidak memiliki kuncinya. Kami tidak bisa mendekripsi gumpalan tersebut. Bahkan jika server dikompromikan, penyerang hanya akan mendapatkan ciphertext yang tidak bermakna.`,
  faq_29_title: "Bisakah lembaga pemerintah mengakses pesan saya?",
  faq_29_body: `Kami tidak bisa memberikan apa yang tidak kami miliki. Tidak ada pesan plaintext yang tersimpan di mana pun. Tidak ada akun pengguna untuk dicari. Tidak ada log IP untuk diserahkan. Gumpalan terenkripsi otomatis terhapus sesuai jadwal tetap. Bahkan di bawah perintah hukum yang sah, paling banyak yang bisa kami hasilkan adalah kumpulan gumpalan terenkripsi dan hash ruangan — tidak ada yang berguna tanpa rahasia bersama yang hanya diketahui oleh para peserta.`,
  faq_30_title: "Apakah nullchat bersumber terbuka?",
  faq_30_body_1: `Ya. Seluruh basis kode — klien, server, enkripsi, dan konfigurasi infrastruktur — tersedia secara publik untuk diaudit di`,
  faq_30_body_2: `. Anda bisa memverifikasi bahwa kode yang berjalan di server cocok dengan yang dipublikasikan, membangunnya sendiri, atau meng-hosting instance Anda sendiri. Transparansi bukan pilihan untuk alat yang meminta Anda mempercayainya dengan komunikasi pribadi Anda.`,
  faq_31_title: "Siapa yang membangun nullchat?",
  faq_31_body_1: `nullchat dibangun oleh Artorias — perusahaan teknologi intelijen yang dioperasikan oleh veteran militer, berbasis di New York City. Artorias hadir untuk membongkar sistem yang sudah usang dan membekali organisasi serta individu terpenting dengan alat yang dirancang khusus untuk beroperasi dalam kegelapan. Pada intinya, Artorias adalah tentang mendemokratisasi intelijen dan anonimitas — memastikan bahwa kemampuan untuk berkomunikasi secara aman dan beroperasi tanpa pengawasan bukanlah hak istimewa yang hanya dimiliki segelintir orang. nullchat adalah salah satu wujud dari misi tersebut: komunikasi aman yang dipangkas hingga esensinya, tanpa kompromi pada integritas kriptografi. Pelajari lebih lanjut di`,

};
