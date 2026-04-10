/**
 * 🧠 LingoFlash - Modulo SRS (Spaced Repetition System)
 */
const SRS = {
    // Calcola i nuovi dati della parola
    // isCorrect: true se premi ✅, false se premi ❌
    compute(word, isCorrect) {
        let level = word.level || 0;
        let interval = 0;

        if (isCorrect) {
            // Algoritmo di progressione (giorni)
            if (level === 0) interval = 1;      // Rivedi domani
            else if (level === 1) interval = 3; // Tra 3 giorni
            else if (level === 2) interval = 7; // Tra una settimana
            else interval = (word.interval || 7) * 2; // Raddoppia sempre
            level++;
        } else {
            // Se sbagli, ricomincia da zero (la rivedrai subito)
            level = 0;
            interval = 0;
        }

        // Calcola il timestamp della prossima revisione
        const nextReview = Date.now() + (interval * 24 * 60 * 60 * 1000);

        return {
            ...word,
            level: level,
            interval: interval,
            nextReview: nextReview
        };
    }
};