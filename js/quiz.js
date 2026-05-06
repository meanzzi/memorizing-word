// 학습 퀴즈 생성 및 진행 모듈
const QuizEngine = {
  allWords: [], // 전체 단어 목록
  questions: [], // 이번 회차에 생성된 문제 목록
  currentQuestionIndex: 0, // 현재 풀고 있는 문제의 인덱스
  score: 0, // 현재까지의 점수

  // 퀴즈 엔진 초기화 및 시작
  init(words) {
    this.allWords = words;
    this.score = 0;
    this.currentQuestionIndex = 0;
    this.generateQuestions();
    this.renderQuestion();
  },

  // 문제 데이터 생성 로직
  generateQuestions() {
    // 단어 목록을 무작위로 섞은 뒤 최대 10개를 선정
    const shuffled = [...this.allWords].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 10);

    this.questions = selected.map((q) => {
      // 50% 확률로 객관식 또는 주관식 결정
      const type = Math.random() > 0.5 ? "multiple" : "subjective";
      if (type === "multiple") {
        return this.createMultipleChoice(q);
      } else {
        return {
          type: "subjective",
          word: q.word,
          translation: q.translation,
          answer: q.word.toLowerCase(), // 주관식은 소문자로 정답 체크
        };
      }
    });
  },

  // 객관식 문제 데이터 생성 (정답 1개 + 오답 3개)
  createMultipleChoice(correctWord) {
    const options = [correctWord.translation];
    const otherWords = this.allWords.filter((w) => w.id !== correctWord.id);
    const shuffledOthers = otherWords.sort(() => Math.random() - 0.5);

    // 무작위로 오답 3개 추출
    shuffledOthers.slice(0, 3).forEach((w) => options.push(w.translation));

    // 단어 개수가 부족할 경우 대비
    while (options.length < 4) {
      options.push("---");
    }

    return {
      type: "multiple",
      word: correctWord.word,
      translation: correctWord.translation,
      options: options.sort(() => Math.random() - 0.5), // 보기 섞기
      answer: correctWord.translation,
    };
  },

  // 화면에 현재 문제 렌더링
  renderQuestion() {
    const question = this.questions[this.currentQuestionIndex];
    const quizContent = document.getElementById("quiz-content");
    const progressBar = document.getElementById("quiz-progress-bar");

    // 진행 바 업데이트
    const progress = (this.currentQuestionIndex / this.questions.length) * 100;
    progressBar.style.width = `${progress}%`;

    let html = "";
    if (question.type === "multiple") {
      html = `
                <div class="quiz-card">
                    <p class="quiz-instruction">뜻을 고르세요</p>
                    <h2 class="quiz-word">${question.word}</h2>
                    <div class="quiz-options">
                        ${question.options
                          .map(
                            (opt) => `
                            <button class="quiz-option-btn">${this.escapeHtml(opt)}</button>
                        `,
                          )
                          .join("")}
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

  // 문제 유형별 이벤트 바인딩
  bindQuestionEvents() {
    const question = this.questions[this.currentQuestionIndex];

    if (question.type === "multiple") {
      const btns = document.querySelectorAll(".quiz-option-btn");
      btns.forEach((btn) => {
        btn.addEventListener("click", () =>
          this.handleAnswer(btn.textContent === question.answer),
        );
      });
    } else {
      const input = document.getElementById("subjective-input");
      const submitBtn = document.getElementById("submit-subjective-btn");

      const checkSubjective = () => {
        const userVal = input.value.trim().toLowerCase();
        this.handleAnswer(userVal === question.answer);
      };

      submitBtn.addEventListener("click", checkSubjective);
      input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") checkSubjective();
      });
      input.focus();
    }
  },

  // 정답 여부 처리 및 다음 문제로 이동
  handleAnswer(isCorrect) {
    if (isCorrect) {
      this.score++;
    }

    this.currentQuestionIndex++;
    if (this.currentQuestionIndex < this.questions.length) {
      this.renderQuestion();
    } else {
      this.showResult();
    }
  },

  // 최종 결과 화면 표시
  showResult() {
    const quizContent = document.getElementById("quiz-content");
    const progressBar = document.getElementById("quiz-progress-bar");
    progressBar.style.width = "100%";

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

    document.getElementById("finish-quiz-btn").addEventListener("click", () => {
      UIManager.showView("main");
    });
  },

  // 점수에 따른 피드백 메시지 생성
  getResultMessage() {
    const ratio = this.score / this.questions.length;
    if (ratio === 1) return "완벽해요! 대단합니다.";
    if (ratio >= 0.8) return "훌륭해요! 조금만 더 하면 완벽해요.";
    if (ratio >= 0.5) return "좋아요! 계속 연습해 보세요.";
    return "다시 한번 시도해 보세요. 포기하지 마세요!";
  },

  // HTML 특수문자 이스케이프
  escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  },
};
