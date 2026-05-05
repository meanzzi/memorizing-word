const UIManager = {
    // DOM Elements
    elements: {
        themeToggle: document.getElementById('theme-toggle'),
        themeIcon: document.querySelector('#theme-toggle .material-symbols-rounded'),
        wordList: document.getElementById('word-list'),
        addWordFab: document.getElementById('add-word-fab'),
        wordModal: document.getElementById('word-modal'),
        wordForm: document.getElementById('word-form'),
        wordInput: document.getElementById('word-input'),
        translationInput: document.getElementById('translation-input'),
        cancelModalBtn: document.getElementById('cancel-modal-btn'),
        modalTitle: document.getElementById('modal-title'),
        startQuizBtn: document.getElementById('start-quiz-btn'),
        mainView: document.getElementById('main-view'),
        quizView: document.getElementById('quiz-view'),
        closeQuizBtn: document.getElementById('close-quiz-btn')
    },

    currentEditingId: null,

    init() {
        this.bindEvents();
        this.applyTheme(StorageManager.getSettings().theme);
        this.renderWordList();
    },

    bindEvents() {
        // Theme Toggle
        this.elements.themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            this.applyTheme(newTheme);
            StorageManager.updateSettings({ theme: newTheme });
        });

        // Modal Controls
        this.elements.addWordFab.addEventListener('click', () => this.showModal());
        this.elements.cancelModalBtn.addEventListener('click', () => this.hideModal());
        this.elements.wordModal.addEventListener('click', (e) => {
            if (e.target === this.elements.wordModal) this.hideModal();
        });

        // Form Submission
        this.elements.wordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // Quiz Controls
        this.elements.startQuizBtn.addEventListener('click', () => {
            const words = StorageManager.getWords();
            if (words.length < 4) {
                alert('퀴즈를 시작하려면 최소 4개의 단어가 필요합니다.');
                return;
            }
            this.showView('quiz');
            QuizEngine.init(words);
        });

        this.elements.closeQuizBtn.addEventListener('click', () => {
            if (confirm('퀴즈를 종료할까요?')) {
                this.showView('main');
            }
        });
    },

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.elements.themeIcon.textContent = theme === 'light' ? 'dark_mode' : 'light_mode';
    },

    renderWordList() {
        const words = StorageManager.getWords();
        this.elements.wordList.innerHTML = words.map(word => `
            <li class="word-item" data-id="${word.id}">
                <div class="word-info">
                    <span class="word-text">${this.escapeHtml(word.word)}</span>
                    <span class="translation-text">${this.escapeHtml(word.translation)}</span>
                </div>
                <div class="word-actions">
                    <button class="icon-button speak-btn" title="발음 듣기">
                        <span class="material-symbols-rounded">volume_up</span>
                    </button>
                    <button class="icon-button edit-btn" title="수정">
                        <span class="material-symbols-rounded">edit</span>
                    </button>
                    <button class="icon-button delete-btn" title="삭제">
                        <span class="material-symbols-rounded">delete</span>
                    </button>
                </div>
            </li>
        `).join('');

        this.bindListEvents();
    },

    bindListEvents() {
        this.elements.wordList.querySelectorAll('.word-item').forEach(item => {
            const id = item.dataset.id;
            const word = StorageManager.getWords().find(w => w.id === id);

            item.querySelector('.speak-btn').addEventListener('click', () => {
                SpeechEngine.speak(word.word);
            });

            item.querySelector('.edit-btn').addEventListener('click', () => {
                this.showModal(word);
            });

            item.querySelector('.delete-btn').addEventListener('click', () => {
                if (confirm('이 단어를 삭제할까요?')) {
                    StorageManager.deleteWord(id);
                    this.renderWordList();
                }
            });
        });
    },

    showModal(word = null) {
        if (word) {
            this.currentEditingId = word.id;
            this.elements.modalTitle.textContent = '단어 수정';
            this.elements.wordInput.value = word.word;
            this.elements.translationInput.value = word.translation;
        } else {
            this.currentEditingId = null;
            this.elements.modalTitle.textContent = '단어 추가';
            this.elements.wordForm.reset();
        }
        this.elements.wordModal.classList.remove('hidden');
        this.elements.wordInput.focus();
    },

    hideModal() {
        this.elements.wordModal.classList.add('hidden');
        this.currentEditingId = null;
    },

    handleFormSubmit() {
        const word = this.elements.wordInput.value;
        const translation = this.elements.translationInput.value;

        if (this.currentEditingId) {
            StorageManager.updateWord(this.currentEditingId, word, translation);
        } else {
            StorageManager.addWord(word, translation);
        }

        this.hideModal();
        this.renderWordList();
    },

    showView(viewName) {
        if (viewName === 'main') {
            this.elements.mainView.classList.remove('hidden');
            this.elements.quizView.classList.add('hidden');
            this.renderWordList();
        } else if (viewName === 'quiz') {
            this.elements.mainView.classList.add('hidden');
            this.elements.quizView.classList.remove('hidden');
        }
    },

    escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
};
