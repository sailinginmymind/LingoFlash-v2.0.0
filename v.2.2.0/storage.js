/**
 * LingoFlash 🎀 - StorageManager
 * Gestione completa del localStorage con struttura dati v4.1 (Multilingual Source Support)
 */

const StorageManager = {
    DB_NAME: 'lingoflash_v4',

    /**
     * Dati iniziali di default con cartella esempio
     */
    getInitialData() {
        return {
            "Esempio 🇹🇼": {
                lang: "zh-TW",
                sourceLang: "en", // Lingua di partenza default
                words: [
                    { id: 1, eng: "Hello",       target: "你好",   pron: "Nǐ hǎo"     },
                    { id: 2, eng: "Pink",        target: "粉紅色", pron: "Fěnhóngsè"  }
                ]
            }
        };
    },

   /**
     * Restituisce tutte le cartelle dal localStorage.
     */
    getFolders() {
        const raw = localStorage.getItem(this.DB_NAME);
        let folders;

        if (!raw) {
            folders = this.getInitialData();
        } else {
            try {
                folders = JSON.parse(raw);
            } catch (e) {
                console.error("LingoFlash: errore parsing DB", e);
                folders = this.getInitialData();
            }
        }

        // --- INIEZIONE AUTOMATICA CARTUCCE VERIFICA ---
        if (!folders["📚 Verifica: Vocaboli"]) {
            folders["📚 Verifica: Vocaboli"] = {
                lang: "zh-TW",
                sourceLang: "en", // Default per queste cartelle fisse
                words: [
                    { id: "v1", eng: "Birthday", target: "生日", pron: "shēngrì" },
                    { id: "v2", eng: "Language", target: "語言", pron: "yǔyán" },
                    { id: "v3", eng: "Approximately", target: "左右", pron: "zuǒyòu" },
                    { id: "v4", eng: "Spain", target: "西班牙", pron: "xībānyá" },
                    { id: "v5", eng: "Gift / Present", target: "禮物", pron: "lǐwù" },
                    { id: "v6", eng: "Pork Knuckles", target: "豬腳", pron: "zhūjiǎo" },
                    { id: "v7", eng: "Egg", target: "蛋", pron: "dàn" },
                    { id: "v8", eng: "Cake", target: "蛋糕", pron: "dàngāo" },
                    { id: "v9", eng: "Spanish (lang)", target: "西班牙文", pron: "xībānyáwén" },
                    { id: "v10", eng: "Gate / Entrance", target: "門口", pron: "ménkǒu" },
                    { id: "v11", eng: "This Year", target: "今年", pron: "jīnnián" },
                    { id: "v12", eng: "Extra Fine Noodles", target: "麵線", pron: "miànxiàn" },
                    { id: "v13", eng: "Tradition / Customs", target: "傳統", pron: "chuántǒng" },
                    { id: "v14", eng: "Happy", target: "快樂", pron: "kuàilè" },
                    { id: "v15", eng: "With Enthusiasm", target: "熱心", pron: "rèxīn" },
                    { id: "v16", eng: "The Same / Alike", target: "一樣", pron: "yíyàng" },
                    { id: "v17", eng: "Young", target: "年輕", pron: "niánqīng" },
                    { id: "v18", eng: "A little / Some", target: "一點", pron: "yìdiǎn" },
                    { id: "v19", eng: "Old (vecchio)", target: "老", pron: "lǎo" },
                    { id: "v20", eng: "To come back", target: "回來", pron: "huílái" },
                    { id: "v21", eng: "To forget", target: "忘", pron: "wàngle" },
                    { id: "v22", eng: "To remember", target: "記得", pron: "jìde" },
                    { id: "v23", eng: "To exchange", target: "交換", pron: "jiāohuàn" },
                    { id: "v24", eng: "To celebrate", target: "過", pron: "guò" },
                    { id: "v25", eng: "To order", target: "訂", pron: "dìng" },
                    { id: "v26", eng: "To wish", target: "祝", pron: "zhù" },
                    { id: "v27", eng: "How come?", target: "怎麼", pron: "zěnme" },
                    { id: "v28", eng: "Certainly", target: "當然", pron: "dāngrán" },
                    { id: "v29", eng: "So (very)", target: "那麼", pron: "nàme" },
                    { id: "v30", eng: "To", target: "對", pron: "duì" }
                ]
            };
            
            folders["💬 Verifica: Frasi"] = {
                lang: "zh-TW",
                sourceLang: "en",
                words: [
                    { id: "f1", eng: "Happy Birthday", target: "生日快樂", pron: "shēngrì kuàilè" },
                    { id: "f2", eng: "This is s/he speaking", target: "我就是", pron: "wǒ jiù shì" },
                    { id: "f3", eng: "Long time no see", target: "好久不見", pron: "hǎojiǔ bújiàn" },
                    { id: "f4", eng: "No need for formalities", target: "不必客氣", pron: "búbì kèqì" },
                    { id: "f5", eng: "That's very kind of you", target: "太客氣", pron: "tài kèqì" },
                    { id: "f6", eng: "It's my pleasure", target: "哪裡,哪裡", pron: "nǎlǐ, nǎlǐ" },
                    { id: "f7", eng: "Most of / Mostly", target: "大部分", pron: "dà bùfèn" },
                    { id: "f8", eng: "Everything your way", target: "萬事如意", pron: "wànshì rúyì" },
                    { id: "f9", eng: "Wishes come true", target: "心想事成", pron: "xīnxiǎng shìchéng" }
                ]
            };
            
            this._saveAll(folders);
        }

        return folders;
    },

    /**
     * Crea una nuova cartella.
     * @param {string} name - Nome cartella
     * @param {string} lang - Lingua target (es. "zh-TW")
     * @param {string} sourceLang - Lingua di partenza (es. "it")
     */
    createFolder(name, lang, sourceLang = 'en') {
        if (!name || typeof name !== 'string') return false;
        const folders = this.getFolders();
        if (folders[name]) return false;

        folders[name] = { 
            lang: lang || 'zh-TW', 
            sourceLang: sourceLang, // salviamo la lingua di partenza
            words: [] 
        };
        
        this._saveAll(folders);
        return true;
    },

    deleteFolder(name) {
        const folders = this.getFolders();
        if (!folders[name]) return false;
        delete folders[name];
        this._saveAll(folders);
        return true;
    },

    renameFolder(oldName, newName) {
        if (!newName || oldName === newName) return false;
        const folders = this.getFolders();
        if (!folders[oldName] || folders[newName]) return false;
        folders[newName] = folders[oldName];
        delete folders[oldName];
        this._saveAll(folders);
        return true;
    },

    saveWord(folderName, wordObj) {
        if (!folderName || !wordObj || !wordObj.eng || !wordObj.target) return false;
        const folders = this.getFolders();
        if (!folders[folderName]) return false;

        if (!Array.isArray(folders[folderName].words)) {
            folders[folderName].words = [];
        }

        const newWord = {
            id: Date.now() + '_' + Math.random().toString(36).slice(2, 7),
            eng:    this._sanitize(wordObj.eng),
            target: this._sanitize(wordObj.target),
            pron:   this._sanitize(wordObj.pron || ''),
            // Inizializziamo i parametri SRS se il modulo SRS esiste
            level: 0,
            nextReview: Date.now()
        };

        folders[folderName].words.push(newWord);
        this._saveAll(folders);
        return true;
    },

    deleteWord(folderName, wordId) {
        const folders = this.getFolders();
        if (!folders[folderName] || !Array.isArray(folders[folderName].words)) return false;
        folders[folderName].words = folders[folderName].words.filter(w => w.id !== wordId);
        this._saveAll(folders);
        return true;
    },

    _saveAll(data) {
        try {
            localStorage.setItem(this.DB_NAME, JSON.stringify(data));
        } catch (e) {
            console.error("LingoFlash: errore salvataggio", e);
        }
    },

    _sanitize(str) {
        if (typeof str !== 'string') return '';
        return str.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').trim().slice(0, 500);
    },

    /**
     * Evoluzione Dati: Salva statistiche storiche per una cartella (Record, Media, Trend)
     * @param {string} folderName - Il nome della cartella (es. "📚 Verifica: Vocaboli")
     * @param {number} newScore - La percentuale ottenuta (0-100)
     */
    saveSessionStats(folderName, newScore) {
        const folders = this.getFolders();
        if (!folders[folderName]) return;

        // Se la cartella non ha l'oggetto stats, lo creiamo
        if (!folders[folderName].stats) {
            folders[folderName].stats = {
                bestScore: 0,
                history: [],
                totalAttempts: 0,
                averageScore: 0
            };
        }

        const stats = folders[folderName].stats;

        // 1. Aggiorna tentativi e Record
        stats.totalAttempts++;
        if (newScore > stats.bestScore) {
            stats.bestScore = newScore;
        }

        // 2. Aggiorna Cronologia (max 10 risultati per il trend)
        stats.history.push(newScore);
        if (stats.history.length > 10) {
            stats.history.shift();
        }

        // 3. Calcola la Media Mobile
        const sum = stats.history.reduce((a, b) => a + b, 0);
        stats.averageScore = Math.round(sum / stats.history.length);

        // 4. Salva tutto
        this._saveAll(folders);
        console.log(`📊 Stats aggiornate per "${folderName}": Media ${stats.averageScore}%`);
    },
};