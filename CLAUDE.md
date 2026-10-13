@AGENTS.md

# 인팩트컴퍼니 홈페이지 — 디자인 작업용 사본

운영 사이트(infactcompany.com)의 화면만 떼어 낸 사본이다. 데이터베이스·관리자·검색 노출 설정·방문 분석·문의 저장은 모두 빠져 있고, 운영 사이트와 연결된 곳이 없다. 여기서 무엇을 바꿔도 운영 사이트는 변하지 않는다.

- 이 폴더 밖(특히 `../infactcompany_hompage`, 운영 사이트 원본)은 읽지도 고치지도 않는다.
- 데이터베이스·로그인·API 키·외부 서비스 연동을 새로 붙이지 않는다. 이 사본의 목적은 디자인 수정뿐이다.
- 사용자는 디자이너다. 답변은 한국어로, 코드 용어보다 화면에서 보이는 것 기준으로 설명한다.

## 어디를 고치나

| 바꾸려는 것 | 위치 |
|---|---|
| 색·글자 크기·여백·버튼 등 공통 스타일 | `src/app/globals.css` |
| 헤더 / 푸터 | `src/components/Header.tsx`, `Footer.tsx` |
| 각 섹션의 배치·모션 | `src/components/sections/*.tsx` |
| 스크롤 등장 효과 | `src/components/Motion.tsx` + `globals.css` |
| 히어로 배경 효과 | `src/components/PrismGradient.tsx`, `ParticleDrift.tsx`, `RibbonGlow.tsx` |
| 문구·섹션 순서·이미지 지정 | `src/content/pages.json` (블로그 글은 `blogs.json`, 회사 정보는 `business.json`) |
| 이미지 파일 | `public/media/` (JSON 에서는 `/media/파일명`) |

섹션 종류(`kind`)와 컴포넌트 연결은 `src/components/SectionRenderer.tsx`, 각 섹션 데이터의 모양은 `src/lib/sections.ts` 에 있다. 기존 디자인 규칙은 `design/DESIGN.md` 참고.

## 실행·확인

- `npm run dev` → http://localhost:3000
- 수정 후 `npm run build` 가 통과하는지 확인한다.

## 주의

- `SectionRenderer` 에서 섹션 사이에 다른 요소를 끼우지 않는다. 서비스 페이지의 덮기 효과가 섹션이 바로 이어져 있다는 전제(`globals.css` 의 `.pain + .pain-m + section`)로 동작한다.
- 스크롤 등장 요소(`data-reveal`, `.reveal-stagger` 등)는 `Motion.tsx` 가 `is-visible` 클래스를 붙인다. 이런 요소의 `className` 을 React 상태로 바꾸면 그 클래스가 지워지므로 `data-*` 속성을 쓴다.
- 가로 스크롤이 생기면 안 된다. PC 와 모바일(360px) 폭 모두에서 확인한다.
- 문의 폼은 입력 검증만 하고 저장·전송하지 않는다(`src/app/(site)/contact/actions.ts`).
