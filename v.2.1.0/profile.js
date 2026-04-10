const ProfileManager = {
    // 1. Calcola statistiche per la singola card
    getFolderStats(folder) {
        const words = folder.words || [];
        const total = words.length;
        const learned = words.filter(w => (w.level || 0) > 0).length;
        const mastery = total > 0 ? Math.round((learned / total) * 100) : 0;
        return { total, learned, mastery };
    },

    // 2. Calcola statistiche per la Master Card in alto
    getGlobalStats(folders) {
        let totalWords = 0;
        let totalLearned = 0;
        let totalMastery = 0;
        let folderCount = 0;

        Object.values(folders).forEach(folder => {
            const stats = this.getFolderStats(folder);
            totalWords += stats.total;
            totalLearned += stats.learned;
            totalMastery += stats.mastery;
            folderCount++;
        });

        const avgMastery = folderCount > 0 ? Math.round(totalMastery / folderCount) : 0;

        const ranks = [
            { min: 300, label: "Leggenda 🎖️" },
            { min: 200, label: "Sapiente 🔮" },
            { min: 150, label: "Maestro 👑" },
            { min: 100, label: "Esperto 🎓" },
            { min: 75,  label: "Avanzato ✨" },
            { min: 50,  label: "Esploratore 🗺️" },
            { min: 30,  label: "Studente 📖" },
            { min: 15,  label: "Apprendista 🎀" },
            { min: 5,   label: "Novizio 🌸" },
            { min: 0,   label: "Curioso 🌱" }
        ];

        const rank = ranks.find(r => totalLearned >= r.min).label;
        return { totalWords, totalLearned, avgMastery, rank };
    },

    // 3. Funzioni di Interazione
    toggleExpand(name) {
        const el = document.getElementById(`actions-${name}`);
        if (el) el.classList.toggle('hidden');
    },

    resetProgress(name, event) {
        event.stopPropagation(); 
        if (confirm(`Vuoi azzerare i progressi di "${name}"? Le parole non verranno cancellate.`)) {
            const folders = StorageManager.getFolders();
            if (folders[name]) {
                folders[name].words.forEach(w => {
                    w.level = 0;
                    w.nextReview = 0;
                });
                StorageManager._saveAll(folders);
                this.render(folders);
            }
        }
    },

 studyFolder(name, event) {
    event.stopPropagation();
    const mainApp = window.app || App; 
    if (!mainApp) return;

    // 1. Imposta la cartella attiva e aggiorna la UI dell'app
    mainApp.state.cartellaAttiva = name;
    if (typeof mainApp.refreshFolders === 'function') mainApp.refreshFolders();

    // 2. Vai alla pagina Quiz
    const quizTabBtn = document.querySelector('[data-target="quiz-page"]');
    if (quizTabBtn) quizTabBtn.click();

    // 3. RESET MANUALE DEGLI ELEMENTI (usiamo gli ID corretti dal tuo HTML/app.js)
    const quizWordEl = document.getElementById('word-to-translate'); // ID corretto da app.js
    const resultTarget = document.getElementById('result-target');
    const resultPron = document.getElementById('result-pronunciation'); // ID completo
    const genBtn = document.getElementById('btn-generate');

    // Inseriamo il messaggio di benvenuto
    if (quizWordEl) {
        quizWordEl.innerHTML = `
            <div style="font-size: 1.5rem; line-height: 1.4; padding: 10px;">
                Pronto per studiare? ✨<br>
                <small style="font-size: 1rem; opacity: 0.7;">Cartella: ${name}</small>
            </div>
        `;
    }

    // PULIZIA OBBLIGATORIA: Cancelliamo i testi della parola precedente
    if (resultTarget) resultTarget.innerText = "";
    if (resultPron) resultPron.innerText = "";

    // 4. RESET DEGLI STATI DI VISIBILITÀ
    // Nascondiamo l'area risposta (quella con la soluzione)
    const answerArea = document.getElementById('answer-area');
    if (answerArea) answerArea.classList.add('hidden');

    // Reset dello stato della soluzione in App
    if (typeof mainApp.toggleSolution === 'function') {
        mainApp.toggleSolution(false);
    }

    // Cambiamo il testo al bottone
    if (genBtn) genBtn.textContent = "INIZIA ORA! 🚀";
},

    // 4. Disegna la UI
    render(folders) {
        const container = document.getElementById('profile-page');
        if (!container) return;

        const global = this.getGlobalStats(folders);

        let html = `
            <div class="global-stats-card dash-layout">
                <div class="dash-left">
                    <small class="dash-label">IL TUO RANGO</small>
                    <div class="dash-rank">${global.rank}</div>
                </div>
                <div class="dash-right">
                    <div class="mini-stat">
                        <span class="mini-val">${global.totalWords}</span>
                        <span class="mini-lab">Parole totali</span>
                    </div>
                    <div class="mini-stat">
                        <span class="mini-val">${global.avgMastery}%</span>
                        <span class="mini-lab">Maestria media</span>
                    </div>
                    <div class="mini-stat">
                        <span class="mini-val">${global.totalLearned}</span>
                        <span class="mini-lab">Parole imparate</span>
                    </div>
                </div>
            </div>
            <h2 class="section-title">Le Mie Cartelle 📂</h2>
        `;

Object.keys(folders).forEach(name => {
            const folder = folders[name];
            const stats = this.getFolderStats(folder);
            const medal = stats.mastery === 100 && stats.total > 0 ? "👑" : (stats.mastery > 50 ? "🎀" : "🌱");

            // CREIAMO IL CONTENUTO VARIABILE (Barra o Messaggio)
            let progressArea = "";
            
         if (stats.mastery === 0) {
            // Box motivazionale molto più compatto, senza bordi e senza emoji centrale
            progressArea = `
                <div class="empty-folder-state" style="padding: 5px 10px; text-align: left; margin: 8px 0; border: none; background: transparent;">
                    <p style="font-size: 0.8rem; color: #888; font-style: italic; margin: 0; line-height:1.2;">
                        "Ogni grande viaggio inizia con una singola parola. Inizia a studiare per vedere crescere questa barra! ✨"
                    </p>
                </div>
            `;
        } else {
            // Barra di progresso normale
            progressArea = `
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width: ${stats.mastery}%"></div>
                </div>
                <div class="progress-label">${stats.mastery}% COMPLETATO</div>
            `;
        }

            html += `
                <div class="card stats-card" onclick="ProfileManager.toggleExpand('${name}')">
                    <div class="stats-header">
                        <div>
                            <h3 style="margin:0; color:var(--text);">${name}</h3>
                            <small style="color:#aaa;">${stats.learned} / ${stats.total} parole apprese</small>
                        </div>
                        <div class="medal">${medal}</div>
                    </div>
                    
                    ${progressArea} 

                    <div id="actions-${name}" class="card-actions hidden">
                        <button class="btn-manage-mini reset" onclick="ProfileManager.resetProgress('${name}', event)">
                            🔄 Reset
                        </button>
                        <button class="btn-manage-mini study" onclick="ProfileManager.studyFolder('${name}', event)">
                            🎯 Studia Ora
                        </button>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }
};