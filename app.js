/**
 * LingoFlash 🎀 Hello Kitty Edition
 * Core Application Logic - Refactoring v2.5 (Multilingual Source Support)
 */

const App = {

    // ─── STATO APPLICAZIONE ──────────────────────────────────────────────────

    state: {
        cartellaAttiva:       null,   // Nome cartella corrente
        ultimaParolaQuiz:     null,   // Oggetto parola estratta per il quiz
        isSoluzioneMostrata:  false,  // Controllo spoiler
        debounceTimer:        null,
        quizDirection:        'en-to-target' 
    },

    // ─── CACHE ELEMENTI DOM ───────────────────────────────────────────────────

    ui: {},

    _cacheUI() {
        this.ui = {
            engInput:         document.getElementById('eng-word'),
            targetInput:      document.getElementById('target-word'),
            pronInput:        document.getElementById('pronunciation'),
            folderList:       document.getElementById('folder-list'),
            quizWord:         document.getElementById('word-to-translate'),
            answerArea:       document.getElementById('answer-area'),
            solutionContent:  document.getElementById('solution-content'),
            btnShow:          document.getElementById('btn-show-answer'),
            langSelect:       document.getElementById('target-lang'), // Lingua A
            sourceLangSelect: document.getElementById('source-lang'), // Lingua DA
            btnSpeak:         document.getElementById('btn-speak'),
            wordsListBody:    document.getElementById('words-list-body'),
            newFolderInput:   document.getElementById('new-folder-name'),
            resultTarget:     document.getElementById('result-target'),
            resultPron:       document.getElementById('result-pronunciation'),
            btnToggleNew:     document.getElementById('btn-toggle-new-folder'),
            newFolderArea:    document.getElementById('new-folder-input-area'),
            btnCancelFolder:  document.getElementById('btn-cancel-folder'),
            fileInput:        document.getElementById('file-import'),
            btnExport:        document.getElementById('btn-export'),
            btnImportTrigger: document.getElementById('btn-import-trigger'),
            folderDisplay:    document.getElementById('folder-selected-name'), 
            quizFolderSelect: document.getElementById('quiz-folder-select'),
            srsControl:       document.getElementById('srs-controls'),
            btnSrsWrong:      document.getElementById('btn-srs-wrong'),
            btnSrsCorrect:    document.getElementById('btn-srs-correct'),
            btnSave:          document.getElementById('btn-save'),
            btnGenerate:      document.getElementById('btn-generate'),
            btnSearchPron:    document.getElementById('btn-search-pron'),
            btnAddFolder:     document.getElementById('btn-add-folder'),
            btnToggleDirection: document.getElementById('btn-toggle-direction'), 
        };
    },

    // ─── BOOTSTRAP ────────────────────────────────────────────────────────────

    init() {
        this._cacheUI();
        this._bindEvents();
        this._setupKeyboardShortcuts();
        this.refreshFolders();
        this.updatePlaceholders(); // Sincronizza i testi iniziali
        console.log("🎀 LingoFlash Loaded — Modalità Poliglotta Attiva!");
    },

    // ─── BINDING EVENTI ───────────────────────────────────────────────────────

    _bindEvents() {
        // Sincronizzazione Placeholders su cambio lingua manuale
        if (this.ui.sourceLangSelect) this.ui.sourceLangSelect.onchange = () => this.updatePlaceholders();
        if (this.ui.langSelect) this.ui.langSelect.onchange = () => this.updatePlaceholders();

        // Navigazione Pagine
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
                if (targetId === 'profile-page') ProfileManager.render(StorageManager.getFolders());
            };
        });

        // Cambio Direzione Quiz con ANIMAZIONE PRESSIONE (Pigiato e Spigiato)
        this.ui.btnToggleDirection.onclick = () => {
            const btn = this.ui.btnToggleDirection;
            
            // 1. EFFETTO VISIVO "PIGIATO"
            btn.classList.add('btn-pressed');
            
            // 2. LOGICA DI CAMBIO
            const isEnToTarget = this.state.quizDirection === 'en-to-target';
            this.state.quizDirection = isEnToTarget ? 'target-to-en' : 'en-to-target';
            
            this.refreshFolders(); 
            this.toast(`Modalità: ${this.state.quizDirection === 'en-to-target' ? 'Diretta' : 'Inversa'} 🔄`);
            
            if (this.state.ultimaParolaQuiz) this.handleGenerateQuiz();

            // 3. EFFETTO VISIVO "SPIGIATO" (torna su dopo 150ms)
            setTimeout(() => {
                btn.classList.remove('btn-pressed');
            }, 150);
        };

        // SRS Bottoni
        if (this.ui.btnSrsCorrect) this.ui.btnSrsCorrect.onclick = () => this.handleSRS(true);
        if (this.ui.btnSrsWrong)   this.ui.btnSrsWrong.onclick = () => this.handleSRS(false);

        // Azioni Cartelle e Parole
        this.ui.btnAddFolder.onclick  = () => this.handleCreateFolder();
        this.ui.btnSave.onclick       = () => this.handleSaveWord();
        this.ui.btnGenerate.onclick   = () => this.handleGenerateQuiz();
        this.ui.btnSearchPron.onclick = () => this.handleQuickSearch();
        
        // Pannello Nuova Cartella
        this.ui.btnToggleNew.onclick = () => {
            this.ui.newFolderArea.classList.remove('hidden');
            this.ui.btnToggleNew.classList.add('hidden');
            this.ui.newFolderInput.focus();
        };

        this.ui.btnCancelFolder.onclick = () => {
            this.ui.newFolderArea.classList.add('hidden');
            this.ui.btnToggleNew.classList.remove('hidden');
            this.ui.newFolderInput.value = '';
        };

        // Backup
        this.ui.btnExport.onclick = () => this.handleExport();
        this.ui.btnImportTrigger.onclick = () => this.ui.fileInput.click();
        this.ui.fileInput.onchange = (e) => this.handleImport(e);
        
        // Quiz e Audio
        this.ui.btnShow.onclick = () => this.toggleSolution(true);
        
        if (this.ui.quizFolderSelect) {
            this.ui.quizFolderSelect.onchange = (e) => {
                this.state.cartellaAttiva = e.target.value;
                this.refreshFolders();
            };
        }

        if (this.ui.btnSpeak) {
            this.ui.btnSpeak.onclick = () => {
                const text = this.ui.resultTarget?.innerText || '';
                const folders = StorageManager.getFolders();
                const folder = folders[this.state.cartellaAttiva];
                const lang = this.state.quizDirection === 'en-to-target' ? (folder?.lang || 'en-US') : (folder?.sourceLang || 'it-IT');
                TranslationAPI.speak(text, lang);
            };
        }

        // AUTOCOMPLETE con Debounce
        this.ui.engInput.oninput = (e) => {
            if (e.isComposing) return;
            clearTimeout(this.state.debounceTimer);
            this.state.debounceTimer = setTimeout(() => this.handleAutocomplete(e.target.value), 500);
        };

        [this.ui.engInput, this.ui.targetInput, this.ui.pronInput].forEach(input => {
            input.onkeydown = (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.handleSaveWord();
                }
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

        // Aggiorna il titolo della sezione lista con il nome della cartella
        const listTitle = document.querySelector('#list-section h2');
        if (listTitle) {
            listTitle.innerText = `Parole di: ${this.state.cartellaAttiva} 📝`;
        }
        
        const currentFolder = folders[this.state.cartellaAttiva];
        const sourceLang = currentFolder.sourceLang || 'en';
        const targetLang = currentFolder.lang || 'zh-TW';

        const sourceFlag = TranslationAPI.getFlag(sourceLang);
        const targetFlag = TranslationAPI.getFlag(targetLang);

        // Aggiorna Bottoni UI
        this.ui.btnToggleDirection.innerText = this.state.quizDirection === 'en-to-target' 
            ? `${sourceFlag} ➔ ${targetFlag}` 
            : `${targetFlag} ➔ ${sourceFlag}`;

        if (this.ui.sourceLangSelect) this.ui.sourceLangSelect.value = sourceLang;
        if (this.ui.langSelect) this.ui.langSelect.value = targetLang;

        keys.forEach(name => {
            const folderData = folders[name];
            const isActive   = name === this.state.cartellaAttiva;
            const wordCount  = folderData.words ? folderData.words.length : 0;
            const flag       = TranslationAPI.getFlag(folderData.lang);

            const container = document.createElement('div');
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
                    if (fData.lang && this.ui.langSelect) this.ui.langSelect.value = fData.lang;
                }
                this.updatePlaceholders();
                this.refreshFolders();
            };

            container.querySelector('.edit-folder').onclick = (e) => {
                e.stopPropagation(); 
                const newName = prompt(`Rinomina "${name}" in:`, name);
                if (newName && newName.trim() !== "" && newName.trim() !== name) {
                    if (StorageManager.renameFolder(name, newName.trim())) {
                        if (this.state.cartellaAttiva === name) this.state.cartellaAttiva = newName.trim();
                        this.refreshFolders();
                        this.toast("Cartella rinominata! 🎀");
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
                <td>
                    <button class="btn-delete-word" title="Rimuovi parola" type="button">🗑️</button>
                </td>
            `;
            tr.querySelector('.btn-delete-word').onclick = () => this.handleDeleteWord(word.id);
            tbody.appendChild(tr);
        });
        this.enableSwipeToDelete();
    },

    // ─── CRUD ────────────────────────────────────────────────────────────────

    handleCreateFolder() {
        const nameInput = document.getElementById('new-folder-name');
        const name = nameInput.value.trim();
        const sourceLang = document.getElementById('source-lang').value;
        const targetLang = document.getElementById('target-lang').value;

        if (!name) {
            alert("Per favore, inserisci un nome per la cartella! 🎀");
            return;
        }

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
        this.toast("Cartella eliminata");
    },

    handleSaveWord() {
        const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
        const word = {
            eng:    capitalize(this.ui.engInput.value.trim()),
            target: capitalize(this.ui.targetInput.value.trim()),
            pron:   capitalize(this.ui.pronInput.value.trim())
        };

        if (!word.eng || !word.target) {
            this.toast("⚠️ Inserisci almeno la parola e la traduzione", 'warn');
            return;
        }

        if (StorageManager.saveWord(this.state.cartellaAttiva, word)) {
            this.ui.engInput.value = this.ui.targetInput.value = this.ui.pronInput.value = '';
            this.ui.engInput.focus();
            this.renderWordsList();
            this.refreshFolders();
            this.toast("✨ Parola salvata!");
        }
    },

    handleDeleteWord(wordId) {
        StorageManager.deleteWord(this.state.cartellaAttiva, wordId);
        this.toast("🗑️ Parola eliminata");
        this.renderWordsList();
        this.refreshFolders();
    },

    // ─── QUIZ ─────────────────────────────────────────────────────────────────

    handleGenerateQuiz() {
        const folders = StorageManager.getFolders();
        const folder  = folders[this.state.cartellaAttiva];
        const words   = folder?.words || [];

        if (words.length === 0) {
            this.toast("⚠️ Aggiungi parole prima di giocare!", 'warn');
            return;
        }

        let randomWord;
        if (words.length > 1 && this.state.ultimaParolaQuiz) {
            const filtered = words.filter(w => w.id !== this.state.ultimaParolaQuiz.id);
            randomWord = filtered[Math.floor(Math.random() * filtered.length)];
        } else {
            randomWord = words[Math.floor(Math.random() * words.length)];
        }
        this.state.ultimaParolaQuiz = randomWord;

        const isReverse = this.state.quizDirection === 'target-to-en';
        this.ui.quizWord.innerText = isReverse ? randomWord.target : randomWord.eng;
        this.ui.resultTarget.innerText = isReverse ? randomWord.eng : randomWord.target;
        this.ui.resultPron.innerText = randomWord.pron || '—';

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
            this.ui.btnShow.parentElement.classList.remove('hidden');
        }
    },

    handleSRS(isCorrect) {
        if (!this.state.ultimaParolaQuiz || !this.state.cartellaAttiva) return;
        const updatedWord = SRS.compute(this.state.ultimaParolaQuiz, isCorrect);
        const folders = StorageManager.getFolders();
        folders[this.state.cartellaAttiva].words = folders[this.state.cartellaAttiva].words.map(w => 
            w.id === updatedWord.id ? updatedWord : w
        );
        StorageManager._saveAll(folders);
        this.toast(isCorrect ? "Ottimo! Livello aumentato 🎀" : "Riproviamoci! ✍️");
        this.toggleSolution(false);
        setTimeout(() => this.handleGenerateQuiz(), 400);
    },

    // ─── LOGICA PLACEHOLDERS & AUTOCOMPLETE ────────────────────────────────

    updatePlaceholders() {
        const sourceLang = this.ui.sourceLangSelect.value;
        const targetLang = this.ui.langSelect.value;
        const sourceFlag = TranslationAPI.getFlag(sourceLang);
        const targetFlag = TranslationAPI.getFlag(targetLang);

        if (this.ui.engInput) {
            this.ui.engInput.placeholder = `Scrivi in ${sourceFlag}...`;
        }
        if (this.ui.targetInput) {
            this.ui.targetInput.placeholder = `Traduzione in ${targetFlag}...`;
        }
    },

    async handleAutocomplete(val) {
        if (!val || val.length < 2) return;
        const from = this.ui.sourceLangSelect.value;
        const to   = this.ui.langSelect.value;
        const translated = await TranslationAPI.translate(val, from, to);
        if (translated) this.ui.targetInput.value = translated;
    },

    // ─── UTILS ─────────────────────────────────────────────────────────────

    handleQuickSearch() {
        const word = this.ui.targetInput.value.trim() || this.ui.engInput.value.trim();
        const url = TranslationAPI.getSearchUrl(word, this.ui.langSelect.value);
        if (url) window.open(url, '_blank');
    },

    handleExport() { FileManager.exportJSON(StorageManager.getFolders()); this.toast("Backup scaricato!"); },

    async handleImport(event) {
        const file = event.target.files[0];
        if (!file) return;
        try {
            const importedData = await FileManager.importJSON(file);
            if (confirm("Unire i dati?")) {
                StorageManager._saveAll({ ...StorageManager.getFolders(), ...importedData });
                this.refreshFolders();
                this.toast("Dati importati!");
            }
        } catch (err) { this.toast("File non valido ❌", "warn"); }
    },

    _setupKeyboardShortcuts() {
        window.addEventListener('keydown', (e) => {
            if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;
            if (e.code === 'Space') { e.preventDefault(); this.handleGenerateQuiz(); }
            if (e.code === 'Enter' && !this.state.isSoluzioneMostrata) this.toggleSolution(true);
        });
    },

   enableSwipeToDelete() {
    // Applichiamo la logica solo su mobile
    if (window.innerWidth > 768) return;

    const rows = document.querySelectorAll('#words-list-body tr');
    rows.forEach(row => {
        let startX = 0;
        let currentDiff = 0;
        const tds = row.querySelectorAll('td');
        const wordId = row.getAttribute('data-id'); 

        row.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            row.classList.add('swiping');
            tds.forEach(td => td.style.transition = 'none');
        }, {passive: true});

        row.addEventListener('touchmove', (e) => {
            currentDiff = startX - e.touches[0].clientX;
            if (currentDiff > 0) {
                tds.forEach(td => {
                    td.style.transform = `translateX(-${Math.min(currentDiff, 120)}px)`;
                });
            }
        }, {passive: true});

        row.addEventListener('touchend', (e) => {
            row.classList.remove('swiping');
            const finalDiff = startX - e.changedTouches[0].clientX;

            if (finalDiff > 100) {
                tds.forEach(td => {
                    td.style.transition = 'transform 0.3s ease-out';
                    td.style.transform = 'translateX(-100%)';
                });
                setTimeout(() => {
                    if (wordId) {
                        this.handleDeleteWord(wordId);
                    }
                }, 250);
            } else {
                tds.forEach(td => {
                    td.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                    td.style.transform = 'translateX(0)';
                });
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

    _clearDisplay() { if (this.ui.folderDisplay) this.ui.folderDisplay.innerText = 'Crea una cartella'; },

    _escapeHTML(str) {
        return String(str).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m]));
    },

    toast(msg, type = 'info') {
        const t = document.createElement('div');
        t.className = 'lf-toast';
        t.innerText = msg;
        t.style.background = type === 'warn' ? '#ff9900' : '#ff4d6d';
        document.body.appendChild(t);
        requestAnimationFrame(() => t.classList.add('visible'));
        setTimeout(() => { t.classList.remove('visible'); setTimeout(() => t.remove(), 400); }, 2200);
    }
};

document.addEventListener('DOMContentLoaded', () => { window.app = App; App.init(); });