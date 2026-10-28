-- perbaikan: constraint lama menolak baris lama (sesi 'pagi')
alter table progres drop constraint if exists progres_sesi_check;

-- baris lama 'pagi' -> jadi 'pagi1'
update progres set sesi = 'pagi1' where sesi = 'pagi';

alter table progres add constraint progres_sesi_check
  check (sesi in ('materi','pagi','pagi1','pagi2','pagi3','siang','malam'));

alter table progres add column if not exists waktu_ms int;
alter table progres add column if not exists jumlah_soal int;
