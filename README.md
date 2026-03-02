# KakaoTalk Theme Download Site

`config/`의 설정을 읽어 `site/` 정적 페이지에 반영하는 간단한 다운로드 랜딩 페이지입니다.

## 폴더 구조

- `config/theme.json`: 테마명/설명/Android·iOS 다운로드 링크 설정
- `site/`: 정적 웹페이지
  - `index.html`
  - `styles.css`
  - `app.js`

## 설정 변경

`config/theme.json`에서 아래 항목을 수정하세요.

- `themeName`, `subtitle`, `description`
- `android.downloadUrl`, `ios.downloadUrl`
- `android.label`, `ios.label`
- `android.note`, `ios.note`

다운로드 URL이 비어있으면 버튼은 자동으로 비활성화됩니다.

## 로컬 미리보기(권장)

정적 파일은 파일 더블클릭(`file://`)로 열면 `fetch`가 막힐 수 있어요. 로컬 서버로 여세요.

```bash
cd .
python3 -m http.server 5173
```

그 다음 브라우저에서 `http://localhost:5173` 접속(자동으로 `/site/`로 이동).

## Render(Static Site) 배포

Render에서 **Static Site**로 생성 후:

- **Root Directory**: 비워두기 (repo 루트)
- **Build Command**: 비워두기
- **Publish Directory**: `.`

배포 후 `/site/` 페이지가 `/config/theme.json`을 읽어야 하므로, `site/`와 `config/` 폴더가 모두 루트에 포함되어 있어야 합니다.

