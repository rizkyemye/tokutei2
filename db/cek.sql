-- cek isi setelah menjalankan semua.sql
select 'kosakata total' as apa, count(*)::text as jumlah from kosakata
union all select 'kosakata 1号', count(*)::text from kosakata where level like '%1号%'
union all select 'kosakata 2号', count(*)::text from kosakata where level like '%2号%'
union all select 'kosakata picto', count(*)::text from kosakata where level = 'picto'
union all select 'soal 宿泊', count(*)::text from soal where sumber_pdf is null or sumber_pdf = '2号'
union all select 'soal picto teks', count(*)::text from soal where sumber_pdf='picto' and pilihan_gambar is null
union all select 'soal picto gambar', count(*)::text from soal where pilihan_gambar is not null
union all select 'materi', count(*)::text from materi;
