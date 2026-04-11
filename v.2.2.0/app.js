/**
 * LingoFlash 🎀 Hello Kitty Edition
 * Core Application Logic - Refactoring v2.5 (Multilingual Source Support)
 *
 * 🩷 Fix v2.5:
 *   1. Integrazione QuizManager — rimossa ogni logica sessione ridondante
 *   2. Fix Reset DOM — ricostruzione #quiz-display + _cacheUI() al riavvio
 *   3. Logica Direzione Quiz — en-to-target / target-to-en corretta
 *   4. Sync Audio (speak) — legge resultTarget con lingua corretta per direzione
 *   5. Mappatura UI — btnToggleSuggestions e tutti i nuovi bottoni in _cacheUI()
 *   6. UX setTimeout 300ms in handleSRS per feedback visivo
 */

const App = {

    // ─── STATO APPLICAZIONE ──────────────────────────────────────────────────

 state: {
        cartellaAttiva:      null,
        ultimaParolaQuiz:    null,
        isSoluzioneMostrata: false,
        debounceTimer:       null,
        quizDirection:       'en-to-target',
        showSuggestions:     true,
        sourceLanguage: localStorage.getItem('lingoflash_global_source') || 'it', 
    },

    // ─── CACHE ELEMENTI DOM ───────────────────────────────────────────────────
    // 🎀 FIX #5: btnToggleSuggestions e tutti i bottoni v2.5 mappati qui

    ui: {},

    _cacheUI() {
        this.ui = {
            engInput:              document.getElementById('eng-word'),
            targetInput:           document.getElementById('target-word'),
            pronInput:             document.getElementById('pronunciation'),
            folderList:            document.getElementById('folder-list'),
            wordsListBody:         document.getElementById('words-list-body'),
            folderDisplay:         document.getElementById('folder-selected-name'),
            newFolderInput:        document.getElementById('new-folder-name'),
            quizWord:              document.getElementById('word-to-translate'),
            answerArea:            document.getElementById('answer-area'),
            solutionContent:       document.getElementById('solution-content'),
            btnShow:               document.getElementById('btn-show-answer'),
            resultTarget:          document.getElementById('result-target'),
            resultPron:            document.getElementById('result-pronunciation'),
            srsControl:            document.getElementById('srs-controls'),
            btnSrsWrong:           document.getElementById('btn-srs-wrong'),
            btnSrsCorrect:         document.getElementById('btn-srs-correct'),
            langSelect:            document.getElementById('target-lang'),
            sourceLangSelect:      document.getElementById('source-lang'),
            quizFolderSelect:      document.getElementById('quiz-folder-select'),
            btnToggleDirection:    document.getElementById('btn-toggle-direction'),
            btnToggleSuggestions:  document.getElementById('btn-toggle-suggestions'),
            btnSpeak:              document.getElementById('btn-speak'),
            btnSave:               document.getElementById('btn-save'),
            btnGenerate:           document.getElementById('btn-generate'),
            btnSearchPron:         document.getElementById('btn-search-pron'),
            btnAddFolder:          document.getElementById('btn-add-folder'),
            btnToggleNew:          document.getElementById('btn-toggle-new-folder'),
            newFolderArea:         document.getElementById('new-folder-input-area'),
            btnCancelFolder:       document.getElementById('btn-cancel-folder'),
            fileInput:             document.getElementById('file-import'),
            btnExport:             document.getElementById('btn-export'),
            btnImportTrigger:      document.getElementById('btn-import-trigger'),
            globalSourceSelect:    document.getElementById('global-source-lang'),            
            modalSourceSelect:     document.getElementById('source-lang')
        };
    },

    // ─── BOOTSTRAP ────────────────────────────────────────────────────────────

    init() {
        this._cacheUI();
        this._bindEvents();
        this._setupKeyboardShortcuts();
        this.refreshFolders();
        this.updatePlaceholders();
        this.initSourceLangSelector();
        console.log('🎀 LingoFlash Loaded — Modalità Poliglotta Attiva!');
    },

  initSourceLangSelector() {
    const select = this.ui.globalSourceSelect;
    const flagDisplay = document.getElementById('current-flag-display');
    if (!select) return;

    select.innerHTML = '';
    Object.keys(TranslationAPI.languages).forEach(code => {
        const lang = TranslationAPI.languages[code];
        const opt = document.createElement('option');
        opt.value = code;
        opt.innerText = `${lang.flag} ${lang.label}`;
        if (code === this.state.sourceLanguage) {
            opt.selected = true;
            if (flagDisplay) flagDisplay.innerText = lang.flag;
        }
        select.appendChild(opt);
    });

    // 🎀 CORREZIONE 1: All'avvio
    I18nManager.translateInterface(this.state.sourceLanguage);

    select.onchange = (e) => {
        const selectedLang = e.target.value;
        this.state.sourceLanguage = selectedLang;
        localStorage.setItem('lingoflash_global_source', selectedLang);
        
        if (flagDisplay) {
            flagDisplay.innerText = TranslationAPI.languages[selectedLang].flag;
        }

        // 🎀 CORREZIONE 2: Al cambio lingua
        I18nManager.translateInterface(selectedLang);

        this.toast(I18nManager.strings[selectedLang]?.toastLang || `Lingua: ${selectedLang}`);
        this.updatePlaceholders();
        if (this.state.cartellaAttiva) this.refreshFolders();
    };
},

    // ─── BINDING EVENTI ───────────────────────────────────────────────────────

    _bindEvents() {
        if (this.ui.sourceLangSelect) this.ui.sourceLangSelect.onchange = () => this.updatePlaceholders();
        if (this.ui.langSelect)       this.ui.langSelect.onchange       = () => this.updatePlaceholders();

        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.onclick = () => {
                const targetId = btn.getAttribute('data-target');
                document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                document.querySelectorAll('.page-content').forEach(page => {
                    page.style.display = 'none';
                    page.classList.remove('active');
                });
                const targetPage = document.getElementById(targetId);
                if (targetPage) {
                    targetPage.style.display = 'block';
                    targetPage.classList.add('active');
                }
if (targetId === 'profile-page') {
    // 1. Prima genera i dati del profilo
    ProfileManager.render(StorageManager.getFolders());
    // 2. Poi traduci le scritte appena generate
    I18nManager.translateInterface(this.state.sourceLanguage);
}            };
        });

        if (this.ui.btnToggleDirection) {
            this.ui.btnToggleDirection.onclick = () => {
                const btn = this.ui.btnToggleDirection;
                btn.classList.add('btn-pressed');

                this.state.quizDirection = (this.state.quizDirection === 'en-to-target')
                    ? 'target-to-en'
                    : 'en-to-target';

                this.refreshFolders();
                this.toast(`Modalità: ${this.state.quizDirection === 'en-to-target' ? 'Diretta 🎀' : 'Inversa 🔄'}`);

                if (this.state.ultimaParolaQuiz) this.handleGenerateQuiz();

                setTimeout(() => btn.classList.remove('btn-pressed'), 150);
            };
        }

        if (this.ui.btnSrsCorrect) this.ui.btnSrsCorrect.onclick = () => this.handleSRS(true);
        if (this.ui.btnSrsWrong)   this.ui.btnSrsWrong.onclick   = () => this.handleSRS(false);

        if (this.ui.btnAddFolder)  this.ui.btnAddFolder.onclick  = () => this.handleCreateFolder();
        if (this.ui.btnSave)       this.ui.btnSave.onclick        = () => this.handleSaveWord();
        if (this.ui.btnGenerate)   this.ui.btnGenerate.onclick    = () => this.handleGenerateQuiz();
        if (this.ui.btnSearchPron) this.ui.btnSearchPron.onclick  = () => this.handleQuickSearch();

        if (this.ui.btnToggleNew) {
            this.ui.btnToggleNew.onclick = () => {
                this.ui.newFolderArea.classList.remove('hidden');
                this.ui.btnToggleNew.classList.add('hidden');
                this.ui.newFolderInput.focus();
            };
        }
        if (this.ui.btnCancelFolder) {
            this.ui.btnCancelFolder.onclick = () => {
                this.ui.newFolderArea.classList.add('hidden');
                this.ui.btnToggleNew.classList.remove('hidden');
                this.ui.newFolderInput.value = '';
            };
        }

        if (this.ui.btnExport)        this.ui.btnExport.onclick        = () => this.handleExport();
        if (this.ui.btnImportTrigger)  this.ui.btnImportTrigger.onclick = () => this.ui.fileInput.click();
        if (this.ui.fileInput)         this.ui.fileInput.onchange        = (e) => this.handleImport(e);

        if (this.ui.btnShow) this.ui.btnShow.onclick = () => this.toggleSolution(true);

        if (this.ui.quizFolderSelect) {
            this.ui.quizFolderSelect.onchange = (e) => {
                this.state.cartellaAttiva = e.target.value;
                this._resetQuizDisplay();
                this.refreshFolders();
            };
        }

        // 🎀 FIX #4: Lingua audio corretta in base alla direzione
        if (this.ui.btnSpeak) {
            this.ui.btnSpeak.onclick = () => {
                const text = this.ui.resultTarget?.innerText?.trim() || '';
                if (!text) return;
                const folders = StorageManager.getFolders();
                const folder  = folders[this.state.cartellaAttiva];
                // In modalità inversa (target→en) il testo mostrato è in lingua sorgente
                const lang = this.state.quizDirection === 'target-to-en'
                    ? (folder?.sourceLang || 'en-US')
                    : (folder?.lang       || 'en-US');
                TranslationAPI.speak(text, lang);
            };
        }

        // 🎀 FIX #5: Bottone Suggerimenti
        if (this.ui.btnToggleSuggestions) {
            this.ui.btnToggleSuggestions.onclick = () => {
                this.state.showSuggestions = !this.state.showSuggestions;
                const btn = this.ui.btnToggleSuggestions;
                if (this.state.showSuggestions) {
                    btn.classList.remove('off');
                    btn.innerText = 'Suggerimenti: ON ✨';
                    this.toast('Suggerimenti attivati 🌸');
                } else {
                    btn.classList.add('off');
                    btn.innerText = 'Suggerimenti: OFF ❌';
                    this.toast('Suggerimenti disattivati');
                }
            };
        }

        if (this.ui.engInput) {
            this.ui.engInput.oninput = (e) => {
                if (e.isComposing) return;
                clearTimeout(this.state.debounceTimer);
                this.state.debounceTimer = setTimeout(
                    () => this.handleAutocomplete(e.target.value), 500
                );
            };
        }

        [this.ui.engInput, this.ui.targetInput, this.ui.pronInput].forEach(input => {
            if (!input) return;
            input.onkeydown = (e) => {
                if (e.key === 'Enter') { e.preventDefault(); this.handleSaveWord(); }
            };
        });
    },

    // ─── RENDER CARTELLE ──────────────────────────────────────────────────────

    refreshFolders() {
        const folders = StorageManager.getFolders();
        const keys    = Object.keys(folders);
        this.ui.folderList.innerHTML = '';

        if (keys.length === 0) {
            this.ui.folderList.innerHTML = `<div class="empty-state">🎀 Crea la tua prima cartella!</div>`;
            this._toggleInterface(false);
            this._clearDisplay();
            return;
        }

        if (!this.state.cartellaAttiva || !folders[this.state.cartellaAttiva]) {
            this.state.cartellaAttiva = keys[0];
        }

        this._toggleInterface(true);
        this.ui.folderDisplay.innerText = this.state.cartellaAttiva;

        const listTitle = document.querySelector('#list-section h2');
        if (listTitle) {
        // Recupera il prefisso tradotto (es. "Parole di:" o "Words in:")
        const currentLang = this.state.sourceLanguage;
        const prefix = I18nManager.strings[currentLang]?.labelWordsIn || "Parole di:";
        
        // Costruisce il titolo mantenendo il nome della cartella dinamico
        listTitle.innerHTML = `${prefix} ${this._escapeHTML(this.state.cartellaAttiva)} 📝`;
    }

        const currentFolder = folders[this.state.cartellaAttiva];
        const sourceLang    = currentFolder.sourceLang || 'en';
        const targetLang    = currentFolder.lang       || 'zh-TW';
        const sourceFlag    = TranslationAPI.getFlag(sourceLang);
        const targetFlag    = TranslationAPI.getFlag(targetLang);

        if (this.ui.btnToggleDirection) {
            this.ui.btnToggleDirection.innerText = this.state.quizDirection === 'en-to-target'
                ? `${sourceFlag} ➔ ${targetFlag}`
                : `${targetFlag} ➔ ${sourceFlag}`;
        }

        if (this.ui.sourceLangSelect) this.ui.sourceLangSelect.value = sourceLang;
        if (this.ui.langSelect)       this.ui.langSelect.value       = targetLang;

        keys.forEach(name => {
            const folderData = folders[name];
            const isActive   = name === this.state.cartellaAttiva;
            const wordCount  = folderData.words ? folderData.words.length : 0;
            const flag       = TranslationAPI.getFlag(folderData.lang);

            const container  = document.createElement('div');
            container.className = `folder-item ${isActive ? 'active' : ''}`;
            container.setAttribute('data-flag', flag);

            container.innerHTML = `
                <button class="folder-btn" type="button">
                    <span class="folder-name">${this._escapeHTML(name)}</span>
                </button>
                <small class="word-count">${wordCount}</small>
                <div class="folder-actions">
                    <span class="edit-folder" title="Rinomina" role="button">✏️</span>
                    <span class="delete-folder" title="Elimina" role="button">🗑️</span>
                </div>
            `;

            container.querySelector('.folder-btn').onclick = () => {
                this.state.cartellaAttiva = name;
                const fData = folders[name];
                if (fData) {
                    if (fData.sourceLang && this.ui.sourceLangSelect) this.ui.sourceLangSelect.value = fData.sourceLang;
                    if (fData.lang       && this.ui.langSelect)       this.ui.langSelect.value       = fData.lang;
                }
                this.updatePlaceholders();
                this._resetQuizDisplay();
                this.refreshFolders();
            };

            container.querySelector('.edit-folder').onclick = (e) => {
                e.stopPropagation();
                const newName = prompt(`Rinomina "${name}" in:`, name);
                if (newName && newName.trim() !== '' && newName.trim() !== name) {
                    if (StorageManager.renameFolder(name, newName.trim())) {
                        if (this.state.cartellaAttiva === name) this.state.cartellaAttiva = newName.trim();
                        this.refreshFolders();
                        this.toast('Cartella rinominata! 🎀');
                    }
                }
            };

            container.querySelector('.delete-folder').onclick = (e) => {
                e.stopPropagation();
                this.handleDeleteFolder(name);
            };

            this.ui.folderList.appendChild(container);
        });

        if (this.ui.quizFolderSelect) {
            this.ui.quizFolderSelect.innerHTML = keys.map(name => {
                const f = folders[name];
                return `<option value="${name}" ${name === this.state.cartellaAttiva ? 'selected' : ''}>
                    ${TranslationAPI.getFlag(f.lang)} ${this._escapeHTML(name)}
                </option>`;
            }).join('');
        }

        this.renderWordsList();
    },

    // ─── RENDER LISTA PAROLE ──────────────────────────────────────────────────

    renderWordsList() {
        const tbody = this.ui.wordsListBody;
        if (!tbody) return;

        const folders = StorageManager.getFolders();
        const folder  = folders[this.state.cartellaAttiva];
        tbody.innerHTML = '';

        if (!folder || !Array.isArray(folder.words) || folder.words.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:20px; color:#bbb;">🎀 Nessuna parola ancora</td></tr>`;
            return;
        }

        folder.words.forEach(word => {
            const tr = document.createElement('tr');
            tr.setAttribute('data-id', word.id);
            tr.innerHTML = `
                <td><strong>${this._escapeHTML(word.eng)}</strong></td>
                <td>${this._escapeHTML(word.target)}</td>
                <td><small>${this._escapeHTML(word.pron || '—')}</small></td>
                <td><button class="btn-delete-word" title="Rimuovi parola" type="button">🗑️</button></td>
            `;
            tr.querySelector('.btn-delete-word').onclick = () => this.handleDeleteWord(word.id);
            tbody.appendChild(tr);
        });

        this.enableSwipeToDelete();
    },

    // ─── CRUD ─────────────────────────────────────────────────────────────────

    handleCreateFolder() {
        const nameInput  = document.getElementById('new-folder-name');
        const name       = nameInput.value.trim();
        const sourceLang = document.getElementById('source-lang').value;
        const targetLang = document.getElementById('target-lang').value;

        if (!name) { alert('Per favore, inserisci un nome per la cartella! 🎀'); return; }

        const success = StorageManager.createFolder(name, targetLang, sourceLang);
        if (success) {
            nameInput.value = '';
            this.state.cartellaAttiva = name;
            this.refreshFolders();
            document.getElementById('new-folder-input-area').classList.add('hidden');
        }
    },

    handleDeleteFolder(name) {
        if (!confirm(`Vuoi eliminare la cartella "${name}"?`)) return;
        StorageManager.deleteFolder(name);
        this.state.cartellaAttiva = null;
        this.refreshFolders();
        this.toast('Cartella eliminata');
    },

    handleSaveWord() {
        const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
        const word = {
            eng:    capitalize(this.ui.engInput.value.trim()),
            target: capitalize(this.ui.targetInput.value.trim()),
            pron:   capitalize(this.ui.pronInput.value.trim()),
        };

        if (!word.eng || !word.target) {
            this.toast('⚠️ Inserisci almeno la parola e la traduzione', 'warn');
            return;
        }

        if (StorageManager.saveWord(this.state.cartellaAttiva, word)) {
            this.ui.engInput.value = this.ui.targetInput.value = this.ui.pronInput.value = '';
            this.ui.engInput.focus();
            this.renderWordsList();
            this.refreshFolders();
            this.toast('✨ Parola salvata!');
        }
    },

    handleDeleteWord(wordId) {
        StorageManager.deleteWord(this.state.cartellaAttiva, wordId);
        this.toast('🗑️ Parola eliminata');
        this.renderWordsList();
        this.refreshFolders();
    },

    // ─── QUIZ ─────────────────────────────────────────────────────────────────
    // 🎀 FIX #1: Usa esclusivamente QuizManager — nessuna logica sessione locale

   handleGenerateQuiz() {
    const folders = StorageManager.getFolders();
    const folder  = folders[this.state.cartellaAttiva];

    if (!folder || !folder.words || folder.words.length === 0) {
        this.toast('⚠️ Aggiungi parole prima di giocare!', 'warn');
        return;
    }

    // Se il report è visibile, il tasto "Esercitati ancora" deve prima pulire tutto
    if (QuizManager.session.isTerminato) {
        this._resetQuizDisplay();
        return; 
    }

    // ✨ IL FIX: Se non ci sono parole viste, inizializza la sessione da zero
    // Questo evita che i punteggi si sommino a quelli delle sessioni precedenti
    if (QuizManager.session.paroleViste.length === 0) {
        QuizManager.startSession(folder.words);
    }

    const estratta = QuizManager.getQuestion(folder.words);

    if (estratta) {
        this.state.ultimaParolaQuiz = estratta;
        this.renderQuizWord();
    } else {
        this.mostraReportFinale();
    }
},

    // 🎀 FIX #3: Direzione quiz — campi corretti per en-to-target e target-to-en
    renderQuizWord() {
        const word = this.state.ultimaParolaQuiz;
        if (!word) return;

        const isReverse = this.state.quizDirection === 'target-to-en';

        // Domanda visibile — en-to-target: mostra eng | target-to-en: mostra target
        this.ui.quizWord.innerText = isReverse ? word.target : word.eng;

        // Risposta nascosta — en-to-target: risposta target | target-to-en: risposta eng
        this.ui.resultTarget.innerText = isReverse ? word.eng   : word.target;
        this.ui.resultPron.innerText   = word.pron || '—';

        this.ui.answerArea.classList.remove('hidden');
        this.toggleSolution(false);
    },

    toggleSolution(show) {
        this.state.isSoluzioneMostrata = show;
        if (show) {
            this.ui.solutionContent.classList.remove('hidden');
            this.ui.solutionContent.classList.add('reveal');
            this.ui.btnShow.parentElement.classList.add('hidden');
            this.ui.srsControl.classList.remove('hidden');
        } else {
            this.ui.solutionContent.classList.remove('reveal');
            this.ui.solutionContent.classList.add('hidden');
            if (this.ui.btnShow)   this.ui.btnShow.parentElement.classList.remove('hidden');
            if (this.ui.srsControl) this.ui.srsControl.classList.add('hidden');
        }
    },

    // 🎀 FIX #1 + #6: QuizManager.recordAnswer + setTimeout 300ms feedback visivo
    handleSRS(isCorrect) {
        if (!this.state.ultimaParolaQuiz) return;

    QuizManager.recordAnswer(isCorrect, this.state.ultimaParolaQuiz);
        // 1. Calcola i nuovi dati SRS
        const updatedWord = SRS.compute(this.state.ultimaParolaQuiz, isCorrect);

        // 2. Recupera tutte le cartelle
        const folders = StorageManager.getFolders();
        const currentFolderName = this.state.cartellaAttiva;
        const folder = folders[currentFolderName];

        if (folder && folder.words) {
            // 3. Trova l'indice della parola originale usando l'ID
            const index = folder.words.findIndex(w => w.id === updatedWord.id);

            if (index !== -1) {
                // 4. Sostituisci la parola esistente con quella aggiornata
                folder.words[index] = updatedWord;

                // 5. Salva l'intero stato delle cartelle (metodo privato dello Storage)
                StorageManager._saveAll(folders);
                
                // Opzionale: rinfresca la lista se sei nella sezione "Gestisci"
                this.renderWordsList();
            }
        }

        this.toast(isCorrect ? '✅ Bene! +1 🌸' : '❌ Ci riproveremo!', isCorrect ? 'info' : 'warn');
        this.toggleSolution(false);

        // Feedback visivo prima della prossima domanda
        setTimeout(() => this.handleGenerateQuiz(), 300);
    },

    // 🎀 FIX #2: Mostra report e offre riavvio pulito via _resetQuizDisplay()
