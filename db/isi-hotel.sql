-- Isi materi + soal 宿泊分野 (dari 特定技能2号評価試験 学習用テキスト 宿泊分野)
-- jalankan setelah db/skema.sql. idempoten.

delete from materi where kategori = '宿泊分野';
delete from soal   where kategori = '宿泊分野';

insert into materi (kategori, judul, ringkas, isi, urutan) values

('宿泊分野','00 · 旅館業法 (undang-undang usaha penginapan)',
 'Izin, standar fasilitas, higienitas, buku tamu, dan sanksi',
 '旅館業法 (Ryokan-gyohō) mengatur usaha penginapan di Jepang. Poin yang sering keluar di ujian:
1. Izin — wajib izin dari 都道府県知事 atau 保健所長. Tanpa izin = ilegal.
2. Standar fasilitas — struktur & peralatan harus memenuhi syarat: luas kamar, ventilasi, pencahayaan, toilet, wastafel.
3. Higienitas — pembersihan & desinfeksi berkala, pembasmian hama.
4. Keselamatan — alat pemadam, jalur evakuasi; latihan evakuasi dianjurkan.
5. 宿泊者名簿 (buku tamu) — nama, alamat, pekerjaan, jumlah malam wajib dicatat dan disimpan untuk periode tertentu. Berguna untuk pelacakan infeksi dan mencegah terorisme/kejahatan.
6. Pengawasan — 保健所 / pemerintah daerah melakukan inspeksi; pelanggaran → pembinaan, perintah henti usaha, denda.
7. Tamu asing — fotokopi paspor wajib diambil dan disimpan sesuai ketentuan.', 10),

('宿泊分野','01 · フロント業務 (resepsionis)',
 'Reservasi, check-in, layanan dalam hotel, check-out & pembayaran',
 'Resepsionis = "wajah" penginapan, menangani tamu dari kedatangan sampai keberangkatan. Empat tugas utama:
1. 予約管理 — menjawab pertanyaan reservasi, konfirmasi data tamu, mengatur pembatalan/perubahan.
2. チェックイン業務 — penampilan bersih, postur benar, bahasa sopan; konfirmasi ada/tidaknya reservasi, nama, paket, jumlah orang; serahkan room key; jelaskan kamar, jam layanan, 非常口 & jalur evakuasi.
3. 館内でのお客様対応と情報提供 — telepon dalam hotel (bicara jelas & pelan; tutup telepon SETELAH tamu menutup), ruang service; masuk kamar tamu hanya setelah mengetuk dan mendapat izin; nomor kamar tamu tidak diberikan ke pihak lain tanpa izin tamu.
4. チェックアウト・会計 — konfirmasi layanan/minuman yang dipakai, pembayaran tanpa kesalahan, lalu barang hilang (遺失物) disimpan periode tertentu; jika pemilik tak ditemukan → lapor ke polisi.
Catatan: check-in umumnya 14:00–15:00, check-out 10:00–11:00 (tergantung hotel).
Manajemen front: kualitas layanan, pembukuan, data tamu, dan KPI: ADR (average daily rate), RevPAR (revenue per available room), OCC (okupansi).', 20),

('宿泊分野','02 · 企画・広報 (perencanaan & promosi)',
 'Membuat paket, menyusun anggaran, mengelola HP & SNS',
 '1. 企画業務 — menyusun rencana produk/paket menginap: analisis pasar & pesaing, target tamu, harga, anggaran, jadwal, lalu evaluasi hasil.
2. 広報業務 — menyampaikan informasi ke luar: siaran pers, kerja sama media, konten promosi.
A. Website sendiri — perbarui harga & ketersediaan, foto berkualitas, informasi akses, tombol reservasi yang jelas, versi HP.
B. SNS — posting rutin, konsisten gaya, balas komentar, gunakan foto/video asli, perhatikan hak foto tamu (jangan posting wajah tamu tanpa izin).', 30),

('宿泊分野','03 · 接客 (layanan tamu)',
 'Salam, postur & ojigi, keigo, praktik layanan, telepon, komplain',
 '1. あいさつ — terang, tersenyum, suara terdengar, menatap lawan bicara. Contoh: いらっしゃいませ / ありがとうございました / かしこまりました / 申し訳ございません. Antar staf: おはようございます (masuk), お先に失礼します (pulang), お疲れさまでした (ke yang pulang).
2. 基本姿勢 & おじぎ — punggung tegak, dagu sedikit ditarik, tangan kanan di atas tangan kiri di depan perut. Jenis ojigi: 会釈 ±15° (berpapasan, saat ke meja tamu), 敬礼/普通礼 ±30° (menyambut, paling sering), 最敬礼 ±45° (mengantar pulang, meminta maaf).
3. 話し方 — 尊敬語 / 謙譲語 / 丁寧語; jangan langsung menolak permintaan tamu, pikirkan solusinya, dan tanyakan atasan bila ragu.
4. Praktik — memandu tamu berjalan 2–3 langkah di depan-kiri mengikuti langkah tamu; berhenti & membungkuk saat tamu lewat; serahkan kunci dengan dua tangan menghadap tamu; dahulukan tamu di lift; tamu tunarungu → bahasa isyarat/tulis; tamu terkunci di luar kamar → konfirmasi nomor kamar & nama, antar ke kamar.
5. 電話対応 — jelas & pelan, tunggu tamu menutup telepon lebih dulu, ulangi pesanan room service untuk memastikan.
6. クレーム対応 — (a) minta maaf atas ketidaknyamanan, (b) telusuri penyebab dengan tenang, (c) laporkan ke penanggung jawab. Jangan selesaikan sendiri bila di luar wewenang.', 40),

('宿泊分野','04 · レストランサービス',
 'Omotenashi, etiket penyajian, alergi makanan, higienitas, istilah',
 'Layanan makan = bagian dari おもてなし (hospitality). Manajer restoran bertanggung jawab atas makanan, layanan, higienitas, penanganan tamu & komplain, plus mendidik staf.
Poin ujian:
- 基本動作 — membawa tray, langkah, posisi tangan, penyajian dari sisi kanan tamu (umumnya), menu diserahkan dengan tangan kanan.
- 服装・身だしなみ — seragam bersih, rambut rapi, kuku pendek, tanpa aksesori berlebih.
- Penyajian — cek pesanan sebelum keluar dapur, sajikan selagi hangat, sebut nama hidangan, tanyakan kebutuhan tambahan.
- 食物アレルギー — WAJIB konfirmasi alergi, cek bahan & alat masak, jangan menebak; bila tidak yakin, tanyakan dapur.
- 食のルール & マナー — 和食 (pola penyajian, urutan, chopstick etiquette), 洋食 (urutan appetizer → main → dessert), lainnya.
- 安全衛生 — HACCP: suhu penyimpanan, pemisahan bahan mentah & matang, cuci tangan, kebersihan alat.
- 専門用語 — istilah layanan (例: お絞り, お通し, 相席, おかわり, 会計, 領収書).', 50),

('宿泊分野','05 · 安全衛生管理・その他',
 'Risiko, keselamatan tamu & staf, higienitas, fasilitas, lingkungan',
 '1. リスクの理解と回避 — identifikasi bahaya (licin, tangga, kolam, dapur panas, listrik), pasang tanda, inspeksi rutin, buat prosedur darurat.
2. お客様の安全確保 — jalur evakuasi jelas, alat pemadam dicek berkala, informasi darurat multibahasa, tangani tamu sakit/cedera dan hubungi 119 bila perlu.
3. 従業員の安全確保 — alat pelindung diri, posisi angkat beban yang benar, jadwal kerja wajar, pelatihan keselamatan.
4. 衛生管理 — kebersihan area umum & kamar, desinfeksi, pengelolaan sampah, pengendalian hama, pemeriksaan kesehatan staf (terutama penjamah makanan).
5. 施設管理 — perawatan gedung & peralatan, pencatatan kerusakan, kontrol suhu/air.
6. 環境対応 — hemat energi & air, kurangi sampah plastik, pemilahan sampah, kebijakan ramah lingkungan.', 60);

insert into soal (kategori, pertanyaan, pilihan, jawaban, penjelasan, urutan) values

('宿泊分野','旅館業を営むために必要なものはどれですか？',
 '["都道府県知事または保健所長の許可", "特に必要ない", "市長への届け出のみ", "会社の登記のみ"]'::jsonb,0,
 '旅館業法により、都道府県知事または保健所長の許可が必要です。',1),

('宿泊分野','宿泊者名簿に記載する必要がないものはどれですか？',
 '["宿泊者の住所", "宿泊者の趣味", "宿泊日数", "宿泊者の氏名"]'::jsonb,1,
 '氏名・住所・職業・宿泊日数などが対象で、趣味は含まれません。',2),

('宿泊分野','外国人のお客様が宿泊する場合、法律上必要な対応はどれですか？',
 '["部屋を別フロアにする", "現金のみ受け付ける", "パスポートのコピーを取って保管する", "通訳を必ず雇う"]'::jsonb,2,
 'パスポートのコピーを取得し、定められた期間保管します。',3),

('宿泊分野','チェックインで確認する予約内容に含まれないものはどれですか？',
 '["ご予約のプラン", "ご予約人数", "お客様の氏名", "お客様の年収"]'::jsonb,3,
 '確認するのは予約の有無・氏名・プラン・人数などです。',4),

('宿泊分野','客室に入る際の正しい対応はどれですか？',
 '["ノックまたは呼び鈴の後、許可をもらって入る", "静かにドアを開けて入る", "合鍵でいつでも入る", "清掃中なら自由に入る"]'::jsonb,0,
 '必ずノックか呼び鈴をし、「入ってください」の許可を得てから入室します。',5),

('宿泊分野','滞在中のお客様の部屋番号を第三者に聞かれた場合どうしますか？',
 '["フロントの判断で教える", "教えない、または本人に確認して了解を得てから伝える", "すぐに教える", "メモを渡す"]'::jsonb,1,
 '本人に確認し、了解を得てから伝えます。',6),

('宿泊分野','館内電話でお客様と話している時、正しいのはどれですか？',
 '["切らずに置く", "同時に切る", "お客様が切ってから切る", "自分から先に切る"]'::jsonb,2,
 'お客様が電話を切ってから切ります。',7),

('宿泊分野','チェックアウト後に忘れ物が見つかり、持ち主が分からない場合はどうしますか？',
 '["従業員がもらう", "すぐ捨てる", "部屋に戻す", "一定期間保管した後、警察に届ける"]'::jsonb,3,
 '一定期間保管し、持ち主が見つからない場合は警察へ届けます。',8),

('宿泊分野','会釈（軽いおじぎ）の角度はおよそどれですか？',
 '["約15度", "約30度", "約90度", "約45度"]'::jsonb,0,
 '会釈は約15度、普通礼（敬礼）は約30度、最敬礼は約45度です。',9),

('宿泊分野','最もよく使うおじぎ（普通礼・敬礼）の角度はおよそどれですか？',
 '["約60度", "約30度", "約45度", "約15度"]'::jsonb,1,
 'お客様をお迎えする場面などで使う普通礼は約30度です。',10),

('宿泊分野','お客様を館内でご案内する時の正しい歩き方はどれですか？',
 '["お客様の真後ろを歩く", "先に走って行く", "2〜3歩、左前方をお客様の歩調に合わせて歩く", "お客様の右後ろを早足で歩く"]'::jsonb,2,
 '2〜3歩先の左前方を、お客様の歩調に合わせて歩きます。',11),

('宿泊分野','ルームキーを渡す時の正しい方法はどれですか？',
 '["片手で投げるように渡す", "テーブルに置く", "ポケットから出して渡す", "相手から見て正面になるよう両手で渡す"]'::jsonb,3,
 '相手から見て正面の向きに、両手でお渡しします。',12),

('宿泊分野','クレーム対応の最初にすべきことはどれですか？',
 '["不快にさせたことをまずお詫びする", "上司を呼ぶ前に反論する", "お客様を無視する", "原因を説明する"]'::jsonb,0,
 'まずお詫び→原因の確認→責任者への報告、の順です。',13),

('宿泊分野','食物アレルギーの対応として正しいのはどれですか？',
 '["メニューを渡すだけにする", "必ず確認し、不明な場合は厨房に確認する", "たぶん大丈夫と伝える", "お客様の自己責任にする"]'::jsonb,1,
 '推測せず、必ず確認します。不明なら厨房に確認します。',14),

('宿泊分野','フロント部門のマネジメントで使われるKPIはどれですか？',
 '["GDP・CPI・PPI", "ROE・EPS・PER", "ADR・RevPAR・OCC", "JIS・ISO・JAS"]'::jsonb,2,
 '宿泊業では ADR（平均客室単価）、RevPAR（稼働客室あたり収益）、OCC（客室稼働率）を使います。',15);

-- jaga-jaga: kalau '\n' tersimpan sebagai teks, ubah jadi baris baru
update materi set isi = replace(isi, '\n', chr(10)) where isi like '%\n%';
