# Design Definition: 영어 암기장 웹앱

## 1. 디자인 컨셉

- **Clean & Minimal**: 토스(Toss) 스타일의 깔끔하고 직관적인 UI를 지향합니다.
- **High Contrast**: 라이트 모드와 다크 모드 간의 확실한 대비를 제공하여 가독성을 높입니다.

## 2. 컬러 팔레트

### 2.1. 라이트 모드 (Light Mode)

- **Primary**: `#5e6ad2` (브랜드 컬러)
- **Background**: `#ffffff` (흰색)
- **Surface**: `#f2f4f6` (연한 회색, 카드나 입력창 배경)
- **Text Primary**: `#191f28` (짙은 회색)
- **Text Secondary**: `#4e5968` (중간 회색)

### 2.2. 다크 모드 (Dark Mode)

- **Primary**: `#5e6ad2`
- **Background**: `#000000` (완전한 검정)
- **Surface**: `#1c1c1e` (어두운 회색)
- **Text Primary**: `#ffffff` (흰색)
- **Text Secondary**: `#b0b8c1` (연한 회색)

## 3. 타이포그래피

- **Font Family**: `Pretendard`, -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
- **Weights**: Regular(400), Medium(500), Bold(700)

## 4. 화면 레이아웃 및 구성

### 4.1. 메인 화면 (Main View)

- **단어 목록 중심**: 저장된 단어들이 리스트 형태로 나열됩니다.
- **테스트 시작**: 하단 혹은 상단에 눈에 띄는 고정 버튼으로 '퀴즈 시작' 기능을 배치합니다.
- **추가 버튼**: 플로팅 액션 버튼(FAB) 또는 리스트 상단에 위치하여 단어 추가 모달을 호출합니다.

### 4.2. 단어 추가 모달 (Add/Edit Modal)

- **형식**: 중앙 팝업(Modal) 방식.
- **필드**: 영단어(Input), 뜻(Input).
- **액션**: '취소', '저장' 버튼.

### 4.3. 퀴즈 화면 (Quiz View)

- **상단 진행 바(Progress Bar)**: 전체 문제 수 대비 현재 진행 상황을 시각적으로 표시.
- **객관식**: 단어와 4개의 뜻 선택지 카드로 구성.
- **주관식**: 뜻과 영단어 입력창으로 구성.

## 5. 컴포넌트 스타일

- **Border Radius**: 버튼 및 카드 UI의 모서리는 `12px` 정도로 약간 둥글게 처리.
- **Interactions**:
  - 버튼 클릭/호버 시 Scale 변화(0.98) 또는 배경색 변화 효과 적용.
  - 리스트 아이템 클릭 시 부드러운 하이라이트 효과.

## 6. 아이콘 및 에셋

- **Icon Library**: Google Material Symbols (Rounded) 사용 예정.
- **주요 아이콘**:
  - `delete`: 삭제 (휴지통)
  - `volume_up`: 발음 재생 (스피커)
  - `add`: 단어 추가
  - `dark_mode` / `light_mode`: 테마 전환

## 7. 애니메이션

- 화면 전환 시 Fade-in 효과.
- 모달 등장 시 Slide-up 효과.
- 정답/오답 피드백 시 간단한 진동 또는 색상 변화 애니메이션.
