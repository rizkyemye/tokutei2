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
  if (!(await pastikanMasuk())) return;
  const { data, error } = await db
    .from("materi")
    .select("id,kategori,judul,ringkas")
    .order("urutan");
  if (error) return kabar("Gagal memuat materi: " + error.message);

  // jaga-jaga kalau data dobel di database
  const unik = [];
  const kunci = new Set();
  for (const m of data) {
    const k = `${m.kategori}|${m.judul}`;
    if (kunci.has(k)) continue;
    kunci.add(k);
    unik.push(m);
  }

  el("daftar").innerHTML = unik
    .map(
      (m) => `<a class="baris-materi" href="materi.html?id=${m.id}">
        <span class="teks">
          <span class="atas-baris"><span class="label-kategori kecil-chip">${m.kategori}</span><span class="judul">${m.judul}</span></span>
          <span class="isi">${m.ringkas || ""}</span>
        </span>
        <span class="panah">›</span></a>`
    )
    .join("");
}

/* ---------------- baca materi ---------------- */
async function halamanMateri() {
  if (!(await pastikanMasuk())) return;
  const id = new URLSearchParams(location.search).get("id");
  const { data, error } = await db.from("materi").select("*").eq("id", id).single();
  if (error) return kabar("Materi tidak ditemukan.");
  el("kategori").textContent = data.kategori;
  const berkas = { "2号": "2gou-shukuhaku.pdf", "1号": "1gou-shukuhaku.pdf", "picto": "pictogram.pdf" };
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
  if (bab) q = q.eq("bab", bab);

  if (sumber === "picto") {
    document.body.classList.add("mode-picto");
    el("label-kuis").textContent = "ピクトグラム" + (jenis === "gambar" ? " · gambar" : jenis === "teks" ? " · teks" : "");
  } else {
    el("label-kuis").textContent = kategori || "宿泊分野";
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
  const { data, error } = await db
    .from("kosakata")
    .select("kanji,kana,arti,grup,level,urutan,gambar")
    .order("urutan");
  if (error) return kabar("Gagal memuat kosakata: " + error.message);

  const semua = data;
  let daftar = semua.slice();
  let i = 0;

  const pilihLevel = el("level");
  const pilihGrup = el("grup");

  function saring() {
    const lv = pilihLevel.value;
    const gr = pilihGrup.value;
    daftar = semua.filter(
      (k) => (lv === "semua" || (k.level || "").includes(lv)) && (gr === "Semua" || k.grup === gr)
    );
    if (!daftar.length) daftar = semua.slice();
    i = 0;
    gambar();
  }

  function isiGrup() {
    const lv = pilihLevel.value;
    const dasar = lv === "semua" ? semua : semua.filter((k) => (k.level || "").includes(lv));
    const grupUnik = ["Semua", ...new Set(dasar.map((k) => k.grup))];
    pilihGrup.innerHTML = grupUnik.map((g) => `<option>${g}</option>`).join("");
  }

  pilihLevel.onchange = () => { isiGrup(); saring(); };
  pilihGrup.onchange = saring;

  const lvUrl = new URLSearchParams(location.search).get("level");
  if (lvUrl && [...pilihLevel.options].some((o) => o.value === lvUrl)) pilihLevel.value = lvUrl;
  if (pilihLevel.value === "picto") document.body.classList.add("mode-picto");

  isiGrup();
  saring();

  function gambar() {
    const k = daftar[i];
    if (!k) return;
    el("kartu").classList.remove("terbuka");
    el("depan-grup").textContent = `${k.level || "2号"} · ${k.grup}`;
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
const PER_HARI = 35;

async function semuaKata() {
  const kumpul = [];
  for (let mulai = 0; mulai < 3000; mulai += 1000) {
    const { data, error } = await db
      .from("kosakata")
      .select("id,kanji,kana,arti,grup,level,gambar,urutan")
      .order("id")
      .range(mulai, mulai + 999);
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

/* ---------------- jalan ---------------- */
const halaman = document.body.dataset.page;
if (halaman === "masuk") halamanMasuk();
if (halaman === "beranda") halamanBeranda();
if (halaman === "materi") halamanMateri();
if (halaman === "kuis") halamanKuis();
if (halaman === "kartu") halamanKartu();
if (halaman === "nilai") halamanNilai();
if (halaman === "review") halamanReview();
if (halaman === "belajar") halamanBelajar();
if (halaman === "hari") halamanHari();
if (halaman === "latihan") halamanLatihan();
