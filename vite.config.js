import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // 상대 경로로 빌드해서 GitHub Pages(저장소 이름 하위 경로)에서도 그대로 동작
  base: './',
  // 같은 Wi-Fi의 태블릿에서 접속할 수 있도록 네트워크에 공개
  server: { host: true, port: 5173 },
  preview: { host: true, port: 4173 },
})
