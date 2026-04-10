const FileManager = {
    // Esporta tutto il database (Backup)
    exportJSON(data) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `LingoFlash_FullBackup_${new Date().toISOString().slice(0,10)}.json`;
        a.click();
    },
    
    // Importa un file (rileva se è un backup o una cartuccia)
    async importFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    // Se il file ha una proprietà "isCartridge", lo trattiamo come tale
                    if (data.isCartridge) {
                        console.log("Cartuccia rilevata: " + data.cartridgeName);
                        resolve({ type: 'cartridge', content: data });
                    } else {
                        resolve({ type: 'backup', content: data });
                    }
                } catch (err) { reject(err); }
            };
            reader.readAsText(file);
        });
    },

    // Funzione per generare il file di una cartuccia (da usare se vuoi crearne di nuove)
    createCartridgeFile(name, lang, sourceLang, words) {
        const cartridge = {
            isCartridge: true,
            cartridgeName: name,
            lang: lang,
            sourceLang: sourceLang,
            installDate: new Date().toISOString(),
            words: words.map(w => ({
                id: `cart-${Math.random().toString(36).substr(2, 9)}`,
                eng: w.eng,
                target: w.target,
                pron: w.pron || '',
                level: 0,
                nextReview: Date.now()
            }))
        };
        const blob = new Blob([JSON.stringify(cartridge, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `Cartuccia_${name.replace(/\s+/g, '_')}.json`;
        a.click();
    }
};