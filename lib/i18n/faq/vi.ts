import type { FaqKey } from "../faq-translations";

export const vi: Record<FaqKey, string> = {
  faq_1_title: "nullchat là gì?",
  faq_1_body: `nullchat là một phòng chat ẩn danh, được mã hóa đầu cuối, không yêu cầu tài khoản, không email, không số điện thoại, và không cần bất kỳ thông tin cá nhân nào. Bạn nhập một bí mật chung — một mật khẩu — và bất kỳ ai nhập cùng mật khẩu đó sẽ vào cùng một phòng. Chỉ vậy thôi.`,
  faq_2_title: "Làm thế nào để vào một phòng?",
  faq_2_body: `Bạn và người muốn trò chuyện thống nhất trước một bí mật chung — trực tiếp, qua cuộc gọi điện thoại, bằng bất kỳ cách nào bạn muốn. Cả hai cùng nhập bí mật đó vào nullchat và bạn sẽ ở trong cùng một phòng được mã hóa. Không có danh sách phòng, không có thư mục, không có cách duyệt. Nếu bạn không biết bí mật, phòng đó không tồn tại đối với bạn.`,
  faq_3_title: "Tôi nên chọn bí mật chung như thế nào?",
  faq_3_body: `Bí mật chung là phần quan trọng nhất trong bảo mật của bạn. Nó vừa là chìa khóa vào phòng, vừa là chìa khóa mã hóa — nếu ai đó đoán được, họ có thể đọc mọi thứ. Hãy coi nó như mật khẩu của một két sắt.

Chọn thứ gì đó dài, ngẫu nhiên và không thể đoán được. Một bí mật mạnh có ít nhất 5–6 từ ngẫu nhiên hoặc hơn 20 ký tự hỗn hợp. Tránh tên, ngày tháng, cụm từ thông dụng, lời bài hát, hoặc bất kỳ thứ gì ai đó có thể tìm thấy trên mạng xã hội của bạn. Không bao giờ tái sử dụng bí mật cho các cuộc trò chuyện hoặc phòng khác nhau.

Chia sẻ bí mật qua một kênh an toàn, ngoài băng tần — trực tiếp là tốt nhất. Cuộc gọi điện thoại cũng chấp nhận được. Không bao giờ gửi qua tin nhắn, email, DM, hoặc bất kỳ nền tảng nào lưu lại tin nhắn. Nếu bạn nghi ngờ bí mật đã bị lộ, hãy ngừng sử dụng ngay lập tức và thống nhất bí mật mới qua kênh an toàn.

Chỉ báo độ mạnh trên màn hình nhập cho bạn cảm nhận sơ bộ về khả năng chống lại tấn công brute-force của bí mật, nhưng không chỉ báo nào thay thế được phán đoán tốt. Khi nghi ngờ, hãy làm cho nó dài hơn và ngẫu nhiên hơn.`,
  faq_4_title: "Mã hóa hoạt động như thế nào?",
  faq_4_body: `Khi bạn nhập bí mật chung, hai điều xảy ra hoàn toàn trong trình duyệt của bạn:

1. Bí mật được xử lý qua Argon2id — một hàm dẫn xuất khóa đòi hỏi nhiều bộ nhớ — sử dụng một salt tách biệt theo miền để tạo ra ID phòng. Hash này được gửi đến máy chủ để nó biết kết nối bạn vào phòng nào. Máy chủ không bao giờ thấy bí mật thực sự của bạn.

2. Bí mật được chạy qua một phép dẫn xuất Argon2id thứ hai, độc lập (64 MiB bộ nhớ, 3 vòng lặp) để tạo ra một khóa mã hóa 256-bit. Khóa này không bao giờ rời khỏi trình duyệt của bạn. Argon2id yêu cầu các khối RAM lớn cho mỗi lần thử, khiến các cuộc tấn công brute-force bằng GPU và ASIC vào mật khẩu của bạn khó hơn nhiều bậc so với các KDF truyền thống.

Mọi tin nhắn bạn gửi đều được mã hóa bằng NaCl secretbox (XSalsa20-Poly1305) với khóa đó trước khi rời thiết bị của bạn. Máy chủ nhận, lưu trữ và chuyển tiếp chỉ bản mã — các blob được mã hóa vô nghĩa nếu không có khóa. Chúng tôi không thể đọc tin nhắn của bạn. Không ai có thể, trừ khi họ biết bí mật chung.`,
  faq_5_title: "Máy chủ thấy gì?",
  faq_5_body: `Máy chủ thấy:
• Một hash dẫn xuất từ Argon2id (ID phòng) — không phải mật khẩu của bạn
• Các blob bản mã được mã hóa — không phải tin nhắn của bạn
• Số lượng kết nối đang hoạt động trong một phòng
• Dấu thời gian khi các blob được mã hóa được nhận

Máy chủ KHÔNG thấy:
• Bí mật chung / mật khẩu của bạn
• Nội dung tin nhắn của bạn
• Danh tính hoặc tên người dùng của bạn (bí danh được mã hóa bên trong tin nhắn)
• Địa chỉ IP của bạn (bị loại bỏ tại biên bởi nhà cung cấp hosting)`,
  faq_6_title: "Đệm tin nhắn là gì?",
  faq_6_body: `Trước khi mã hóa, mỗi tin nhắn được đệm đến một khối cố định 8.192 byte bằng tiền tố độ dài 2 byte, theo sau là nội dung tin nhắn và nhiễu ngẫu nhiên. Điều này có nghĩa là một tin nhắn ngắn như "xin chào" tạo ra bản mã có kích thước giống hệt tin nhắn dài tối đa. Nếu không có đệm, người quan sát có thể đoán nội dung tin nhắn dựa trên độ dài bản mã. Phần nhiễu ngẫu nhiên (không phải số không) đảm bảo không có mẫu nào có thể nhận dạng trong bản rõ trước khi mã hóa. Đệm loại bỏ hoàn toàn kênh phụ này.`,
  faq_7_title: "Làm mờ dấu thời gian là gì?",
  faq_7_body: `Dấu thời gian trong tin nhắn được làm tròn đến phút gần nhất trước khi mã hóa. Điều này ngăn chặn các cuộc tấn công tương quan thời gian, trong đó người quan sát có thể so khớp các mẫu tin nhắn trên các kênh khác nhau bằng cách so sánh dấu thời gian chính xác.`,
  faq_8_title: "Tin nhắn tồn tại bao lâu?",
  faq_8_body: `Tin nhắn sử dụng hệ thống hẹn giờ phân tầng:

• Hộp thư chết (tin nhắn đầu tiên): Tin nhắn nằm được mã hóa trên máy chủ trong tối đa 24 giờ, chờ phản hồi. Người gửi có thể rời đi và quay lại kiểm tra mà không kích hoạt bất kỳ đếm ngược nào. Việc đơn giản vào phòng không đốt tin nhắn.

• Cả hai người dùng có mặt: Khi người thứ hai tham gia phòng, tất cả tin nhắn chưa đọc ngay lập tức bắt đầu đếm ngược tự hủy 5 phút. Mọi tin nhắn mới gửi khi cả hai người dùng có mặt cũng tự hủy sau 5 phút. Không cần hành động nào — chỉ sự hiện diện đã xác nhận tin nhắn đang được đọc.

• Nút Đã nhận: Nếu bạn nhận tin nhắn hộp thư chết khi đang ở một mình trong phòng, bạn có thể nhấn nút "Đã nhận" để xác nhận thủ công việc nhận và bắt đầu đếm ngược tự hủy 5 phút. Nút này chỉ xuất hiện một lần — khi nhận hộp thư chết lần đầu — và không khả dụng trong các cuộc trò chuyện đang diễn ra.

• Cuộc trò chuyện đang hoạt động: Khi phòng đã có phản hồi, các tin nhắn tiếp theo có cửa sổ 6 giờ nếu người nhận không có mặt. Nếu cả hai người dùng đều kết nối, tin nhắn tự hủy sau 5 phút tự động.

• Giới hạn cứng: Bất kỳ tin nhắn chưa đọc nào đều bị xóa sau khi hẹn giờ hết hạn (24 giờ cho hộp thư chết, 6 giờ cho tin nhắn đang hoạt động) bất kể nó có được xác nhận hay không.

Không có lưu trữ, không có sao lưu, không có cách khôi phục tin nhắn đã xóa.`,
  faq_9_title: "Hộp thư chết là gì?",
  faq_9_body: `nullchat hoạt động như một hộp thư chết kỹ thuật số. Trong nghệ thuật tình báo truyền thống, hộp thư chết là phương pháp truyền thông tin giữa hai người mà không cần họ gặp nhau hoặc ở cùng một nơi cùng lúc. nullchat hoạt động theo cách tương tự.

Bạn nhập bí mật chung, để lại tin nhắn được mã hóa và ngắt kết nối. Tin nhắn nằm trên máy chủ — được mã hóa và không ai đọc được, kể cả chúng tôi — trong tối đa 24 giờ. Liên lạc của bạn nhập cùng bí mật khi họ sẵn sàng và nhận tin nhắn. Khi người nhận tham gia và cả hai người dùng có mặt, tất cả tin nhắn đang chờ ngay lập tức bắt đầu đếm ngược tự hủy 5 phút — chỉ sự hiện diện đã là bằng chứng nhận. Nếu người nhận lấy tin nhắn khi đang ở một mình, họ có thể nhấn nút "Đã nhận" một lần duy nhất để xác nhận thủ công việc nhận và bắt đầu tự hủy, hoặc đơn giản là trả lời. Khi quá trình tự hủy bắt đầu, tin nhắn bị phá hủy vĩnh viễn sau 5 phút.

Người gửi có thể kết nối lại an toàn bất cứ lúc nào để kiểm tra xem tin nhắn có còn đang chờ không — mà không kích hoạt bất kỳ đếm ngược nào, miễn là họ là người duy nhất trong phòng. Không bên nào cần trực tuyến cùng lúc. Không bên nào cần tài khoản. Không bên nào có thể nhận dạng được. Máy chủ không bao giờ biết ai để lại tin nhắn hoặc ai nhận nó — chỉ biết rằng một blob được mã hóa đã được lưu trữ và sau đó được truy xuất. Sau khi tự hủy, không có bằng chứng nào cho thấy cuộc trao đổi đã từng xảy ra.`,
  faq_10_title: "Phòng tồn tại bao lâu?",
  faq_10_body: `Một phòng tồn tại miễn là nó có kết nối đang hoạt động hoặc tin nhắn chưa hết hạn. Khi người cuối cùng ngắt kết nối và tất cả tin nhắn đã hết hạn hoặc bị tự hủy, phòng biến mất. Không có trạng thái phòng lâu dài. Nếu không có tin nhắn nào được gửi, phòng chỉ là một kết nối trực tiếp — không có gì được lưu trữ, và nó biến mất ngay khi mọi người rời đi.`,
  faq_11_title: "Nút Kết thúc là gì?",
  faq_11_body: `Kết thúc ngay lập tức xóa mọi tin nhắn bạn đã gửi trong phiên hiện tại khỏi máy chủ cho tất cả mọi người trong phòng. Những người tham gia khác sẽ thấy tin nhắn của bạn biến mất khỏi màn hình của họ trong thời gian thực. Sau đó bạn bị ngắt kết nối khỏi phòng. Sử dụng điều này nếu bạn cần rời đi mà không để lại dấu vết.`,
  faq_12_title: "Nút Rời đi là gì?",
  faq_12_body: `Rời đi chỉ đơn giản ngắt kết nối bạn khỏi phòng. Tin nhắn của bạn vẫn còn trên máy chủ — tin nhắn chưa đọc tiếp tục chờ (tối đa 24 giờ), và tin nhắn đã đọc tiếp tục đếm ngược tự hủy 5 phút. Nếu bạn tham gia lại phòng sau, bạn sẽ nhận được bí danh ngẫu nhiên mới — không có cách nào liên kết danh tính cũ và mới của bạn.`,
  faq_13_title: "Bí danh ngẫu nhiên là gì?",
  faq_13_body: `Khi bạn vào một phòng, bạn được gán một mã hex ngẫu nhiên gồm 8 ký tự (ví dụ "a9f2b71c") làm bí danh. Bí danh này được tạo trong trình duyệt, mã hóa bên trong mỗi tin nhắn, và không bao giờ được gửi đến máy chủ dưới dạng văn bản thuần. Nếu bạn ngắt kết nối và kết nối lại, bạn nhận bí danh mới. Không có cách nào để đặt trước, chọn hoặc duy trì bí danh.`,
  faq_14_title: "Có giới hạn người tham gia không?",
  faq_14_body: `Mỗi phòng hỗ trợ tối đa 50 kết nối đồng thời. Nếu phòng đã đầy, bạn sẽ thấy thông báo "Phòng đã đầy". Giới hạn này tồn tại để giữ phòng riêng tư và ngăn chặn lạm dụng.`,
  faq_15_title: "Có giới hạn tốc độ không?",
  faq_15_body: `Có. Mỗi kết nối bị giới hạn 1 tin nhắn mỗi giây. Điều này ngăn chặn spam và lạm dụng mà không yêu cầu bất kỳ xác minh danh tính nào. Nếu bạn gửi tin nhắn quá nhanh, bạn sẽ thấy thông báo ngắn "Chậm lại".`,
  faq_16_title: "Tôi có thể truy cập nullchat qua Tor không?",
  faq_16_body_1: `nullchat có sẵn dưới dạng dịch vụ ẩn Tor cho người dùng ở các khu vực bị kiểm duyệt hoặc bất kỳ ai muốn thêm một lớp ẩn danh. Mở Tor Browser và truy cập:`,
  faq_16_body_2: `Theo mặc định, cả phiên bản clearnet và Tor đều kết nối với cùng một backend — người dùng trên cả hai có thể giao tiếp với nhau trong cùng phòng bằng cùng bí mật chung. Dịch vụ .onion định tuyến qua mạng Tor mà không có Cloudflare, không CDN, và không có cơ sở hạ tầng bên thứ ba nào giữa bạn và máy chủ. Tor định tuyến kết nối của bạn qua nhiều relay được mã hóa, nên cả máy chủ lẫn bất kỳ người quan sát nào đều không thể xác định địa chỉ IP thực hoặc vị trí của bạn. Dịch vụ .onion sử dụng HTTP thuần, điều này là bình thường và an toàn — bản thân Tor cung cấp mã hóa đầu cuối giữa trình duyệt và máy chủ của bạn. Tất cả mã hóa cấp ứng dụng tương tự (NaCl secretbox, dẫn xuất khóa Argon2id) được áp dụng bên trên. Lưu ý: Tor Browser phải được đặt ở mức bảo mật "Standard" để nullchat hoạt động, vì ứng dụng yêu cầu JavaScript.`,
  faq_17_title: "Phòng chỉ dành cho Tor là gì?",
  faq_17_body: `Khi truy cập nullchat qua dịch vụ ẩn .onion, bạn có tùy chọn bật "Phòng chỉ dành cho Tor" — một nút chuyển xuất hiện trên màn hình nhập mật khẩu. Khi được bật, phòng của bạn được đặt trong một không gian tên riêng biệt mà chỉ những người dùng Tor khác với cùng nút chuyển được bật mới có thể truy cập. Người dùng clearnet không bao giờ có thể vào phòng chỉ dành cho Tor, ngay cả khi họ biết bí mật chung.

Điều này cung cấp mức bảo mật cao hơn so với các phòng chia sẻ mặc định:

• Cả hai bên đều được định tuyến qua mạng onion nhiều bước nhảy của Tor — địa chỉ IP thực hoặc vị trí của không bên nào hiển thị với bất kỳ ai, bao gồm cả máy chủ.
• Không tra cứu DNS, không CDN, và không có cơ sở hạ tầng bên thứ ba nào chạm vào kết nối tại bất kỳ điểm nào.
• Phân tích lưu lượng khó hơn đáng kể vì cả hai bên đều được hưởng lợi từ đệm relay của Tor kết hợp với đệm kết nối riêng của nullchat (khung giả ngẫu nhiên gửi theo khoảng thời gian ngẫu nhiên).
• Không có người tham gia clearnet nào có siêu dữ liệu kết nối yếu hơn có thể bị tương quan với cuộc trò chuyện.

Bạn chỉ ẩn danh bằng mắt xích yếu nhất trong cuộc trò chuyện. Trong phòng mặc định, kết nối của người tham gia clearnet chạm vào bộ phân giải DNS, cơ sở hạ tầng CDN và định tuyến internet tiêu chuẩn — tất cả đều có thể bị quan sát hoặc triệu tập để lấy siêu dữ liệu về ai đã kết nối, khi nào và từ đâu. Nút chuyển chỉ dành cho Tor loại bỏ hoàn toàn rủi ro này bằng cách đảm bảo mọi người tham gia đều có cùng mức ẩn danh ở tầng mạng.

Cả hai bên phải đồng ý bật nút chuyển — nó hoạt động giống như cách thống nhất bí mật chung. Tiêu đề chat hiển thị "CHỈ TOR" màu xanh lá khi đang hoạt động, hoặc "CLEARNET" màu đỏ cho các phòng tiêu chuẩn, để bạn luôn biết mình đang ở chế độ nào.`,
  faq_18_title: "Thời gian chờ không hoạt động là gì?",
  faq_18_body: `Nếu bạn không hoạt động trong 15 phút — không gõ, không chạm, không cuộn — nullchat sẽ tự động ngắt kết nối và đưa bạn trở lại màn hình nhập mật khẩu. Cảnh báo xuất hiện ở phút thứ 13 cho bạn tùy chọn ở lại. Điều này bảo vệ phiên của bạn nếu bạn rời khỏi thiết bị, ngăn tin nhắn bị tự hủy khi không ai đang đọc, và đảm bảo chat không bị hiển thị trên màn hình không có người trông coi.`,
  faq_19_title: "Còn về địa chỉ IP thì sao?",
  faq_19_body: `Trên clearnet (nullchat.org), ứng dụng được lưu trữ trên mạng biên của Cloudflare. Địa chỉ IP của bạn được xử lý ở tầng cơ sở hạ tầng và không bao giờ được đọc, ghi nhật ký hoặc lưu trữ bởi mã ứng dụng. Mã máy chủ không truy cập header IP. Chúng tôi không có cơ chế để nhận dạng bạn bằng địa chỉ mạng.

Trên dịch vụ ẩn Tor (.onion), địa chỉ IP của bạn hoàn toàn không bao giờ hiển thị với máy chủ — định tuyến onion của Tor đảm bảo ẩn danh hoàn toàn ở cấp mạng. Máy chủ chỉ thấy các kết nối từ mạng Tor, không có cách nào truy ngược về bạn.`,
  faq_20_title: "Có cookie hoặc trình theo dõi nào không?",
  faq_20_body: `Không. nullchat không đặt cookie, không sử dụng phân tích, không tải script bên thứ ba, không nhúng pixel theo dõi, và không thực hiện yêu cầu bên ngoài. Các header Content Security Policy thực thi điều này ở cấp trình duyệt. Bạn có thể xác minh điều này trong công cụ nhà phát triển của trình duyệt.`,
  faq_21_title: "Tại sao tôi không thể gửi liên kết, hình ảnh hoặc tệp?",
  faq_21_body: `Theo thiết kế. nullchat chỉ hỗ trợ văn bản thuần — không thể gửi hoặc hiển thị liên kết, hình ảnh, tệp đính kèm hoặc phương tiện dưới bất kỳ hình thức nào. Đây là quyết định bảo mật có chủ đích, không phải giới hạn. Liên kết có thể nhấp và phương tiện nhúng là bề mặt tấn công chính cho các khai thác zero-day được sử dụng bởi phần mềm gián điệp thương mại như Pegasus, Predator và các công cụ giám sát tương tự. Một liên kết hoặc tệp độc hại duy nhất có thể âm thầm xâm nhập toàn bộ thiết bị. Bằng cách giới hạn chat chỉ còn văn bản thuần, nullchat loại bỏ hoàn toàn vectơ tấn công này. Không có gì để nhấp, không có gì để tải xuống, và không có gì để hiển thị — có nghĩa là không có gì để khai thác.`,
  faq_22_title: "Tôi có thể sao chép hoặc chụp màn hình tin nhắn không?",
  faq_22_body: `nullchat chủ động ngăn cản việc chụp nội dung tin nhắn. Chọn văn bản và sao chép bị vô hiệu hóa trong khu vực chat, menu chuột phải bị chặn, và các phím tắt chụp màn hình phổ biến bị chặn. API Screen Capture của trình duyệt cũng bị chặn qua header Permissions-Policy, ngăn các công cụ ghi màn hình dựa trên web chụp trang.

Đây là các biện pháp bảo vệ dựa trên ma sát, không phải đảm bảo tuyệt đối. Người dùng quyết tâm luôn có thể chụp ảnh màn hình bằng thiết bị khác hoặc sử dụng công cụ cấp hệ điều hành vượt qua giới hạn trình duyệt. Mục tiêu là làm cho việc chụp thông thường trở nên khó khăn và củng cố kỳ vọng rằng các cuộc trò chuyện trong nullchat không được dùng để lưu lại.`,
  faq_23_title: "Lưu lượng giả là gì?",
  faq_23_body: `nullchat tự động gửi các tin nhắn giả được mã hóa theo khoảng thời gian ngẫu nhiên (mỗi 10–60 giây) khi bạn đang kết nối với một phòng. Các tin nhắn giả này không thể phân biệt với tin nhắn thật — chúng có cùng kích thước (nhờ đệm cố định), được mã hóa với cùng khóa, và được chuyển tiếp qua cùng đường dẫn máy chủ. Client của người nhận âm thầm loại bỏ chúng sau khi giải mã.

Lưu lượng giả đánh bại phân tích lưu lượng. Nếu không có nó, người quan sát theo dõi lưu lượng mạng có thể xác định khi nào giao tiếp thực sự đang diễn ra dựa trên thời điểm các blob mã hóa được gửi. Với lưu lượng giả, có một dòng lưu lượng liên tục trông giống hệt nhau bất kể có ai đang thực sự gõ hay không — khiến việc phân biệt tin nhắn thật với nhiễu trở nên bất khả thi.`,
  faq_24_title: "Đệm kết nối là gì?",
  faq_24_body: `Máy chủ gửi các khung nhị phân có độ dài ngẫu nhiên (64–512 byte dữ liệu ngẫu nhiên) đến mọi client đang kết nối theo khoảng thời gian ngẫu nhiên (mỗi 5–30 giây). Các khung này không phải tin nhắn — chúng là nhiễu thuần túy mà client âm thầm bỏ qua. Kết hợp với lưu lượng giả phía client, đệm kết nối đảm bảo rằng các mẫu lưu lượng mạng không tiết lộ gì về việc giao tiếp thực sự có đang diễn ra hay không, bao nhiêu tin nhắn đang được trao đổi, hoặc khi nào người tham gia đang hoạt động.`,
  faq_25_title: "Phím hoảng loạn là gì?",
  faq_25_body: `Nhấn ba lần nhanh phím Escape ngay lập tức xóa sạch phiên của bạn. Khi được kích hoạt, nullchat gửi lệnh kết thúc đến máy chủ (xóa tất cả tin nhắn của bạn), đóng kết nối WebSocket, xóa khóa mã hóa trong bộ nhớ, xóa DOM, xóa sessionStorage và localStorage, xóa clipboard, và chuyển hướng trình duyệt đến google.com. Toàn bộ quá trình mất chưa đến một giây. Nếu trình duyệt cố khôi phục trang từ bộ nhớ đệm (ví dụ qua nút quay lại), việc xóa sẽ tự động được kích hoạt lại. Sử dụng điều này nếu bạn cần xóa ngay mọi bằng chứng của cuộc trò chuyện khỏi màn hình và trình duyệt.`,
  faq_26_title: "Chế độ ẩn giấu là gì?",
  faq_26_body: `Chế độ ẩn giấu ngụy trang giao diện nullchat thành một trình soạn thảo tài liệu. Nhấn Shift năm lần nhanh để kích hoạt. Toàn bộ giao diện thay đổi — giao diện chat tối được thay thế bằng giao diện soạn thảo tài liệu quen thuộc hoàn chỉnh với thanh công cụ và thanh menu. Tin nhắn xuất hiện dưới dạng đoạn văn trong nội dung tài liệu, và đầu vào của bạn hòa lẫn vào như đang gõ văn bản. Tất cả mã hóa, hẹn giờ tự hủy, và tính năng bảo mật tiếp tục hoạt động bình thường bên dưới.

Điều này hữu ích nếu ai đó đang nhìn qua vai bạn hoặc màn hình của bạn hiển thị cho người khác. Nhìn thoáng qua, nó trông như bạn đang soạn thảo tài liệu, không phải đang có cuộc trò chuyện mã hóa. Nhấn Shift năm lần nữa để quay lại chế độ chat bình thường.`,
  faq_27_title: "nullchat có tự động xóa clipboard không?",
  faq_27_body: `Có. Nếu bất kỳ nội dung nào được sao chép khi bạn đang trong phòng chat, nullchat tự động xóa clipboard sau 15 giây. Clipboard cũng bị xóa khi bạn đóng tab hoặc điều hướng đi, và ngay lập tức nếu bạn sử dụng phím hoảng loạn. Điều này ngăn nội dung tin nhắn tồn tại trong clipboard sau khi bạn đã rời cuộc trò chuyện.`,
  faq_28_title: "Bạn có thể đọc tin nhắn của tôi không?",
  faq_28_body: `Không. Máy chủ chỉ là một bộ chuyển tiếp đơn giản. Nó nhận các blob mã hóa và chuyển tiếp chúng. Khóa mã hóa được dẫn xuất từ bí mật chung của bạn, thứ không bao giờ rời khỏi trình duyệt. Chúng tôi không có khóa. Chúng tôi không thể giải mã các blob. Ngay cả khi máy chủ bị xâm phạm, kẻ tấn công chỉ thu được bản mã vô nghĩa.`,
  faq_29_title: "Cơ quan chính phủ có thể truy cập tin nhắn của tôi không?",
  faq_29_body: `Chúng tôi không thể cung cấp thứ chúng tôi không có. Không có tin nhắn văn bản thuần nào được lưu trữ ở bất kỳ đâu. Không có tài khoản người dùng để tra cứu. Không có nhật ký IP để bàn giao. Các blob mã hóa tự động xóa theo lịch trình cố định. Ngay cả với lệnh tư pháp hợp lệ, tối đa những gì chúng tôi có thể cung cấp là một bộ sưu tập các blob mã hóa và hash phòng — không có cái nào hữu ích nếu không có bí mật chung mà chỉ những người tham gia biết.`,
  faq_30_title: "nullchat có mã nguồn mở không?",
  faq_30_body_1: `Có. Toàn bộ mã nguồn — client, máy chủ, mã hóa và cấu hình cơ sở hạ tầng — đều công khai để kiểm tra tại`,
  faq_30_body_2: `. Bạn có thể xác minh rằng mã đang chạy trên máy chủ khớp với mã đã công bố, tự build, hoặc tự host bản riêng. Minh bạch không phải là tùy chọn cho một công cụ yêu cầu bạn tin tưởng nó với các giao tiếp riêng tư.`,
  faq_31_title: "Ai đã xây dựng nullchat?",
  faq_31_body_1: `nullchat được xây dựng bởi Artorias — một công ty công nghệ tình báo do cựu chiến binh điều hành, có trụ sở tại New York City. Artorias tồn tại để tháo dỡ các hệ thống lỗi thời và trang bị cho các tổ chức và cá nhân quan trọng nhất những công cụ được xây dựng chuyên biệt cho hoạt động trong bóng tối. Về bản chất, Artorias hướng đến dân chủ hóa tình báo và ẩn danh — đảm bảo rằng khả năng giao tiếp an toàn và hoạt động không bị giám sát không phải là đặc quyền dành cho số ít. nullchat là một biểu hiện của sứ mệnh đó: giao tiếp an toàn được tinh giản đến bản chất, không thỏa hiệp về tính toàn vẹn mật mã. Tìm hiểu thêm tại`,
  faq_32_title: "Tôi có thể thêm nullchat vào màn hình chính không?",
  faq_32_body: `Có. nullchat hỗ trợ Thêm vào màn hình chính trên cả iOS và Android. Trên iOS Safari, nhấn nút chia sẻ và chọn "Thêm vào MH chính". Trên Android Chrome, nhấn menu và chọn "Thêm vào màn hình chính" hoặc "Cài đặt ứng dụng". Điều này tạo một lối tắt độc lập mở nullchat mà không có giao diện trình duyệt — không thanh địa chỉ, không tab. Trông và cảm giác như một ứng dụng gốc.

Quan trọng: nullchat cố tình không sử dụng service worker hoặc lưu trữ bất kỳ dữ liệu nào ngoại tuyến. Không có chế độ ngoại tuyến. Lối tắt màn hình chính chỉ đơn giản mở trang web trực tiếp — không có gì được lưu trên thiết bị ngoài lối tắt. Đây là quyết định bảo mật: lưu bộ nhớ đệm các trang chat mã hóa hoặc script service worker trên thiết bị sẽ tạo bằng chứng pháp y rằng nullchat đã được sử dụng. Lối tắt không để lại dấu vết nào ngoài biểu tượng của nó, có thể bị xóa bất cứ lúc nào.`,
};
