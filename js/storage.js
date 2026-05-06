// 로컬 스토리지를 이용한 데이터 관리 모듈
const StorageManager = {
  STORAGE_KEY: "voca_storage_data",

  // 초기 데이터 구조 생성
  getInitialData() {
    return {
      settings: {
        theme: "light",
        lastUpdated: new Date().toISOString(),
      },
      words: [],
    };
  },

  // 로컬 스토리지에서 데이터 로드
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
      console.error("데이터 파싱 실패", e);
      return this.getInitialData();
    }
  },

  // 데이터를 로컬 스토리지에 저장
  save(data) {
    data.settings.lastUpdated = new Date().toISOString();
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  },

  // 모든 단어 목록 가져오기
  getWords() {
    const data = this.load();
    return data.words;
  },

  // 새로운 단어 추가 (중복 체크 포함)
  addWord(word, translation) {
    const data = this.load();
    const trimmedWord = word.trim();

    // 중복 체크 (대소문자 무시)
    const isDuplicate = data.words.some(
      (w) => w.word.toLowerCase() === trimmedWord.toLowerCase(),
    );
    if (isDuplicate) return null;

    const newWord = {
      id: crypto.randomUUID(), // 고유 ID 생성
      word: trimmedWord,
      translation: translation.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    data.words.unshift(newWord); // 목록 맨 앞에 추가
    this.save(data);
    return newWord;
  },

  // 기존 단어 수정
  updateWord(id, word, translation) {
    const data = this.load();
    const index = data.words.findIndex((w) => w.id === id);
    if (index !== -1) {
      data.words[index] = {
        ...data.words[index],
        word: word.trim(),
        translation: translation.trim(),
        updatedAt: new Date().toISOString(),
      };
      this.save(data);
      return data.words[index];
    }
    return null;
  },

  // 단어 삭제
  deleteWord(id) {
    const data = this.load();
    const filteredWords = data.words.filter((w) => w.id !== id);
    if (filteredWords.length !== data.words.length) {
      data.words = filteredWords;
      this.save(data);
      return true;
    }
    return false;
  },

  // 설정 정보 가져오기
  getSettings() {
    const data = this.load();
    return data.settings;
  },

  // 설정 정보 업데이트 (테마 등)
  updateSettings(newSettings) {
    const data = this.load();
    data.settings = { ...data.settings, ...newSettings };
    this.save(data);
  },
};
