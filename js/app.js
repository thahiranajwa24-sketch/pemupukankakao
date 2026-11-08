/**
 * ASISTEN PEMUPUKAN KAKAO - MAIN APPLICATION CONTROLLER
 */

const App = {
  state: {
    mode: "petani", // "petani" | "admin"
    theme: "light", // "light" | "dark"
    currentView: "home", // "home" | "wizard" | "result" | "history" | "guide" | "admin"
    wizardStep: 1,
    totalSteps: 7,
    formData: {
      areaHa: 1.0,
      treeCount: 1100,
      treeUnknown: false,
      plantAge: "3-5",
      plantHealth: "sehat",
      soilCondition: "lembap",
      knowsPH: false,
      phValue: "",
      weatherCondition: "lembap",
      selectedFertilizers: ["npk_16"],
      hasSoilTest: false,
      soilTestDetails: { nVal: "", pVal: "", kVal: "", phVal: "" }
    },
    currentResult: null,
    db: null
  },

  init() {
    this.state.db = StorageManager.getCustomDatabase();
    this.bindEvents();
    this.render();
  },

  bindEvents() {
    // Theme Switcher
    const themeBtn = document.getElementById("theme-toggle");
    if (themeBtn) {
      themeBtn.addEventListener("click", () => {
        this.state.theme = this.state.theme === "light" ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", this.state.theme);
        themeBtn.innerHTML = this.state.theme === "light" ? "🌙 Dark" : "☀️ Light";
      });
    }

    // Mode Switcher (Petani vs Penyuluh/Admin)
    const modeBtn = document.getElementById("mode-toggle");
    if (modeBtn) {
      modeBtn.addEventListener("click", () => {
        this.state.mode = this.state.mode === "petani" ? "admin" : "petani";
        if (this.state.mode === "admin") {
          this.state.currentView = "admin";
        } else {
          this.state.currentView = "home";
        }
        this.render();
      });
    }
  },

  setView(viewName) {
    this.state.currentView = viewName;
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.render();
  },

  startWizard() {
    this.state.wizardStep = 1;
    this.state.currentView = "wizard";
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.render();
  },

  loadTestProfile(profileId) {
    const profiles = StorageManager.getTestProfiles();
    const target = profiles.find(p => p.id === profileId);
    if (target) {
      this.state.formData = JSON.parse(JSON.stringify(target.input));
      this.calculateAndShowResult();
    }
  },

  calculateAndShowResult() {
    const result = CalculationEngine.calculateRecommendation(this.state.formData, this.state.db);
    this.state.currentResult = result;
    this.state.currentView = "result";
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.render();
  },

  saveCurrentResultToHistory() {
    if (this.state.currentResult) {
      StorageManager.saveCheckResult(this.state.currentResult, `Kebun Kakao (${this.state.formData.areaHa} Ha)`);
      alert("✅ Hasil rekomendasi pemupukan berhasil disimpan ke Riwayat Saya!");
    }
  },

  // --- RENDER ROUTER ---
  render() {
    const navModeBtn = document.getElementById("mode-toggle");
    if (navModeBtn) {
      navModeBtn.className = `nav-btn ${this.state.mode === 'admin' ? 'mode-active' : ''}`;
      navModeBtn.innerHTML = this.state.mode === 'petani' 
        ? `👨‍🌾 Mode Petani` 
        : `📋 Mode Penyuluh / Admin`;
    }

    const container = document.getElementById("main-container");
    if (!container) return;

    switch (this.state.currentView) {
      case "home":
        container.innerHTML = this.renderHomeView();
        break;
      case "wizard":
        container.innerHTML = this.renderWizardView();
        break;
      case "result":
        container.innerHTML = this.renderResultView();
        break;
      case "history":
        container.innerHTML = this.renderHistoryView();
        break;
      case "guide":
        container.innerHTML = this.renderGuideView();
        break;
      case "admin":
        container.innerHTML = this.renderAdminView();
        break;
      default:
        container.innerHTML = this.renderHomeView();
    }
  },

  // --- 1. BERANDA / HOME VIEW ---
  renderHomeView() {
    const profiles = StorageManager.getTestProfiles();
    return `
      <!-- Hero Card Banner -->
      <div class="hero-card">
        <div class="hero-content">
          <div class="hero-tag">🌱 Aplikasi Khusus Petani Kakao Indonesia</div>
          <h1 class="hero-title">ASISTEN PEMUPUKAN KAKAO</h1>
          <p class="hero-subtitle">
            "Bantu tentukan kebutuhan pupuk kakao berdasarkan kondisi kebun Anda secara sederhana, cepat, dan akurat."
          </p>
          <div class="hero-actions">
            <button class="btn btn-primary" onclick="App.startWizard()">
              🚀 Mulai Cek Pemupukan
            </button>
            <button class="btn btn-secondary" onclick="App.setView('history')">
              📜 Riwayat Saya
            </button>
            <button class="btn btn-outline" style="color: #fff; border-color: rgba(255,255,255,0.4);" onclick="App.setView('guide')">
              📚 Panduan Pemupukan
            </button>
          </div>
        </div>
        <div class="hero-image-wrapper">
          <img src="assets/hero.jpg" alt="Kebun Kakao Subur" class="hero-img" />
        </div>
      </div>

      <!-- Keterangan Aplikasi -->
      <div class="alert-box info" style="margin-bottom: 2rem;">
        <span class="alert-icon">💡</span>
        <div>
          <strong>Prinsip Utama:</strong> Jawab 7 pertanyaan sederhana mengenai kondisi kebun Anda. Aplikasi yang akan melakukan seluruh perhitungan dosis, jumlah karung pupuk, dan waktu aplikasi secara otomatis.
        </div>
      </div>

      <!-- 3 Utama Card Features -->
      <div class="grid-cards">
        <div class="card" onclick="App.startWizard()" style="cursor: pointer;">
          <div class="card-icon">🧪</div>
          <h3 class="card-title">Cek Pemupukan Kebun</h3>
          <p class="card-desc">Hitung dosis NPK, jumlah karung, dan waktu memupuk sesuai umur pohon dan cuaca saat ini.</p>
          <button class="btn btn-forest btn-sm">Mulai Cek Sekarang →</button>
        </div>

        <div class="card" onclick="App.setView('history')" style="cursor: pointer;">
          <div class="card-icon">📂</div>
          <h3 class="card-title">Riwayat Kebun Saya</h3>
          <p class="card-desc">Lihat kembali hasil perhitungan dosis pemupukan sebelumnya yang telah disimpan.</p>
          <button class="btn btn-outline btn-sm">Buka Riwayat →</button>
        </div>

        <div class="card" onclick="App.setView('guide')" style="cursor: pointer;">
          <div class="card-icon">📖</div>
          <h3 class="card-title">Panduan Pemupukan</h3>
          <p class="card-desc">Pelajari cara penaburan pupuk melingkar (ring placement), pemeliharaan tajuk, dan jenis pupuk.</p>
          <button class="btn btn-outline btn-sm">Baca Panduan →</button>
        </div>
      </div>

      <!-- Quick Test Profiles for Demo -->
      <div style="background: var(--color-surface); padding: 1.5rem; border-radius: var(--radius-lg); border: 1px solid var(--color-border);">
        <h3 style="font-size: 1.1rem; margin-bottom: 0.5rem; color: var(--color-secondary);">
          🧪 Uji Coba Cepat (Contoh Profil Petani Kakao)
        </h3>
        <p style="font-size: 0.875rem; color: var(--color-text-muted); margin-bottom: 1rem;">
          Klik salah satu profil di bawah untuk melihat hasil rekomendasi secara instan:
        </p>
        <div style="display: flex; flex-wrap: wrap; gap: 0.6rem;">
          ${profiles.map(p => `
            <button class="btn btn-outline btn-sm" onclick="App.loadTestProfile('${p.id}')">
              ${p.title}
            </button>
          `).join("")}
        </div>
      </div>
    `;
  },

  // --- 2. STEP-BY-STEP WIZARD VIEW ---
  renderWizardView() {
    const step = this.state.wizardStep;
    const total = this.state.totalSteps;
    const percent = Math.round((step / total) * 100);

    return `
      <div class="wizard-card">
        <!-- Progress Bar & Header -->
        <div class="wizard-header">
          <div class="step-meta">
            <span class="step-count">Pertanyaan ${step} dari ${total}</span>
            <span class="step-percent">${percent}% Selesai</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" style="width: ${percent}%;"></div>
          </div>
          <div class="step-dots">
            ${Array.from({ length: total }, (_, i) => `
              <div class="step-dot ${i + 1 === step ? 'active' : (i + 1 < step ? 'completed' : '')}"></div>
            `).join("")}
          </div>
        </div>

        <!-- Step Question Content -->
        <div class="wizard-body">
          ${this.renderWizardStepContent(step)}
        </div>

        <!-- Navigation Buttons -->
        <div class="wizard-footer">
          <button class="btn btn-outline" onclick="App.prevStep()" ${step === 1 ? 'disabled style="opacity: 0.5;"' : ''}>
            ← Kembali
          </button>
          ${step < total ? `
            <button class="btn btn-primary" onclick="App.nextStep()">
              Lanjut →
            </button>
          ` : `
            <button class="btn btn-forest" onclick="App.calculateAndShowResult()">
              🌱 Lihat Hasil Rekomendasi
            </button>
          `}
        </div>
      </div>
    `;
  },

  renderWizardStepContent(step) {
    const data = this.state.formData;

    switch (step) {
      case 1: // Luas & Jumlah Tanaman
        return `
          <h2 class="question-title">1. Berapa luas kebun & jumlah tanaman kakao Anda?</h2>
          <p class="question-hint">Pilih atau masukkan ukuran luas lahan kebun kakao Anda:</p>
          
          <div class="form-group">
            <label class="form-label">Luas Kebun (Hektare):</label>
            <div class="options-grid" style="grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); margin-bottom: 1rem;">
              ${[0.1, 0.5, 1.0, 2.0].map(val => `
                <div class="option-card ${data.areaHa === val ? 'selected' : ''}" onclick="App.updateForm('areaHa', ${val})">
                  <div class="option-content" style="text-align: center;">
                    <div class="option-label">${val} Ha</div>
                  </div>
                </div>
              `).join("")}
            </div>
            <div class="input-group">
              <input type="number" step="0.1" class="form-control" placeholder="Masukkan sendiri luas kebun" value="${data.areaHa}" onchange="App.updateForm('areaHa', parseFloat(this.value) || 1.0)" />
              <span class="input-suffix">Hektare (Ha)</span>
            </div>
          </div>

          <div class="form-group" style="margin-top: 1.5rem;">
            <label class="form-label">Jumlah Tanaman Kakao (Pohon):</label>
            <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.75rem;">
              <input type="checkbox" id="tree-unknown" ${data.treeUnknown ? 'checked' : ''} onchange="App.updateForm('treeUnknown', this.checked)" style="width: 20px; height: 20px;" />
              <label for="tree-unknown" style="font-weight: 700; cursor: pointer; color: var(--color-primary);">
                "Saya tidak tahu jumlah tanaman." (Aplikasi akan mengestimasi otomatis)
              </label>
            </div>

            ${!data.treeUnknown ? `
              <div class="input-group">
                <input type="number" class="form-control" placeholder="Contoh: 1000" value="${data.treeCount || ''}" onchange="App.updateForm('treeCount', parseInt(this.value) || 0)" />
                <span class="input-suffix">Pohon</span>
              </div>
            ` : `
              <div class="alert-box info" style="margin-top: 0.5rem;">
                ℹ️ Estimasi Otomatis: Berdasarkan luas ${data.areaHa} Ha dan jarak tanam standar 3m x 3m, diperkirakan terdapat <strong>${CalculationEngine.estimateTreeCount(data.areaHa)} pohon</strong> kakao.
              </div>
            `}
          </div>
        `;

      case 2: // Umur Tanaman
        const ageOptions = [
          { key: "0-1", label: "0 – 1 Tahun", group: "Tanaman Muda (TBM 1)", desc: "Fokus: Pertumbuhan akar muda & tunas batang." },
          { key: "1-2", label: "1 – 2 Tahun", group: "Tanaman Muda (TBM 2)", desc: "Fokus: Pembentukan tajuk & cabangan jering." },
          { key: "3-5", label: "3 – 5 Tahun", group: "Tanaman Menghasilkan (TM 1)", desc: "Fokus: Inisiasi bunga & pembentukan buah awal." },
          { key: "6-10", label: "6 – 10 Tahun", group: "Tanaman Menghasilkan (TM 2)", desc: "Fokus: Mempertahankan puncak produksi biji." },
          { key: ">10", label: "Lebih dari 10 Tahun", group: "Tanaman Dewasa (TM 3)", desc: "Fokus: Pemeliharaan tajuk & daya tahan pohon." },
          { key: "unknown", label: "Saya Tidak Tahu", group: "Estimasi Standar", desc: "Aplikasi menggunakan dosis rata-rata aman." }
        ];

        return `
          <h2 class="question-title">2. Berapa umur tanaman kakao Anda?</h2>
          <p class="question-hint">Umur tanaman menentukan kelompok kebutuhan pupuk (Tanaman Muda vs Tanaman Menghasilkan):</p>
          <div class="options-grid">
            ${ageOptions.map(opt => `
              <div class="option-card ${data.plantAge === opt.key ? 'selected' : ''}" onclick="App.updateForm('plantAge', '${opt.key}')">
                <div class="option-content">
                  <div class="option-label">${opt.label}</div>
                  <div class="option-subtext">${opt.desc}</div>
                  <span class="option-badge">${opt.group}</span>
                </div>
              </div>
            `).join("")}
          </div>
        `;

      case 3: // Kondisi Tanaman
        const healthOptions = [
          { key: "sehat", icon: "🌿", label: "Tanaman Terlihat Sehat", desc: "Daun hijau, pertumbuhan normal, buah berkembang baik." },
          { key: "menguning", icon: "🍃", label: "Daun Terlihat Menguning", desc: "Warna daun pucat atau kekuningan." },
          { key: "lambat", icon: "🌱", label: "Pertumbuhan Lambat", desc: "Tunas baru jarang tumbuh, tanaman kerdil." },
          { key: "bunga_banyak_buah_sedikit", icon: "🌸", label: "Bunga Banyak, Buah Sedikit", desc: "Bunga sering gugur sebelum jadi pentil buah." },
          { key: "buah_sedikit_kecil", icon: "🍫", label: "Buah Sedikit / Ukuran Kecil", desc: "Jumlah pods sedikit atau ukuran buah mengecil." },
          { key: "kurang_subur", icon: "⚠️", label: "Kurang Subur", desc: "Tanaman kusam, tajuk tipis, kurang bergairah." },
          { key: "unknown", icon: "❓", label: "Tidak Yakin / Tidak Tahu", desc: "Gunakan panduan kondisi umum." }
        ];

        return `
          <h2 class="question-title">3. Bagaimana kondisi tanaman kakao Anda saat ini?</h2>
          <p class="question-hint">Pilih pengamatan visual utama di kebun Anda:</p>
          <div class="options-grid">
            ${healthOptions.map(opt => `
              <div class="option-card ${data.plantHealth === opt.key ? 'selected' : ''}" onclick="App.updateForm('plantHealth', '${opt.key}')">
                <div class="option-icon">${opt.icon}</div>
                <div class="option-content">
                  <div class="option-label">${opt.label}</div>
                  <div class="option-subtext">${opt.desc}</div>
                </div>
              </div>
            `).join("")}
          </div>
          <div class="alert-box info">
            💡 <em>Catatan Agronomi:</em> Gejala tanaman dapat disebabkan oleh beberapa faktor. Untuk mengetahui kekurangan unsur hara secara pasti, disarankan melakukan uji tanah atau analisis daun di laboratorium.
          </div>
        `;

      case 4: // Kondisi Tanah & pH
        const soilOptions = [
          { key: "lembap", label: "Tanah Cukup Lembap", desc: "Kondisi ideal, tidak terlalu basah/kering." },
          { key: "subur", label: "Tanah Terlihat Subur", desc: "Warna gelap, kaya gembur humus." },
          { key: "kurang_subur", label: "Tanah Kurang Subur", desc: "Tanah keras, padat, atau memerah." },
          { key: "sangat_kering", label: "Tanah Sangat Kering", desc: "Tanah retak-retak, kekurangan air." },
          { key: "tergenang", label: "Tanah Sering Tergenang", desc: "Air menggenangi perakaran kakao." },
          { key: "unknown", label: "Saya Tidak Tahu", desc: "Gunakan perkiraan tanah standar." }
        ];

        return `
          <h2 class="question-title">4. Bagaimana kondisi tanah di kebun Anda?</h2>
          <p class="question-hint">Kondisi kelembapan dan kesuburan tanah mempengaruhi daya serap pupuk:</p>
          <div class="options-grid" style="margin-bottom: 1.5rem;">
            ${soilOptions.map(opt => `
              <div class="option-card ${data.soilCondition === opt.key ? 'selected' : ''}" onclick="App.updateForm('soilCondition', '${opt.key}')">
                <div class="option-content">
                  <div class="option-label">${opt.label}</div>
                  <div class="option-subtext">${opt.desc}</div>
                </div>
              </div>
            `).join("")}
          </div>

          <div style="background: var(--color-surface-hover); padding: 1.25rem; border-radius: var(--radius-lg); border: 1px solid var(--color-border);">
            <label class="form-label">Apakah Anda mengetahui pH (keasaman) tanah?</label>
            <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
              <button class="btn btn-sm ${data.knowsPH ? 'btn-forest' : 'btn-outline'}" onclick="App.updateForm('knowsPH', true)">
                Ya, Saya Tahu
              </button>
              <button class="btn btn-sm ${!data.knowsPH ? 'btn-forest' : 'btn-outline'}" onclick="App.updateForm('knowsPH', false)">
                Tidak Tahu
              </button>
            </div>

            ${data.knowsPH ? `
              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label">Masukkan Angka pH Tanah (Contoh: 6.2):</label>
                <input type="number" step="0.1" min="3" max="9" class="form-control" placeholder="Contoh: 6.0" value="${data.phValue || ''}" onchange="App.updateForm('phValue', this.value)" />
                <p style="font-size: 0.8rem; color: var(--color-text-muted); margin-top: 0.4rem;">
                  ℹ️ <em>Penjelasan pH:</em> pH < 6.0 = Masam | pH 6.0–7.0 = Optimal | pH > 7.0 = Basa.
                </p>
              </div>
            ` : ''}
          </div>
        `;

      case 5: // Kondisi Hujan & Cuaca
        const weatherOptions = [
          { key: "lembap", icon: "💧", label: "Tanah Cukup Lembap", desc: "Tidak hujan deras & tanah cukup basah." },
          { key: "hujan_ringan", icon: "🌧️", label: "Hujan Ringan / Gerimis", desc: "Membantu melarutkan pupuk secara lembut." },
          { key: "hujan_sedang", icon: "🌧️", label: "Hujan Sedang", desc: "Hujan merata dengan intensitas normal." },
          { key: "hujan_deras", icon: "⛈️", label: "Hujan Deras / Lebat", desc: "Risiko pupuk hanyut tercuci tinggi." },
          { key: "sangat_kering", icon: "☀️", label: "Sedang Kering / Kemarau", desc: "Tanah kering tanpa cukup air." },
          { key: "genangan", icon: "🌊", label: "Ada Genangan Air", desc: "Air menggenangi piringan pohon kakao." }
        ];

        return `
          <h2 class="question-title">5. Bagaimana kondisi cuaca di kebun saat ini?</h2>
          <p class="question-hint">Kondisi cuaca sangat menentukan apakah pemupukan aman dilakukan atau harus ditunda:</p>
          <div class="options-grid">
            ${weatherOptions.map(opt => `
              <div class="option-card ${data.weatherCondition === opt.key ? 'selected' : ''}" onclick="App.updateForm('weatherCondition', '${opt.key}')">
                <div class="option-icon">${opt.icon}</div>
                <div class="option-content">
                  <div class="option-label">${opt.label}</div>
                  <div class="option-subtext">${opt.desc}</div>
                </div>
              </div>
            `).join("")}
          </div>
        `;

      case 6: // Pupuk Yang Dimiliki
        const ferts = this.state.db.fertilizers;
        const selected = data.selectedFertilizers || [];

        return `
          <h2 class="question-title">6. Pupuk apa saja yang tersedia di kebun Anda?</h2>
          <p class="question-hint">Pilih semua pupuk yang Anda miliki saat ini (Bisa memilih lebih dari satu):</p>
          <div class="options-grid">
            ${ferts.map(f => {
              const isChecked = selected.includes(f.id);
              return `
                <div class="option-card ${isChecked ? 'selected' : ''}" onclick="App.toggleFertilizer('${f.id}')">
                  <div class="option-content">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.3rem;">
                      <div class="option-label">${f.name}</div>
                      <input type="checkbox" ${isChecked ? 'checked' : ''} style="width: 18px; height: 18px;" onclick="event.stopPropagation(); App.toggleFertilizer('${f.id}')" />
                    </div>
                    <div class="option-subtext">N: ${f.n}% | P: ${f.p}% | K: ${f.k}%</div>
                    <span class="option-badge">${f.category}</span>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        `;

      case 7: // Hasil Uji Tanah/Daun (Opsional)
        return `
          <h2 class="question-title">7. Apakah Anda memiliki hasil uji laboratorium (tanah / daun)?</h2>
          <p class="question-hint">Fitur ini opsional. Jika tidak ada, tekan "Tidak / Lewati" untuk menggunakan rekomendasi standar:</p>

          <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem;">
            <button class="btn ${data.hasSoilTest ? 'btn-forest' : 'btn-outline'}" onclick="App.updateForm('hasSoilTest', true)">
              Ya, Memiliki Hasil Uji
            </button>
            <button class="btn ${!data.hasSoilTest ? 'btn-forest' : 'btn-outline'}" onclick="App.updateForm('hasSoilTest', false)">
              Tidak / Lewati Fitur Ini
            </button>
          </div>

          ${data.hasSoilTest ? `
            <div style="background: var(--color-surface-hover); padding: 1.5rem; border-radius: var(--radius-lg); border: 1px solid var(--color-border);">
              <h4 style="margin-bottom: 1rem; color: var(--color-primary);">Masukkan Nilai Hasil Tes (Opsional):</h4>
              <div class="options-grid" style="grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 0;">
                <div class="form-group">
                  <label class="form-label">Kandungan N (% atau ppm):</label>
                  <input type="text" class="form-control" placeholder="Contoh: 0.15" value="${data.soilTestDetails.nVal || ''}" onchange="App.updateSoilTest('nVal', this.value)" />
                </div>
                <div class="form-group">
                  <label class="form-label">Kandungan P (ppm):</label>
                  <input type="text" class="form-control" placeholder="Contoh: 12" value="${data.soilTestDetails.pVal || ''}" onchange="App.updateSoilTest('pVal', this.value)" />
                </div>
                <div class="form-group">
                  <label class="form-label">Kandungan K (me/100g):</label>
                  <input type="text" class="form-control" placeholder="Contoh: 0.4" value="${data.soilTestDetails.kVal || ''}" onchange="App.updateSoilTest('kVal', this.value)" />
                </div>
                <div class="form-group">
                  <label class="form-label">pH Tanah Lab:</label>
                  <input type="text" class="form-control" placeholder="Contoh: 6.2" value="${data.soilTestDetails.phVal || ''}" onchange="App.updateSoilTest('phVal', this.value)" />
                </div>
              </div>
            </div>
          ` : `
            <div class="alert-box success">
              ✅ Rekomendasi akan tetap dihitung secara akurat menggunakan data dasar kebun & pedoman teknis Puslitkoka Indonesia.
            </div>
          `}
        `;

      default:
        return `<p>Pertanyaan tidak ditemukan.</p>`;
    }
  },

  updateForm(key, value) {
    this.state.formData[key] = value;
    this.render();
  },

  updateSoilTest(key, value) {
    if (!this.state.formData.soilTestDetails) this.state.formData.soilTestDetails = {};
    this.state.formData.soilTestDetails[key] = value;
  },

  toggleFertilizer(id) {
    let list = this.state.formData.selectedFertilizers || [];
    if (list.includes(id)) {
      list = list.filter(item => item !== id);
    } else {
      list.push(id);
    }
    this.state.formData.selectedFertilizers = list;
    this.render();
  },

  prevStep() {
    if (this.state.wizardStep > 1) {
      this.state.wizardStep--;
      window.scrollTo({ top: 0, behavior: "smooth" });
      this.render();
    }
  },

  nextStep() {
    if (this.state.wizardStep < this.state.totalSteps) {
      this.state.wizardStep++;
      window.scrollTo({ top: 0, behavior: "smooth" });
      this.render();
    }
  },

  // --- 3. REKOMENDASI RESULTS VIEW ---
  renderResultView() {
    const res = this.state.currentResult;
    if (!res) return `<div class="alert-box warning">Belum ada data hasil pemupukan.</div>`;

    const v = res.weatherVerdict;
    const isAllow = v.status === "allow";

    return `
      <!-- Result Header Summary -->
      <div class="result-header-card">
        <div class="result-title-bar">
          <div>
            <h1 style="font-size: 1.75rem; color: var(--color-primary);">HASIL CEK PEMUPUKAN KAKAO</h1>
            <p style="font-size: 0.9rem; color: var(--color-text-muted);">
              Estimasi berbasis data kebun & standar Pusat Penelitian Kopi dan Kakao Indonesia (Puslitkoka).
            </p>
          </div>
          <div style="display: flex; gap: 0.5rem;" class="no-print">
            <button class="btn btn-forest btn-sm" onclick="App.saveCurrentResultToHistory()">
              💾 Simpan ke Riwayat
            </button>
            <button class="btn btn-outline btn-sm" onclick="window.print()">
              🖨️ Cetak / Simpan PDF
            </button>
            <button class="btn btn-secondary btn-sm" onclick="App.startWizard()">
              🔄 Cek Ulang
            </button>
          </div>
        </div>

        <div class="summary-pills">
          <div class="summary-pill">
            <div class="summary-pill-label">Luas & Jumlah Pohon</div>
            <div class="summary-pill-val">${res.farmDetails.areaHa} Ha (${res.farmDetails.treeCount.toLocaleString('id-ID')} Pohon)</div>
          </div>
          <div class="summary-pill">
            <div class="summary-pill-label">Umur Tanaman</div>
            <div class="summary-pill-val">${res.farmDetails.categoryName}</div>
          </div>
          <div class="summary-pill">
            <div class="summary-pill-label">Kondisi Pohon</div>
            <div class="summary-pill-val">${res.plantCondition.priorityNutrient}</div>
          </div>
          <div class="summary-pill">
            <div class="summary-pill-label">Kondisi Cuaca</div>
            <div class="summary-pill-val">${v.badgeText}</div>
          </div>
        </div>
      </div>

      <!-- 1. Banner Keputusan Waktu Pemupukan -->
      <div class="verdict-card ${v.status}">
        <div class="verdict-icon">${isAllow ? '✅' : '⏳'}</div>
        <div>
          <div class="verdict-title">${v.title} (${v.badgeText})</div>
          <div class="verdict-desc">${v.reason}</div>
        </div>
      </div>

      <!-- 2. Kartu Utama Rekomendasi Pemupukan -->
      ${res.fertilizers.map(fRec => `
        <div class="recom-big-card">
          <div class="recom-big-title">
            <span>🌱</span> REKOMENDASI PEMUPUKAN UTAMA
          </div>
          <div class="recom-fert-name">${fRec.fertilizer.name}</div>
          
          <div class="recom-metrics-grid">
            <div class="metric-box">
              <div class="metric-label">DOSIS PER POHON (PER APLIKASI)</div>
              <div class="metric-value">${fRec.doseGramPerTree} gram</div>
              <div class="metric-sub">atau ${fRec.doseKgPerTree} kg / pohon</div>
            </div>

            <div class="metric-box">
              <div class="metric-label">TOTAL PER APLIKASI KEBUN</div>
              <div class="metric-value">${fRec.totalKgPerApplication.toLocaleString('id-ID')} kg</div>
              <div class="metric-sub">Frekuensi: ${fRec.freqPerYear}x aplikasi / tahun</div>
            </div>

            <div class="metric-box">
              <div class="metric-label">TOTAL KEBUTUHAN PER TAHUN</div>
              <div class="metric-value">${fRec.totalKgPerYear.toLocaleString('id-ID')} kg</div>
              <div class="metric-sub">Untuk seluruh kebun (${res.farmDetails.areaHa} Ha)</div>
            </div>
          </div>

          <!-- Highlight Jumlah Karung -->
          <div class="bag-highlight">
            <div>
              📦 Perkiraan Jumlah Karung Pupuk (Ukuran 50 kg):
              <div style="font-size: 0.85rem; font-weight: 400; opacity: 0.9;">
                Penghitungan: ${fRec.totalKgPerApplication.toLocaleString('id-ID')} kg ÷ 50 kg per karung
              </div>
            </div>
            <div class="bag-badge">${fRec.totalBagsPerApplication} KARUNG</div>
          </div>
        </div>
      `).join("")}

      <!-- Kartu Pupuk Organik Tambahan -->
      <div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-xl); padding: 1.5rem; margin-bottom: 2rem;">
        <h3 style="color: var(--color-secondary); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
          🍂 Rekomendasi Pupuk Organik / Kompos Kulit Kakao
        </h3>
        <p style="font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: 1rem;">
          Diberikan 1x dalam setahun pada awal musim hujan untuk memperbaiki humus dan struktur tanah:
        </p>
        <div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
          <div>
            <strong>Dosis per Pohon:</strong> ${res.dosageSummary.organicKgPerTree} kg / pohon / tahun
          </div>
          <div>
            <strong>Total Kebun:</strong> ${res.dosageSummary.totalOrganicKg.toLocaleString('id-ID')} kg (${res.dosageSummary.totalOrganicBags} karung @ 50kg)
          </div>
        </div>
      </div>

      <!-- 3. Unsur Hara Yang Perlu Diperhatikan -->
      <div style="margin-bottom: 2rem;">
        <h2 style="font-size: 1.35rem; color: var(--color-primary); margin-bottom: 1rem;">
          🔍 Unsur Hara Yang Perlu Diperhatikan
        </h2>
        <div class="nutrient-cards">
          <div class="nutrient-card n-card">
            <div class="nutrient-header">
              <span class="nutrient-symbol">🟢 Nitrogen (N)</span>
            </div>
            <p style="font-size: 0.9rem; color: var(--color-text-muted);">
              Mendukung pertumbuhan daun hijau segar, tunas baru, dan kerangka batang kakao.
            </p>
          </div>

          <div class="nutrient-card p-card">
            <div class="nutrient-header">
              <span class="nutrient-symbol">🟡 Fosfor (P)</span>
            </div>
            <p style="font-size: 0.9rem; color: var(--color-text-muted);">
              Mendukung perakaran kuat dan pembentukan pentil bunga kakao yang sehat.
            </p>
          </div>

          <div class="nutrient-card k-card">
            <div class="nutrient-header">
              <span class="nutrient-symbol">🔵 Kalium (K)</span>
            </div>
            <p style="font-size: 0.9rem; color: var(--color-text-muted);">
              Mendukung pembentukan, pembesaran, serta kepadatan isi biji buah kakao.
            </p>
          </div>
        </div>
      </div>

      <!-- 4. Panduan Visual Cara Pemupukan Ring Placement -->
      <div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-xl); padding: 2rem; margin-bottom: 2rem;">
        <h2 style="font-size: 1.35rem; color: var(--color-primary); margin-bottom: 1rem;">
          📐 Cara Pemberian Pupuk (Ring Placement)
        </h2>
        
        <div class="guide-step-list">
          <div class="guide-step-item">
            <div class="guide-step-num">1</div>
            <div class="guide-step-text">Bersihkan piringan sekitar pohon kakao dari gulma dan rumput liar.</div>
          </div>
          <div class="guide-step-item">
            <div class="guide-step-num">2</div>
            <div class="guide-step-text">Jangan menaruh pupuk menempel langsung pada batang utama pohon.</div>
          </div>
          <div class="guide-step-item">
            <div class="guide-step-num">3</div>
            <div class="guide-step-text">Taburkan pupuk secara melingkar di area perakaran aktif (sekitar 1,5 hingga 2 meter dari batang, tepat di bawah tajuk daun terluar).</div>
          </div>
          <div class="guide-step-item">
            <div class="guide-step-num">4</div>
            <div class="guide-step-text">Pastikan tanah dalam kondisi lembap (tidak kering kerontang dan tidak banjir tergenang).</div>
          </div>
          <div class="guide-step-item">
            <div class="guide-step-num">5</div>
            <div class="guide-step-text">Tutup pupuk secara tipis dengan serasah daun atau tanah agar tidak menguap kena terik matahari.</div>
          </div>
        </div>

        <div class="ring-img-box">
          <img src="assets/ring-guide.jpg" alt="Diagram Pemupukan Melingkar Kakao" class="ring-img" />
        </div>
      </div>

      <!-- 5. Peringatan Keselamatan & Catatan Ilmiah -->
      <div class="alert-box warning" style="margin-bottom: 1.5rem;">
        <span class="alert-icon">⚠️</span>
        <div>
          <strong>Peringatan Keselamatan Pemupukan:</strong>
          <ul style="margin-left: 1.2rem; margin-top: 0.4rem;">
            <li>Gunakan sarung tangan saat memegang pupuk kimia.</li>
            <li>Jangan menyimpan pupuk bersebelahan dengan bahan makanan atau pakan ternak.</li>
            <li>Simpan sisa pupuk di tempat tertutup kering dan jauh dari jangkauan anak-anak.</li>
          </ul>
        </div>
      </div>

      <div style="background: var(--color-surface-hover); padding: 1.25rem; border-radius: var(--radius-lg); border: 1px solid var(--color-border); font-size: 0.85rem; color: var(--color-text-muted); text-align: justify;">
        <strong>🔬 Catatan Ilmiah & Disclaimer:</strong><br />
        Rekomendasi ini merupakan estimasi berdasarkan data kondisi kebun yang dimasukkan ke dalam aplikasi serta standar teknis Puslitkoka Indonesia. Kebutuhan pupuk aktual dapat berbeda berdasarkan varietas kakao, kemiringan lahan, curah hujan mikro, dan tingkat produktivitas. Apabila tersedia, gunakan hasil analisis laboratorium tanah atau daun untuk perhitungkan yang lebih presisi.
      </div>
    `;
  },

  // --- 4. RIWAYAT VIEW ---
  renderHistoryView() {
    const history = StorageManager.getHistory();

    return `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem;">
        <div>
          <h1 style="font-size: 1.75rem; color: var(--color-primary);">RIWAYAT PEMUPUKAN KAKAO</h1>
          <p style="font-size: 0.9rem; color: var(--color-text-muted);">Daftar rekomendasi pemupukan kebun yang pernah disimpan.</p>
        </div>
        <div>
          <button class="btn btn-primary btn-sm" onclick="App.startWizard()">+ Cek Pemupukan Baru</button>
        </div>
      </div>

      ${history.length === 0 ? `
        <div class="wizard-card" style="text-align: center; padding: 3rem 1.5rem;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">📂</div>
          <h3 style="color: var(--color-secondary); margin-bottom: 0.5rem;">Belum Ada Riwayat Tersimpan</h3>
          <p style="color: var(--color-text-muted); margin-bottom: 1.5rem;">Lakukan tes pemupukan kebun Anda untuk mulai menyimpan riwayat di sini.</p>
          <button class="btn btn-forest" onclick="App.startWizard()">Mulai Cek Pemupukan Sekarang</button>
        </div>
      ` : `
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${history.map(item => `
            <div class="card">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                <div>
                  <h3 style="font-size: 1.15rem; color: var(--color-primary);">${item.farmName}</h3>
                  <span style="font-size: 0.8rem; color: var(--color-text-muted);">${item.date}</span>
                </div>
                <button class="btn btn-outline btn-sm" style="color: var(--color-danger); border-color: var(--color-danger-bg);" onclick="App.deleteHistory('${item.id}')">
                  🗑️ Hapus
                </button>
              </div>

              <div style="display: flex; gap: 1.5rem; flex-wrap: wrap; font-size: 0.9rem; margin-bottom: 1rem;">
                <div><strong>Luas:</strong> ${item.result.farmDetails.areaHa} Ha</div>
                <div><strong>Pohon:</strong> ${item.result.farmDetails.treeCount} Pohon</div>
                <div><strong>Umur:</strong> ${item.result.farmDetails.categoryName}</div>
                <div><strong>Dosis/Pohon:</strong> ${item.result.dosageSummary.gramPerApplication} gram</div>
              </div>

              <button class="btn btn-secondary btn-sm" onclick="App.viewHistoryDetail('${item.id}')">
                👁️ Lihat Rekomendasi Lengkap
              </button>
            </div>
          `).join("")}
        </div>
      `}
    `;
  },

  deleteHistory(id) {
    if (confirm("Apakah Anda yakin ingin menghapus data riwayat ini?")) {
      StorageManager.deleteHistoryItem(id);
      this.render();
    }
  },

  viewHistoryDetail(id) {
    const history = StorageManager.getHistory();
    const target = history.find(h => h.id === id);
    if (target) {
      this.state.currentResult = target.result;
      this.state.currentView = "result";
      window.scrollTo({ top: 0, behavior: "smooth" });
      this.render();
    }
  },

  // --- 5. PANDUAN KNOWLEDGE BASE VIEW ---
  renderGuideView() {
    return `
      <div style="margin-bottom: 2rem;">
        <h1 style="font-size: 1.75rem; color: var(--color-primary);">PANDUAN PEMUPUKAN KAKAO</h1>
        <p style="font-size: 0.9rem; color: var(--color-text-muted);">
          Pengetahuan dasar agronomi pemupukan kakao yang ringkas dan mudah dipraktikkan.
        </p>
      </div>

      <div class="grid-cards">
        <div class="card">
          <div class="card-icon">📐</div>
          <h3 class="card-title">Metode Pemupukan Melingkar</h3>
          <p class="card-desc">Mengapa pupuk harus ditabur pada ring 1.5 - 2m dari batang? Karena akar halus penyerap nutrisi berada di sekitar proyeksi tajuk terluar.</p>
        </div>

        <div class="card">
          <div class="card-icon">🌧️</div>
          <h3 class="card-title">Jadwal Pemupukan Musim Hujan</h3>
          <p class="card-desc">Pemupukan kakao umumnya dilakukan 2 kali setahun: Aplikasi I pada awal musim hujan dan Aplikasi II pada akhir musim hujan.</p>
        </div>

        <div class="card">
          <div class="card-icon">🍂</div>
          <h3 class="card-title">Manfaat Kompos Kulit Kakao</h3>
          <p class="card-desc">Kulit buah kakao bekas panen yang dikomposkan mengandung Kalium organik yang sangat tinggi untuk dikembalikan ke tanah.</p>
        </div>
      </div>

      <div style="background: var(--color-surface); padding: 2rem; border-radius: var(--radius-xl); border: 1px solid var(--color-border);">
        <h2 style="color: var(--color-primary); margin-bottom: 1rem;">Langkah Pemeliharaan Kebun Sebelum Memupuk:</h2>
        <ol style="margin-left: 1.5rem; line-height: 1.8; color: var(--color-text-main);">
          <li><strong>Sanitasi Kebun:</strong> Bersihkan gulma dan sarang hama di sekitar piringan pohon.</li>
          <li><strong>Pemangkasan Tajuk:</strong> Pangkas cabang air (chupon) agar sinar matahari masuk ke dalam rimbun daun.</li>
          <li><strong>Pemeriksaan Kelembapan:</strong> Pastikan tanah tidak kering kerontang dan tidak banjir.</li>
        </ol>
      </div>
    `;
  },

  // --- 6. MODE PENYULUH / ADMIN VIEW ---
  renderAdminView() {
    const db = this.state.db;

    return `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h1 style="font-size: 1.75rem; color: var(--color-secondary);">PANEL PENYULUH / ADMIN</h1>
          <p style="font-size: 0.9rem; color: var(--color-text-muted);">
            Kelola parameter database pupuk, persentase NPK, matriks dosis standar Puslitkoka, dan riwayat.
          </p>
        </div>
        <button class="btn btn-outline btn-sm" onclick="App.resetAdminDB()">
          🔄 Reset Database ke Standar Puslitkoka
        </button>
      </div>

      <div class="wizard-card">
        <h3 style="color: var(--color-primary); margin-bottom: 1rem;">📋 Daftar Jenis Pupuk Terdaftar:</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>Nama Pupuk</th>
              <th>Kategori</th>
              <th>N (%)</th>
              <th>P (% P₂O₅)</th>
              <th>K (% K₂O)</th>
              <th>Penggunaan Info</th>
            </tr>
          </thead>
          <tbody>
            ${db.fertilizers.map(f => `
              <tr>
                <td><strong>${f.name}</strong></td>
                <td><span class="option-badge">${f.category}</span></td>
                <td>${f.n}%</td>
                <td>${f.p}%</td>
                <td>${f.k}%</td>
                <td style="font-size: 0.85rem;">${f.usageInfo}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <h3 style="color: var(--color-primary); margin-top: 2rem; margin-bottom: 1rem;">📊 Matriks Dosis Standar Per Pohon:</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>Kelompok Umur</th>
              <th>Golongan Kakao</th>
              <th>Dosis NPK Standar (Gram/Pohon/Thn)</th>
              <th>Frekuensi Aplikasi</th>
              <th>Kompos (Kg/Thn)</th>
            </tr>
          </thead>
          <tbody>
            ${Object.entries(db.baseDosageMatrix).map(([key, item]) => `
              <tr>
                <td><strong>${key} Tahun</strong></td>
                <td>${item.group}</td>
                <td>${item.baseDoseGramPerYear} g</td>
                <td>${item.freqPerYear}x / tahun</td>
                <td>${item.organicDoseKgPerYear} kg</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  },

  resetAdminDB() {
    if (confirm("Reset seluruh parameter database ke standar asli Puslitkoka?")) {
      this.state.db = StorageManager.resetDatabaseToDefault();
      alert("✅ Database berhasil direset!");
      this.render();
    }
  }
};

// Start application when DOM is ready
document.addEventListener("DOMContentLoaded", () => App.init());
