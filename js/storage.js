const StorageManager = {
    STORAGE_KEY: 'voca_storage_data',

    getInitialData() {
        return {
            settings: {
                theme: 'light',
                lastUpdated: new Date().toISOString()
            },
            words: []
        };
    },

    load() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        if (!data) {
            const initialData = this.getInitialData();
            this.save(initialData);
            return initialData;
        }
        try {
            return JSON.parse(data);
        } catch (e) {
            console.error('Failed to parse storage data', e);
            return this.getInitialData();
        }
    },

    save(data) {
        data.settings.lastUpdated = new Date().toISOString();
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    },

    getWords() {
        const data = this.load();
        return data.words;
    },

    addWord(word, translation) {
        const data = this.load();
        const trimmedWord = word.trim();
        
        // 중복 체크 (대소문자 무시)
        const isDuplicate = data.words.some(w => w.word.toLowerCase() === trimmedWord.toLowerCase());
        if (isDuplicate) return null;

        const newWord = {
            id: crypto.randomUUID(),
            word: trimmedWord,
            translation: translation.trim(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        data.words.unshift(newWord);
        this.save(data);
        return newWord;
    },

    updateWord(id, word, translation) {
        const data = this.load();
        const index = data.words.findIndex(w => w.id === id);
        if (index !== -1) {
            data.words[index] = {
                ...data.words[index],
                word: word.trim(),
                translation: translation.trim(),
                updatedAt: new Date().toISOString()
            };
            this.save(data);
            return data.words[index];
        }
        return null;
    },

    deleteWord(id) {
        const data = this.load();
        const filteredWords = data.words.filter(w => w.id !== id);
        if (filteredWords.length !== data.words.length) {
            data.words = filteredWords;
            this.save(data);
            return true;
        }
        return false;
    },

    getSettings() {
        const data = this.load();
        return data.settings;
    },

    updateSettings(newSettings) {
        const data = this.load();
        data.settings = { ...data.settings, ...newSettings };
        this.save(data);
    }
};
