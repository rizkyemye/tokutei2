-- perbaikan: teks materi berisi "\n" literal, ganti jadi baris baru sungguhan
update materi set isi = replace(isi, '\n', chr(10)) where isi like '%\n%';
update materi set ringkas = replace(ringkas, '\n', ' ') where ringkas like '%\n%';
select judul, length(isi) as panjang from materi order by urutan;
