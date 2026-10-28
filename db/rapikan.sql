-- rapikan: hapus baris dobel (kalau skrip pernah dijalankan 2x)
delete from materi a using materi b
  where a.id > b.id and a.kategori = b.kategori and a.judul = b.judul;

delete from kosakata a using kosakata b
  where a.id > b.id and a.kanji = b.kanji and a.kana = b.kana and a.level = b.level;

-- soal: kolom level tidak ada; pembanding pakai pertanyaan + sumber + gambar + pilihan
delete from soal a using soal b
  where a.id > b.id
    and a.pertanyaan = b.pertanyaan
    and coalesce(a.sumber_pdf,'') = coalesce(b.sumber_pdf,'')
    and coalesce(a.gambar,'') = coalesce(b.gambar,'')
    and a.pilihan::text = b.pilihan::text;

select 'materi' as tabel, count(*)::text as jumlah from materi
union all select 'kosakata', count(*)::text from kosakata
union all select 'soal', count(*)::text from soal;
