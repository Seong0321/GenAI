``sh
# npm -> 현재 폴더를 node 관련 프로젝트로 만들어주겠다.
npm init -y
```

```sh
# npm install # package json에 기술된 의존성을 설치
# npm install {패키지명} # 현재 노드 프로젝트에 패키지 설치
npm i express
# yarn, pnpm 이라는 차세대 패키지 매니저가 있음
```

```sh
# .gitignore 작성 필요

echo node_modules > .gitignore