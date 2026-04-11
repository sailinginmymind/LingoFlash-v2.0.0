/**
 * LingoFlash 🎀 - i18n Manager
 * Mappatura completa basata su index.html e app.js
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

            // PROFILO
            profileRankLabel: "IL TUO RANGO",
            rankNovice: "Novizio 🌸",
            rankNext: "parole per APPRENDISTA 🎀",
            statsTotalWords: "Parole totali",
            statsAverageMastery: "Maestria media",
            statsLearned: "Parole imparate",
            profileFoldersTitle: "Le Mie Cartelle 🗒️",
            labelLearned: "parole apprese",
            labelCompleted: "COMPLETATO",

            // MESSAGGI (TOAST)
            toastLang: "Lingua UI: Italiano 🎀",
            toastSaveOk: "Parola salvata con successo! ✨",
            toastFolderCreated: "Cartella creata! 📂",
            toastSelectFolder: "Seleziona una cartella prima! ⚠️"
        },
        'en': {
            // NAVBAR
            studio: "🎯 Study",
            gestisci: "📝 Manage",
            profilo: "🌸 Profile",

            // STUDY PAGE (QUIZ)
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

            // MANAGE PAGE (SIDEBAR)
            titleFolders: "My Folders 📂",
            btnNewFolder: "+ New Folder",
            placeholderFolderName: "Folder name...",
            btnCreate: "Create",
            btnCancel: "Cancel",
            btnExport: "📤 Export",
            btnImport: "📥 Import",

            // MANAGE PAGE (INPUT)
            titleAddWord: "Add Word",
            placeholderOriginal: "Original word...",
            placeholderTranslation: "Auto translation...",
            placeholderPronNote: "Pronunciation/Notes",
            btnSave: "Save to folder",

            // TABLE
            titleTable: "Words in:",
            labelWordsIn: "Words in:",
            thOriginal: "Original",
            thTranslation: "Translation",
            thPron: "Pronunciation",
            thAction: "Action",
            
            // PROFILE 
            profileRankLabel: "YOUR RANK",
            rankNovice: "Novice 🌸",
            rankNext: "words to APPRENTICE 🎀",
            statsTotalWords: "Total words",
            statsAverageMastery: "Average mastery",
            statsLearned: "Words learned",
            profileFoldersTitle: "My Folders 🗒️",
            labelLearned: "words learned",
            labelCompleted: "COMPLETED",

            // MESSAGES (TOAST)
            toastLang: "UI Language: English 🎀",
            toastSaveOk: "Word saved successfully! ✨",
            toastFolderCreated: "Folder created! 📂",
            toastSelectFolder: "Please select a folder first! ⚠️"
        }
    },

    translateInterface(lang) {
        const t = this.strings[lang] || this.strings['it'];
        const isMobile = window.innerWidth < 600;
        const globalSelector = document.getElementById('current-flag-display');
            if (globalSelector && isMobile) {}
        // Navigazione
        document.querySelectorAll('.nav-btn').forEach(btn => {
            const target = btn.getAttribute('data-target');
            if (target === 'quiz-page') btn.innerText = t.studio;
            if (target === 'manage-page') btn.innerText = t.gestisci;
            if (target === 'profile-page') btn.innerText = t.profilo;
        });

        // Pagina Studio
        this._setText('#quiz-section h2', t.titlePractice, true);
        this._setText('.label', t.labelTranslate, true);
        this._setText('btn-generate', t.btnGenerate);
        this._setText('btn-show-answer', t.btnShowSolution);
        this._setText('.sol-item small', t.labelTraduzione, true); // Primo small
        this._setText('.srs-label', t.labelHowGo, true);
        this._setText('btn-srs-wrong', t.btnWrong);
        this._setText('btn-srs-correct', t.btnCorrect);
        this._setText('.quiz-folder-selector small', t.labelSelectedSet, true);
        
        // Se non c'è una parola attiva, traduciamo il placeholder del quiz
        const qDisplay = document.getElementById('word-to-translate');
        if (qDisplay && (qDisplay.innerText === "Premi \"Genera\"" || qDisplay.innerText === "Press \"Generate\"")) {
            qDisplay.innerText = t.placeholderPressGen;
        }

        // Sidebar
        this._setText('.sidebar h3', t.titleFolders, true);
        this._setText('btn-toggle-new-folder', t.btnNewFolder);
        this._setPlaceholder('new-folder-name', t.placeholderFolderName);
        this._setText('btn-add-folder', t.btnCreate);
        this._setText('btn-cancel-folder', t.btnCancel);
        this._setText('btn-export', t.btnExport);
        this._setText('btn-import-trigger', t.btnImport);

        // Aggiunta Parola
        this._setText('#input-section h2', t.titleAddWord, true);
        this._setPlaceholder('eng-word', t.placeholderOriginal);
        this._setPlaceholder('target-word', t.placeholderTranslation);
        this._setPlaceholder('pronunciation', t.placeholderPronNote);
        this._setText('btn-save', t.btnSave);

        // Tabella intestazioni
        this._setText('#list-section h2', t.titleTable, true);
        const ths = document.querySelectorAll('#words-table th');
        if (ths.length >= 4) {
            ths[0].innerText = t.thOriginal;
            ths[1].innerText = t.thTranslation;
            ths[2].innerText = t.thPron;
            ths[3].innerText = t.thAction;
        }

        // 🎀 6. PAGINA PROFILO (NUOVA PARTE)
        // Titolo Rango
        this._setText('.profile-header small', t.profileRankLabel, true);
        
        // Nome del Rango (es. Novizio)
        this._setText('.rank-name', t.rankNovice, true);
        
        // Info sotto la barra del rango
        this._setText('.next-rank-info', t.rankNext, true);

        // Statistiche centrali (Parole totali, Maestria, Imparate)
        // Usiamo un ciclo perché spesso queste etichette sono dentro div simili
        document.querySelectorAll('.stat-item p').forEach(p => {
            const text = p.innerText.toLowerCase();
            if (text.includes('parole totali') || text.includes('total words')) 
                p.innerText = t.statsTotalWords;
            if (text.includes('maestria media') || text.includes('average mastery')) 
                p.innerText = t.statsAverageMastery;
            if (text.includes('parole imparate') || text.includes('words learned')) 
                p.innerText = t.statsLearned;
        });

        // Titolo sezione cartelle nel profilo
        this._setText('#profile-page h2', t.profileFoldersTitle, true);
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