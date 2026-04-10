/**
 * TranslationAPI - Modulo centralizzato per Lingue e Traduzioni
 */
const TranslationAPI = {
    services: {
        mymemory: "https://api.mymemory.translated.net/get",
        googleSearch: "https://www.google.com/search?q=",
        // Aggiungiamo il servizio MDBG
        mdbg: "https://www.mdbg.net/chinese/dictionary?page=worddict&wdrst=1&wdqb="
    },

    languages: {
        'zh-TW': { flag: '🇹🇼', label: 'Cinese Trad.' },
        'zh-CN': { flag: '🇨🇳', label: 'Cinese Semp.' },
        'ja':    { flag: '🇯🇵', label: 'Giapponese' },
        'ko':    { flag: '🇰🇷', label: 'Coreano' },
        'vi':    { flag: '🇻🇳', label: 'Vietnamita' },
        'en':    { flag: '🇬🇧', label: 'Inglese' },
        'fr':    { flag: '🇫🇷', label: 'Francese' },
        'it':    { flag: '🇮🇹', label: 'Italiano' }
    },

    getFlag(langCode) {
        return this.languages[langCode]?.flag || '📂';
    },
    
    getLangPill(langCode) {
        const langShort = langCode.split('-')[0].toUpperCase();
        const cleanCode = langCode.replace('-', '').toLowerCase();
        return `<span class="lang-pill pill-${cleanCode}">${langShort}</span>`;
    },

    async translate(text, from = 'en', to) {
        if (!text || text.trim().length < 2) return null;
        const langpair = `${from}|${to}`;
        try {
            const url = `${this.services.mymemory}?q=${encodeURIComponent(text.trim())}&langpair=${encodeURIComponent(langpair)}`;
            const response = await fetch(url);
            if (!response.ok) return null;
            const data = await response.json();
            const translatedText = data?.responseData?.translatedText;
            return (translatedText && translatedText.toLowerCase() !== text.toLowerCase()) 
                ? translatedText 
                : null;
        } catch (e) { return null; }
    },

    /**
     * FUNZIONE MODIFICATA:
     * Usa MDBG se la lingua è cinese, altrimenti Google.
     */
    getSearchUrl(word, lang) {
        if (!word) return null;

        // Se la lingua è cinese (qualsiasi variante zh)
        if (lang.startsWith('zh')) {
            return `${this.services.mdbg}${encodeURIComponent(word)}`;
        }

        // Per tutte le altre lingue usa Google Pronunciation
        const query = `pronunciation ${word} ${lang}`;
        return `${this.services.googleSearch}${encodeURIComponent(query)}`;
    },

    speak(text, langCode) {
        if (!text || !window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = langCode;
        const voices = window.speechSynthesis.getVoices();
        const matchVoice = voices.find(v => v.lang.startsWith(langCode));
        if (matchVoice) utterance.voice = matchVoice;
        utterance.rate = 0.8;
        window.speechSynthesis.speak(utterance);
    }
};