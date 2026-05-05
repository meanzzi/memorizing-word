# Architecture & Technical Specification: 영어 암기장 웹앱

## 1. 시스템 개요
본 애플리케이션은 서버 없이 브라우저 환경에서 동작하는 Vanilla JavaScript 기반의 SPA(Single Page Application) 스타일 웹앱입니다.

## 2. 데이터 아키텍처 (Storage)
데이터는 브라우저의 `localStorage`를 사용하며, JSON 형식으로 관리됩니다.

### 2.1. 데이터 스키마
- **Key**: `voca_storage_data`
- **Structure**:
```json
{
  "settings": {
    "theme": "light" | "dark",
    "lastUpdated": "ISO_DATE_STRING"
  },
  "words": [
    {
      "id": "uuid-v4",
      "word": "apple",
      "translation": "사과",
      "createdAt": "ISO_DATE_STRING",
      "updatedAt": "ISO_DATE_STRING"
    }
  ]
}
```

## 3. 모듈 구조 (Module Structure)
코드의 유지보수성을 위해 기능별로 모듈을 분리하여 관리합니다.

- **`StorageManager`**: `localStorage`와의 통신(CRUD)을 담당.
- **`UIManager`**: DOM 조작, 이벤트 바인딩, 모달 관리, 테마 전환 담당.
- **`QuizEngine`**: 퀴즈 데이터 생성(셔플링), 정답 체크, 점수 계산 로직 담당.
- **`SpeechEngine`**: Web Speech API를 사용한 단어 발음 기능 담당.
- **`App`**: 각 모듈을 초기화하고 전체적인 흐름을 제어.

## 4. 주요 기능 상세 설계

### 4.1. 단어 관리 (CRUD) 흐름
1. **Create**: 모달에서 입력받은 데이터를 `StorageManager`를 통해 저장하고 `UIManager`로 목록 갱신.
2. **Read**: 앱 시작 시 `StorageManager`가 데이터를 로드하고 `UIManager`가 화면에 렌더링.
3. **Update**: 특정 아이템의 수정 버튼 클릭 시 모달에 기존 값을 채우고, 저장 시 데이터 업데이트 및 화면 갱신.
4. **Delete**: 삭제 확인 후 데이터를 제거하고 화면에서 해당 요소를 삭제.

### 4.2. 퀴즈 시스템 로직
- **데이터 준비**: 전체 단어 목록에서 퀴즈에 필요한 개수만큼 무작위 추출.
- **객관식**: 1개의 정답과 3개의 오답(다른 단어의 뜻)을 섞어서 4지 선다형 데이터 생성.
- **주관식**: 뜻을 제시하고 사용자의 입력값(Trim, Lowercase 처리)을 정답 영단어와 비교.
- **진행 관리**: 현재 인덱스를 추적하여 상단 프로그레스 바 갱신.

## 5. UI/UX 구현 전략
- **State-driven Rendering**: 데이터 상태가 변경될 때마다 관련 UI 컴포넌트가 다시 그려지도록 설계.
- **CSS Variable**: 다크 모드 구현을 위해 CSS 변수(Variables)를 적극 활용하여 테마 전환 처리.
- **Responsive Design**: Flexbox와 Grid를 활용하여 모바일 환경에 최적화된 레이아웃 구현.

## 6. 보안 및 예외 처리
- **XSS 방지**: 사용자 입력값을 DOM에 삽입할 때 `textContent`를 사용하거나 적절한 이스케이프 처리.
- **데이터 무결성**: 로드된 JSON 데이터가 손상되었을 경우를 대비해 초기화 로직(Default State) 구현.
- **저장 용량**: `localStorage`의 용량 제한(약 5MB)을 고려하여 데이터 최적화.
