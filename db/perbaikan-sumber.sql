-- perbaikan: baris ピクトグラム & 制度 pernah kena update soal 2号 (bug sumber-soal.sql)
update soal set sumber_pdf = 'picto', bab = 'ピクトグラム', halaman = null,
                 kalimat = null, kalimat_ruby = null, kosakata = '[]'::jsonb
 where kategori = 'ピクトグラム';

update soal set sumber_pdf = null, bab = null, halaman = null,
                 kalimat = null, kalimat_ruby = null, kosakata = '[]'::jsonb
 where kategori = '制度';

-- seragamkan label PDF bab 宿泊 (2号)
update soal set sumber_pdf = '2号' where kategori = '宿泊分野' and sumber_pdf = '宿泊分野';

-- hapus soal yang pertanyaannya sama dalam kategori yang sama
delete from soal a using soal b
 where a.id > b.id and a.kategori = b.kategori and a.pertanyaan = b.pertanyaan
   and a.kategori <> 'ピクトグラム';

-- audit: semua harus 0
select 'picto punya halaman' as masalah, count(*) as baris
  from soal where kategori = 'ピクトグラム' and halaman is not null
union all select 'picto sumber salah', count(*) from soal where kategori = 'ピクトグラム' and coalesce(sumber_pdf,'') <> 'picto'
union all select '制度 sumber terisi', count(*) from soal where kategori = '制度' and sumber_pdf is not null
union all select '2号 tanpa halaman', count(*) from soal where kategori = '宿泊分野' and halaman is null
union all select '1号 tanpa halaman', count(*) from soal where kategori = '宿泊分野（1号）' and halaman is null
union all select 'bab tak cocok materi', count(*) from soal s
   where s.bab is not null and s.kategori <> 'ピクトグラム'
     and not exists (select 1 from materi m where m.judul = s.bab);
