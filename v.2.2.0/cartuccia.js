/**
 * 🎀 LingoFlash - Cartucce Preinstallate
 * Queste cartelle vengono iniettate automaticamente se non presenti.
 */

const DatiVerifica = {
    "📚 Verifica: Vocaboli": {
        lang: "zh-TW",
        sourceLang: "it", // Aggiungiamo la lingua di partenza
        words: [
            { id: "v1-201", eng: "Birthday", target: "生日", pron: "shēngrì", level: 0 },
            { id: "v1-202", eng: "Language", target: "語言", pron: "yǔyán", level: 0 },
            { id: "v1-203", eng: "Approximately", target: "左右", pron: "zuǒyòu", level: 0 },
            { id: "v1-204", eng: "Spain", target: "西班牙", pron: "xībānyá", level: 0 },
            { id: "v1-205", eng: "Gift / Present", target: "禮物", pron: "lǐwù", level: 0 },
            { id: "v1-206", eng: "Pork Knuckles", target: "豬腳", pron: "zhūjiǎo", level: 0 },
            { id: "v1-207", eng: "Egg", target: "蛋", pron: "dàn", level: 0 },
            { id: "v1-208", eng: "Cake", target: "蛋糕", pron: "dàngāo", level: 0 },
            { id: "v1-209", eng: "Spanish (language)", target: "西班牙文", pron: "xībānyáwén", level: 0 },
            { id: "v1-210", eng: "Gate / Entrance", target: "門口", pron: "ménkǒu", level: 0 },
            { id: "v1-211", eng: "This Year", target: "今年", pron: "jīnnián", level: 0 },
            { id: "v1-212", eng: "Extra Fine Noodles", target: "麵線", pron: "miànxiàn", level: 0 },
            { id: "v1-213", eng: "Tradition / Customs", target: "傳統", pron: "chuántǒng", level: 0 },
            { id: "v1-214", eng: "Happy", target: "快樂", pron: "kuàilè", level: 0 },
            { id: "v1-215", eng: "With Enthusiasm", target: "熱心", pron: "rèxīn", level: 0 },
            { id: "v1-216", eng: "The Same / Alike", target: "一樣", pron: "yíyàng", level: 0 },
            { id: "v1-217", eng: "Young", target: "年輕", pron: "niánqīng", level: 0 },
            { id: "v1-218", eng: "A little / Some", target: "一點", pron: "yìdiǎn", level: 0 },
            { id: "v1-219", eng: "Old (vecchio/anziano)", target: "老", pron: "lǎo", level: 0 },
            { id: "v1-220", eng: "Old Person (persona anziana)", target: "老人", pron: "lǎorén", level: 0 },
            { id: "v1-221", eng: "Old (di età grande)", target: "年紀大", pron: "niánjì dà", level: 0 },
            { id: "v1-222", eng: "To come back", target: "回來", pron: "huílái", level: 0 },
            { id: "v1-223", eng: "To forget", target: "忘", pron: "wàngle", level: 0 },
            { id: "v1-224", eng: "To remember", target: "記得", pron: "jìde", level: 0 },
            { id: "v1-225", eng: "To exchange", target: "交換", pron: "jiāohuàn", level: 0 },
            { id: "v1-226", eng: "To celebrate", target: "過", pron: "guò", level: 0 },
            { id: "v1-227", eng: "To order (something in advance)", target: "訂", pron: "dìng", level: 0 },
            { id: "v1-228", eng: "To wish (happiness, good luck, etc.)", target: "祝", pron: "zhù", level: 0 },
            { id: "v1-229", eng: "How come?", target: "怎麼", pron: "zěnme", level: 0 },
            { id: "v1-230", eng: "Certainly / Of course", target: "當然", pron: "dāngrán", level: 0 },
            { id: "v1-231", eng: "So (very)", target: "那麼", pron: "nàme", level: 0 },
            { id: "v1-232", eng: "To", target: "對", pron: "duì", level: 0 },
            { id: "v1-233", eng: "Particle indicating realization", target: "啊", pron: "a", level: 0 },
            { id: "v1-234", eng: "Verbal particle (completed action)", target: "了", pron: "le", level: 0 }
        ]
    },
    "💬 Verifica: Frasi Utili": {
        lang: "zh-TW",
        sourceLang: "it",
        words: [
            { id: "v2-301", eng: "Happy Birthday", target: "生日快樂", pron: "shēngrì kuàilè", level: 0 },
            { id: "v2-302", eng: "This is s/he speaking", target: "我就是", pron: "wǒ jiù shì", level: 0 },
            { id: "v2-303", eng: "Long time no see", target: "好久不見", pron: "hǎojiǔ bújiàn", level: 0 },
            { id: "v2-304", eng: "No need to stand on formalities", target: "不必客氣", pron: "búbì kèqì", level: 0 },
            { id: "v2-305", eng: "That's very kind of you", target: "太客氣(了)", pron: "tài kèqì", level: 0 },
            { id: "v2-306", eng: "Don't mention it / It's my pleasure", target: "哪裡,哪裡", pron: "nǎlǐ, nǎlǐ", level: 0 },
            { id: "v2-307", eng: "Most of / Mostly", target: "大部分", pron: "dà bùfèn", level: 0 },
            { id: "v2-308", eng: "May everything go your way", target: "萬事如意", pron: "wànshì rúyì", level: 0 },
            { id: "v2-309", eng: "May all your wishes come true", target: "心想事成", pron: "xīnxiǎng shìchéng", level: 0 }
        ]
    }
};

(function autoInstall() {
    // IMPORTANTE: La chiave deve essere la stessa di StorageManager.DB_NAME
    const DB_NAME = 'lingoflash_v4'; 
    const rawData = localStorage.getItem(DB_NAME);
    let currentData = rawData ? JSON.parse(rawData) : {};
    let updated = false;

    for (const folderName in DatiVerifica) {
        if (!currentData[folderName]) {
            currentData[folderName] = DatiVerifica[folderName];
            updated = true;
        }
    }

    if (updated) {
        localStorage.setItem(DB_NAME, JSON.stringify(currentData));
        console.log("🎀 Cartucce 'Verifica' installate con successo!");
        
        // Se l'app è già caricata, aggiorna la vista
        if (window.app && typeof window.app.refreshFolders === 'function') {
            window.app.refreshFolders();
        }
    }
})();