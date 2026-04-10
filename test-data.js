/**
 * LingoFlash 🎀 - Test Data
 * Importazione automatica di una cartella "Prova 🎀" con 20 parole di esempio.
 * Si auto-esegue se il database è vuoto (solo la cartella Esempio default).
 */

const TestData = [
    { eng: "Water",       target: "水",   pron: "Shuǐ"       },
    { eng: "Mountain",    target: "山",   pron: "Shān"        },
    { eng: "Moon",        target: "月",   pron: "Yuè"         },
    { eng: "Sun",         target: "日",   pron: "Rì"          },
    { eng: "Fire",        target: "火",   pron: "Huǒ"         },
    { eng: "Wood",        target: "木",   pron: "Mù"          },
    { eng: "Gold",        target: "金",   pron: "Jīn"         },
    { eng: "Person",      target: "人",   pron: "Rén"         },
    { eng: "Heart",       target: "心",   pron: "Xīn"         },
    { eng: "Door",        target: "門",   pron: "Mén"         },
    { eng: "Love",        target: "愛",   pron: "Ài"          },
    { eng: "Beautiful",   target: "美麗", pron: "Měilì"       },
    { eng: "Happy",       target: "快樂", pron: "Kuàilè"      },
    { eng: "Friend",      target: "朋友", pron: "Péngyǒu"     },
    { eng: "Cat",         target: "貓",   pron: "Māo"         },
    { eng: "Flower",      target: "花",   pron: "Huā"         },
    { eng: "Sky",         target: "天空", pron: "Tiānkōng"    },
    { eng: "Thank you",   target: "謝謝", pron: "Xièxiè"      },
    { eng: "Goodbye",     target: "再見", pron: "Zàijiàn"     },
    { eng: "Study",       target: "學習", pron: "Xuéxí"       },
    { eng: "Dream",       target: "夢想", pron: "Mèngxiǎng"   },
    { eng: "Tomorrow",    target: "明天", pron: "Míngtiān"    }
];

/**
 * Importa manualmente le parole di test in una cartella "Prova 🎀".
 * Può essere chiamata dalla console del browser: importTestWords()
 */
window.importTestWords = () => {
    const FOLDER_NAME = "Prova 🎀";
    const LANG        = "zh-TW";

    StorageManager.createFolder(FOLDER_NAME, LANG);

    const folders = StorageManager.getFolders();
    if (!folders[FOLDER_NAME]) {
        console.error("importTestWords: impossibile creare la cartella.");
        return;
    }

    // Genera ID univoci per ogni parola
    folders[FOLDER_NAME].words = TestData.map(w => ({
        id:     Date.now() + '_' + Math.random().toString(36).slice(2, 7),
        eng:    w.eng,
        target: w.target,
        pron:   w.pron
    }));

    StorageManager._saveAll(folders);

    if (window.App) {
        App.state.cartellaAttiva = FOLDER_NAME;
        App.refreshFolders();
        App.toast("Cartella Prova importata con successo! 🎀");
    } else {
        location.reload();
    }

    console.log(`✅ ${TestData.length} parole importate in '${FOLDER_NAME}'`);
};

/**
 * Auto-import: se il DB contiene solo la cartella "Esempio" di default
 * (cioè è un'installazione fresh), importa automaticamente la cartella Prova.
 * In questo modo l'utente trova subito contenuto con cui giocare.
 */
(function autoImportIfEmpty() {
    // Aspettiamo che il DOM sia pronto e App sia inizializzato
    document.addEventListener('DOMContentLoaded', () => {
        const folders = StorageManager.getFolders();
        const keys    = Object.keys(folders);

        // Condizione: solo la cartella "Esempio" esiste (DB appena creato)
        const isFirstRun = keys.length === 1 && keys[0] === "Esempio 🇹🇼";

        if (isFirstRun) {
            console.log("🎀 Primo avvio rilevato — importo le parole di esempio...");
            window.importTestWords();
        }
    });
})();