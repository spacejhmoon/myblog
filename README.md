# React + TypeScript + Vite

이 템플릿은 Vite에서 HMR과 일부 ESLint 규칙으로 React를 동작시키는 최소 설정을 제공합니다.

현재 사용 가능한 공식 플러그인은 두 가지입니다:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) — [Babel](https://babeljs.io/) (또는 [rolldown-vite](https://vite.dev/guide/rolldown) 사용 시 [oxc](https://oxc.rs))로 Fast Refresh 지원
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) — [SWC](https://swc.rs/)로 Fast Refresh 지원

## React Compiler

개발·빌드 성능 영향으로 이 템플릿에서는 React Compiler가 비활성화되어 있습니다. 사용하려면 [설치 문서](https://react.dev/learn/react-compiler/installation)를 참고하세요.

## ESLint 설정 확장

프로덕션 앱을 개발 중이라면, 타입 인식 린트 규칙을 사용하도록 설정을 업데이트하는 것을 권장합니다:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // 기타 설정...

      // tseslint.configs.recommended 제거 후 아래로 교체
      tseslint.configs.recommendedTypeChecked,
      // 더 엄격한 규칙: tseslint.configs.strictTypeChecked
      // 스타일 규칙: tseslint.configs.stylisticTypeChecked

      // 기타 설정...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // 기타 옵션...
    },
  },
])
```

React 전용 린트 규칙을 위해 [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x)와 [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom)을 설치할 수도 있습니다:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // 기타 설정...
      // React 린트 규칙
      reactX.configs['recommended-typescript'],
      // React DOM 린트 규칙
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // 기타 옵션...
    },
  },
])
```
