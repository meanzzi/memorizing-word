const QuizEngine = {
    allWords: [],
    questions: [],
    currentQuestionIndex: 0,
    score: 0,

    init(words) {
        this.allWords = words;
        this.score = 0;
        this.currentQuestionIndex = 0;
        this.generateQuestions();
        this.renderQuestion();
    },

    generateQuestions() {
        // Shuffle and take up to 10 questions
        const shuffled = [...this.allWords].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, 10);

        this.questions = selected.map(q => {
            const type = Math.random() > 0.5 ? 'multiple' : 'subjective';
            if (type === 'multiple') {
                return this.createMultipleChoice(q);
            } else {
                return {
                    type: 'subjective',
                    word: q.word,
                    translation: q.translation,
                    answer: q.word.toLowerCase()
                };
            }
        });
    },

    createMultipleChoice(correctWord) {
        const options = [correctWord.translation];
        const otherWords = this.allWords.filter(w => w.id !== correctWord.id);
        const shuffledOthers = otherWords.sort(() => Math.random() - 0.5);
        
        // Take 3 random wrong answers
        shuffledOthers.slice(0, 3).forEach(w => options.push(w.translation));
        
        // If not enough words, pad with dummy
        while (options.length < 4) {
            options.push('---');
        }

        return {
            type: 'multiple',
            word: correctWord.word,
            translation: correctWord.translation,
            options: options.sort(() => Math.random() - 0.5),
            answer: correctWord.translation
        };
    },

    renderQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        const quizContent = document.getElementById('quiz-content');
        const progressBar = document.getElementById('quiz-progress-bar');

        // Update progress bar
        const progress = ((this.currentQuestionIndex) / this.questions.length) * 100;
        progressBar.style.width = `${progress}%`;

        let html = '';
        if (question.type === 'multiple') {
            html = `
                <div class="quiz-card">
                    <p class="quiz-instruction">뜻을 고르세요</p>
                    <h2 class="quiz-word">${question.word}</h2>
                    <div class="quiz-options">
                        ${question.options.map(opt => `
                            <button class="quiz-option-btn">${this.escapeHtml(opt)}</button>
                        `).join('')}
                    </div>
                </div>
            `;
        } else {
            html = `
                <div class="quiz-card">
                    <p class="quiz-instruction">영단어를 입력하세요</p>
                    <h2 class="quiz-translation">${question.translation}</h2>
                    <div class="quiz-input-group">
                        <input type="text" id="subjective-input" autofocus placeholder="입력 후 엔터">
                        <button id="submit-subjective-btn" class="primary-button">제출</button>
                    </div>
                </div>
            `;
        }

        quizContent.innerHTML = html;
        this.bindQuestionEvents();
    },

    bindQuestionEvents() {
        const question = this.questions[this.currentQuestionIndex];
        
        if (question.type === 'multiple') {
            const btns = document.querySelectorAll('.quiz-option-btn');
            btns.forEach(btn => {
                btn.addEventListener('click', () => this.handleAnswer(btn.textContent === question.answer));
            });
        } else {
            const input = document.getElementById('subjective-input');
            const submitBtn = document.getElementById('submit-subjective-btn');
            
            const checkSubjective = () => {
                const userVal = input.value.trim().toLowerCase();
                this.handleAnswer(userVal === question.answer);
            };

            submitBtn.addEventListener('click', checkSubjective);
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') checkSubjective();
            });
            input.focus();
        }
    },

    handleAnswer(isCorrect) {
        if (isCorrect) {
            this.score++;
            // Simple visual feedback could go here
        }

        this.currentQuestionIndex++;
        if (this.currentQuestionIndex < this.questions.length) {
            this.renderQuestion();
        } else {
            this.showResult();
        }
    },

    showResult() {
        const quizContent = document.getElementById('quiz-content');
        const progressBar = document.getElementById('quiz-progress-bar');
        progressBar.style.width = '100%';

        quizContent.innerHTML = `
            <div class="quiz-result">
                <h2>테스트 종료!</h2>
                <div class="result-score">
                    <span class="score-num">${this.score}</span>
                    <span class="score-total">/ ${this.questions.length}</span>
                </div>
                <p class="result-message">${this.getResultMessage()}</p>
                <button id="finish-quiz-btn" class="primary-button">목록으로 돌아가기</button>
            </div>
        `;

        document.getElementById('finish-quiz-btn').addEventListener('click', () => {
            UIManager.showView('main');
        });
    },

    getResultMessage() {
        const ratio = this.score / this.questions.length;
        if (ratio === 1) return '완벽해요! 대단합니다.';
        if (ratio >= 0.8) return '훌륭해요! 조금만 더 하면 완벽해요.';
        if (ratio >= 0.5) return '좋아요! 계속 연습해 보세요.';
        return '다시 한번 시도해 보세요. 포기하지 마세요!';
    },

    escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
};
