-- materi ピクトグラム (dari PDF 標準デザイン) + kolom sumber/halaman di tabel materi
alter table materi add column if not exists sumber_pdf text;
alter table materi add column if not exists halaman int;
delete from materi where kategori = 'ピクトグラム';
insert into materi (kategori,judul,ringkas,isi,urutan,sumber_pdf,halaman) values
('ピクトグラム','ピクトグラム · 01 · 分類と使い方','188 piktogram standar: 10 kategori, dipakai untuk tamu asing di fasilitas umum.','PDF ini = **別添2 標準デザイン** (desain standar piktogram) untuk 国立公園.
**Tujuan** — supaya pengunjung asing paham tanpa harus membaca bahasa Jepang.
**10 kategori**
1. 公共・一般施設 — 案内所 ✓ お手洗 ✓ 病院 ✓ 救護所 ✓ 警察 ✓ スロープ ✓ 喫煙所
2. 交通施設 — 駅 ✓ バス ✓ 駐車場 ✓ 手荷物受取所 ✓ 税関 ✓ 出国手続
3. 商業施設 — レストラン ✓ 喫茶 ✓ 会計 ✓ コンビニ ✓ 薬局 ✓ 理容
4. 観光・文化・スポーツ施設 — 公園 ✓ 博物館 ✓ 自然保護 ✓ キャンプ場
5. 禁止・規制 — 禁煙 ✓ 立入禁止 ✓ ペット持込禁止 ✓ 花火禁止
6. 危険・警告 — 転落注意 ✓ 感電注意 ✓ 津波注意 ✓ 落石注意
7. 指示 (mandatory) — 静かに ✓ 一列並び ✓ 矢印
8. 災害種別 — 洪水 ✓ 津波 ✓ 土石流 ✓ 崖崩れ
9. 施設表示 (オリジナル) — 避難小屋 ✓ ビジターセンター ✓ 登山道
10. ユニバーサルデザイン — 勾配 5% / 8% 以下
**Aturan pakai** — piktogram harus **disertai teks** (文字併記) ✓ warna & bentuk harus sama dengan tanda lain di area yang sama ✓ jangan bikin versi sendiri.',20,'picto',1),
('ピクトグラム','ピクトグラム · 02 · Warna & contoh taman nasional','Contoh penerapan: warna pengarah sendiri + piktogram khas taman.','**妙高戸隠連山国立公園** (Myoko-Togakushi) — contoh nyata penerapan standar.
**独自の取り組み**
・**アイキャッチカラー** (warna pengarah/aksen khusus) ditentukan bersama 協議会; dipilih dari warna khas daerah supaya mudah terlihat ✓ membuat semua tanda terasa satu keluarga.
・**Piktogram orisinal** — pertama di Jepang: **携帯トイレ回収ボックス** (kotak toilet portabel) ✓ lalu 自然探勝路 / 登山道 / 避難小屋 / ビジターセンター / 湖沼 / 滝 / 神社 / カヌー / 花みどころ.
**Warna & bentuk tanda**
・Latar & simbol harus kontras tinggi; teks Jepang + Inggris.
・Untuk rampa/jalan: **勾配 5% 以下** (ramah kursi roda) vs **8% 以上を含む** (butuh bantuan).
**Inti untuk kerja hotel** — piktogram membantu tamu asing menemukan 非常口 / お手洗 / 会計 / 温泉 / 喫煙所 tanpa bertanya ✓ tapi tetap harus ada teks pendamping.',21,'picto',7);

update materi set sumber_pdf = '2号', halaman = case
  when judul like '00%' then 5 when judul like '01%' then 8 when judul like '02%' then 24
  when judul like '03%' then 34 when judul like '04%' then 44 when judul like '05%' then 58 end
 where kategori = '宿泊分野';

update materi set sumber_pdf = '1号', halaman = case
  when judul like '%01%' then 5 when judul like '%02%' then 19 when judul like '%03%' then 27
  when judul like '%04%' then 36 when judul like '%05%' then 46 end
 where kategori = '宿泊分野（1号）';

-- urutkan: 制度 -> 2号 -> 1号 -> ピクトグラム
update materi m set urutan = t.rn
from (select id, row_number() over (order by
        case kategori when '制度' then 0 when '宿泊分野' then 1 when '宿泊分野（1号）' then 2 else 3 end,
        urutan, id)::int as rn
      from materi) t
where m.id = t.id;

select kategori, judul, sumber_pdf, halaman, urutan from materi order by urutan;
