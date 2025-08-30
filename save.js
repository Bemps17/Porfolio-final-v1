/**
 * Gestionnaire de sauvegarde pour le portfolio.
 * Gère l'état de l'application (ex: thème) en utilisant IndexedDB comme source principale
 * et localStorage comme fallback/synchronisation.
 */

// Wrapper pour IndexedDB pour simplifier les opérations.
const dbManager = {
    _db: null,
    _dbName: 'portfolioDB',
    _storeName: 'userState',

    /**
     * Ouvre la connexion à la base de données et la crée si nécessaire.
     * @returns {Promise<IDBDatabase>}
     */
    async open() {
        return new Promise((resolve, reject) => {
            if (this._db) {
                return resolve(this._db);
            }
            const request = indexedDB.open(this._dbName, 1);

            request.onerror = (event) => {
                console.error("Erreur d'ouverture d'IndexedDB:", event);
                reject("Erreur IndexedDB");
            };

            request.onsuccess = (event) => {
                this._db = event.target.result;
                resolve(this._db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this._storeName)) {
                    db.createObjectStore(this._storeName, { keyPath: 'key' });
                    console.log(`[IndexedDB] Object store '${this._storeName}' créé.`);
                }
            };
        });
    },

    /**
     * Récupère une valeur depuis IndexedDB.
     * @param {string} key La clé à récupérer.
     * @returns {Promise<any|undefined>} La valeur ou undefined.
     */
    async get(key) {
        const db = await this.open();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this._storeName], 'readonly');
            const store = transaction.objectStore(this._storeName);
            const request = store.get(key);

            request.onsuccess = () => {
                resolve(request.result ? request.result.value : undefined);
            };
            request.onerror = (event) => {
                console.error("Erreur de lecture dans IndexedDB:", event);
                reject(event);
            };
        });
    },

    /**
     * Sauvegarde une paire clé/valeur dans IndexedDB.
     * @param {string} key La clé.
     * @param {any} value La valeur.
     * @returns {Promise<void>}
     */
    async set(key, value) {
        const db = await this.open();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this._storeName], 'readwrite');
            const store = transaction.objectStore(this._storeName);
            const request = store.put({ key, value });

            request.onsuccess = () => {
                resolve();
            };
            request.onerror = (event) => {
                console.error("Erreur d'écriture dans IndexedDB:", event);
                reject(event);
            };
        });
    }
};

/**
 * Vérifie et affiche l'état des sauvegardes dans LocalStorage et IndexedDB.
 * Tente de synchroniser les données si elles sont désynchronisées.
 */
async function checkSaveState() {
    console.log("%c--- Vérification de l'état des sauvegardes ---", "color: orange; font-weight: bold;");

    try {
        const themeFromLocalStorage = localStorage.getItem('portfolio-theme');
        if (themeFromLocalStorage) console.log(`[LocalStorage] Thème trouvé: "${themeFromLocalStorage}"`);
        else console.log("[LocalStorage] Aucun thème trouvé.");

        const themeFromIndexedDB = await dbManager.get('theme');
        if (themeFromIndexedDB) console.log(`[IndexedDB] Thème trouvé: "${themeFromIndexedDB}"`);
        else console.log("[IndexedDB] Aucun thème trouvé.");

        if (themeFromLocalStorage && !themeFromIndexedDB) {
            console.log("[Synchronisation] Migration du thème de LocalStorage vers IndexedDB...");
            await dbManager.set('theme', themeFromLocalStorage);
        } else if (!themeFromLocalStorage && themeFromIndexedDB) {
            console.log("[Synchronisation] Restauration du thème d'IndexedDB vers LocalStorage...");
            localStorage.setItem('portfolio-theme', themeFromIndexedDB);
        } else if (themeFromLocalStorage && themeFromIndexedDB && themeFromLocalStorage !== themeFromIndexedDB) {
            console.warn("[Alerte de désynchronisation] Les thèmes sont différents ! Priorité à IndexedDB.");
            localStorage.setItem('portfolio-theme', themeFromIndexedDB);
        } else if (themeFromLocalStorage && themeFromIndexedDB) {
            console.log("%c[État] Les sauvegardes sont synchronisées.", "color: green;");
        }
    } catch (error) {
        console.error("Erreur lors de la vérification de l'état des sauvegardes:", error);
    }
    console.log("%c--- Fin de la vérification ---", "color: orange; font-weight: bold;");
}

async function saveTheme(theme) {
    localStorage.setItem('portfolio-theme', theme);
    try {
        await dbManager.set('theme', theme);
        console.log(`[Sauvegarde] Thème "${theme}" sauvegardé dans LocalStorage et IndexedDB.`);
    } catch (error) {
        console.error(`[Sauvegarde] Échec de la sauvegarde du thème "${theme}" dans IndexedDB:`, error);
    }
}

async function loadTheme() {
    try {
        let theme = await dbManager.get('theme');
        if (theme) {
            if (localStorage.getItem('portfolio-theme') !== theme) localStorage.setItem('portfolio-theme', theme);
            return theme;
        }
        theme = localStorage.getItem('portfolio-theme');
        if (theme) {
            await dbManager.set('theme', theme);
            return theme;
        }
    } catch (error) {
        console.error("Impossible de charger le thème depuis IndexedDB, utilisation de LocalStorage comme fallback.", error);
        return localStorage.getItem('portfolio-theme') || 'corporate';
    }
    return 'corporate';
}