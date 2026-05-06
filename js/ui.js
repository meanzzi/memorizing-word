// 사용자 인터페이스 및 이벤트 관리 모듈

const UIManager = {
  // DOM 요소 참조 모음
  elements: {
    themeToggle: document.getElementById("theme-toggle"),
    themeIcon: document.querySelector(
      "#theme-toggle .material-symbols-rounded",
    ),
    wordList: document.getElementById("word-list"),
    addWordFab: document.getElementById("add-word-fab"),
    wordModal: document.getElementById("word-modal"),
    wordForm: document.getElementById("word-form"),
    wordInput: document.getElementById("word-input"),
    translationInput: document.getElementById("translation-input"),
    cancelModalBtn: document.getElementById("cancel-modal-btn"),
    modalTitle: document.getElementById("modal-title"),
    startQuizBtn: document.getElementById("start-quiz-btn"),
    mainView: document.getElementById("main-view"),
    quizView: document.getElementById("quiz-view"),
    closeQuizBtn: document.getElementById("close-quiz-btn"),
    // 커스텀 모달 요소
    customModal: document.getElementById("custom-modal"),
    customModalMessage: document.getElementById("custom-modal-message"),
    customModalCancel: document.getElementById("custom-modal-cancel"),
    customModalConfirm: document.getElementById("custom-modal-confirm"),
    toastContainer: document.getElementById("toast-container"),
  },

  currentEditingId: null, // 현재 수정 중인 단어의 ID

  // 초기화 함수
  init() {
    this.bindEvents();
    this.applyTheme(StorageManager.getSettings().theme);
    this.renderWordList();
  },

  // 이벤트 리스너 바인딩
  bindEvents() {
    // 테마 전환 버튼 클릭
    this.elements.themeToggle.addEventListener("click", () => {
      const currentTheme =
        document.documentElement.getAttribute("data-theme") || "light";
      const newTheme = currentTheme === "light" ? "dark" : "light";
      this.applyTheme(newTheme);
      StorageManager.updateSettings({ theme: newTheme });
    });

    // 단어 추가 버튼 클릭
    this.elements.addWordFab.addEventListener("click", () => this.showModal());
    // 모달 취소 버튼 클릭
    this.elements.cancelModalBtn.addEventListener("click", () =>
      this.hideModal(),
    );
    // 모달 바깥 영역 클릭 시 닫기
    this.elements.wordModal.addEventListener("click", (e) => {
      if (e.target === this.elements.wordModal) this.hideModal();
    });

    // 단어 추가/수정 폼 제출
    this.elements.wordForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleFormSubmit();
    });

    // 퀴즈 시작 버튼 클릭
    this.elements.startQuizBtn.addEventListener("click", () => {
      const words = StorageManager.getWords();
      if (words.length < 4) {
        this.showToast("퀴즈를 시작하려면 최소 4개의 단어가 필요합니다.");
        return;
      }
      this.showView("quiz");
      QuizEngine.init(words);
    });

    // 퀴즈 종료 버튼 클릭
    this.elements.closeQuizBtn.addEventListener("click", () => {
      this.showCustomModal("퀴즈를 종료할까요?", true, () => {
        this.showView("main");
      });
    });

    // 단어 목록 이벤트 위임 (발음, 수정, 삭제)
    this.elements.wordList.addEventListener("click", (e) => {
      const item = e.target.closest(".word-item");
      if (!item) return;

      const id = item.dataset.id;
      const word = StorageManager.getWords().find((w) => w.id === id);

      if (e.target.closest(".speak-btn")) {
        SpeechEngine.speak(word.word);
      } else if (e.target.closest(".edit-btn")) {
        this.showModal(word);
      } else if (e.target.closest(".delete-btn")) {
        this.showCustomModal(`'${word.word}' 단어를 삭제할까요?`, true, () => {
          StorageManager.deleteWord(id);
          this.renderWordList();
          this.showToast("단어가 삭제되었습니다.");
        });
      }
    });
  },

  // 테마 적용 (CSS 변수 및 아이콘 변경)
  applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    this.elements.themeIcon.textContent =
      theme === "light" ? "dark_mode" : "light_mode";
  },

  // 화면에 단어 목록 렌더링
  renderWordList() {
    const words = StorageManager.getWords();
    if (words.length === 0) {
      this.elements.wordList.innerHTML =
        '<li class="empty-state">단어장이 비어있습니다.<br>새로운 단어를 추가해 보세요!</li>';
      return;
    }

    this.elements.wordList.innerHTML = words
      .map(
        (word) => `
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
        `,
      )
      .join("");
  },

  // 단어 추가/수정 모달 표시
  showModal(word = null) {
    if (word) {
      this.currentEditingId = word.id;
      this.elements.modalTitle.textContent = "단어 수정";
      this.elements.wordInput.value = word.word;
      this.elements.translationInput.value = word.translation;
    } else {
      this.currentEditingId = null;
      this.elements.modalTitle.textContent = "단어 추가";
      this.elements.wordForm.reset();
    }
    this.elements.wordModal.classList.remove("hidden");
    this.elements.wordInput.focus();
  },

  // 모달 숨기기
  hideModal() {
    this.elements.wordModal.classList.add("hidden");
    this.currentEditingId = null;
  },

  // 폼 제출 처리 (저장 또는 업데이트)
  handleFormSubmit() {
    const word = this.elements.wordInput.value;
    const translation = this.elements.translationInput.value;

    if (this.currentEditingId) {
      StorageManager.updateWord(this.currentEditingId, word, translation);
      this.showToast("단어가 수정되었습니다.");
    } else {
      const result = StorageManager.addWord(word, translation);
      if (!result) {
        this.showToast("이미 존재하는 단어입니다.");
        return;
      }
      this.showToast("단어가 추가되었습니다.");
    }

    this.hideModal();
    this.renderWordList();
  },

  // 메인화면/퀴즈화면 전환
  showView(viewName) {
    if (viewName === "main") {
      this.elements.mainView.classList.remove("hidden");
      this.elements.quizView.classList.add("hidden");
      this.renderWordList();
    } else if (viewName === "quiz") {
      this.elements.mainView.classList.add("hidden");
      this.elements.quizView.classList.remove("hidden");
    }
  },

  // 커스텀 UI 헬퍼 함수들

  // 토스트 메시지 표시
  showToast(message, duration = 3000) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    this.elements.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = "toastOut 0.3s ease-in forwards";
      toast.addEventListener("animationend", () => toast.remove());
    }, duration);
  },

  // 커스텀 모달 표시 (알림 또는 확인용)
  showCustomModal(message, isConfirm = false, onConfirm = null) {
    this.elements.customModalMessage.textContent = message;
    this.elements.customModalCancel.classList.toggle("hidden", !isConfirm);
    this.elements.customModal.classList.remove("hidden");

    const close = () => {
      this.elements.customModal.classList.add("hidden");
      this.elements.customModalConfirm.onclick = null;
      this.elements.customModalCancel.onclick = null;
    };

    this.elements.customModalConfirm.onclick = () => {
      if (onConfirm) onConfirm();
      close();
    };

    this.elements.customModalCancel.onclick = close;
    this.elements.customModal.onclick = (e) => {
      if (e.target === this.elements.customModal) close();
    };
  },

  // HTML 특수문자 이스케이프 (XSS 방지)
  escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  },
};
