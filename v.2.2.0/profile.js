const ProfileManager = {
    // 1. Calcola statistiche per la singola card (Aggiornato con Quiz Stats)
    getFolderStats(folder) {
        const words = folder.words || [];
        const total = words.length;
        const learned = words.filter(w => (w.level || 0) > 0).length;
        const mastery = total > 0 ? Math.round((learned / total) * 100) : 0;
        
        // Nuovi dati dai Quiz
        const quiz = folder.stats || { bestScore: 0, averageScore: 0, totalAttempts: 0, history: [] };
        
        // Calcolo Trend
        let trend = "🆕";
        if (quiz.history && quiz.history.length >= 2) {
            const last = quiz.history[quiz.history.length - 1];
            const prev = quiz.history[quiz.history.length - 2];
            trend = last > prev ? "📈" : (last < prev ? "📉" : "➡️");
        }

        return { total, learned, mastery, quiz, trend };
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

    const currentIdx = ranks.findIndex(r => totalLearned >= r.min);
    const currentRank = ranks[currentIdx];
    const nextRank = ranks[currentIdx - 1];

return { 
    totalWords, 
    totalLearned, 
    avgMastery, 
    rankValue: currentRank.min, // Restituiamo 300, 200, ecc.
    rankLabel: currentRank.label, // Fallback
    nextRank: nextRank ? { min: nextRank.min, label: nextRank.label } : null
};
},

    // 3. Funzioni di Interazione (Invariate)
    toggleExpand(name) {
        const el = document.getElementById(`actions-${name}`);
        if (el) el.classList.toggle('hidden');
    },

    resetProgress(name, event) {
        event.stopPropagation(); 
        if (confirm(`Vuoi azzerare i progressi e le statistiche di "${name}"?`)) {
            const folders = StorageManager.getFolders();
            if (folders[name]) {
                folders[name].words.forEach(w => {
                    w.level = 0;
                    w.nextReview = 0;
                });
                // Reset anche delle statistiche quiz
                folders[name].stats = { bestScore: 0, averageScore: 0, totalAttempts: 0, history: [] };
                
                StorageManager._saveAll(folders);
                this.render(folders);
            }
        }
    },

    studyFolder(name, event) {
        event.stopPropagation();
        const mainApp = window.app || App; 
        if (!mainApp) return;

        mainApp.state.cartellaAttiva = name;
        if (typeof mainApp.refreshFolders === 'function') mainApp.refreshFolders();

        const quizTabBtn = document.querySelector('[data-target="quiz-page"]');
        if (quizTabBtn) quizTabBtn.click();

        const quizWordEl = document.getElementById('word-to-translate');
        const resultTarget = document.getElementById('result-target');
        const resultPron = document.getElementById('result-pronunciation');
        const genBtn = document.getElementById('btn-generate');

        if (quizWordEl) {
            quizWordEl.innerHTML = `
                <div style="font-size: 1.5rem; line-height: 1.4; padding: 10px;">
                    Pronto per studiare? ✨<br>
                    <small style="font-size: 1rem; opacity: 0.7;">Cartella: ${name}</small>
                </div>
            `;
        }

        if (resultTarget) resultTarget.innerText = "";
        if (resultPron) resultPron.innerText = "";

        const answerArea = document.getElementById('answer-area');
        if (answerArea) answerArea.classList.add('hidden');

        if (typeof mainApp.toggleSolution === 'function') {
            mainApp.toggleSolution(false);
        }

        if (genBtn) genBtn.textContent = "INIZIA ORA! 🚀";
    },

    // 4. Disegna la UI (Aggiornata con i Widget Statistici)
    render(folders) {
        const container = document.getElementById('profile-page');
        if (!container) return;

        const global = this.getGlobalStats(folders);

        // Calcolo dati barra XP
        let xpPercent = 100;
        let xpText = "Livello Massimo raggiunto! 🏆";
        if (global.nextRank) {
            xpPercent = (global.totalLearned / global.nextRank.min) * 100;
            xpText = `${global.totalLearned} / ${global.nextRank.min} parole per ${global.nextRank.label}`;
        }

        let html = `
        <div class="global-stats-card dash-layout" style="display: flex; align-items: center; justify-content: space-around; padding: 30px;">
            <div class="dash-left" style="flex: 1.5; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; border-right: 1px solid rgba(0,0,0,0.05);">
                <small class="dash-label i18n-rank-label" style="font-size: 0.8rem; letter-spacing: 1px; margin-bottom: 8px;">IL TUO RANGO</small>
<div class="dash-rank rank-name" data-rank="${global.rankValue}">${global.rankLabel}</div>                
                <div class="rank-xp-container" style="width: 100%; max-width: 320px; margin-top: 5px;">
                    <div style="width: 100%; height: 8px; background: rgba(0,0,0,0.05); border-radius: 10px; overflow: hidden; box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);">
                        <div style="width: ${xpPercent}%; height: 100%; background: #ff4d6d; border-radius: 10px; transition: width 0.8s ease;"></div>
                    </div>
                    <div class="next-rank-info" style="font-size: 0.75rem; color: #888; margin-top: 8px; font-weight: 600; text-transform: uppercase;">
                        ${xpText}
                    </div>
                </div>
            </div>
            
            <div class="dash-right" style="flex: 1; display: flex; flex-direction: column; gap: 15px; padding-left: 20px;">
                <div class="mini-stat">
                    <span class="mini-val" style="font-size: 1.4rem;">${global.totalWords}</span>
                    <span class="mini-lab i18n-total-words">Parole totali</span>
                </div>
                <div class="mini-stat">
                    <span class="mini-val" style="color: #ff4d6d !important; font-size: 1.8rem;">${global.avgMastery}%</span>
                    <span class="mini-lab i18n-avg-mastery">Maestria media</span>
                </div>
                <div class="mini-stat">
                    <span class="mini-val" style="font-size: 1.4rem;">${global.totalLearned}</span>
                    <span class="mini-lab i18n-learned-words">Parole imparate</span>
                </div>
            </div>
        </div>
        <h2 class="section-title i18n-profile-folders">Le Mie Cartelle 📂</h2>
    `;

       Object.keys(folders).forEach(name => {
            const folder = folders[name];
            const stats = this.getFolderStats(folder);
            const medal = stats.mastery === 100 && stats.total > 0 ? "👑" : (stats.mastery > 50 ? "🎀" : "🌱");

            // --- Aggiornamento Colori Leggibili per il Record ---
            let statusColor = "#555"; // Grigio scuro di default (leggibile) per punteggi bassi/intermedi
            if (stats.quiz.totalAttempts > 0) {
                if (stats.quiz.averageScore >= 80) {
                    statusColor = "#10b981"; // Manteniamo il Verde per l'eccellenza
                }
                // Rimosso il giallo: sotto l'80% rimane grigio scuro, molto più leggibile.
            }

           let progressArea = "";
            if (stats.mastery === 0) {
                // Determiniamo il testo iniziale in base alla lingua attuale
                const currentLang = localStorage.getItem('lingoflash_lang') || 'it';
                const msg = currentLang === 'it' 
                    ? "Ogni grande viaggio inizia con una singola parola. Inizia a studiare! ✨" 
                    : "Every great journey begins with a single word. Start studying! ✨";

                progressArea = `
                    <div class="empty-folder-state" style="padding: 5px 10px; text-align: left; margin: 8px 0; border: none; background: transparent;">
                        <p class="i18n-empty-msg" style="font-size: 0.8rem; color: #888; font-style: italic; margin: 0; line-height:1.2;">
                            "${msg}"
                        </p>
                    </div>
                `;
            } else {
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
                <h3 style="margin:0; color:var(--text);">${name} <span style="font-size:0.9rem;">${stats.trend}</span></h3>
                <small style="color:#aaa;">${stats.learned} / ${stats.total} <span class="i18n-label-learned-count">parole apprese</span></small>
            </div>
            <div class="medal">${medal}</div>
        </div>
        
        ${progressArea}

        <div class="quiz-mini-stats" style="display:flex; justify-content:space-between; margin-top:10px; padding:10px; background: #fff0f3; border-radius:12px; font-size:0.75rem; border: 1px solid #ffdde5;">
            <div style="color:${statusColor}; font-weight:bold;">
                <span class="i18n-label-record">🏆 Record</span>: ${stats.quiz.bestScore}%
            </div>
            
            <div style="color:#555;">
                <span class="i18n-label-avg">📊 Media</span> 
                <small style="opacity:0.7; font-size:0.65rem;">(ultimi ${stats.quiz.history ? stats.quiz.history.length : 0})</small>: 
                <b>${stats.quiz.averageScore}%</b>
            </div>
            
            <div style="color:#555;">
                <span class="i18n-label-test">🔥 Test</span>: <b>${stats.quiz.totalAttempts}</b>
            </div>
        </div>

        <div id="actions-${name}" class="card-actions hidden">
            <button class="btn-manage-mini reset" onclick="ProfileManager.resetProgress('${name}', event)">
                <span class="i18n-btn-reset">🔄 Reset</span>
            </button>
            <button class="btn-manage-mini study" onclick="ProfileManager.studyFolder('${name}', event)">
                <span class="i18n-btn-study">🎯 Studia Ora</span>
            </button>
        </div>
    </div>
`;
        });

        container.innerHTML = html;
    }
};