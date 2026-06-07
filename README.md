# 영어 암기장 웹앱

Vanilla JavaScript 기반의 모바일 우선 영어 암기장 웹앱입니다.
사용자가 영어 단어를 저장하고 퀴즈를 통해 반복 학습할 수 있도록 설계했으며, 브라우저의 `localStorage`를 활용해 별도의 서버 없이 동작합니다.

프로젝트 구현 과정에서는 Gemini CLI 등을 활용해 초기 구조 설계와 기능 구현 속도를 높였습니다.
다만 AI의 제안을 그대로 사용하는 대신 유지보수성·사용자 경험·성능 관점에서 직접 구조를 수정하며 개발을 진행했습니다.

---

# 주요 기능

* 영단어 CRUD (추가 / 조회 / 수정 / 삭제)
* 객관식 / 주관식 퀴즈 시스템
* Web Speech API 기반 영단어 발음 기능
* 라이트 모드 / 다크 모드 지원
* 모바일 우선 반응형 UI
* 커스텀 Toast 및 확인 모달 UI
* 이벤트 위임 기반 성능 최적화

---

# 기술 스택

* HTML5
* CSS3
* Vanilla JavaScript
* Browser LocalStorage
* Web Speech API

---


# AI 협업 방식

프로젝트 진행 과정에서는 Gemini CLI를 활용했습니다.

* 초기 구조 설계
* UI 아이디어 탐색
* 기능 구현
* 리팩토링 방향 검토



또한 `gemini.md` 규칙 문서를 정의해 규칙을 지켜 작업이 진행되도록 관리했습니다.


실제 구현 과정에서는 AI가 제안한 구조를 그대로 사용하지 않고

* 이벤트 위임 기반 성능 개선
* 사용자 입력 데이터 검증
* 다크 모드 애니메이션 일관성 수정
* 유지보수 가능한 모듈 구조 분리

위 사항을 직접 판단하며 수정했습니다.

---

# 실행 방법

```bash
# 프로젝트 클론
git clone <repository-url>

# 프로젝트 폴더 이동
cd <project-folder>

# index.html 실행
```

별도의 서버 없이 브라우저 환경에서 실행 가능합니다.

---

# 문서

자세한 설계 및 AI 협업 과정은 `docs` 폴더에서 확인할 수 있습니다.

* `docs/CHANGE.md`
* `docs/ai-collaboration.md`
* `docs/architecture.md`
* `docs/design.md`
* `docs/prd.md`
* `docs/tasks.md`