mostraReportFinale() {
    // 1. DOBBIAMO DIRE AL MANAGER QUALE CARTELLA STIAMO USANDO
    const nomeDellaCartellaAttiva = this.state.cartellaAttiva; 

    // 2. PASSIAMO IL NOME DENTRO LE PARENTESI DI getReport
    const report = QuizManager.getReport(nomeDellaCartellaAttiva); 

    // --- Da qui in poi il tuo codice rimane uguale ---
    const sbagliate = QuizManager.session.paroleSbagliate;
    const display = document.getElementById('quiz-display');

    if (this.ui.answerArea) this.ui.answerArea.classList.add('hidden');
    if (this.ui.btnGenerate) this.ui.btnGenerate.innerText = "✨ Esercitati ancora";

    let listaSbagliateHTML = '';
    if (sbagliate.length > 0) {
        listaSbagliateHTML = `
            <div class="review-box" style="margin-top: 20px; text-align: left; background: #fff5f7; padding: 15px; border-radius: 15px; border: 1px dashed #ff4d6d;">
                <h3 style="color: #ff4d6d; font-size: 1.1rem; margin-bottom: 10px;">Da rivedere:</h3>
                <ul style="list-style: none; padding: 0; max-height: 150px; overflow-y: auto;">
                    ${sbagliate.map(w => `
                        <li>
                            <div class="review-item-main">
                                <b>${w.eng}</b>: ${w.target}
                            </div>
                            <div class="review-item-pron">
                                ${w.pron ? `[${w.pron}]` : ''}
                            </div>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    }

    display.innerHTML = `
        <div class="quiz-report" style="text-align:center; padding: 20px;">
            <h2 style="font-size: 1.8rem;">Sessione finita!</h2>
            <div style="font-size: 2.5rem; margin: 10px 0;">${report.percentuale}%</div>
            <p>Corrette: <b>${report.punti}</b> su <b>${report.totale}</b></p>
            ${listaSbagliateHTML}
        </div>`;
    
    // 3. (OPZIONALE) AGGIORNA SUBITO IL PROFILO
    if (typeof ProfileManager !== 'undefined') {
        ProfileManager.render(StorageManager.getFolders());
    }
},
    /**
     * 🎀 FIX #2 (CRITICO): Ripristina gli elementi DOM di #quiz-display dopo che
     * mostraReportFinale() li ha sovrascritti. Poi chiama _cacheUI() + _bindEvents()
     * per aggiornare tutti i riferimenti e riavvia la sessione da zero.
     */
   _resetQuizDisplay(autoStart = false) { // Aggiungiamo un parametro di default
    const display = document.getElementById('quiz-display');

    if (this.ui.btnGenerate) {
        this.ui.btnGenerate.innerText = "Genera Parola";
    }

    display.innerHTML = `
        <span class="label">TRADUCI:</span>
        <div id="word-to-translate" class="question-text">Premi "Genera"</div>`;

    this._cacheUI();
    this._bindEvents();

    QuizManager.session.isTerminato = false;
    QuizManager.session.paroleViste = [];
    QuizManager.session.punteggio = 0;
    QuizManager.session.totaleDomande = 0; 
    QuizManager.session.paroleSbagliate = []; // Resettiamo anche queste!
    this.state.ultimaParolaQuiz = null;

    if (this.ui.answerArea) this.ui.answerArea.classList.remove('hidden');

    // ✨ Avvia il quiz solo se lo richiediamo esplicitamente
    if (autoStart) {
        this.handleGenerateQuiz();
    }
},

    // ─── PLACEHOLDERS & AUTOCOMPLETE ──────────────────────────────────────────

    updatePlaceholders() {
        if (!this.ui.sourceLangSelect || !this.ui.langSelect) return;
        const sourceFlag = TranslationAPI.getFlag(this.ui.sourceLangSelect.value);
        const targetFlag = TranslationAPI.getFlag(this.ui.langSelect.value);
        if (this.ui.engInput)    this.ui.engInput.placeholder    = `Scrivi in ${sourceFlag}...`;
        if (this.ui.targetInput) this.ui.targetInput.placeholder = `Traduzione in ${targetFlag}...`;
    },

   async handleAutocomplete(val) {
        if (!val || val.length < 2 || !this.state.showSuggestions) return;
        
        // Usa la lingua globale scelta dal selettore "Mondo"
        const source = this.state.sourceLanguage; 
        const target = this.ui.langSelect.value;

        const translated = await TranslationAPI.translate(val, source, target);
        if (translated) this.ui.targetInput.value = translated;
    },

    // ─── UTILS ────────────────────────────────────────────────────────────────

    handleQuickSearch() {
        const word = this.ui.targetInput.value.trim() || this.ui.engInput.value.trim();
        const url  = TranslationAPI.getSearchUrl(word, this.ui.langSelect.value);
        if (url) window.open(url, '_blank');
    },

    handleExport() {
        FileManager.exportJSON(StorageManager.getFolders());
        this.toast('Backup scaricato! 📤');
    },

    async handleImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const result = await FileManager.importFile(file);
            let dataToMerge = {};

            if (result.type === 'cartridge') {
                const cartridge = result.content;
                dataToMerge[cartridge.cartridgeName] = {
                    lang: cartridge.lang, sourceLang: cartridge.sourceLang, words: cartridge.words,
                };
                this.toast(`Cartuccia "${cartridge.cartridgeName}" rilevata! 🎀`);
            } else {
                dataToMerge = result.content;
                this.toast('Backup completo rilevato! 📂');
            }

            if (confirm('Vuoi unire questi dati alla tua libreria attuale?')) {
                StorageManager._saveAll({ ...StorageManager.getFolders(), ...dataToMerge });
                this.refreshFolders();
                this.toast('Importazione completata! ✨');
            }
        } catch (err) {
            console.error('Errore importazione:', err);
            this.toast('File non valido o corrotto ❌', 'warn');
        } finally {
            event.target.value = '';
        }
    },

    _setupKeyboardShortcuts() {
        window.addEventListener('keydown', (e) => {
            if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;
            if (e.code === 'Space') { e.preventDefault(); this.handleGenerateQuiz(); }
            if (e.code === 'Enter' && !this.state.isSoluzioneMostrata) this.toggleSolution(true);
        });
    },

    enableSwipeToDelete() {
        if (window.innerWidth > 768) return;

        document.querySelectorAll('#words-list-body tr').forEach(row => {
            let startX = 0;
            const tds  = row.querySelectorAll('td');
            const wordId = row.getAttribute('data-id');

            row.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                row.classList.add('swiping');
                tds.forEach(td => td.style.transition = 'none');
            }, { passive: true });

            row.addEventListener('touchmove', (e) => {
                const diff = startX - e.touches[0].clientX;
                if (diff > 0) tds.forEach(td => { td.style.transform = `translateX(-${Math.min(diff, 120)}px)`; });
            }, { passive: true });

            row.addEventListener('touchend', (e) => {
                row.classList.remove('swiping');
                const finalDiff = startX - e.changedTouches[0].clientX;
                if (finalDiff > 100) {
                    tds.forEach(td => { td.style.transition = 'transform 0.3s ease-out'; td.style.transform = 'translateX(-100%)'; });
                    setTimeout(() => { if (wordId) this.handleDeleteWord(wordId); }, 250);
                } else {
                    tds.forEach(td => { td.style.transition = 'transform 0.3s cubic-bezier(0.4,0,0.2,1)'; td.style.transform = 'translateX(0)'; });
                }
            });
        });
    },

    _toggleInterface(enabled) {
        ['input-section', 'quiz-section', 'list-section'].forEach(id => {
            const el = document.getElementById(id);
            if (el) { el.style.opacity = enabled ? '1' : '0.5'; el.style.pointerEvents = enabled ? '' : 'none'; }
        });
    },

    _clearDisplay() {
        if (this.ui.folderDisplay) this.ui.folderDisplay.innerText = 'Crea una cartella';
    },

    _escapeHTML(str) {
        return String(str).replace(/[&<>"']/g, m => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]));
    },

    toast(msg, type = 'info') {
        const t = document.createElement('div');
        t.className = 'lf-toast';
        t.innerText = msg;
        t.style.background = type === 'warn' ? '#ff9900' : '#ff4d6d';
        document.body.appendChild(t);
        requestAnimationFrame(() => t.classList.add('visible'));
        setTimeout(() => { t.classList.remove('visible'); setTimeout(() => t.remove(), 400); }, 2200);
    },
};

document.addEventListener('DOMContentLoaded', () => { window.app = App; App.init(); });