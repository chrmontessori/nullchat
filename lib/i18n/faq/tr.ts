import type { FaqKey } from "../faq-translations";

export const tr: Record<FaqKey, string> = {
  faq_1_title: "nullchat nedir?",
  faq_1_body: `nullchat; hesap, e-posta, telefon numarası veya herhangi bir kişisel bilgi gerektirmeyen anonim, uçtan uca şifreli bir sohbet odasıdır. Ortak bir sır — bir parola — girersiniz ve aynı parolayı giren herkes aynı odaya düşer. Hepsi bu.`,
  faq_2_title: "Bir odaya nasıl katılırım?",
  faq_2_body: `Siz ve konuşmak istediğiniz kişi önceden ortak bir sır üzerinde anlaşırsınız — yüz yüze, telefon görüşmesiyle veya istediğiniz herhangi bir yolla. İkiniz de bu sırrı nullchat'e yazarsınız ve aynı şifreli odadasınız. Oda listesi yok, dizin yok, göz atma imkanı yok. Sırrı bilmiyorsanız, oda sizin için mevcut değildir.`,
  faq_3_title: "Ortak sırrı nasıl seçmeliyim?",
  faq_3_body: `Ortak sırrınız güvenliğinizin en kritik parçasıdır. Hem odanızın anahtarı hem de şifrelemenizin anahtarıdır — birisi tahmin ederse her şeyi okuyabilir. Bir kasanın şifresi gibi davranın.

Uzun, rastgele ve tahmin edilemez bir şey seçin. Güçlü bir sır en az 5–6 rastgele kelime veya 20'den fazla karışık karakterden oluşmalıdır. İsimlerden, tarihlerden, yaygın ifadelerden, şarkı sözlerinden veya sosyal medyanızda bulunabilecek herhangi bir şeyden kaçının. Bir sırrı farklı konuşmalarda veya odalarda asla tekrar kullanmayın.

Sırrınızı güvenli, bant dışı bir kanal üzerinden paylaşın — yüz yüze en iyisidir. Telefon görüşmesi kabul edilebilir. Asla mesaj, e-posta, DM veya mesajları kaydeden herhangi bir platform üzerinden göndermeyin. Bir sırrın ele geçirildiğinden şüpheleniyorsanız, kullanmayı hemen bırakın ve güvenli bir kanal üzerinden yenisi üzerinde anlaşın.

Giriş ekranındaki güç göstergesi, sırrınızın kaba kuvvet saldırılarına ne kadar dayanıklı olduğu hakkında kabaca bir fikir verir, ancak hiçbir gösterge sağduyunun yerini tutmaz. Şüphe duyduğunuzda daha uzun ve daha rastgele yapın.`,
  faq_4_title: "Şifreleme nasıl çalışır?",
  faq_4_body: `Ortak sırrınızı girdiğinizde, tamamen tarayıcınızda iki şey gerçekleşir:

1. Sır, alan adına özgü bir tuz kullanılarak Argon2id — bellek yoğun bir anahtar türetme fonksiyonu — ile işlenir ve bir oda kimliği üretilir. Bu hash, sunucuya sizi hangi odaya bağlayacağını bildirmek için gönderilir. Sunucu gerçek sırrınızı asla görmez.

2. Sır, 256 bit şifreleme anahtarı üretmek için ikinci, bağımsız bir Argon2id türetmesinden (64 MiB bellek, 3 yineleme) geçirilir. Bu anahtar tarayıcınızdan asla çıkmaz. Argon2id her tahmin için büyük RAM blokları gerektirir, bu da GPU ve ASIC kaba kuvvet saldırılarını geleneksel KDF'lere göre çok daha zor hale getirir.

Gönderdiğiniz her mesaj, cihazınızdan ayrılmadan önce bu anahtar kullanılarak NaCl secretbox (XSalsa20-Poly1305) ile şifrelenir. Sunucu yalnızca şifreli metin — anahtar olmadan anlamsız olan şifreli veri parçaları — alır, saklar ve iletir. Mesajlarınızı okuyamayız. Ortak sırrı bilmedikçe kimse okuyamaz.`,
  faq_5_title: "Sunucu ne görür?",
  faq_5_body: `Sunucu şunları görür:
• Argon2id ile türetilmiş bir hash (oda kimliği) — parolanızı değil
• Şifreli metin parçaları — mesajlarınızı değil
• Bir odadaki aktif bağlantı sayısı
• Şifreli veri parçalarının alındığı zaman damgaları

Sunucu şunları GÖRMEZ:
• Ortak sırrınız / parolanız
• Mesaj içeriğiniz
• Kimliğiniz veya kullanıcı adınız (takma adlar mesajların içinde şifrelenir)
• IP adresiniz (barındırma sağlayıcımız tarafından uç noktada kaldırılır)`,
  faq_6_title: "Mesaj dolgusu nedir?",
  faq_6_body: `Şifrelemeden önce, her mesaj 2 baytlık uzunluk öneki, ardından mesaj içeriği ve rastgele gürültü kullanılarak sabit 8.192 baytlık bir bloğa doldurulur. Bu, "merhaba" gibi kısa bir mesajın maksimum uzunluktaki bir mesajla tam olarak aynı boyutta şifreli metin ürettiği anlamına gelir. Dolgu olmadan, bir gözlemci şifreli metin uzunluğuna bakarak mesaj içeriğini tahmin edebilir. Rastgele gürültü dolgusu (sıfırlar değil), şifrelemeden önce düz metinde ayırt edilebilir bir kalıp olmamasını sağlar. Dolgu bu yan kanalı tamamen ortadan kaldırır.`,
  faq_7_title: "Zaman damgası gizleme nedir?",
  faq_7_body: `Mesajlara dahil edilen zaman damgaları, şifrelemeden önce en yakın dakikaya yuvarlanır. Bu, bir gözlemcinin tam zaman damgalarını karşılaştırarak farklı kanallardaki mesaj kalıplarını eşleştirebileceği zamanlama korelasyon saldırılarını önler.`,
  faq_8_title: "Mesajlar ne kadar süre kalır?",
  faq_8_body: `Mesajlar kademeli bir zamanlayıcı sistemi kullanır:

• Gizli bırakma noktası (ilk mesaj): Bir mesaj, bir yanıt bekleyerek sunucuda şifrelenmiş olarak 24 saate kadar bekler. Gönderen, herhangi bir geri sayımı tetiklemeden ayrılıp kontrol etmek için geri gelebilir. Odaya girmek mesajı yakmaz.

• Her iki kullanıcı da mevcut: İkinci bir kişi odaya katıldığında, tüm okunmamış mesajlar hemen 5 dakikalık yakma geri sayımına başlar. Her iki kullanıcı da mevcutken gönderilen her yeni mesaj da 5 dakikada otomatik olarak yanar. Herhangi bir işlem gerekmez — varlık tek başına mesajın okunduğunu doğrular.

• Alındı düğmesi: Odada yalnızken bir gizli bırakma mesajı alırsanız, alındığını manuel olarak onaylamak ve 5 dakikalık yakmayı başlatmak için "Alındı" düğmesine basabilirsiniz. Bu düğme yalnızca bir kez — ilk gizli bırakma alımı sırasında — görünür ve aktif konuşmalarda kullanılamaz.

• Aktif konuşma: Bir odada yanıtlar görüldüğünde, sonraki mesajların alıcı mevcut değilse 6 saatlik bir penceresi vardır. Her iki kullanıcı da bağlıysa, mesajlar otomatik olarak 5 dakikada yanar.

• Kesin üst sınır: Herhangi bir okunmamış mesaj, onaylanıp onaylanmadığına bakılmaksızın zamanlayıcısı dolduğunda (gizli bırakma noktaları için 24 saat, aktif mesajlar için 6 saat) silinir.

Arşiv yok, yedek yok, silinen bir mesajı kurtarma yolu yok.`,
  faq_9_title: "Gizli bırakma noktası nedir?",
  faq_9_body: `nullchat dijital bir gizli bırakma noktası olarak işlev görür. Geleneksel istihbarat zanaatında, gizli bırakma noktası iki kişi arasında buluşmalarına veya aynı anda aynı yerde olmalarına gerek kalmadan bilgi aktarma yöntemidir. nullchat aynı şekilde çalışır.

Ortak sırrı girersiniz, şifreli bir mesaj bırakırsınız ve bağlantıyı kesersiniz. Mesaj sunucuda — biz dahil kimse tarafından okunamayan şifreli halde — 24 saate kadar bekler. İrtibat kişiniz hazır olduğunda aynı sırrı girer ve mesajı alır. Alıcı katıldığında ve her iki kullanıcı da mevcut olduğunda, bekleyen tüm mesajlar hemen 5 dakikalık yakma geri sayımına başlar — varlık tek başına alındı kanıtıdır. Alıcı mesajı yalnızken alırsa, alındığını manuel olarak onaylamak ve yakmayı başlatmak için tek seferlik "Alındı" düğmesine basabilir veya sadece yanıtlayabilir. Yakma başladığında, mesaj 5 dakika sonra kalıcı olarak yok edilir.

Gönderen, odada tek kişi olduğu sürece herhangi bir geri sayımı tetiklemeden mesajının hâlâ bekleyip beklemediğini kontrol etmek için güvenle yeniden bağlanabilir. İki tarafın da aynı anda çevrimiçi olması gerekmez. İki tarafın da hesaba ihtiyacı yoktur. İki taraftan hiçbiri tanımlanabilir değildir. Sunucu mesajı kimin bıraktığını veya kimin aldığını asla bilemez — yalnızca şifreli bir veri parçasının saklandığını ve daha sonra alındığını bilir. Yakmadan sonra, değişimin gerçekleştiğine dair hiçbir kanıt kalmaz.`,
  faq_10_title: "Odalar ne kadar süre kalır?",
  faq_10_body: `Bir oda, aktif bağlantıları veya süresi dolmamış mesajları olduğu sürece var olur. Son kişi bağlantıyı kestiğinde ve tüm mesajların süresi dolduğunda veya yandığında, oda yok olur. Kalıcı oda durumu yoktur. Hiçbir mesaj gönderilmezse, oda sadece canlı bir bağlantıdır — hiçbir şey saklanmaz ve herkes ayrıldığı anda kaybolur.`,
  faq_11_title: "Sonlandır düğmesi nedir?",
  faq_11_body: `Sonlandır, mevcut oturumunuz sırasında gönderdiğiniz tüm mesajları sunucudan, odadaki herkes için anında siler. Diğer katılımcılar mesajlarınızın ekranlarından gerçek zamanlı olarak kaybolduğunu görür. Ardından odadan bağlantınız kesilir. İz bırakmadan ayrılmanız gerekiyorsa bunu kullanın.`,
  faq_12_title: "Ayrıl düğmesi nedir?",
  faq_12_body: `Ayrıl sizi odadan basitçe bağlantıyı keser. Mesajlarınız sunucuda kalır — okunmamış mesajlar beklemeye devam eder (24 saate kadar) ve okunmuş mesajlar 5 dakikalık yakma geri sayımına devam eder. Odaya daha sonra yeniden katılırsanız, yeni bir rastgele takma ad alırsınız — eski ve yeni kimliklerinizi bağlamanın bir yolu yoktur.`,
  faq_13_title: "Rastgele takma adlar nedir?",
  faq_13_body: `Bir odaya girdiğinizde, takma adınız olarak rastgele 8 karakterlik bir onaltılık kod (örneğin "a9f2b71c") atanır. Bu takma ad tarayıcınızda oluşturulur, her mesajın içinde şifrelenir ve sunucuya asla düz metin olarak gönderilmez. Bağlantıyı kesip yeniden bağlanırsanız, yeni bir takma ad alırsınız. Bir takma adı ayırtmanın, seçmenin veya kalıcı kılmanın yolu yoktur.`,
  faq_14_title: "Katılımcı sınırı var mı?",
  faq_14_body: `Her oda en fazla 50 eşzamanlı bağlantıyı destekler. Oda doluysa, "Oda dolu" mesajı görürsünüz. Bu sınır, odaları samimi tutmak ve kötüye kullanımı önlemek için mevcuttur.`,
  faq_15_title: "Hız sınırlaması var mı?",
  faq_15_body: `Evet. Her bağlantı saniyede 1 mesajla sınırlıdır. Bu, herhangi bir kimlik doğrulaması gerektirmeden spam ve kötüye kullanımı önler. Mesajları çok hızlı gönderirseniz, kısa bir "Yavaşlayın" uyarısı görürsünüz.`,
  faq_16_title: "nullchat'e Tor üzerinden erişebilir miyim?",
  faq_16_body_1: `nullchat, sansürlü bölgelerdeki kullanıcılar veya ek bir anonimlik katmanı isteyen herkes için Tor gizli servisi olarak kullanılabilir. Tor Browser'ı açın ve şu adrese gidin:`,
  faq_16_body_2: `Varsayılan olarak, hem clearnet hem de Tor sürümleri aynı arka uca bağlanır — her ikisindeki kullanıcılar aynı ortak sırrı kullanarak aynı odalarda birbirleriyle iletişim kurabilir. .onion servisi, sizinle sunucu arasında Cloudflare, CDN ve üçüncü taraf altyapı olmadan Tor ağı üzerinden yönlendirilir. Tor bağlantınızı birden fazla şifreli aktarıcı üzerinden yönlendirir, böylece ne sunucu ne de herhangi bir gözlemci gerçek IP adresinizi veya konumunuzu belirleyebilir. .onion servisi düz HTTP kullanır, bu beklenen ve güvenli bir durumdur — Tor'un kendisi tarayıcınız ile sunucu arasında uçtan uca şifreleme sağlar. Tüm aynı uygulama düzeyinde şifreleme (NaCl secretbox, Argon2id anahtar türetme) bunun üzerine uygulanır. Not: nullchat'in çalışması için Tor Browser "Standart" güvenlik düzeyine ayarlanmalıdır, çünkü uygulama JavaScript gerektirir.`,
  faq_17_title: "Yalnızca Tor odası nedir?",
  faq_17_body: `nullchat'e .onion gizli servisi üzerinden erişirken, "Yalnızca Tor odası" seçeneğini etkinleştirme imkanınız vardır — bu, parola giriş ekranında görünen bir geçiş düğmesidir. Etkinleştirildiğinde, odanız yalnızca aynı geçiş düğmesini etkinleştirmiş diğer Tor kullanıcılarının erişebileceği ayrı bir ad alanına yerleştirilir. Clearnet kullanıcıları, ortak sırrı bilseler bile asla yalnızca Tor odasına katılamazlar.

Bu, varsayılan paylaşımlı odalara göre daha yüksek bir güvenlik düzeyi sağlar:

• Her iki taraf da Tor'un çok atlamalı soğan ağı üzerinden yönlendirilir — hiçbir tarafın gerçek IP adresi veya konumu sunucu dahil kimseye görünür değildir.
• Hiçbir DNS sorgusu, CDN ve üçüncü taraf altyapı bağlantıya hiçbir noktada temas etmez.
• Trafik analizi önemli ölçüde daha zordur çünkü her iki taraf da Tor'un aktarıcı dolgusu ile nullchat'in kendi bağlantı doldurmasından (rastgele aralıklarla gönderilen rastgele sahte çerçeveler) yararlanır.
• Konuşmayla ilişkilendirilebilecek daha zayıf bağlantı meta verisine sahip bir clearnet katılımcısı yoktur.

Konuşmadaki en zayıf halka kadar anonimsizdir. Varsayılan bir odada, bir clearnet katılımcısının bağlantısı DNS çözümleyicilerine, CDN altyapısına ve standart internet yönlendirmesine temas eder — bunların tümü kimin bağlandığı, ne zaman ve nereden bağlandığı hakkında meta veri için gözlemlenebilir veya mahkeme kararıyla istenebilir. Yalnızca Tor geçişi, her katılımcının aynı düzeyde ağ katmanı anonimliğine sahip olmasını sağlayarak bu riski tamamen ortadan kaldırır.

Her iki tarafın da geçişi etkinleştirmesi konusunda anlaşması gerekir — bu, ortak sır üzerinde anlaşmakla aynı şekilde çalışır. Sohbet başlığı aktifken yeşil renkte "TOR ONLY", standart odalar için kırmızı renkte "CLEARNET" görüntüler, böylece hangi modda olduğunuzu her zaman bilirsiniz.`,
  faq_18_title: "Hareketsizlik zaman aşımı nedir?",
  faq_18_body: `15 dakika boyunca hareketsiz kalırsanız — yazma, dokunma, kaydırma yok — nullchat sizi otomatik olarak bağlantıyı keser ve parola giriş ekranına döndürür. 13. dakikada kalma seçeneği sunan bir uyarı görünür. Bu, cihazınızdan uzaklaşmanız durumunda oturumunuzu korur, kimse aktif olarak okumuyorken mesajların yanmasını önler ve sohbetin gözetimsiz bir ekranda görünür kalmamasını sağlar.`,
  faq_19_title: "IP adresleri ne olacak?",
  faq_19_body: `Clearnet'te (nullchat.org), uygulama Cloudflare'ın uç ağında barındırılır. IP adresiniz altyapı katmanında işlenir ve uygulama kodu tarafından asla okunmaz, kaydedilmez veya saklanmaz. Sunucu kodu IP başlıklarına erişmez. Sizi ağ adresiyle tanımlama mekanizmamız yoktur.

Tor gizli servisinde (.onion), IP adresiniz sunucuya hiçbir şekilde görünür değildir — Tor'un soğan yönlendirmesi tam ağ düzeyinde anonimlik sağlar. Sunucu yalnızca Tor ağından gelen bağlantıları görür ve bunları size kadar izlemenin yolu yoktur.`,
  faq_20_title: "Çerez veya izleyici var mı?",
  faq_20_body: `Hayır. nullchat çerez koymaz, analitik kullanmaz, üçüncü taraf betikleri yüklemez, izleme pikselleri gömmez ve harici istek yapmaz. Content Security Policy başlıkları bunu tarayıcı düzeyinde zorunlu kılar. Bunu tarayıcınızın geliştirici araçlarından doğrulayabilirsiniz.`,
  faq_21_title: "Neden bağlantı, resim veya dosya gönderemiyorum?",
  faq_21_body: `Tasarım gereği. nullchat yalnızca metin tabanlıdır — hiçbir bağlantı, resim, dosya eki veya herhangi bir medya gönderilemez veya görüntülenemez. Bu bilinçli bir güvenlik kararıdır, bir kısıtlama değil. Tıklanabilir bağlantılar ve gömülü medya, Pegasus, Predator ve benzeri ticari casus yazılımlar tarafından kullanılan sıfır gün istismarlarının birincil saldırı yüzeyidir. Tek bir kötü amaçlı bağlantı veya dosya tüm bir cihazı sessizce ele geçirebilir. Sohbeti yalnızca düz metne indirgeyerek, nullchat bu saldırı vektörünü tamamen ortadan kaldırır. Tıklayacak, indirecek ve işleyecek hiçbir şey yok — bu da istismar edilecek hiçbir şey olmadığı anlamına gelir.`,
  faq_22_title: "Mesajları kopyalayabilir veya ekran görüntüsü alabilir miyim?",
  faq_22_body: `nullchat mesaj içeriğinin yakalanmasını aktif olarak caydırır. Sohbet alanında metin seçimi ve kopyalama devre dışıdır, sağ tıklama bağlam menüleri engellenir ve yaygın ekran görüntüsü klavye kısayolları yakalanır. Tarayıcının Screen Capture API'si de Permissions-Policy başlıkları aracılığıyla engellenerek, web tabanlı ekran kayıt araçlarının sayfayı yakalaması önlenir.

Bunlar sürtünme tabanlı korumalardır, mutlak garantiler değildir. Kararlı bir kullanıcı her zaman ekranını başka bir cihazla fotoğraflayabilir veya tarayıcı kısıtlamalarını atlayan işletim sistemi düzeyinde araçlar kullanabilir. Amaç, gündelik yakalamayı zorlaştırmak ve nullchat'teki konuşmaların kaydedilmek üzere tasarlanmadığı beklentisini pekiştirmektir.`,
  faq_23_title: "Sahte trafik nedir?",
  faq_23_body: `nullchat, bir odaya bağlıyken rastgele aralıklarla (her 10–60 saniyede) otomatik olarak şifreli sahte mesajlar gönderir. Bu sahte mesajlar gerçek mesajlardan ayırt edilemez — aynı boyuttadırlar (sabit dolgu sayesinde), aynı anahtarla şifrelenir ve aynı sunucu yolu üzerinden iletilir. Alıcının istemcisi bunları şifre çözdükten sonra sessizce atar.

Sahte trafik, trafik analizini yener. Bu olmadan, ağ trafiğini izleyen bir gözlemci, şifreli veri parçalarının ne zaman gönderildiğine bakarak gerçek iletişimin ne zaman gerçekleştiğini belirleyebilir. Sahte trafikle, herhangi birinin gerçekten yazıp yazmadığına bakılmaksızın sürekli bir aynı görünümlü trafik akışı vardır — bu da gerçek mesajları gürültüden ayırt etmeyi imkansız kılar.`,
  faq_24_title: "Bağlantı dolgusu nedir?",
  faq_24_body: `Sunucu, rastgele aralıklarla (her 5–30 saniyede) her bağlı istemciye rastgele uzunlukta ikili çerçeveler (64–512 bayt rastgele veri) gönderir. Bu çerçeveler mesaj değildir — istemcinin sessizce görmezden geldiği saf gürültüdür. İstemci tarafındaki sahte trafikle birlikte, bağlantı dolgusu ağ trafiği kalıplarının gerçek iletişim olup olmadığı, kaç mesaj alışverişi yapıldığı veya katılımcıların ne zaman aktif olduğu hakkında hiçbir şey ortaya koymamasını sağlar.`,
  faq_25_title: "Panik tuşu nedir?",
  faq_25_body: `Escape tuşuna üç kez hızlıca basmak oturumunuzu anında siler. Tetiklendiğinde, nullchat sunucuya sonlandırma komutu gönderir (tüm mesajlarınızı siler), WebSocket bağlantısını kapatır, bellekteki şifreleme anahtarını sıfırlar, DOM'u temizler, sessionStorage ve localStorage'ı siler, panoyu temizler ve tarayıcınızı google.com'a yönlendirir. Tüm süreç bir saniyeden az sürer. Tarayıcı sayfayı önbellekten geri yüklemeye çalışırsa (örneğin geri düğmesiyle), silme otomatik olarak yeniden tetiklenir. Konuşmanın tüm izlerini ekranınızdan ve tarayıcınızdan hemen silmeniz gerekiyorsa bunu kullanın.`,
  faq_26_title: "Steganografik mod nedir?",
  faq_26_body: `Steganografik mod, nullchat arayüzünü bir belge düzenleyici olarak gizler. Etkinleştirmek için Shift tuşuna beş kez hızlıca basın. Tüm arayüz dönüşür — koyu sohbet arayüzü, araç çubuğu ve menü çubuğu ile tanıdık görünümlü bir belge düzenleme arayüzüne dönüşür. Mesajlar belge gövdesinde paragraflar olarak görünür ve girdiniz aktif yazma olarak karışır. Tüm şifreleme, yakma zamanlayıcıları ve güvenlik özellikleri altında normal şekilde çalışmaya devam eder.

Birisi omzunuzun üzerinden bakıyorsa veya ekranınız başkalarına görünürse bu kullanışlıdır. İlk bakışta, şifreli bir konuşma yapmak yerine bir belge düzenliyormuşsunuz gibi görünür. Normal sohbet görünümüne dönmek için Shift tuşuna beş kez tekrar basın.`,
  faq_27_title: "nullchat panoyu otomatik temizler mi?",
  faq_27_body: `Evet. Bir sohbet odasındayken herhangi bir şey kopyalanırsa, nullchat panonuzu 15 saniye sonra otomatik olarak temizler. Sekmeyi kapattığınızda veya sayfadan ayrıldığınızda da pano silinir ve panik tuşunu kullanırsanız hemen temizlenir. Bu, konuşmadan ayrıldıktan sonra mesaj içeriğinin panonuzda kalmasını önler.`,
  faq_28_title: "Mesajlarımı okuyabilir misiniz?",
  faq_28_body: `Hayır. Sunucu basit bir aktarıcıdır. Şifreli veri parçalarını alır ve iletir. Şifreleme anahtarı, tarayıcınızdan asla çıkmayan ortak sırrınızdan türetilir. Anahtara sahip değiliz. Şifreli verilerin şifresini çözemeyiz. Sunucu ele geçirilse bile, saldırgan yalnızca anlamsız şifreli metin elde eder.`,
  faq_29_title: "Devlet kurumları mesajlarıma erişebilir mi?",
  faq_29_body: `Sahip olmadığımız şeyi sağlayamayız. Hiçbir yerde düz metin mesajlar saklanmaz. Aranacak kullanıcı hesabı yoktur. Teslim edilecek IP kayıtları yoktur. Şifreli veri parçaları sabit bir programda otomatik olarak silinir. Geçerli bir yasal emir altında bile üretebileceğimiz en fazla şey, şifreli veri parçaları ve oda hash'leri koleksiyonudur — bunların hiçbiri yalnızca katılımcıların bildiği ortak sır olmadan işe yaramaz.`,
  faq_30_title: "nullchat açık kaynak mı?",
  faq_30_body_1: `Evet. Tüm kod tabanı — istemci, sunucu, şifreleme ve altyapı yapılandırması — denetim için herkese açık olarak şu adreste mevcuttur`,
  faq_30_body_2: `. Sunucuda çalışan kodun yayınlananla eşleştiğini doğrulayabilir, kendiniz derleyebilir veya kendi örneğinizi barındırabilirsiniz. Özel iletişimlerinizi emanet etmenizi isteyen bir araç için şeffaflık isteğe bağlı değildir.`,
  faq_31_title: "nullchat'i kim yaptı?",
  faq_31_body_1: `nullchat, Artorias tarafından geliştirilmektedir — New York merkezli, gaziler tarafından işletilen bir istihbarat teknolojisi şirketi. Artorias, eskimiş sistemleri sökmek ve en önemli kuruluşları ve bireyleri karanlıkta faaliyet göstermek için özel olarak tasarlanmış araçlarla donatmak için vardır. Özünde Artorias, istihbarat ve anonimliği demokratikleştirmekle ilgilidir — güvenli iletişim kurma ve gözetim altında olmadan faaliyet gösterme yeteneğinin azınlığa ayrılmış bir ayrıcalık olmamasını sağlamak. nullchat bu misyonun bir ifadesidir: kriptografik bütünlükten ödün vermeden özüne indirgenmiş güvenli iletişim. Daha fazla bilgi için`,

};
