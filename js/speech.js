// Web Speech API를 이용한 음성 합성(TTS) 모듈
const SpeechEngine = {
  // 텍스트를 읽어주는 함수
  speak(text, lang = "en-US") {
    if (!window.speechSynthesis) {
      console.warn("이 브라우저는 음성 합성을 지원하지 않습니다.");
      return;
    }

    // 이전 음성 재생 취소
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang; // 언어 설정 (기본: 영어)
    utterance.rate = 1.0; // 속도
    utterance.pitch = 1.0; // 피치

    window.speechSynthesis.speak(utterance);
  },
};
