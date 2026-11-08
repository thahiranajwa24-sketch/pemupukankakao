/**
 * ASISTEN PEMUPUKAN KAKAO - CALCULATION & RECOMMENDATION ENGINE
 */

const CalculationEngine = {
  /**
   * Estimasi jumlah tanaman berdasarkan luas lahan jika petani tidak tahu
   */
  estimateTreeCount(areaHa) {
    if (!areaHa || areaHa <= 0) areaHa = 1.0; // Default 1 ha
    const areaSqM = areaHa * 10000;
    const spacingSqM = 9.0; // Standard 3m x 3m spacing for cocoa
    return Math.round(areaSqM / spacingSqM);
  },

  /**
   * Evaluasi rekomendasi lengkap berdasarkan input petani dan database
   */
  calculateRecommendation(userInput, db = INITIAL_DATABASE) {
    // 1. Sanitasi Data Kebun
    let areaHa = parseFloat(userInput.areaHa) || 1.0;
    let treeCount = parseInt(userInput.treeCount);
    let usedTreeEstimation = false;

    if (!treeCount || treeCount <= 0 || userInput.treeUnknown) {
      treeCount = this.estimateTreeCount(areaHa);
      usedTreeEstimation = true;
    }

    // 2. Umur Tanaman & Kelompok Growth
    const ageKey = userInput.plantAge || "unknown";
    const baseDosageInfo = db.baseDosageMatrix[ageKey] || db.baseDosageMatrix["unknown"];

    // Classification (Tanaman Muda 0-2 th vs Tanaman Menghasilkan >=3 th)
    const isYoung = (ageKey === "0-1" || ageKey === "1-2");
    const categoryName = isYoung ? "Tanaman Muda (TBM - Belum Menghasilkan)" : "Tanaman Menghasilkan (TM)";

    // 3. Modifikator Kondisi Tanah & Tanaman
    const soilKey = userInput.soilCondition || "unknown";
    const soilMod = db.soilModifiers[soilKey] || db.soilModifiers["unknown"];

    const healthKey = userInput.plantHealth || "unknown";
    const healthMod = db.plantHealthModifiers[healthKey] || db.plantHealthModifiers["unknown"];

    // 4. Hitung Dosis Per Pohon per Tahun (gram)
    let baseGramPerYear = baseDosageInfo.baseDoseGramPerYear;
    let adjustedGramPerYear = baseGramPerYear * soilMod.factor;

    // Frekuensi Aplikasi
    const freq = baseDosageInfo.freqPerYear || 2;
    let gramPerApplication = Math.round(adjustedGramPerYear / freq);
    let kgPerApplication = (gramPerApplication / 1000).toFixed(2);
    let kgPerYearPerTree = (adjustedGramPerYear / 1000).toFixed(2);

    // 5. Total Kebutuhan Pupuk Kebun
    let totalKgPerApplication = Math.round((gramPerApplication * treeCount) / 1000);
    let totalKgPerYear = Math.round((adjustedGramPerYear * treeCount) / 1000);
    let totalBags50kgPerApplication = Math.ceil(totalKgPerApplication / 50);
    let totalBags50kgPerYear = Math.ceil(totalKgPerYear / 50);

    // Dosis Organik
    let organicKgPerTree = baseDosageInfo.organicDoseKgPerYear;
    let totalOrganicKg = Math.round(organicKgPerTree * treeCount);
    let totalOrganicBags = Math.ceil(totalOrganicKg / 50);

    // 6. Pemilihan Pupuk Yang Dimiliki Petani
    let selectedFertilizerIds = userInput.selectedFertilizers || ["npk_16"];
    let fertilizerRecommendations = [];

    if (selectedFertilizerIds.length === 0) {
      selectedFertilizerIds = ["npk_16"]; // Default fallback
    }

    selectedFertilizerIds.forEach(fertId => {
      const fertObj = db.fertilizers.find(f => f.id === fertId);
      if (fertObj) {
        // Hitung kandungan unsur hara total yang diberikan oleh pupuk ini
        let nKg = Math.round(totalKgPerApplication * (fertObj.n / 100));
        let pKg = Math.round(totalKgPerApplication * (fertObj.p / 100));
        let kKg = Math.round(totalKgPerApplication * (fertObj.k / 100));

        fertilizerRecommendations.push({
          fertilizer: fertObj,
          doseGramPerTree: gramPerApplication,
          doseKgPerTree: kgPerApplication,
          freqPerYear: freq,
          totalKgPerApplication: totalKgPerApplication,
          totalBagsPerApplication: totalBags50kgPerApplication,
          totalKgPerYear: totalKgPerYear,
          totalBagsPerYear: totalBags50kgPerYear,
          nKgYield: nKg,
          pKgYield: pKg,
          kKgYield: kKg
        });
      }
    });

    // 7. Evaluasi Cuaca & Timing Verdict
    const weatherKey = userInput.weatherCondition || "lembap";
    const weatherVerdict = db.weatherRules[weatherKey] || db.weatherRules["lembap"];

    // 8. Evaluasi pH Tanah (Jika ada)
    let phEvaluation = null;
    if (userInput.knowsPH && userInput.phValue) {
      const phVal = parseFloat(userInput.phValue);
      if (phVal < 6.0) {
        phEvaluation = {
          val: phVal,
          status: "masam",
          label: "Tanah Masam (pH < 6.0)",
          advice: "Kondisi kebun cenderung masam. Disarankan pemberian Kapur Dolomit 200-500g/pohon secara terpisah sebelum memupuk NPK."
        };
      } else if (phVal <= 7.0) {
        phEvaluation = {
          val: phVal,
          status: "optimal",
          label: "Sangat Optimal (pH 6.0 - 7.0)",
          advice: "pH tanah sangat ideal untuk penyerapan semua hara pupuk secara maksimal."
        };
      } else {
        phEvaluation = {
          val: phVal,
          status: "basa",
          label: "Cenderung Basa (pH > 7.0)",
          advice: "Kondisi tanah agak basa. Pastikan pengenceran/pemupukan organik cukup untuk menyeimbangkan hara."
        };
      }
    }

    // 9. Susun Output Rekomendasi
    return {
      timestamp: new Date().toISOString(),
      farmDetails: {
        areaHa: areaHa,
        treeCount: treeCount,
        usedTreeEstimation: usedTreeEstimation,
        plantAgeLabel: this.getAgeLabel(ageKey),
        categoryName: categoryName,
        isYoung: isYoung,
        focusArea: baseDosageInfo.focusArea
      },
      plantCondition: {
        healthKey: healthKey,
        healthNote: healthMod.note,
        priorityNutrient: healthMod.priority
      },
      soilCondition: {
        soilKey: soilKey,
        soilNote: soilMod.text,
        phEval: phEvaluation
      },
      weatherVerdict: weatherVerdict,
      dosageSummary: {
        gramPerApplication: gramPerApplication,
        freqPerYear: freq,
        totalKgPerApplication: totalKgPerApplication,
        totalBagsPerApplication: totalBags50kgPerApplication,
        totalKgPerYear: totalKgPerYear,
        totalBagsPerYear: totalBags50kgPerYear,
        organicKgPerTree: organicKgPerTree,
        totalOrganicKg: totalOrganicKg,
        totalOrganicBags: totalOrganicBags
      },
      fertilizers: fertilizerRecommendations,
      hasUnknownData: (userInput.plantAge === "unknown" || userInput.soilCondition === "unknown" || usedTreeEstimation)
    };
  },

  getAgeLabel(key) {
    const labels = {
      "0-1": "0 – 1 Tahun (Tanaman Muda)",
      "1-2": "1 – 2 Tahun (Tanaman Muda)",
      "3-5": "3 – 5 Tahun (Tanaman Menghasilkan)",
      "6-10": "6 – 10 Tahun (Puncak Produksi)",
      ">10": "Lebih dari 10 Tahun",
      "unknown": "Umur Tidak Diketahui (Estimasi Rata-Rata)"
    };
    return labels[key] || "Tidak Diketahui";
  }
};
