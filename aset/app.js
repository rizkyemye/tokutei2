// 特定技能2号 — logika halaman (Supabase auth + baca data + kuis)
// JS dipakai karena login & database harus jalan di browser.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const AKAR = new URL("../", import.meta.url).href;
const k = window.KONFIG || {};
if (!k.supabaseUrl || k.supabaseUrl.includes("xxxx")) {
  alert("aset/konfig.js belum diisi (URL + publishable key Supabase).");
}
const db = createClient(k.supabaseUrl || "https://x.supabase.co", k.supabaseKey || "x");

const el = (id) => document.getElementById(id);
const kabar = (teks, jenis = "salah") => {
  const n = el("kabar");
  if (!n) return;
  n.textContent = teks;
  n.className = "kabar tampil " + jenis;
};

const emailDari = (nama) => `${nama.trim().toLowerCase()}@tokutei2.local`;

/* ---------------- login / daftar ---------------- */
async function halamanMasuk() {
  let mode = "masuk";
  const ganti = () => {
    el("judul").textContent = mode === "masuk" ? "Masuk" : "Daftar";
    el("tombol-utama").textContent = mode === "masuk" ? "Masuk" : "Buat akun";
    el("tanya").textContent = mode === "masuk" ? "Belum punya akun?" : "Sudah punya akun?";
    el("ganti").textContent = mode === "masuk" ? "Daftar" : "Masuk";
  };
  el("ganti").onclick = (e) => {
    e.preventDefault();
    mode = mode === "masuk" ? "daftar" : "masuk";
    ganti();
  };
  ganti();

  const { data } = await db.auth.getSession();
  if (data.session) location.replace(AKAR + "app.html");

  el("form").onsubmit = async (e) => {
    e.preventDefault();
    const nama = el("nama").value.trim();
    const sandi = el("sandi").value;
    if (nama.length < 3) return kabar("Nama minimal 3 huruf.");
    if (sandi.length < 8) return kabar("Sandi minimal 8 karakter.");

    el("tombol-utama").disabled = true;
    try {
      if (mode === "daftar") {
        const { error } = await db.auth.signUp({ email: emailDari(nama), password: sandi });
        if (error) throw error;
        kabar("Akun dibuat. Kalau diminta konfirmasi email, cek kotak masuk.", "ok");
      }
      const { error } = await db.auth.signInWithPassword({ email: emailDari(nama), password: sandi });
      if (error) throw error;
      location.replace(AKAR + "app.html");
    } catch (err) {
      kabar(err.message || "Gagal. Coba lagi.");
    } finally {
      el("tombol-utama").disabled = false;
    }
  };
}

/* ---------------- butuh login ---------------- */
async function pastikanMasuk() {
  const { data } = await db.auth.getSession();
  if (!data.session) {
    location.replace(AKAR + "index.html");
    return null;
  }
  const nama = data.session.user.email.split("@")[0];
  document.querySelectorAll("[data-nama]").forEach((n) => (n.textContent = nama));
  const keluar = el("keluar");
  if (keluar)
    keluar.onclick = async () => {
      await db.auth.signOut();
      location.replace(AKAR + "index.html");
    };
  return data.session;
}

/* ---------------- beranda ---------------- */
async function halamanBeranda() {
  const sesi = await pastikanMasuk();
  if (!sesi) return;

  // kotak pengingat selalu ada, walau HTML lama
  let kotak = el("pengingat");
  if (!kotak) {
    kotak = document.createElement("div");
    kotak.id = "pengingat";
    const jangkar = el("lihat-materi") || el("daftar");
    if (jangkar && jangkar.parentElement) jangkar.parentElement.insertBefore(kotak, jangkar);
    else document.querySelector(".bungkus")?.appendChild(kotak);
  }

  const SESI = ["materi", "pagi1", "pagi2", "pagi3", "siang", "malam"];
  const NAMA = { materi: "チェック materi", pagi1: "Pagi 1", pagi2: "Pagi 2", pagi3: "Pagi 3", siang: "Sesi siang", malam: "Sesi malam" };

  let hari = 1, sesiBerikut = "materi", sisaHari = 30, galat = null;
  try {
    const { data: prog, error } = await db.from("progres").select("hari,sesi").eq("user_id", sesi.user.id);
    if (error) throw error;
    const selesai = new Set((prog || []).map((p) => `${p.hari}-${p.sesi}`));
    sisaHari = 0;
    for (let n = 1; n <= 30; n++) {
      const belum = SESI.filter((s) => !selesai.has(`${n}-${s}`));
      if (belum.length) { sisaHari++; if (sisaHari === 1) { hari = n; sesiBerikut = belum[0]; } }
    }
  } catch (e) {
    galat = e?.message || "gagal membaca progres";
  }

  if (galat) {
    kotak.innerHTML = `<a class="kartu-ingat" href="belajar.html">
      <span class="kiri"><span class="label">Mulai belajar</span>
        <span class="nama">Program 30 hari</span>
        <span class="ket">progres belum terbaca — buka program untuk mulai</span></span>
      <span class="panah">→</span></a>`;
  } else if (!sisaHari) {
    kotak.innerHTML = `<div class="peti" style="border-color:#0e7a4f;background:#e2f5ea">
      <p class="kecil" style="margin:0 0 4px;color:#0e7a4f;font-weight:800">✓ Selesai semua</p>
      <p style="margin:0">30 hari program sudah tuntas. Ulangi kapan saja lewat Belajar 30 hari.</p>
    </div>`;
  } else {
    const urut = SESI.indexOf(sesiBerikut);
    kotak.innerHTML = `<a class="kartu-ingat" href="hari.html?n=${hari}">
      <span class="kiri">
        <span class="label">Belum dipelajari</span>
        <span class="nama">Hari ${hari} — ${NAMA[sesiBerikut]}</span>
        <span class="ket">${urut} dari 6 sesi hari itu selesai · ${sisaHari} hari belum tuntas</span>
      </span>
      <span class="panah">→</span>
    </a>`;
  }

  // ---- materi bacaan (disembunyikan dulu) ----
  const { data, error } = await db
    .from("materi").select("id,kategori,judul,ringkas").order("urutan");
  if (error) return kabar("Gagal memuat materi: " + error.message);

  const unik = [];
  const kunci = new Set();
  for (const m of data) {
    const k = `${m.kategori}|${m.judul}`;
    if (kunci.has(k)) continue;
    kunci.add(k);
    unik.push(m);
  }

  const daftar = el("daftar");
  if (daftar) {
    daftar.hidden = true;
    daftar.innerHTML = unik
      .map((m) => `<a class="baris-materi" href="materi.html?id=${m.id}">
          <span class="teks">
            <span class="atas-baris"><span class="label-kategori kecil-chip">${m.kategori}</span><span class="judul">${m.judul}</span></span>
            <span class="isi">${m.ringkas || ""}</span>
          </span>
          <span class="panah">›</span></a>`)
      .join("");
  }

  const tombol = el("lihat-materi");
  if (tombol && daftar) {
    tombol.onclick = () => {
      daftar.hidden = !daftar.hidden;
      tombol.textContent = daftar.hidden ? "Materi bacaan" : "Tutup materi";
    };
  } else if (tombol) {
    tombol.hidden = true;
  }
}

