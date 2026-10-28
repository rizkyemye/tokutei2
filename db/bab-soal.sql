-- pisahkan soal 宿泊 per bab (bab = judul materi), lalu tambah soal 安全管理
update soal set bab = '00 · 旅館業法 (undang-undang usaha penginapan)' where kategori = '宿泊分野' and urutan in (1,2,3);
update soal set bab = '01 · フロント業務 (resepsionis)' where kategori = '宿泊分野' and urutan in (4,5,6,7,8,12);
update soal set bab = '02 · 企画・広報 (perencanaan & promosi)' where kategori = '宿泊分野' and urutan in (15);
update soal set bab = '03 · 接客 (layanan tamu)' where kategori = '宿泊分野' and urutan in (9,10,11,13);
update soal set bab = '04 · レストランサービス' where kategori = '宿泊分野' and urutan in (14);
insert into soal (kategori,pertanyaan,pilihan,jawaban,penjelasan,urutan,bab,sumber_pdf) values
('宿泊分野','火災が発生したとき、最初にすべき対応はどれですか？',
 '["消火・通報・避難誘導を行う", "お客様に部屋で待つよう伝える", "フロントで電話を待つ", "まず記録を書く"]'::jsonb,0,
 '火災時は「初期消火・119番通報・避難誘導」を同時に進めます。',16,'05 · 安全衛生管理・その他','宿泊分野'),
('宿泊分野','地震の揺れが収まったあと、最初に確認することはどれですか？',
 '["お客様と従業員の安全、建物・設備の被害", "翌日の予約数", "シフトの入れ替え", "売上の計算"]'::jsonb,0,
 'まず人命と建物の安全確認、次にライフラインと避難経路の点検です。',17,'05 · 安全衛生管理・その他','宿泊分野')
on conflict do nothing;

select bab, count(*) from soal where kategori = '宿泊分野' group by bab order by bab;
