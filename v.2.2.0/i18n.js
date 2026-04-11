/**
 * LingoFlash 🎀 - i18n Manager
 */

const I18nManager = {
    strings: {
        'it': {
            // NAVBAR
            studio: "🎯 Studio",
            gestisci: "📝 Gestisci",
            profilo: "🌸 Profilo",

            // PAGINA STUDIO (QUIZ)
            titlePractice: "Esercitati",
            labelTranslate: "TRADUCI:",
            placeholderPressGen: "Premi \"Genera\"",
            btnGenerate: "GENERA NUOVA PAROLA",
            btnShowSolution: "👁️ Mostra Soluzione",
            labelTraduzione: "Traduzione",
            labelPronuncia: "Pronuncia",
            labelHowGo: "Come è andata?",
            btnWrong: "❌ Non la so!",
            btnCorrect: "✅ La so!",
            labelSelectedSet: "Set scelto: ",

            // PAGINA GESTISCI (SIDEBAR)
            titleFolders: "Le Mie Cartelle 📂",
            btnNewFolder: "+ Nuova Cartella",
            placeholderFolderName: "Nome cartella...",
            btnCreate: "Crea",
            btnCancel: "Annulla",
            btnExport: "📤 Export",
            btnImport: "📥 Import",

            // PAGINA GESTISCI (INPUT)
            titleAddWord: "Aggiungi Parola",
            placeholderOriginal: "Parola originale...",
            placeholderTranslation: "Traduzione automatica...",
            placeholderPronNote: "Pronuncia/Note",
            btnSave: "Salva nella cartella",

            // TABELLA
            titleTable: "Parole in:",
            labelWordsIn: "Parole di:",
            thOriginal: "Originale",
            thTranslation: "Traduzione",
            thPron: "Pronuncia",
            thAction: "Azione",

            // PROFILO (FISSO)
            profileRankLabel: "IL TUO RANGO",
            statsTotalWords: "Parole totali",
            statsAverageMastery: "Maestria media",
            statsLearned: "Parole imparate",
            profileFoldersTitle: "Le Mie Cartelle 🗒️",
            labelLearned: "parole apprese",
            labelCompleted: "COMPLETATO",
            btnReset: "Reset",
            btnStudyNow: "Studia Ora",
            labelRecord: "Record",
            labelAverage: "Media",
            labelTest: "Test",
            
            // RANGHI DINAMICI
            labelWordsTo: "parole per",
            rank_300: "Leggenda 🎖️",
            rank_200: "Sapiente 🔮",
            rank_150: "Maestro 👑",
            rank_100: "Esperto 🎓",
            rank_75:  "Avanzato ✨",
            rank_50:  "Esploratore 🗺️",
            rank_30:  "Studente 📖",
            rank_15:  "Apprendista 🎀",
            rank_5:   "Novizio 🌸",
            rank_0:   "Curioso 🌱",

            // MESSAGGI (TOAST)
            toastLang: "Lingua UI: Italiano 🎀",
            toastSaveOk: "Parola salvata con successo! ✨",
            toastFolderCreated: "Cartella creata! 📂",
            toastSelectFolder: "Seleziona una cartella prima! ⚠️",
            emptyFolderMsg: "Ogni grande viaggio inizia con una singola parola. Inizia a studiare! ✨"
        },
        'en': {
            // NAVBAR (Mantenuto)
            studio: "🎯 Study",
            gestisci: "📝 Manage",
            profilo: "🌸 Profile",
            titlePractice: "Practice",
            labelTranslate: "TRANSLATE:",
            placeholderPressGen: "Press \"Generate\"",
            btnGenerate: "GENERATE NEW WORD",
            btnShowSolution: "👁️ Show Solution",
            labelTraduzione: "Translation",
            labelPronuncia: "Pronunciation",
            labelHowGo: "How did it go?",
            btnWrong: "❌ I don't know",
            btnCorrect: "✅ I know it!",
            labelSelectedSet: "Set: ",
            titleFolders: "My Folders 📂",
            btnNewFolder: "+ New Folder",
            placeholderFolderName: "Folder name...",
            btnCreate: "Create",
            btnCancel: "Cancel",
            btnExport: "📤 Export",
            btnImport: "📥 Import",
            titleAddWord: "Add Word",
            placeholderOriginal: "Original word...",
            placeholderTranslation: "Auto translation...",
            placeholderPronNote: "Pronunciation/Notes",
            btnSave: "Save to folder",
            titleTable: "Words in:",
            labelWordsIn: "Words in:",
            thOriginal: "Original",
            thTranslation: "Translation",
            thPron: "Pronunciation",
            thAction: "Action",
            profileRankLabel: "YOUR RANK",
            statsTotalWords: "Total words",
            statsAverageMastery: "Average mastery",
            statsLearned: "Words learned",
            profileFoldersTitle: "My Folders 🗒️",
            labelLearned: "words learned",
            labelCompleted: "COMPLETED",
            btnReset: "Reset",
            btnStudyNow: "Study Now",
            labelRecord: "Record",
            labelAverage: "Average",
            labelTest: "Test",
            labelWordsTo: "words to",
            rank_300: "Legend 🎖️",
            rank_200: "Sage 🔮",
            rank_150: "Master 👑",
            rank_100: "Expert 🎓",
            rank_75:  "Advanced ✨",
            rank_50:  "Explorer 🗺️",
            rank_30:  "Student 📖",
            rank_15:  "Apprentice 🎀",
            rank_5:   "Novice 🌸",
            rank_0:   "Curious 🌱",
            toastLang: "UI Language: English 🎀",
            toastSaveOk: "Word saved successfully! ✨",
            toastFolderCreated: "Folder created! 📂",
            toastSelectFolder: "Please select a folder first! ⚠️",
            emptyFolderMsg: "Every great journey begins with a single word. Start studying! ✨"
        }
    },

    translateInterface(lang) {
        const t = this.strings[lang] || this.strings['it'];
        
        // --- 1. NAVIGAZIONE (Invariata) ---
        document.querySelectorAll('.nav-btn').forEach(btn => {
            const target = btn.getAttribute('data-target');
            if (target === 'quiz-page') btn.innerText = t.studio;
            if (target === 'manage-page') btn.innerText = t.gestisci;
            if (target === 'profile-page') btn.innerText = t.profilo;
        });

        // --- 2. PAGINA STUDIO (Invariata) ---
        this._setText('#quiz-section h2', t.titlePractice, true);
        this._setText('.label', t.labelTranslate, true);
        this._setText('btn-generate', t.btnGenerate);
        this._setText('btn-show-answer', t.btnShowSolution);
        this._setText('.srs-label', t.labelHowGo, true);
        this._setText('btn-srs-wrong', t.btnWrong);
        this._setText('btn-srs-correct', t.btnCorrect);
        this._setText('.quiz-folder-selector small', t.labelSelectedSet, true);
        
        const qDisplay = document.getElementById('word-to-translate');
        if (qDisplay && (qDisplay.innerText.includes("Genera") || qDisplay.innerText.includes("Generate"))) {
            qDisplay.innerText = t.placeholderPressGen;
        }

        // --- 3. SIDEBAR & INPUT (Invariata) ---
        this._setText('.sidebar h3', t.titleFolders, true);
        this._setText('btn-toggle-new-folder', t.btnNewFolder);
        this._setPlaceholder('new-folder-name', t.placeholderFolderName);
        this._setText('btn-add-folder', t.btnCreate);
        this._setText('btn-cancel-folder', t.btnCancel);
        this._setText('btn-export', t.btnExport);
        this._setText('btn-import-trigger', t.btnImport);
        this._setText('#input-section h2', t.titleAddWord, true);
        this._setPlaceholder('eng-word', t.placeholderOriginal);
        this._setPlaceholder('target-word', t.placeholderTranslation);
        this._setPlaceholder('pronunciation', t.placeholderPronNote);
        this._setText('btn-save', t.btnSave);

        // --- 4. TABELLA (Invariata) ---
        this._setText('#list-section h2', t.titleTable, true);
        const ths = document.querySelectorAll('#words-table th');
        if (ths.length >= 4) {
            ths[0].innerText = t.thOriginal;
            ths[1].innerText = t.thTranslation;
            ths[2].innerText = t.thPron;
            ths[3].innerText = t.thAction;
        }

        // --- 5. PAGINA PROFILO (LOGICA PULITA) ---
        // Testi fissi Dashboard
        this._setText('.i18n-rank-label', t.profileRankLabel, true);
        this._setText('.i18n-total-words', t.statsTotalWords, true);
        this._setText('.i18n-avg-mastery', t.statsAverageMastery, true);
        this._setText('.i18n-learned-words', t.statsLearned, true);
        this._setText('.i18n-profile-folders', t.profileFoldersTitle, true);

        // Traduzione Rango Principale (usando il data-rank che abbiamo messo nel ProfileManager)
        const rankNameEl = document.querySelector('.rank-name');
        if (rankNameEl) {
            const rankVal = rankNameEl.getAttribute('data-rank') || 0;
            rankNameEl.innerText = t[`rank_${rankVal}`] || t.rank_0;
        }

        // Traduzione Info Prossimo Rango (Sotto la barra rosa)
        const nextRankEl = document.querySelector('.next-rank-info');
        if (nextRankEl && typeof ProfileManager !== 'undefined') {
            const folders = StorageManager.getFolders();
            const global = ProfileManager.getGlobalStats(folders);
            if (global.nextRank) {
                const nextLabel = t[`rank_${global.nextRank.min}`];
                nextRankEl.innerText = `${global.totalLearned} / ${global.nextRank.min} ${t.labelWordsTo} ${nextLabel}`;
            } else {
                nextRankEl.innerText = lang === 'it' ? "Livello Massimo raggiunto! 🏆" : "Max Level Reached! 🏆";
            }
        }

        // --- 6. TRADUZIONE CARD CARTELLE (Pink Cards) ---
        // Qui usiamo le classi i18n che hai aggiunto nell'HTML del render
        document.querySelectorAll('.i18n-label-record').forEach(el => el.innerText = `🏆 ${t.labelRecord}`);
        document.querySelectorAll('.i18n-label-avg').forEach(el => el.innerText = `📊 ${t.labelAverage}`);
        document.querySelectorAll('.i18n-label-test').forEach(el => el.innerText = `🔥 ${t.labelTest}`);
        document.querySelectorAll('.i18n-label-learned-count').forEach(el => el.innerText = t.labelLearned);
        document.querySelectorAll('.i18n-btn-reset').forEach(el => el.innerText = `🔄 ${t.btnReset}`);
        document.querySelectorAll('.i18n-btn-study').forEach(el => el.innerText = `🎯 ${t.btnStudyNow}`);

        // Traduzione "% COMPLETATO"
        document.querySelectorAll('.progress-label').forEach(el => {
            const perc = el.innerText.split('%')[0].trim();
            el.innerText = `${perc}% ${t.labelCompleted}`;
        });
        // ✨ AGGIUNGI QUI: Cerca tutte le frasi motivazionali e aggiornale
        document.querySelectorAll('.i18n-empty-msg').forEach(el => {
            el.innerText = `"${t.emptyFolderMsg}"`;
        });
    },

    _setText(selector, text, isQuery = false) {
        const el = isQuery ? document.querySelector(selector) : document.getElementById(selector);
        if (el) el.innerText = text;
    },

    _setPlaceholder(id, text) {
        const el = document.getElementById(id);
        if (el) el.placeholder = text;
    }
};