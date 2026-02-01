# Reetry Frontend (Next.js 16)

### 명령어 실행
swagger 명령어

```bash
pnpm api:gen
```

## 환경 변수

- `NEXT_PUBLIC_AMPLITUDE_API_KEY`: Amplitude 프로젝트 API Key

## Amplitude 이벤트 추적

- 모든 페이지 전환 시 `page_view` 이벤트가 자동으로 전송된다.
- 커스텀 이벤트가 필요하면 `trackAmplitudeEvent` 함수를 사용해서 추가 이벤트를 발송한다.
