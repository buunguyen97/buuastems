
---
-- 설치 순서(2021.10.29)
## Node  && NPM
* NODE : 16.10.0 ~~14.17.6~~
* NPM : npm install -g npm@7.24.1
* windows 일 경우 NVM 사용이 편함.

## Angular cli 설치npm install -g @angular/cli
* npm install -g @angular/cli

## Package 설치
* npm install

## 실행명령어
* ng serve --configuration dev


## 실행
* http://localhost:4201 로 접속
* 관리자 를 누른 후 계정은 aaaa / password입력

---
## Angular CLI 명령어..
* https://uxgjs.tistory.com/61
* 화면 생성 : ng g c [pages 포함한 경로(pages/poc/simulation)]
* 서비스 생성 : ng g s [pages 폴더명의 + 파일명까지 (pages/poc/simulation/simulation)]
* 메뉴달기
  * routing-module에 등록하기 
  * app-navigation에 메뉴등록
---


---
GC Memory Issue
* node --max_old_space_size=8192 ./node_modules/@angular/cli/bin/ng serve --configuration=dev
