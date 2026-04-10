/**
 * 🎯 LingoFlash - Quiz Manager Module
 * Gestisce la logica delle sessioni, i punteggi e il report finale.
 */

const QuizManager = {
    session: {
        paroleViste: [],
        punteggio: 0,      // Usiamo "punteggio" come nome standard
        totaleDomande: 0,
        isTerminato: false,
        paroleSbagliate: []
    },

    // Inizia una nuova sessione per una cartella
    startSession(words) {
        this.session.paroleViste = [];
        this.session.punteggio = 0; // Reset corretto
        this.session.paroleSbagliate = []; // Reset fondamentale per non accumulare errori vecchi
        this.session.totaleDomande = words.length;
        this.session.isTerminato = false;
    },

    // Estrae la prossima parola non ancora vista
    getQuestion(words) {
        const disponibili = words.filter(w => !this.session.paroleViste.includes(w.id));
        
        if (disponibili.length === 0) {
            this.session.isTerminato = true;
            return null;
        }

        const parola = disponibili[Math.floor(Math.random() * disponibili.length)];
        this.session.paroleViste.push(parola.id);
        return parola;
    },

    // Registra la risposta (corretta/errata)
    recordAnswer(isCorrect, parola) {
        if (isCorrect === true) {
            this.session.punteggio++; // FIX: Usiamo "punteggio", non "punti"
        } else {
            // Salva la parola negli errori se non è già presente
            if (!this.session.paroleSbagliate.find(w => w.id === parola.id)) {
                this.session.paroleSbagliate.push(parola);
            }
        }
        // Nota: indiceCorrente non serve qui perché usiamo paroleViste.length per tracciare il progresso
    },

    getReport() {
        const totale = this.session.totaleDomande;
        const punti  = this.session.punteggio; // FIX: Usiamo "punteggio"
        const percentuale = totale > 0 ? Math.round((punti / totale) * 100) : 0;
        
        return {
            punti: punti,
            totale: totale,
            percentuale: percentuale
        };
    }
};