/* ---------------- baca materi ---------------- */
async function halamanMateri() {
  if (!(await pastikanMasuk())) return;
  const id = new URLSearchParams(location.search).get("id");
  const { data, error } = await db.from("materi").select("*").eq("id", id).single();
  if (error) return kabar("Materi tidak ditemukan.");
  el("kategori").textContent = data.kategori;
  const berkas = { "2号": "2gou-shukuhaku.pdf", "宿泊分野": "2gou-shukuhaku.pdf", "1号": "1gou-shukuhaku.pdf", "picto": "pictogram.pdf" };
  const sm = el("sumber-materi");
  if (sm && data.sumber_pdf && berkas[data.sumber_pdf]) {
    sm.innerHTML = data.halaman
      ? `📖 <a class="tautan-pdf" href="aset/pdf/${berkas[data.sumber_pdf]}#page=${data.halaman}" target="_blank" rel="noopener">${data.sumber_pdf} PDF ・ halaman ${data.halaman} ↗</a>`
      : `📖 ${data.sumber_pdf} PDF`;
  }
  const lanjut = el("lanjut-kuis");
  if (lanjut) lanjut.href = `kuis.html?kategori=${encodeURIComponent(data.kategori)}&bab=${encodeURIComponent(data.judul)}`;
  el("judul").textContent = data.judul;
  // baris baru -> <p>, **teks** -> <b>
  const GARIS = String.fromCharCode(10);
  const MIRING = String.fromCharCode(92);
  const isi = String(data.isi || "").split(MIRING + "n").join(GARIS);
  el("isi").innerHTML = isi
    .split(GARIS)
    .map((b) => b.trim())
    .filter(Boolean)
    .map((b) => "<p>" + b.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>") + "</p>")
    .join("");
}

/* ---------------- kuis (satu soal satu layar) ---------------- */
async function halamanKuis() {
  if (!(await pastikanMasuk())) return;
  const sesi = (await db.auth.getSession()).data.session;
  const params = new URLSearchParams(location.search);
  const sumber = params.get("sumber");
  const jenis = params.get("jenis");           // "teks" | "gambar"
  const kategori = params.get("kategori");      // dari tombol "lanjut ke kuis"
  const bab = params.get("bab");                // bab spesifik (materi 宿泊)

  let q = db.from("soal").select("*").order("urutan");
  if (sumber) q = q.eq("sumber_pdf", sumber);
  if (jenis === "gambar") q = q.not("pilihan_gambar", "is", null);
  if (jenis === "teks") q = q.is("pilihan_gambar", null);
  if (kategori) q = q.eq("kategori", kategori);
  // kuis materi = soal 宿泊 saja (1号 + 2号), bukan ピクトグラム
  if (!sumber && !kategori) q = q.neq("kategori", "ピクトグラム");
  if (bab) q = q.eq("bab", bab);

  if (sumber === "picto") {
    document.body.classList.add("mode-picto");
    el("label-kuis").textContent = "ピクトグラム" + (jenis === "gambar" ? " · gambar" : jenis === "teks" ? " · teks" : "");
  } else {
    el("label-kuis").textContent = kategori || "宿泊 1号 + 2号";
  }
  el("judul-kuis").textContent = sumber === "picto" ? "Kuis ピクトグラム"
    : bab ? "Kuis bab" : "Kuis materi";

  let { data: semuaSoal, error } = await q;
  if (error) return kabar("Gagal memuat soal: " + error.message);

  // kalau bab itu belum punya soal: coba kategori, lalu semua soal
  if (bab && !semuaSoal.length) {
    const dua = await db.from("soal").select("*").eq("kategori", kategori || "宿泊分野").order("urutan");
    semuaSoal = dua.data || [];
  }
  if (!semuaSoal.length) {
    const tiga = await db.from("soal").select("*").order("urutan");
    semuaSoal = tiga.data || [];
  }

  const data = semuaSoal.length > 10
    ? semuaSoal.slice().sort(() => Math.random() - 0.5).slice(0, 10)
    : semuaSoal;

  el("info-kuis").textContent = `${data.length} soal · satu soal satu layar`;
  let i = 0, benar = 0, mulaiMs = 0, kunci = false;
  const rincian = [];

  function tampil() {
    const s = data[i];
    kunci = false;
    el("k-hitung").textContent = `${i + 1} / ${data.length}`;
    el("k-baris").style.width = `${Math.round((i / data.length) * 100)}%`;
    el("k-tipe").textContent = s.kategori || "";
    el("k-tanya").textContent = s.pertanyaan;

    const g = el("k-gambar");
    const pakaiGambarOpsi = !!(s.pilihan_gambar && s.pilihan_gambar.length);
    if (s.gambar && !pakaiGambarOpsi) { g.src = s.gambar; g.hidden = false; }
    else { g.hidden = true; g.removeAttribute("src"); }

    const opsi = el("k-opsi");
    if (s.pilihan_gambar && s.pilihan_gambar.length) {
      opsi.className = "pilihan-gambar";
      opsi.innerHTML = s.pilihan_gambar.map((g2, j) =>
        `<button class="pilihan opsi-gambar" data-j="${j}" aria-label="pilihan ${j + 1}"><img src="${g2}" alt=""></button>`).join("");
    } else {
      opsi.className = "opsi-satu";
      opsi.innerHTML = s.pilihan.map((p, j) => `<button class="pilihan" data-j="${j}">${p}</button>`).join("");
    }
    opsi.querySelectorAll(".pilihan").forEach((b) => (b.onclick = () => jawab(s, Number(b.dataset.j), b)));

    const jel = el("k-jelasin");
    jel.hidden = true;
    jel.textContent = s.penjelasan || "";
    el("k-sumber").innerHTML = panelSumber(s);
    el("k-lanjut").hidden = true;
    mulaiMs = performance.now();
  }

  async function jawab(s, j, tombol) {
    if (kunci) return;
    kunci = true;
    const ms = performance.now() - mulaiMs;
    const tepat = j === s.jawaban;
    const semua = el("k-opsi").querySelectorAll(".pilihan");
    tombol.classList.add(tepat ? "benar" : "salah");
    if (!tepat) semua[s.jawaban]?.classList.add("benar");
    semua.forEach((b) => (b.disabled = true));

    if (tepat) benar++;
    else if (sesi) await db.from("salah").insert({ user_id: sesi.user.id, soal_id: s.id });

    if (s.penjelasan) el("k-jelasin").hidden = false;
    const panel = el("k-sumber").querySelector(".sumber");
    if (panel) panel.hidden = false;

    if (s.penjelasan) el("k-jelasin").hidden = false;
    const pnJ = el("k-sumber").querySelector(".sumber");
    if (pnJ) pnJ.hidden = false;
    rincian.push({ no: i + 1, tanya: s.pertanyaan, benar: tepat, ms });
    el("k-hitung").textContent = `${i + 1} / ${data.length}`;
    el("k-baris").style.width = `${Math.round(((i + 1) / data.length) * 100)}%`;

    const lanjut = el("k-lanjut");
    lanjut.hidden = false;
    lanjut.textContent = i + 1 < data.length ? "Soal berikutnya →" : "Lihat hasil →";
  }

  el("k-lanjut").onclick = async () => {
    i++;
    if (i < data.length) return tampil();
    el("arena").hidden = true;
    el("hasil").hidden = false;
    el("skor").textContent = `${benar}/${data.length}`;
    const totalMs = rincian.reduce((a2, r) => a2 + r.ms, 0);
    el("ringkas").textContent = `rata-rata ${(totalMs / Math.max(rincian.length, 1) / 1000).toFixed(1).replace(".", ",")} s/soal`;
    el("rincian").innerHTML = rincian.map((r) => `<div class="baris-rincian${r.benar ? "" : " lewat"}">
      <span class="no">${r.no}</span>
      <span class="kata">${r.tanya}</span>
      <span class="waktu">${(r.ms / 1000).toFixed(1).replace(".", ",")} s</span>
      <span class="tanda">${r.benar ? "✓" : "✗"}</span></div>`).join("");
    await db.from("nilai").insert({ user_id: sesi.user.id, skor: benar, total: data.length });
  };

  tampil();
}

/* ---------------- flashcard kosakata ---------------- */
async function halamanKartu() {
  if (!(await pastikanMasuk())) return;
  const hanyaPicto = new URLSearchParams(location.search).get("level") === "picto";
  // semuaKata() ambil per 1000 baris, jadi tidak kena batas Supabase
  const semua = await semuaKata(hanyaPicto);
  if (!semua.length) return kabar("Gagal memuat kosakata.");
  let daftar = hanyaPicto ? semua.filter((k) => k.level === "picto") : semua.slice();
  let i = 0;

  const lvUrl = new URLSearchParams(location.search).get("level") || "semua";
  if (lvUrl === "picto") document.body.classList.add("mode-picto");
  el("hitung").textContent = `${daftar.length} kartu`;
  function gambar() {
    const k = daftar[i];
    if (!k) return;
    el("kartu").classList.remove("terbuka");
    el("depan-grup").textContent = k.grup || "";
    el("depan-kanji").textContent = k.kanji;
    const g = el("depan-gambar");
    if (g) {
      if (k.gambar) { g.src = k.gambar; g.hidden = false; } else { g.hidden = true; g.removeAttribute("src"); }
    }
    el("belakang-kana").textContent = k.kana;
    el("belakang-arti").textContent = k.arti;
    el("hitung").textContent = `${i + 1} / ${daftar.length}`;
  }

  el("kartu").onclick = () => el("kartu").classList.toggle("terbuka");
  el("sesudah").onclick = () => {
    i = (i + 1) % daftar.length;
    gambar();
  };
  el("sebelum").onclick = () => {
    i = (i - 1 + daftar.length) % daftar.length;
    gambar();
  };
  el("acak").onclick = () => {
    daftar = daftar.sort(() => Math.random() - 0.5);
    i = 0;
    gambar();
  };

  gambar();
}



function panelSumber(s) {
  if (!s.bab && !s.kalimat) return "";
  const halaman = s.halaman
    ? ` ・ <a class="tautan-pdf" href="aset/pdf/2gou-shukuhaku.pdf#page=${s.halaman}" target="_blank" rel="noopener">halaman ${s.halaman} ↗</a>`
    : "";
  return `<div class="sumber" hidden>
    <p class="kutipan">${s.kalimat ? "「" + s.kalimat + "」" : ""}</p>
    <p class="kecil asal">📖 ${s.bab || ""}${halaman}${s.sumber_pdf ? " ・ " + s.sumber_pdf + " PDF" : ""}</p>
  </div>`;
}

/* ---------------- nilai ---------------- */
async function halamanNilai() {
  if (!(await pastikanMasuk())) return;
  const { data, error } = await db
    .from("nilai")
    .select("skor,total,dibuat")
    .order("dibuat", { ascending: false })
    .limit(50);
  if (error) return kabar("Gagal memuat nilai: " + error.message);

  if (!data.length) {
    el("n-kuis").textContent = "0";
    el("n-rata").textContent = "–";
    el("n-terakhir").textContent = "–";
    el("riwayat").innerHTML = '<p class="kecil">Belum ada kuis yang dikerjakan.</p>';
    return;
  }

  const totalPersen = data.reduce((a, r) => a + r.skor / r.total, 0) / data.length;
  el("n-kuis").textContent = data.length;
  el("n-rata").textContent = Math.round(totalPersen * 100) + "%";
  el("n-terakhir").textContent = `${data[0].skor}/${data[0].total}`;
  el("riwayat").innerHTML = data
    .slice(0, 20)
    .map((r) => {
      const t = new Date(r.dibuat);
      const tgl = `${t.getDate()}/${t.getMonth() + 1} ${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}`;
      return `<div class="baris-nilai"><span>${tgl}</span><b>${r.skor}/${r.total}</b></div>`;
    })
    .join("");
}

/* ---------------- review salah ---------------- */
async function halamanReview() {
  const sesi = await pastikanMasuk();
  if (!sesi) return;
  const { data, error } = await db
    .from("salah")
    .select("id,soal_id,soal(pertanyaan,pilihan,jawaban,penjelasan,bab,sumber_pdf,halaman,kalimat,kalimat_ruby,kosakata)")
    .order("dibuat", { ascending: false })
    .limit(50);
  if (error) return kabar("Gagal memuat review: " + error.message);

  const unik = [];
  const terlihat = new Set();
  for (const r of data) {
    if (!r.soal || terlihat.has(r.soal_id)) continue;
    terlihat.add(r.soal_id);
    unik.push({ ...r, soal: r.soal });
  }

  if (!unik.length) {
    el("kosong").hidden = false;
    return;
  }

  el("daftar").innerHTML = unik
    .map(
      (r) => `<div class="kartu-review">
        <p class="tanya">${r.soal.pertanyaan}</p>
        <p class="jawab">Jawaban benar: <b>${r.soal.pilihan[r.soal.jawaban]}</b></p>
        ${r.soal.penjelasan ? `<p class="jelas">${r.soal.penjelasan}</p>` : ""}
        ${panelSumber(r.soal).replace('class="sumber" hidden','class="sumber"')}
        <button class="tombol garis" data-hapus="${r.id}" style="margin-top:10px;min-height:36px;padding:6px 12px;font-size:13px">Sudah paham</button>
      </div>`
    )
    .join("");

  el("daftar").querySelectorAll("[data-hapus]").forEach((b) => {
    b.onclick = async () => {
      await db.from("salah").delete().eq("id", Number(b.dataset.hapus));
      b.closest(".kartu-review").remove();
    };
  });
}


/* ================= 30 hari x 3 sesi ================= */
const PER_HARI = 28;

async function semuaKata(denganPicto = false) {
  const kumpul = [];
  for (let mulai = 0; mulai < 3000; mulai += 1000) {
    let q = db
      .from("kosakata")
      .select("id,kanji,kana,arti,grup,level,gambar,urutan")
      .order("id")
      .range(mulai, mulai + 999);
    if (!denganPicto) q = q.neq("level", "picto");   // ピクトグラム punya tab sendiri
    const { data, error } = await q;
    if (error) return [];
    kumpul.push(...data);
    if (data.length < 1000) break;
  }
  // urutan program: 1号 -> 2号 -> ピクトグラム (urutan per level bikin rapih)
  const pangkat = (lv) => (lv === "1号" || lv === "1号・2号") ? 0 : lv === "2号" ? 1 : lv === "picto" ? 2 : 3;
  return kumpul.sort((x, y) =>
    pangkat(x.level) - pangkat(y.level) ||
    (x.urutan ?? 0) - (y.urutan ?? 0) ||
    x.id - y.id
  );
}


const kataHari = (semua, n) => semua.slice((n - 1) * PER_HARI, n * PER_HARI);

async function progresSaya() {
  const { data } = await db.from("progres").select("hari,sesi,skor,total");
  const peta = {};
  for (const r of data || []) peta[`${r.hari}-${r.sesi}`] = r;
  return peta;
}

async function halamanBelajar() {
  const sesi = await pastikanMasuk();
  if (!sesi) return;
  const semua = await semuaKata();
  const total = Math.ceil(semua.length / PER_HARI);
  const prog = await progresSaya();

  el("daftar-hari").innerHTML = Array.from({ length: total }, (_, i) => {
    const n = i + 1;
    const m = prog[`${n}-materi`], p = prog[`${n}-pagi`];
    const status = p ? "selesai" : m ? "materi" : "";
    const tanda = p ? "✓" : m ? "◐" : n;
    return `<a class="kartu-hari ${status}" href="hari.html?n=${n}">
      <span class="tanda">${tanda}</span>
      <span class="ket">Hari ${n}</span>
      <span class="jml">${kataHari(semua, n).length} kata</span>
    </a>`;
  }).join("");
  document.querySelectorAll("[data-progres]").forEach((n) => (n.textContent = Object.keys(prog).length));
}

async function halamanHari() {
  const sesi = await pastikanMasuk();
  if (!sesi) return;
  const n = Number(new URLSearchParams(location.search).get("n") || 1);
  const semua = await semuaKata();
  const kata = kataHari(semua, n);
  const prog = await progresSaya();

  el("label-hari").textContent = `Hari ${n} / 30`;
  el("judul-hari").textContent = `Hari ${n}`;
  el("info-hari").textContent = `${kata.length} kata · ${[...new Set(kata.map((k) => k.grup))].length} bagian`;

  const materiSelesai = !!prog[`${n}-materi`];

  const setBaris = (kunci, tombol, chip, kartu, ket) => {
    const status = prog[`${n}-${kunci}`];
    const selesai = !!status;
    if (selesai) {
      kartu.classList.add("selesai");
      chip.className = "chip ok";
      chip.textContent = `✓ ${status.skor}/${status.total}`;
      tombol.textContent = "Ulang";
      tombol.className = "aksi ghost";
      tombol.href = `latihan.html?n=${n}&sesi=${kunci}`;
      if (ket && status.waktu_ms) ket.textContent = `${status.total} soal · ${(status.waktu_ms / 1000).toFixed(1).replace(".", ",")} s total`;
      return true;
    }
    return false;
  };

  // materi
  {
    const tombol = el("tombol-materi"), chip = el("chip-materi"), kartu = el("sesi-materi");
    if (setBaris("materi", tombol, chip, kartu, null)) return;
    chip.className = "chip aktif";
    chip.textContent = "wajib";
    tombol.textContent = "Mulai";
    tombol.className = "aksi utama";
    tombol.href = `latihan.html?n=${n}&sesi=materi`;
  }

  // akordeon: pakai <details> native, tidak perlu JS
  let terbuka = materiSelesai;
  let selesaiPagi = 0;
  [1, 2, 3].forEach((sub) => {
    const kunci = `pagi${sub}`;
    const tombol = el(`tombol-pagi${sub}`), chip = el(`chip-pagi${sub}`);
    const kartu = el(`sesi-pagi${sub}`), ket = el(`ket-pagi${sub}`);
    tombol.href = `latihan.html?n=${n}&sesi=${kunci}`;

    if (setBaris(kunci, tombol, chip, kartu, ket)) { terbuka = true; selesaiPagi++; return; }

    if (terbuka) {
      chip.className = "chip aktif";
      chip.textContent = "berikutnya";
      tombol.textContent = "Mulai";
      tombol.className = "aksi utama";
      terbuka = false;                    // hanya satu yang "berikutnya"
    } else {
      kartu.classList.add("mati");
      chip.className = "chip kunci";
      chip.textContent = "🔒";
      tombol.className = "aksi kosong";
      tombol.removeAttribute("href");
      tombol.textContent = "";
      ket.textContent = sub === 1 ? (materiSelesai ? "selesaikan Pagi 1 dulu" : "selesaikan チェック materi dulu") : `selesaikan Pagi ${sub - 1} dulu`;
    }
  });

  const chipPagi = el("chip-pagi");
  chipPagi.className = "chip " + (selesaiPagi === 3 ? "ok" : "aktif");
  chipPagi.textContent = selesaiPagi === 3 ? "✓ 3/3" : `${selesaiPagi}/3 selesai`;

  // siang -> malam
  let bisaSiang = selesaiPagi === 3;
  const pasang = (kunci, nomor, bisa, ketBuka, ketKunci) => {
    const tombol = el(`tombol-${kunci}`), chip = el(`chip-${kunci}`);
    const kartu = el(`sesi-${kunci}`), ket = el(`ket-${kunci}`);
    tombol.href = `latihan.html?n=${n}&sesi=${kunci}`;
    if (setBaris(kunci, tombol, chip, kartu, ket)) return true;
    if (bisa) {
      chip.className = "chip aktif";
      chip.textContent = "berikutnya";
      tombol.textContent = "Mulai";
      tombol.className = "aksi utama";
      if (ket) ket.textContent = ketBuka;
    } else {
      kartu.classList.add("mati");
      chip.className = "chip kunci";
      chip.textContent = "🔒";
      tombol.className = "aksi kosong";
      tombol.removeAttribute("href");
      tombol.textContent = "";
      if (ket) ket.textContent = ketKunci;
    }
    return false;
  };

  const siangSelesai = pasang("siang", 4, bisaSiang, "15 soal · 8 bank + 7 kosakata hari ini", "selesaikan Pagi 1–3 dulu");
  if (!siangSelesai) bisaSiang = false;
  pasang("malam", 5, !!prog[`${n}-siang`] || siangSelesai, "40 soal · 30 hari ini + 10 ulangan (3 pagi : 7 siang)", "selesaikan Sesi siang dulu");
}

/* --- sesi: materi (flashcard) atau pagi (6 tipe soal) --- */
async function halamanLatihan() {
  const sesi = await pastikanMasuk();
  if (!sesi) return;
  const params = new URLSearchParams(location.search);
  const n = Number(params.get("n") || 1);
  const jenis = params.get("sesi") || "materi";
  const semua = await semuaKata();
  const kata = kataHari(semua, n);
  el("label-sesi").textContent = `Hari ${n}`;

  if (jenis === "materi") return sesiMateri(n, kata);
  if (jenis === "siang" || jenis === "malam") return sesiSoal(n, jenis, kata);
  const sub = Number(jenis.replace("pagi", "")) || 1;
  return sesiPagi(n, kata, sub);
}

function sesiMateri(n, kata) {
  el("judul-sesi").textContent = "チェック materi";
  el("info-sesi").textContent = "Balik tiap kartu, lalu tekan “sudah hafal”.";
  el("materi").hidden = false;

  let i = 0;
  const kartu = el("kartu-materi");
  const gambar = () => {
    const k = kata[i];
    kartu.classList.remove("terbuka");
    el("m-kanji").textContent = k.kanji;
    el("m-kana").textContent = k.kana;
    el("m-arti").textContent = k.arti;
    el("m-hitung").textContent = `${i + 1} / ${kata.length}`;
  };
  kartu.onclick = () => kartu.classList.toggle("terbuka");

  const maju = async (aktif) => {
    if (aktif) {
      i++;
      if (i >= kata.length) {
        const s = (await db.auth.getSession()).data.session;
        await db.from("progres").upsert(
          { user_id: s.user.id, hari: n, sesi: "materi", skor: kata.length, total: kata.length },
          { onConflict: "user_id,hari,sesi" }
        );
        location.replace(`hari.html?n=${n}`);
        return;
      }
    } else {
      kata.push(kata.splice(i, 1)[0]);
    }
    gambar();
  };
  el("m-hafal").onclick = () => maju(true);
  el("m-lewat").onclick = () => maju(false);
  gambar();
}

function sesiPagi(n, kata, sub) {
  const judul = `Pagi ${sub}`;
  el("judul-sesi").textContent = judul;
  el("info-sesi").textContent = "Satu soal satu layar · salah diulang di akhir";
  el("kuis").hidden = false;

  // 35 kata -> sub 1: 12, sub 2: 12, sub 3: 11
  const potong = Math.ceil(kata.length / 3);
  const bagian = kata.slice((sub - 1) * potong, sub * potong);
  const acak = (a) => a.slice().sort(() => Math.random() - 0.5);
  const TIPE = ["kanji→kana", "kana→kanji", "kanji→arti", "arti→kanji", "arti→kana", "kana→arti"];

  const bikin = (k, i) => {
    const tipe = TIPE[i % 6];
    const lain = acak(bagian.filter((x) => x.kanji !== k.kanji));
    let tanya, jawab, opsi;
    if (tipe === "kanji→kana") { tanya = k.kanji; jawab = k.kana; opsi = lain.map((x) => x.kana); }
    if (tipe === "kana→kanji") { tanya = k.kana; jawab = k.kanji; opsi = lain.map((x) => x.kanji); }
    if (tipe === "kanji→arti") { tanya = k.kanji; jawab = k.arti; opsi = lain.map((x) => x.arti); }
    if (tipe === "arti→kanji") { tanya = k.arti; jawab = k.kanji; opsi = lain.map((x) => x.kanji); }
    if (tipe === "arti→kana") { tanya = k.arti; jawab = k.kana; opsi = lain.map((x) => x.kana); }
    if (tipe === "kana→arti") { tanya = k.kana; jawab = k.arti; opsi = lain.map((x) => x.arti); }
    const empat = [jawab, ...acak([...new Set(opsi.filter((o) => o !== jawab))]).slice(0, 3)];
    return { tipe, tanya, jawab, opsi: acak(empat), kata: k, salah: 0 };
  };

  const antre = acak(bagian).map((k, i) => bikin(k, i));
  const totalUnik = antre.length;
  let benarSekali = 0, dicoba = 0, totalMs = 0, mulaiMs = 0, selesai = false;

  const catatan = [];   // rincian waktu tiap jawaban (muncul di hasil akhir)

  function soalBerikut() {
    if (!antre.length) return selesaiSesi();
    const s = antre[0];
    el("k-tipe").textContent = s.tipe;
    el("k-tanya").textContent = s.tanya;
    el("k-antre").textContent = `${antre.length} soal lagi di antrean`;
    const maju = totalUnik - antre.length;
    const bar = el("k-baris");
    if (bar) bar.style.width = `${Math.round((maju / Math.max(totalUnik, 1)) * 100)}%`;
    el("k-opsi").innerHTML = s.opsi
      .map((o, j) => `<button class="pilihan" data-j="${j}">${o}</button>`)
      .join("");
    el("k-opsi").querySelectorAll(".pilihan").forEach((b) => {
      b.onclick = () => jawab(s, Number(b.dataset.j), b);
    });
    mulaiMs = performance.now();
  }

  function jawab(s, j, tombol) {
    const ms = performance.now() - mulaiMs;
    const tepat = s.opsi[j] === s.jawab;
    tombol.classList.add(tepat ? "benar" : "salah");
    if (!tepat) {
      [...el("k-opsi").querySelectorAll(".pilihan")].find((x) => x.textContent === s.jawab)?.classList.add("benar");
      s.salah++;
    }
    el("k-opsi").querySelectorAll(".pilihan").forEach((x) => (x.disabled = true));
    dicoba++;
    catatan.push({ no: dicoba, tipe: s.tipe, tanya: s.tanya, benar: tepat, ms });
    totalMs += ms;
    antre.shift();
    if (tepat) { if (s.salah === 0) benarSekali++; }
    else { antre.push(s); }        // salah -> paling belakang antrean

    setTimeout(soalBerikut, 420);
  }

  async function selesaiSesi() {
    if (selesai) return;
    selesai = true;
    const ses = (await db.auth.getSession()).data.session;
    await db.from("progres").upsert(
      {
        user_id: ses.user.id, hari: n, sesi: `pagi${sub}`,
        skor: benarSekali, total: totalUnik,
        jumlah_soal: dicoba, waktu_ms: Math.round(totalMs),
      },
      { onConflict: "user_id,hari,sesi" }
    );
    el("k-hasil").hidden = false;
    el("k-skor").textContent = `${benarSekali}/${totalUnik}`;
    el("k-ringkas").textContent =
      `${dicoba} jawaban · rata-rata ${(totalMs / Math.max(dicoba, 1) / 1000).toFixed(1)} s/soal`;
    el("k-rincian").innerHTML = catatan
      .map((c) => `<div class="baris-rincian${c.benar ? "" : " lewat"}">
        <span class="no">${c.no}</span>
        <span class="kata">${c.tanya}</span>
        <span class="tipe">${c.tipe}</span>
        <span class="waktu">${(c.ms / 1000).toFixed(1).replace(".", ",")} s</span>
        <span class="tanda">${c.benar ? "✓" : "✗"}</span></div>`)
      .join("");
    el("k-lanjut").href = `hari.html?n=${n}`;
    el("k-opsi").innerHTML = "";
    el("k-antre").textContent = "";
    el("k-tanya").textContent = "";
    el("k-tipe").textContent = "";
  }

  el("k-hasil").hidden = true;
  soalBerikut();
}


/* --- sesi siang (15 soal) & malam (30 soal: 12 pagi + 18 siang + sisa hari lalu) --- */
async function sesiSoal(n, jenis, kata) {
  el("judul-sesi").textContent = jenis === "siang" ? "Sesi siang" : "Sesi malam";
  el("info-sesi").textContent = jenis === "siang"
    ? "15 soal · 8 bank + 7 kosakata hari ini"
    : "40 soal · 15 bank + 15 kosakata + 10 ulangan kemarin (3 pagi : 7 siang)";
  el("kuis").hidden = false;
  el("k-lanjut-soal").hidden = false;

  // level hari ini -> bank soal
  const lv = kata.length ? kata[0].level : "2号";
  let q = db.from("soal").select("*");
  if (lv === "picto") q = q.eq("sumber_pdf", "picto");
  else if (lv === "2号") q = q.eq("kategori", "宿泊分野");
  else q = q.eq("kategori", "宿泊分野（1号）");
  const { data: bank, error } = await q.order("urutan");
  if (error) { el("kabar") && kabar("Gagal memuat soal: " + error.message); return; }
  if (!bank.length) { el("kabar") && kabar("Belum ada soal untuk level ini."); return; }

  let isiBank = bank.slice();
  if (jenis === "malam" && isiBank.length < 40) {
    // bank kecil (mis. 制度/1号 38) -> tambah soal level lain biar tetap 40
    const lain = lv === "2号" ? "宿泊分野（1号）" : "宿泊分野";
    const { data } = await db.from("soal").select("*").eq("kategori", lain).order("urutan");
    isiBank = isiBank.concat(data || []);
  }

  const potong = (mulai, jml) => {
    const out = [];
    for (let i = 0; i < jml && i < isiBank.length; i++) out.push(isiBank[(mulai + i) % isiBank.length]);
    return out;
  };
  // ambil n soal berbeda, lewati yang sudah dipakai
  const ambil = (jml, mulai, larang = new Set()) => {
    const out = [];
    const pakai = new Set(larang);
    for (let k = 0; k < isiBank.length * 2 && out.length < jml; k++) {
      const s = isiBank[(mulai + k) % isiBank.length];
      if (pakai.has(s.id)) continue;
      pakai.add(s.id);
      out.push(s);
    }
    return out;
  };

  // 7 soal dari kosakata hari ini (selalu baru) + 8 dari bank soal
  const TIPE_KATA = ["kanji→arti", "arti→kanji", "kana→arti", "arti→kana"];
  const acakArr = (a2) => a2.slice().sort(() => Math.random() - 0.5);
  const bikinKata = (k, idx) => {
    const tipe = TIPE_KATA[idx % 4];
    const lain = kata.filter((x) => x.kanji !== k.kanji);
    let tanya, jawab, kandidat, label;
    if (tipe === "kanji→arti") { tanya = k.kanji; jawab = k.arti; kandidat = lain.map((x) => x.arti); label = "意味"; }
    if (tipe === "arti→kanji") { tanya = k.arti; jawab = k.kanji; kandidat = lain.map((x) => x.kanji); label = "ことば"; }
    if (tipe === "kana→arti") { tanya = k.kana; jawab = k.arti; kandidat = lain.map((x) => x.arti); label = "意味"; }
    if (tipe === "arti→kana") { tanya = k.arti; jawab = k.kana; kandidat = lain.map((x) => x.kana); label = "読み方"; }
    const pengecoh = [...new Set(kandidat.filter((o) => o && o !== jawab))].slice(0, 3);
    const pilihan = acakArr([jawab, ...pengecoh]);
    return {
      id: `kata-${k.id || k.kanji}-${idx}`,
      pertanyaan: `「${tanya}」の${label}はどれですか？`,
      pilihan,
      jawaban: pilihan.indexOf(jawab),
      penjelasan: `${k.kanji}（${k.kana}）— ${k.arti}`,
      bab: "チェック materi", halaman: null, kalimat: null, pilihan_gambar: null, gambar: null,
    };
  };
  const soalKata = (jml) => acakArr(kata).slice(0, jml).map((k, i2) => bikinKata(k, i2));

  let daftar = [];
  if (jenis === "siang") {
    const dariBank = potong((n * 6) % isiBank.length, 6);
    daftar = [...dariBank, ...soalKata(9)].sort(() => Math.random() - 0.5);
  }

  if (jenis === "malam") {
    // 40 soal = 30 materi hari ini + 10 ulangan hari kemarin (3 pagi : 7 siang)
    const ses0 = (await db.auth.getSession()).data.session;
    const ambilRiwayat = async (sesi) => {
      let q2 = db.from("riwayat").select("soal_id,benar").eq("user_id", ses0.user.id).eq("hari", n - 1);
      if (sesi) q2 = q2.eq("sesi", sesi);
      const { data } = await q2;
      return data || [];
    };
    const urut = (rows) => [...rows].sort((x, y) => Number(x.benar) - Number(y.benar));
    const uniq = (rows) => [...new Set(rows.map((r) => r.soal_id).filter(Boolean))];

    const semuaRiwayat = urut(await ambilRiwayat(null));
    const riwayatSiang = urut(await ambilRiwayat("siang"));
    const idSiang = uniq(riwayatSiang).slice(0, 7);
    const idPagi = uniq(semuaRiwayat).filter((id) => !idSiang.includes(id)).slice(0, 3);
    let idKemarin = [...idPagi, ...idSiang];

    if (idKemarin.length < 10) {
      const tambah = ambil(10 - idKemarin.length, ((n - 1) * 7 + 30), new Set(idKemarin)).map((s) => s.id);
      idKemarin = [...idKemarin, ...tambah];
    }

    let soalKemarin = [];
    if (idKemarin.length) {
      const { data } = await db.from("soal").select("*").in("id", idKemarin);
      const peta = new Map((data || []).map((s) => [s.id, s]));
      soalKemarin = idKemarin.map((id) => peta.get(id)).filter(Boolean);
    }

    // 40 = 15 bank + 15 kosakata hari ini + 10 ulangan kemarin
    const dariBank = ambil(15, (n * 7) % isiBank.length, new Set(soalKemarin.map((s) => s.id)));
    const dariKata = soalKata(15);
    daftar = [...dariBank, ...dariKata, ...soalKemarin].sort(() => Math.random() - 0.5);
  }
  const ses = (await db.auth.getSession()).data.session;
  let i = 0, benar = 0, mulaiMs = 0, kunciJawab = false;
  const rincian = [];

  function tampil() {
    const s = daftar[i];
    kunciJawab = false;
    el("k-hitung").textContent = `${i + 1} / ${daftar.length}`;
    el("k-baris").style.width = `${Math.round((i / daftar.length) * 100)}%`;
    el("k-tipe").textContent = s.bab || s.kategori || "";
    el("k-tanya").textContent = s.pertanyaan;

    const g = el("k-gambar");
    const pakaiGambar = !!(s.pilihan_gambar && s.pilihan_gambar.length);
    if (s.gambar && !pakaiGambar) { g.src = s.gambar; g.hidden = false; }
    else { g.hidden = true; g.removeAttribute("src"); }

    const opsi = el("k-opsi");
    if (pakaiGambar) {
      opsi.className = "pilihan-gambar";
      opsi.innerHTML = s.pilihan_gambar.map((g2, j) =>
        `<button class="pilihan opsi-gambar" data-j="${j}"><img src="${g2}" alt=""></button>`).join("");
    } else {
      opsi.className = "opsi-satu";
      opsi.innerHTML = s.pilihan.map((p, j) => `<button class="pilihan" data-j="${j}">${p}</button>`).join("");
    }
    opsi.querySelectorAll(".pilihan").forEach((b) => (b.onclick = () => jawab(s, Number(b.dataset.j), b)));

    // penjelasan & sumber disembunyikan sampai soal dijawab
    const jel = el("k-jelasin");
    jel.hidden = true;
    jel.textContent = s.penjelasan || "";
    el("k-sumber").innerHTML = panelSumber(s);
    const pn = el("k-sumber").querySelector(".sumber");
    if (pn) pn.hidden = true;

    el("k-lanjut-soal").hidden = true;
    el("k-antre").textContent = `${daftar.length - i - 1} soal lagi`;
    mulaiMs = performance.now();
  }

  async function jawab(s, j, tombol) {
    if (kunciJawab) return;
    kunciJawab = true;
    const ms = performance.now() - mulaiMs;
    const tepat = j === s.jawaban;
    const semua = el("k-opsi").querySelectorAll(".pilihan");
    tombol.classList.add(tepat ? "benar" : "salah");
    if (!tepat) semua[s.jawaban]?.classList.add("benar");
    semua.forEach((b) => (b.disabled = true));
    if (tepat) benar++;
    else if (ses) await db.from("salah").insert({ user_id: ses.user.id, soal_id: s.id });
    if (ses && s.id) {
      await db.from("riwayat").upsert(
        { user_id: ses.user.id, hari: n, sesi: jenis, soal_id: s.id, benar: tepat },
        { onConflict: "user_id,hari,sesi,soal_id" }
      );
    }
    if (s.penjelasan) el("k-jelasin").hidden = false;
    const pnJ = el("k-sumber").querySelector(".sumber");
    if (pnJ) pnJ.hidden = false;
    rincian.push({ no: i + 1, tanya: s.pertanyaan, benar: tepat, ms });
    el("k-baris").style.width = `${Math.round(((i + 1) / daftar.length) * 100)}%`;
    el("k-lanjut-soal").hidden = false;
    el("k-lanjut-soal").textContent = i + 1 < daftar.length ? "Soal berikutnya →" : "Lihat hasil →";
  }

  el("k-lanjut-soal").onclick = async () => {
    i++;
    if (i < daftar.length) return tampil();
    el("kuis").hidden = true;
    el("k-hasil").hidden = false;
    el("k-skor").textContent = `${benar}/${daftar.length}`;
    const totalMs = rincian.reduce((a2, r) => a2 + r.ms, 0);
    el("k-ringkas").textContent = `rata-rata ${(totalMs / Math.max(rincian.length, 1) / 1000).toFixed(1).replace(".", ",")} s/soal`;
    el("k-rincian").innerHTML = rincian.map((r) => `<div class="baris-rincian${r.benar ? "" : " lewat"}">
      <span class="no">${r.no}</span><span class="kata">${r.tanya}</span>
      <span class="waktu">${(r.ms / 1000).toFixed(1).replace(".", ",")} s</span>
      <span class="tanda">${r.benar ? "✓" : "✗"}</span></div>`).join("");
    el("k-lanjut").href = `hari.html?n=${n}`;
    await db.from("progres").upsert(
      { user_id: ses.user.id, hari: n, sesi: jenis, skor: benar, total: daftar.length,
        jumlah_soal: daftar.length, waktu_ms: Math.round(totalMs) },
      { onConflict: "user_id,hari,sesi" }
    );
  };

  tampil();
}


/* ---------------- tab ピクトグラム ---------------- */
async function halamanPicto() {
  if (!(await pastikanMasuk())) return;
  const { data, error } = await db
    .from("materi").select("id,kategori,judul,ringkas")
    .eq("kategori", "ピクトグラム").order("urutan");
  if (error) return kabar("Gagal memuat materi: " + error.message);

  el("daftar").innerHTML = data
    .map((m) => `<a class="baris-materi" href="materi.html?id=${m.id}">
      <span class="teks">
        <span class="atas-baris"><span class="label-kategori kecil-chip">ピクトグラム</span><span class="judul">${m.judul}</span></span>
        <span class="isi">${m.ringkas || ""}</span>
      </span><span class="panah">›</span></a>`).join("");
}


/* ---------------- kata motivasi harian ---------------- */
const MOTIVASI = [
  ["継続は力なり", "けいぞくはちからなり", "Konsistensi itu kekuatan — sedikit tapi tiap hari."],
  ["七転び八起き", "ななころびやおき", "Jatuh tujuh kali, bangun delapan kali."],
  ["石の上にも三年", "いしのうえにもさんねん", "Tekun di satu tempat, akhirnya berhasil juga."],
  ["塵も積もれば山となる", "ちりもつもればやまとなる", "Debu menumpuk pun jadi gunung."],
  ["習うより慣れよ", "ならうよりなれよ", "Lebih cepat paham kalau langsung dipraktikkan."],
  ["失敗は成功のもと", "しっぱいはせいこうのもと", "Kegagalan adalah dasar keberhasilan."],
  ["案ずるより産むが易し", "あんずるよりうむがやすし", "Dikerjakan lebih mudah daripada ditakutkan."],
  ["急がば回れ", "いそがばまわれ", "Kalau mau cepat, ambil jalan yang benar dulu."],
  ["為せば成る", "なせばなる", "Kalau dikerjakan, pasti tercapai."],
  ["努力に勝る天才なし", "どりょくにまさるてんさいなし", "Tidak ada bakat yang mengalahkan usaha."],
  ["好きこそ物の上手なれ", "すきこそもののじょうずなれ", "Yang disukai akan cepat dikuasai."],
  ["千里の道も一歩から", "せんりのみちもいっぽから", "Perjalanan seribu ri dimulai dari satu langkah."],
  ["雨降って地固まる", "あめふってじかたまる", "Setelah hujan, tanah jadi lebih padat."],
  ["笑う門には福来る", "わらうかどにはふくきたる", "Pintu yang selalu tersenyum didatangi keberuntungan."],
];

function tampilMotivasi() {
  const kotak = el("motivasi");
  if (!kotak) return;
  const hariKe = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const [jp, kana, arti] = MOTIVASI[hariKe % MOTIVASI.length];
  kotak.innerHTML = `<p class="jp">${jp}</p><p class="kana">${kana}</p><p class="arti">${arti}</p>`;
}

/* ---------------- jalan ---------------- */
const halaman = document.body.dataset.page;
if (halaman === "masuk") halamanMasuk();
if (halaman === "beranda") { tampilMotivasi(); halamanBeranda(); }
if (halaman === "picto") halamanPicto();
if (halaman === "materi") halamanMateri();
if (halaman === "kuis") halamanKuis();
if (halaman === "kartu") halamanKartu();
if (halaman === "nilai") halamanNilai();
if (halaman === "review") halamanReview();
if (halaman === "belajar") halamanBelajar();
if (halaman === "hari") halamanHari();
if (halaman === "latihan") halamanLatihan();
