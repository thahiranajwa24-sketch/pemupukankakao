/**
 * ASISTEN PEMUPUKAN KAKAO - INITIAL DATABASE & AGRONOMIC BENCHMARKS
 * Standard Presets based on Puslitkoka Indonesia (Pusat Penelitian Kopi dan Kakao) Guidelines
 */

const INITIAL_DATABASE = {
  // Official Agronomic Reference metadata
  referenceSource: {
    title: "Pedoman Teknis Pemupukan Tanaman Kakao",
    institution: "Pusat Penelitian Kopi dan Kakao Indonesia (Puslitkoka)",
    version: "2026.1",
    lastUpdated: "2026-09-11"
  },

  // 1. Database Jenis Pupuk & Kandungan Hara
  fertilizers: [
    {
      id: "npk_16",
      name: "NPK 16-16-16",
      category: "Majemuk",
      n: 16,
      p: 16,
      k: 16,
      other: "Magnesium & Kalsium (Trace)",
      unit: "kg",
      usageInfo: "Pupuk seimbang yang ideal untuk fase pertumbuhan vegetatif dan pemeliharaan umum kakao."
    },
    {
      id: "npk_15",
      name: "NPK 15-15-15 (Phonska)",
      category: "Majemuk",
      n: 15,
      p: 15,
      k: 15,
      other: "Sulfur 10%",
      unit: "kg",
      usageInfo: "Pupuk majemuk bersubsidi/standar yang populer dan mudah ditemukan petani kakao."
    },
    {
      id: "npk_kakao",
      name: "NPK Kakao Spesifik (12-12-17+2Mg)",
      category: "Majemuk Kakao",
      n: 12,
      p: 12,
      k: 17,
      other: "MgO 2%, B 0.5%",
      unit: "kg",
      usageInfo: "Formulasi khusus kakao menghasilkan. Kandungan K lebih tinggi mendukung pengisian buah kakao."
    },
    {
      id: "urea",
      name: "Urea",
      category: "Tunggal",
      n: 46,
      p: 0,
      k: 0,
      other: "-",
      unit: "kg",
      usageInfo: "Sumber Nitrogen tinggi. Sangat baik memicu pertumbuhan daun baru dan tunas vegetatif kakao."
    },
    {
      id: "sp36",
      name: "SP-36 / TSP",
      category: "Tunggal",
      n: 0,
      p: 36,
      k: 0,
      other: "Sulfur 5%",
      unit: "kg",
      usageInfo: "Sumber Fosfor (P). Merangsang perkembangan akar muda dan pembentukan bunga kakao."
    },
    {
      id: "kcl",
      name: "KCl (Muriate of Potash)",
      category: "Tunggal",
      n: 0,
      p: 0,
      k: 60,
      other: "Klorida",
      unit: "kg",
      usageInfo: "Sumber Kalium (K) tinggi. Memperkuat ketahanan tanaman dan meningkatkan berat/ukuran biji kakao."
    },
    {
      id: "organik",
      name: "Pupuk Organik Kakao / Kasam",
      category: "Organik",
      n: 2,
      p: 1.5,
      k: 2.5,
      other: "C-Organik > 15%",
      unit: "kg",
      usageInfo: "Memperbaiki struktur tanah kebun kakao, meningkatkan daya simpan air dan aktivitas mikroba tanah."
    },
    {
      id: "kompos_kulit",
      name: "Kompos Kulit Buah Kakao",
      category: "Organik",
      n: 1.8,
      p: 0.8,
      k: 3.2,
      other: "Kaya Kalium Organik",
      unit: "kg",
      usageInfo: "Dibuat dari fermentasi kulit buah kakao (pulp/pod husk). Sangat tinggi Kalium alami untuk tanah."
    },
    {
      id: "dolomit",
      name: "Kapur Dolomit",
      category: "Pembenah Tanah",
      n: 0,
      p: 0,
      k: 0,
      other: "CaO 30%, MgO 18%",
      unit: "kg",
      usageInfo: "Digunakan apabila tanah kebun kakao masam (pH < 6.0) untuk menaikkan pH dan suplai Magnesium."
    }
  ],

  // 2. Matriks Dosis Standar Per Pohon Per Tahun (dalam gram NPK seimbang)
  baseDosageMatrix: {
    "0-1": {
      group: "Tanaman Muda (TBM 1)",
      baseDoseGramPerYear: 250, // 250 g/pohon/tahun
      freqPerYear: 4,           // 4x aplikasi @ 62.5 g
      organicDoseKgPerYear: 2,  // 2 kg kompos/pohon
      focusArea: "Pertumbuhan akar muda, batang utama, dan tunas daun."
    },
    "1-2": {
      group: "Tanaman Muda (TBM 2)",
      baseDoseGramPerYear: 450, // 450 g/pohon/tahun
      freqPerYear: 3,           // 3x aplikasi @ 150 g
      organicDoseKgPerYear: 3,
      focusArea: "Pembentukan cabangan jering (jorquette) dan pembentukan tajuk pohon."
    },
    "3-5": {
      group: "Tanaman Menghasilkan (TM 1)",
      baseDoseGramPerYear: 700, // 700 g/pohon/tahun
      freqPerYear: 2,           // 2x aplikasi (Awal & Akhir Musim Hujan)
      organicDoseKgPerYear: 5,
      focusArea: "Inisiasi pembungaan awal, pemeliharaan batang, dan pembentukan buah muda."
    },
    "6-10": {
      group: "Tanaman Menghasilkan (TM 2 - Puncak)",
      baseDoseGramPerYear: 950, // 950 g/pohon/tahun
      freqPerYear: 2,
      organicDoseKgPerYear: 5,
      focusArea: "Mempertahankan produktivitas puncak biji kakao dan perkembangan buah."
    },
    ">10": {
      group: "Tanaman Menghasilkan (TM 3 - Dewasa)",
      baseDoseGramPerYear: 1100, // 1100 g/pohon/tahun
      freqPerYear: 2,
      organicDoseKgPerYear: 5,
      focusArea: "Pemeliharaan tajuk, peremajaan tunas air (chupon control), dan mempertahankan tonase."
    },
    "unknown": {
      group: "Estimasi Standar Umum Kakao",
      baseDoseGramPerYear: 750, // Default rata-rata
      freqPerYear: 2,
      organicDoseKgPerYear: 4,
      focusArea: "Kombinasi pertumbuhan vegetatif dan pemeliharaan pembuangan umum."
    }
  },

  // 3. Faktor Pengali Kondisi Tanah
  soilModifiers: {
    "subur": { factor: 0.9, text: "Tanah terlihat subur (dosis disesuaikan efisien)." },
    "kurang_subur": { factor: 1.15, text: "Tanah kurang subur (dosis ditambahkan 15% untuk pemulihan)." },
    "sangat_kering": { factor: 1.0, text: "Tanah kering (perlu perhatikan kelembapan sebelum memupuk)." },
    "tergenang": { factor: 1.0, text: "Tanah tergenang (tunda pemupukan sampai air surut)." },
    "lembap": { factor: 1.0, text: "Tanah lembap (kondisi ideal untuk penyerapan pupuk)." },
    "unknown": { factor: 1.0, text: "Kondisi tanah standar." }
  },

  // 4. Modifikator Gejala Visual Tanaman
  plantHealthModifiers: {
    "sehat": { nMod: 1.0, pMod: 1.0, kMod: 1.0, priority: "Perawatan Seimbang", note: "Tanaman dalam kondisi sehat, lanjutkan pemupukan berkala." },
    "menguning": { nMod: 1.25, pMod: 1.0, kMod: 1.0, priority: "Prioritas Nitrogen (N)", note: "Daun menguning mengindikasikan perlunya asupan Nitrogen (N) lebih tinggi." },
    "lambat": { nMod: 1.15, pMod: 1.2, kMod: 1.0, priority: "Prioritas Akar & Tunas (N & P)", note: "Pertumbuhan lambat memerlukan penguatan Fosfor untuk perakaran dan Nitrogen untuk tunas." },
    "bunga_banyak_buah_sedikit": { nMod: 0.9, pMod: 1.15, kMod: 1.3, priority: "Prioritas Kalium (K)", note: "Bunga gugur atau tidak jadi buah mengindikasikan perlunya unsur Kalium (K) untuk pembentukan pod." },
    "buah_sedikit_kecil": { nMod: 1.0, pMod: 1.0, kMod: 1.35, priority: "Prioritas Kalium (K)", note: "Ukuran buah kecil memerlukan tambahan Kalium (K) agar isi biji kakao padat." },
    "kurang_subur": { nMod: 1.15, pMod: 1.15, kMod: 1.15, priority: "Dosis Lengkap N-P-K + Organik", note: "Tanaman kurang subur disarankan mendapat pupuk organik dan NPK lengkap." },
    "unknown": { nMod: 1.0, pMod: 1.0, kMod: 1.0, priority: "Dosis Standar", note: "Gunakan rekomendasi standar berimbang." }
  },

  // 5. Aturan Cuaca & Genangan (Timing Verdict)
  weatherRules: {
    "hujan_deras": {
      status: "delay",
      badgeText: "⏳ Sebaiknya Ditunda",
      title: "Tunda Pemupukan",
      reason: "Hujan deras berisiko tinggi menyebabkan pupuk hanyut (runoff) atau tercuci (leaching) sebelum sempat diserap akar kakao."
    },
    "genangan": {
      status: "stop",
      badgeText: "🛑 Jangan Memupuk Dahulu",
      title: "Tanaman Tergenang Air",
      reason: "Akar kakao dalam kondisi tergenang kekurangan oksigen (anoksia). Pupuk tidak akan diserap dan dapat merusak akar."
    },
    "sangat_kering": {
      status: "delay",
      badgeText: "⏳ Tunggu Kelembapan Cukup",
      title: "Tanah Terlalu Kering",
      reason: "Pupuk memerlukan kelembapan tanah untuk larut. Memupuk di tanah sangat kering dapat menyebabkan pupuk menguap atau merusak akar."
    },
    "hujan_ringan": {
      status: "allow",
      badgeText: "✅ Bisa Dilakukan",
      title: "Kondisi Baik Untuk Pemupukan",
      reason: "Hujan ringan memberikan kelembapan yang pas untuk melarutkan butiran pupuk secara perlahan ke area akar."
    },
    "hujan_sedang": {
      status: "allow",
      badgeText: "✅ Bisa Dilakukan",
      title: "Kondisi Sesuai",
      reason: "Pastikan pupuk ditabur merata pada ring perakaran dan tidak tergenang."
    },
    "lembap": {
      status: "allow",
      badgeText: "✅ SANGAT IDEAL",
      title: "Kondisi Sangat Sesuai",
      reason: "Tanah lembap tanpa genangan adalah kondisi paling ideal agar butiran pupuk cepat diserap perakaran kakao."
    }
  }
};
