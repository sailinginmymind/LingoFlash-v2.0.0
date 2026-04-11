/**
 * TranslationAPI - Modulo centralizzato per Lingue e Traduzioni
 */
const TranslationAPI = {
    services: {
        mymemory: "https://api.mymemory.translated.net/get",
        googleSearch: "https://www.google.com/search?q=",
        mdbg: "https://www.mdbg.net/chinese/dictionary?page=worddict&wdrst=1&wdqb="
    },

    languages: {
        'it':    { flag: '🇮🇹', label: 'Italiano' },
        'en':    { flag: '🇬🇧', label: 'Inglese' },
        'zh-TW': { flag: '🇹🇼', label: 'Cinese Trad.' },
        'zh-CN': { flag: '🇨🇳', label: 'Cinese Semp.' },
        'ja':    { flag: '🇯🇵', label: 'Giapponese' },
        'ko':    { flag: '🇰🇷', label: 'Coreano' },
        'fr':    { flag: '🇫🇷', label: 'Francese' },
        'es':    { flag: '🇪🇸', label: 'Spagnolo' },
        'de':    { flag: '🇩🇪', label: 'Tedesco' }
    },

    // DIZIONARIO INTERFACCIA
    uiStrings: {
        'it': {
            btnGenerate: "GENERA NUOVA PAROLA",
            studio: "🎯 Studio",
            gestisci: "📝 Gestisci",
            profilo: "🌸 Profilo",
            placeholderOriginal: "Parola originale...",
            placeholderTrans: "Traduzione automatica...",
            btnSave: "Salva nella cartella"
        },
        'en': {
            btnGenerate: "GENERATE NEW WORD",
            studio: "🎯 Study",
            gestisci: "📝 Manage",
            profilo: "🌸 Profile",
            placeholderOriginal: "Original word...",
            placeholderTrans: "Auto translation...",
            btnSave: "Save to folder"
        },
        'fr': {
            btnGenerate: "GÉNÉRER UN MOT",
            studio: "🎯 Étude",
            gestisci: "📝 Gérer",
            profilo: "🌸 Profil",
            placeholderOriginal: "Mot original...",
            placeholderTrans: "Traduction auto...",
            btnSave: "Enregistrer"
        },
        'es': {
            btnGenerate: "GENERAR PALABRA",
            studio: "🎯 Estudio",
            gestisci: "📝 Gestionar",
            profilo: "🌸 Perfil",
            placeholderOriginal: "Palabra original...",
            placeholderTrans: "Traducción auto...",
            btnSave: "Guardar"
        }
    },

    getFlag(langCode) {
        return this.languages[langCode]?.flag || '📂';
    },

    async translate(text, from = 'en', to) {
        if (!text || text.trim().length < 2) return null;
        const langpair = `${from}|${to}`;
        try {
            const url = `${this.services.mymemory}?q=${encodeURIComponent(text.trim())}&langpair=${encodeURIComponent(langpair)}`;
            const response = await fetch(url);
            if (!response.ok) return null;
            const data = await response.json();
            return data?.responseData?.translatedText || null;
        } catch (e) { return null; }
    },

    getSearchUrl(word, lang) {
        if (!word) return null;
        if (lang.startsWith('zh')) return `${this.services.mdbg}${encodeURIComponent(word)}`;
        return `${this.services.googleSearch}${encodeURIComponent(`pronunciation ${word} ${lang}`)}`;
    },

    speak(text, langCode) {
        if (!text || !window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = langCode;
        window.speechSynthesis.speak(utterance);
    }
};