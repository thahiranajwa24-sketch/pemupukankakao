/**
 * ASISTEN PEMUPUKAN KAKAO - LOCAL STORAGE & HISTORY MANAGEMENT
 */

const STORAGE_KEYS = {
  HISTORY: "asisten_kakao_history_v1",
  DATABASE: "asisten_kakao_custom_db_v1",
  SETTINGS: "asisten_kakao_settings_v1"
};

const StorageManager = {
  // --- HISTORY LOGS ---
  getHistory() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Gagal membaca riwayat dari LocalStorage", e);
      return [];
    }
  },

  saveCheckResult(result, farmName = "Kebun Kakao Saya") {
    const history = this.getHistory();
    const newItem = {
      id: "check_" + Date.now(),
      date: new Date().toLocaleDateString("id-ID", {
        day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
      }),
      farmName: farmName,
      result: result
    };
    history.unshift(newItem); // Tambahkan ke paling atas
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    } catch (e) {
      console.error("Gagal menyimpan riwayat", e);
    }
    return newItem;
  },

  deleteHistoryItem(id) {
    let history = this.getHistory();
    history = history.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    return history;
  },

  clearAllHistory() {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  },

  // --- CUSTOM DATABASE (ADMIN MODE) ---
  getCustomDatabase() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DATABASE);
      return data ? JSON.parse(data) : INITIAL_DATABASE;
    } catch (e) {
      return INITIAL_DATABASE;
    }
  },

  saveCustomDatabase(db) {
    try {
      localStorage.setItem(STORAGE_KEYS.DATABASE, JSON.stringify(db));
    } catch (e) {
      console.error("Gagal menyimpan database kustom", e);
    }
  },

  resetDatabaseToDefault() {
    localStorage.removeItem(STORAGE_KEYS.DATABASE);
    return INITIAL_DATABASE;
  },

  // --- PRESET TEST PROFILES FOR QUICK DEMO ---
  getTestProfiles() {
    return [
      {
        id: "test_1",
        title: "🌱 Petani Tanaman Muda (TBM)",
        desc: "Luas 1 Ha, Umur 1.5 thn, Tanah lembap, NPK 16-16-16.",
        input: {
          areaHa: 1.0,
          treeCount: 1100,
          treeUnknown: false,
          plantAge: "1-2",
          plantHealth: "sehat",
          soilCondition: "lembap",
          knowsPH: false,
          weatherCondition: "hujan_ringan",
          selectedFertilizers: ["npk_16", "organik"],
          hasSoilTest: false
        }
      },
      {
        id: "test_2",
        title: "🍫 Petani Produksi Puncak (TM)",
        desc: "Luas 2 Ha, 2.000 pohon, Umur 7 thn, Daun menguning.",
        input: {
          areaHa: 2.0,
          treeCount: 2000,
          treeUnknown: false,
          plantAge: "6-10",
          plantHealth: "menguning",
          soilCondition: "kurang_subur",
          knowsPH: true,
          phValue: 5.5,
          weatherCondition: "hujan_sedang",
          selectedFertilizers: ["npk_kakao", "urea", "organik"],
          hasSoilTest: false
        }
      },
      {
        id: "test_3",
        title: "❓ Petani Awam (\"Saya Tidak Tahu\")",
        desc: "Lahan 0.5 Ha, Jumlah pohon & umur tanaman tidak diketahui.",
        input: {
          areaHa: 0.5,
          treeCount: null,
          treeUnknown: true,
          plantAge: "unknown",
          plantHealth: "unknown",
          soilCondition: "unknown",
          knowsPH: false,
          weatherCondition: "lembap",
          selectedFertilizers: ["npk_15"],
          hasSoilTest: false
        }
      },
      {
        id: "test_4",
        title: "🧪 Petani Dengan Uji Lab Tanah",
        desc: "Luas 1 Ha, Umur 4 thn, Memiliki hasil tes pH 5.8 & N-P-K lab.",
        input: {
          areaHa: 1.0,
          treeCount: 1000,
          treeUnknown: false,
          plantAge: "3-5",
          plantHealth: "bunga_banyak_buah_sedikit",
          soilCondition: "lembap",
          knowsPH: true,
          phValue: 5.8,
          weatherCondition: "lembap",
          selectedFertilizers: ["npk_16", "sp36", "kcl"],
          hasSoilTest: true,
          soilTestDetails: { nStatus: "Rendah", pStatus: "Sedang", kStatus: "Tinggi" }
        }
      },
      {
        id: "test_5",
        title: "⛈️ Petani Cuaca Hujan Deras / Genangan",
        desc: "Luas 1.5 Ha, 1.500 pohon, Terjadi hujan deras & genangan.",
        input: {
          areaHa: 1.5,
          treeCount: 1500,
          treeUnknown: false,
          plantAge: "3-5",
          plantHealth: "sehat",
          soilCondition: "tergenang",
          knowsPH: false,
          weatherCondition: "hujan_deras",
          selectedFertilizers: ["npk_16"],
          hasSoilTest: false
        }
      }
    ];
  }
};
