-- 特定技能1号 宿泊分野: materi + soal (bab, halaman, kutipan asli dari PDF 1号)
delete from materi where kategori = '宿泊分野（1号）';
delete from soal where kategori = '宿泊分野（1号）';
insert into materi (kategori,judul,ringkas,isi,urutan) values
('宿泊分野（1号）','1号 · 01 · フロント業務','Pekerjaan resepsionis 1号: reservasi, check-in, layanan di dalam hotel, check-out & pembayaran.','フロント（レセプション）= 「宿泊施設の顔」. Semua prosedur dari penjemputan sampai pelepasan tamu.
**1. 予約管理 (reservasi)** — menjawab pertanyaan reservasi, menerima data tamu secara tepat, mengatur pembatalan/perubahan sesuai permintaan tamu.
**2. チェックイン業務** — konfirmasi isi reservasi (nama, rencana/paket, jumlah orang), serahkan kunci kamar, jelaskan fasilitas; untuk tamu asing salin paspor sesuai aturan.
**3. 館内でのお客様対応と情報提供** — menjawab pertanyaan tamu soal fasilitas, memandu lokasi, meneruskan telepon.
**4. チェックアウト・会計業務** — hitung pemakaian layanan/minuman di kamar, terima pembayaran tanpa kesalahan, cek barang bawaan.
**Etika dasar** — 身だしなみ (rapi), 姿勢 (tegak), 言葉遣い (keigo: です・ます・お〜いたします), senyum.
**Data pribadi** — nama, alamat, telepon tamu wajib dikelola dengan benar, jangan dibagikan.
**Tanggung jawab** — tamu asing tanpa data benar = masalah hukum; jangan tinggalkan front tanpa staf.',10),
('宿泊分野（1号）','1号 · 02 · 企画・広報','Merancang paket/rencana dan menyampaikannya lewat website & SNS.','**1. 企画業務** — merancang paket menginap (plan) berdasarkan musim, target tamu, dan harga; menganalisis data reservasi untuk melihat tren.
**2. 広報業務** — menyampaikan informasi ke luar: website sendiri, SNS (Instagram/X/YouTube), brosur, kerja sama dengan OTA.
**A. Website sendiri** — informasi harus akurat & terbaru: harga, jam check-in/out, akses, fasilitas.
**B. SNS** — foto nyata lebih menarik; balas komentar; jangan pernah tulis data tamu.
**Efek** — informasi yang benar menaikkan jumlah reservasi; informasi salah menimbulkan klaim.
**Catatan** — jangan menjanjikan yang tidak bisa dipenuhi (over-promise).',11),
('宿泊分野（1号）','1号 · 03 · 接客','Etika melayani tamu: salam, ojigi, bahasa, memandu, telepon, klaim.','**1. あいさつ (salam)** — ucapkan lebih dulu, senyum, suara jelas.
**2. おじぎ (ojigi)** — 会釈 15° (saat berpapasan), 敬礼・普通礼 30° (menyambut tamu, paling sering), 最敬礼 45° (permintaan maaf/terima kasih mendalam).
**3. 話し方** — gunakan 敬語; bicara pelan & jelas; jangan memotong ucapan tamu.
**4. 具体的な接客** — memandu: berjalan 2–3 langkah di **kiri-depan** tamu, mengikuti langkah tamu; berhenti & ojigi saat tamu lewat; serahkan kunci dengan dua tangan menghadap tamu.
**5. 電話対応** — jangan biarkan berdering lama; catat pesan; tutup telepon setelah tamu yang menutup.
**6. クレーム対応** — (1) minta maaf karena membuat tidak nyaman (2) telusuri penyebab dengan teliti (3) laporkan ke atasan; jangan selesaikan sendiri.',12),
('宿泊分野（1号）','1号 · 04 · レストランサービス','Melayani makan & minum: gerakan dasar, tata cara, alergi, higiene.','**1. サービスの基本動作** — membawa nampan, meletakkan piring dari sisi kanan tamu, menyajikan dengan tangan kanan dari kanan, membersihkan dari kanan.
**2. 服装・身だしなみ** — seragam bersih, rambut rapi, kuku pendek, tidak berbau menyengat.
**3. 食事・ドリンクの提供** — konfirmasi pesanan, antar sesuai urutan (minuman → makanan), tanya kebutuhan sebelum tamu minta.
**4. 食のルール・マナー** — 和食 (urutan & sopan), 洋食 (pisau-garpu dari luar ke dalam), lainnya.
**5. 食物アレルギー** — alergi bisa berakibat fatal (アナフィラキシー); wajib konfirmasi alergen (telur, susu, gandum, kacang, seafood) sebelum menyajikan.
**6. 安全衛生管理** — cuci tangan, suhu penyimpanan, hindari kontaminasi silang.
**7. 専門用語** — 配膳, ウェルカムドリンク, メインディッシュ, ブッフェ, シルバー, カスターセット.',13),
('宿泊分野（1号）','1号 · 05 · 安全衛生管理','Risiko, keselamatan tamu & staf, higiene, fasilitas, lingkungan.','**1. リスクの理解と回避** — cegah kecelakaan sebelum terjadi; periksa lantai licin, tangga, kabel.
**2. お客様の安全確保** — 火災: segera pemadaman awal + evakuasi tamu; 地震: **jangan pakai lift**, gunakan tangga darurat; 119 untuk pemadam/ambulans dengan info jelas.
**3. 従業員の安全確保** — lapor kondisi badan, jangan kerja saat demam/muntah (risiko 食中毒).
**4. 衛生管理** — cuci tangan, desinfeksi, penanganan muntahan/diare (ノロウィルス) dengan sarung tangan & klorin.
**5. 施設管理** — perawatan peralatan, pencahayaan, suhu, kebersihan area umum.
**6. 環境対応** — hemat energi/air, kurangi sampah & plastik, pemilahan sampah.',14);
insert into soal (kategori,pertanyaan,pilihan,jawaban,penjelasan,urutan,bab,sumber_pdf,halaman,kalimat,kalimat_ruby,kosakata) values
('宿泊分野（1号）','予約管理の仕事として正しいものはどれですか？','["お客様の予約の問い合わせ対応と、キャンセル・変更の調整", "客室の清掃", "料理の盛り付け", "駐車場の管理"]'::jsonb,0,'予約管理は、問い合わせへの正しい対応とリクエストに応じたキャンセル・変更の調整を行う業務です。',1,'1号 · 01 · フロント業務','1号',6,'予約管理は、お客様からの予約の問い合わせへの正しい対応、お客様からのリクエストに応じた予約のキャンセルや変更の調整など…',null,'[]'::jsonb),
('宿泊分野（1号）','お客様から予約を受けるときに必ず行うべきことはどれですか？','["個人情報を聞き、適切に管理する", "SNSに投稿する", "同僚に伝えない", "メモを捨てる"]'::jsonb,0,'名前・連絡先などの個人情報は正確に聞き取り、適切に管理します。',2,'1号 · 01 · フロント業務','1号',8,'お客様ご自身の個人情報をお聞きし、適切に管理する必要があります。',null,'[]'::jsonb),
('宿泊分野（1号）','チェックイン業務に含まれないものはどれですか？','["予約内容の確認", "ルームキーのお渡し", "館内・設備の説明", "翌月の宿泊代の請求"]'::jsonb,3,'チェックインでは予約確認・宿泊手続き・鍵の受け渡し・館内説明を行います。',3,'1号 · 01 · フロント業務','1号',10,'予約内容を確認し、ご宿泊の手続き、ルームキーのお渡し、館内・設備の説明などをして…',null,'[]'::jsonb),
('宿泊分野（1号）','ルームキーを渡すときの正しい方法はどれですか？','["相手から見て正面の方向に向けて両手で渡す", "机に置く", "片手で後ろから渡す", "客室まで持って帰ってもらう"]'::jsonb,0,'鍵は相手から見て正面になるよう、両手で丁寧に渡します。',4,'1号 · 03 · 接客','1号',33,'ルームキーをお客様に渡す時には､相手から見て正面の方向に向けて両手でお渡しします。',null,'[]'::jsonb),
('宿泊分野（1号）','館内でお客様からの電話を受けたとき、正しいのはどれですか？','["はっきりとゆっくり話し、お客様が切ってから切る", "早口で話す", "先に切る", "メモを取らない"]'::jsonb,0,'聞き取りやすい話し方で、通話はお客様が切ってから切ります。',5,'1号 · 01 · フロント業務','1号',14,'はっきりとゆっくり話すよう心がけます。また、お客様との電話を切る際には、必ず、お客様が電話を切ってから電話を切るようにします。',null,'[]'::jsonb),
('宿泊分野（1号）','チェックアウト・会計業務で最も大切なことはどれですか？','["スムーズに手続きし、支払いに間違いがないようにする", "できるだけ時間をかける", "現金だけ受け付ける", "領収書を出さない"]'::jsonb,0,'お客様の予定に影響しないよう迅速に、かつ正確に精算します。',6,'1号 · 01 · フロント業務','1号',16,'チェックアウト・会計業務はお客様が宿泊を終えてお帰りになる際の手続きと精算を行う業務です。',null,'[]'::jsonb),
('宿泊分野（1号）','企画業務の内容として正しいものはどれですか？','["宿泊プランなど新しいサービスを考える", "客室を掃除する", "フロントの電話を取る", "料理を作る"]'::jsonb,0,'企画業務は、宿泊プランなど新しいサービスや仕組みを検討する仕事です。',7,'1号 · 02 · 企画・広報','1号',20,'1. 企画業務',null,'[]'::jsonb),
('宿泊分野（1号）','自社SNSを運用するとき、してはいけないことはどれですか？','["お客様の個人情報を投稿する", "写真を載せる", "キャンペーンを案内する", "コメントに返信する"]'::jsonb,0,'SNSでも個人情報の取り扱いは厳禁です。',8,'1号 · 02 · 企画・広報','1号',25,'B . SNSの運用方法',null,'[]'::jsonb),
('宿泊分野（1号）','会釈（軽いおじぎ）の角度はおよそどれですか？','["約15°", "約30°", "約45°", "約90°"]'::jsonb,0,'会釈は約15°。すれ違う時などに使います。',9,'1号 · 03 · 接客','1号',31,'約15°前傾 会釈',null,'[]'::jsonb),
('宿泊分野（1号）','敬礼（普通礼）の角度はおよそどれですか？','["約15°", "約30°", "約45°", "約60°"]'::jsonb,1,'敬礼（普通礼）は約30°で、最もよく使うおじぎです。',10,'1号 · 03 · 接客','1号',31,'約30°前傾 敬礼 普通礼',null,'[]'::jsonb),
('宿泊分野（1号）','最敬礼の角度はおよそどれですか？','["約15°", "約30°", "約45°", "約75°"]'::jsonb,2,'最敬礼は約45°。お詫びや深い感謝の場面で使います。',11,'1号 · 03 · 接客','1号',31,'約45°前傾 最敬礼',null,'[]'::jsonb),
('宿泊分野（1号）','お客様を館内でご案内するときの正しい歩き方はどれですか？','["2～3歩、左前方を、お客様の歩調に合わせて歩く", "真後ろを早歩きする", "右後ろを離れて歩く", "並んで歩く"]'::jsonb,0,'案内時は左前方を、お客様の歩調に合わせて歩きます。',12,'1号 · 03 · 接客','1号',33,'宿泊施設内でお客様をご案内する際には、2 ～3 歩、左前方を、お客様の歩調に合わせながら歩きます。',null,'[]'::jsonb),
('宿泊分野（1号）','クレーム対応で最初にすべきことはどれですか？','["不快にさせたことをお詫びする", "原因を調べない", "自分だけで解決する", "お客様を待たせる"]'::jsonb,0,'まずお詫び → 原因の確認 → 責任者への報告、の順です。',13,'1号 · 03 · 接客','1号',34,'クレーム対応のポイントは、・まず、不快にさせたことをお詫びする・クレームの原因を丁寧に確認する・責任者に報告することです。',null,'[]'::jsonb),
('宿泊分野（1号）','食物アレルギーへの対応として正しいのはどれですか？','["提供前にアレルゲンを必ず確認する", "お客様の自己責任にする", "同じ皿に盛る", "加熱すれば大丈夫と伝える"]'::jsonb,0,'症状が重いと死に至ることもあるため、事前確認が必須です。',14,'1号 · 04 · レストランサービス','1号',42,'食物アレルギーとは、特定のアレルギー成分を含んだ食べ物を食べた後に、アレルギー症状が引き起こされることです。',null,'[]'::jsonb),
('宿泊分野（1号）','「配膳」の意味はどれですか？','["料理や飲み物をテーブルに運び適切に提供すること", "食器を洗うこと", "会計をすること", "予約を取ること"]'::jsonb,0,'配膳 = membawa dan menyajikan makanan/minuman ke meja.',15,'1号 · 04 · レストランサービス','1号',44,'配膳 料理や飲み物をテーブルに運び適切に提供すること',null,'[]'::jsonb),
('宿泊分野（1号）','火災を発見したとき、最初にすべきことはどれですか？','["初期消火を行い、お客様を安全に避難させる", "エレベーターで避難する", "様子を見る", "記録を書く"]'::jsonb,0,'初期消火と避難誘導を同時に進めます。',16,'1号 · 05 · 安全衛生管理','1号',48,'火災を発見した場合は、速やかに初期消火を実施し、お客様を安全に避難させる',null,'[]'::jsonb),
('宿泊分野（1号）','地震が発生したときの避難方法として正しいのはどれですか？','["エレベーターを使わず非常階段を使う", "エレベーターで降りる", "客室に残る", "窓を開け放す"]'::jsonb,0,'地震時は絶対にエレベーターを使わず、非常階段で避難します。',17,'1号 · 05 · 安全衛生管理','1号',48,'地震が発生した場合は、絶対にエレベーターを使用せず、非常階段等を使用して速やかにお客様を安全な場所に避難させる',null,'[]'::jsonb),
('宿泊分野（1号）','施設管理の内容として正しいものはどれですか？','["設備の点検・清掃・修繕を行う", "予約を取る", "プランを企画する", "SNSを更新する"]'::jsonb,0,'施設管理は設備や環境を安全・清潔に保つ仕事です。',18,'1号 · 05 · 安全衛生管理','1号',50,'4.施設管理について',null,'[]'::jsonb);

select bab, halaman, count(*) from soal where kategori = '宿泊分野（1号）' group by bab, halaman order by bab;
