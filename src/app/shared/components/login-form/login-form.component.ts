/*
 * Copyright (c) 2021 JFLab All rights reserved.
 * File Name : login-form.component.ts
 * Author : jbh5310
 * Lastupdate : 2021-09-01 14:00:58
 */

import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {DxFormComponent} from 'devextreme-angular/ui/form';
import {AuthService} from '../../services';
import {DxButtonComponent, DxPopupComponent} from 'devextreme-angular';
import {APPCONSTANTS} from '../../constants/appconstants';
import {SessionStorageService} from '../../services/session-storage.service';
import {CookieService} from 'ngx-cookie-service';
import {CommonUtilService} from '../../services/common-util.service';
import {ProfileService} from '../../../pages/profile/profile.service';
import {TermService} from '../../../pages/mm/term/term.service';
import {CommonCodeService} from '../../services/common-code.service';
import {COMMONINITDATA} from '../../constants/commoninitdata';

declare let Kakao: any;
declare let google: any;
// declare let naver: any;

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit, AfterViewInit {
  @ViewChild('loginForm', {static: false}) loginForm: DxFormComponent;

  @ViewChild('signUp', {static: false}) signUp: DxPopupComponent;
  @ViewChild('signUpForm', {static: false}) signUpForm: DxFormComponent;

  @ViewChild('pwdPopup', {static: false}) pwdPopup: DxPopupComponent;
  @ViewChild('pwdPopupForm', {static: false}) pwdPopupForm: DxFormComponent;

  @ViewChild('pwdBtn', {static: false}) pwdBtn: DxButtonComponent;

  // signup 1 checkbox
  // option1: boolean;
  // option2: boolean;
  // optionAll: boolean;

  // Global
  G_TENANT: string = this.utilService.getTenant();
  G_COUNTRY: string = this.utilService.getLanguage();

  allCheckValue = false;

  checkUserType = true;

  currentStep: number;

  // DataSet
  dsPattern = [];

  // idPattern: RegExp = /[A-Za-z0-9]{4}$/;
  idPattern: RegExp;
  idPatternMsg: string;
  // pwPattern: RegExp = /^(?=.*?[A-Za-z])(?=.*?\d)[A-Za-z\d]{8,}$/;
  pwPattern: RegExp;
  pwPatternMsg: string;

  tzNames: string[];

  selectedTz: string;

  pwdPopupData = {
    changePassword: ''
  };

  phoneMask = COMMONINITDATA.DEFAULT_PHONE_MASK;
  phoneRules = COMMONINITDATA.PHONE_RULES;
  phoneEditorOptions = this.utilService.getPhoneEditorOptions();
  telEditorOptions = this.utilService.getTelEditorOptions();

  constructor(public utilService: CommonUtilService,
              private authService: AuthService,
              private termService: TermService,
              private codeService: CommonCodeService,
              private service: ProfileService,
              private router: Router,
              private sessionStorageService: SessionStorageService,
              private cookieService: CookieService) {
    this.tzNames = this.utilService.getTimeZoneNames();
    this.onSignIn = this.onSignIn.bind(this);
    this.changeId = this.changeId.bind(this);
    this.pwdPopupSaveClick = this.pwdPopupSaveClick.bind(this);
  }

  ngOnInit(): void {
    this.initCode();
  }

  initCode(): void {
    // 사용여부
    this.codeService.getCode(this.G_TENANT, 'SYSTEMSETTING').subscribe(result => {
      this.dsPattern = result.data;

      for (const pattern of this.dsPattern) {
        if ( pattern.code === 'PATTERN_ID' ) {
          this.idPattern = new RegExp(pattern.etcColumn1);
          this.idPatternMsg = pattern.etcColumn2;
        } else if ( pattern.code === 'PATTERN_PW' ) {
          this.pwPattern = new RegExp(pattern.etcColumn1);
          this.pwPatternMsg = pattern.etcColumn2;
        }
      }
    });
  }

  ngAfterViewInit(): void {
    // 첫번째 탭 활성화
    const spinner = document.querySelector('#global-loading');

    if (spinner) {
      setTimeout(() => spinner.setAttribute('style', 'display: none;'), 1000);
    }

    const locale = this.utilService.getLanguage();
    this.utilService.setLanguage(locale);

    let timeZone = this.cookieService.get(APPCONSTANTS.TEXT_TIMEZONE);

    if ((timeZone !== 'undefined') && timeZone && (timeZone !== '') && (timeZone !== undefined)) {
      this.selectedTz = timeZone;
    } else {
      timeZone = this.utilService.getBrowserTimeZone();
    }
    this.utilService.useLocale(timeZone);

    if (this.cookieService.get(APPCONSTANTS.TOKEN_USER_TENANT_KEY)) {
      // this.formData.controls.tenant.value = this.cookieService.get(APPCONSTANTS.TOKEN_USER_TENANT_KEY);
      // this.loginForm.instance.getEditor('tenant').option('value', this.cookieService.get(APPCONSTANTS.TOKEN_USER_TENANT_KEY));
      // this.loginForm.instance.getEditor('id').option('value', this.cookieService.get(APPCONSTANTS.TOKEN_USER_USERID_KEY));
      // this.loginForm.instance.getEditor('rememberMe').option('value', this.cookieService.get(APPCONSTANTS.TOKEN_USER_REMEMBERME));
    }

    // this.loginForm.instance.getEditor('country').option('value', locale);
    // this.loginForm.instance.getEditor('timeZone').option('value', timeZone);

    // Social Login
    // Google 인증 설정
    google.accounts.id.initialize({
      client_id: '757973945814-4e0ttr6ddlofeg7dpkcqlljrsimlpvkb.apps.googleusercontent.com',
      callback: (response: any) => this.handleGoogleSignIn(response)
    });

    google.accounts.id.renderButton(
      document.getElementById('btnGoogle'),
      { size: 'large', type: 'icon', shape: 'pill' }  // customization attributes
    );

    // Kakao 인증 설정
    if (!Kakao.isInitialized()) {
      Kakao.init('836eea5a741e70d9536caac12e02cb63'); // 사용하려는 앱의 JavaScript 키 입력
      Kakao.isInitialized();
    }

    // @ts-ignore
    console.log(naver);

    window.name = 'opener';

    console.log('http://' + window.location.hostname + ((location.port === '' || location.port === undefined) ? '' : ':' + location.port) + '/call-back');

    // @ts-ignore
    const naverLogin = new naver.LoginWithNaverId({
      clientId: '4kBgkfr027aTN9dLAoN7',
      // tslint:disable-next-line:max-line-length
      callbackUrl: 'http://' + window.location.hostname + ((location.port === '' || location.port === undefined) ? '' : ':' + location.port) + '/call-back',
      isPopup: true, /* 팝업을 통한 연동처리 여부 */
      loginButton: { color: 'green', type: 1, height: 50 } /* 로그인 버튼의 타입을 지정 */
    }); /* 설정정보를 초기화하고 연동을 준비 */

    naverLogin.init();

    document.getElementById('naverIdLogin_loginButton').setAttribute('href', 'javascript:void(0);');

    console.log(document.getElementById('naverIdLogin_loginButton').getAttribute('href'));

    /* (5) 현재 로그인 상태를 확인 */
    window.addEventListener('load', () => {
      console.log(naverLogin.user);

      naverLogin.getLoginStatus((status) => {
        if (status) {
          /* (6) 로그인 상태가 "true" 인 경우 로그인 버튼을 없애고 사용자 정보를 출력합니다. */
          setLoginStatus();
        }
      });
    });

    /* (6) 로그인 상태가 "true" 인 경우 로그인 버튼을 없애고 사용자 정보를 출력합니다. */
    function setLoginStatus(): void {
      const profileImage = naverLogin.user.getProfileImage();
      const nickName = naverLogin.user.getNickName();
      let imageViewer = '';
      if (profileImage) {
        imageViewer += '<br><br><img src="' + profileImage + '" height=50 /> <p>';
      }

    //   $("#naverIdLogin_loginButton").html(imageViewer + nickName + '님 반갑습니다.</p>');
    //   $("#gnbLogin").html("Logout");
    //   $("#gnbLogin").attr("href", "#");
    //   /* (7) 로그아웃 버튼을 설정하고 동작을 정의합니다. */
    //   $("#gnbLogin").click(function (e) {
    //   e.preventDefault();
    //   naverLogin.logout();
    //   location.replace('/oauth/sample/javascript_sample.html');
    // });
    }
  }

  // Google 인증 Start
  handleGoogleSignIn(response): void {
    console.log(response.credential);

    // This next is for decoding the idToken to an object if you want to see the details.
    const base64Url = response.credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    console.log(JSON.parse(jsonPayload));
  }
  // Google 인증 End

  // Kakao 인증 Start
  loginWithKakao(): void {
    Kakao.Auth.login({
      success: (success) => {
        alert(JSON.stringify(success));
        Kakao.Auth.setAccessToken(success.access_token);
        this.profileWithKakao();
      },
      fail: (err) => {
        alert(JSON.stringify(err));
      },
    });
  }

  profileWithKakao(): void {
    // @ts-ignore
    Kakao.API.request({
      url: '/v2/user/me',
      success: (response) => {
        console.log(response);
        // document.getElementById("userid").innerText = response.id;
        // document.getElementById("nickname").innerText = response.kakao_account.profile.nickname;
        // document.getElementById("profile_image").src = response.properties.profile_image;
        // document.getElementById("thumbnail_image").src = response.properties.thumbnail_image;
      },
      fail: (error) => {
        console.log(error);
      }
    });
  }
  // Kakao 인증 End

  onClickUserType(e, userType): void {
    this.utilService.setUserType(userType);
    this.changeUserType();
  }

  changeUserType(): void {
    this.checkUserType = !this.checkUserType;
  }

  async onSignIn(): Promise<void> {
    const loginFormData = this.loginForm.formData;
    const loginValidate = this.loginForm.instance.validate();
    const userType = this.utilService.getUserType();

    if (!loginValidate.isValid) {
      loginValidate.brokenRules[0][COMMONINITDATA.VALIDATOR].focus();
      return;
    }
    loginFormData.tenant = this.G_TENANT;
    loginFormData.country = this.G_COUNTRY;
    loginFormData.userType = userType;

    const {tenant, timeZone, country} = loginFormData;

    this.utilService.dictionary = null;
    await this.utilService.setLanguage(country);
    await this.utilService.initMessages();

    const result = await this.authService.logInPost(loginFormData);

    if (!result.success) {
      this.utilService.notify_error(result.msg);
      // notify(result.msg, 'error', 2000);
    } else {
      // const companyId = result.data.companyId !== null ? result.data.companyId.toString() : null;
      this.cookieService.set(APPCONSTANTS.TOKEN_USER_TENANT_KEY, result.data.tenant, 7);
      this.cookieService.set(APPCONSTANTS.TOKEN_USER_USERID_KEY, result.data.usr, 7);
      this.cookieService.set(APPCONSTANTS.TOKEN_USER_USERID_UID, result.data.uid.toString(), 7);
      // this.cookieService.set(APPCONSTANTS.TOKEN_USER_COMPANYID, companyId, 7);
      // this.cookieService.set(APPCONSTANTS.TOKEN_USER_REMEMBERME, rememberMe, 7);

      this.cookieService.set(APPCONSTANTS.TEXT_TIMEZONE, timeZone, 7);
      this.cookieService.set(APPCONSTANTS.TEXT_LOCALE, country, 7);

      this.utilService.useLocale(timeZone);

      // 최초 로그인 체크
      if (result.code === APPCONSTANTS.CHANGE_PASSWORD_REQUIRED) {
        loginFormData.uid = result.data.uid;
        this.pwdPopup.visible = true;
        return;
        // 최초 로그인시 비밀번호 변경 팝업 호출
      }
    }
  }

  onCreateAccountClick = () => {
    // this.router.navigate(['/create-account']);
    // this.returnMSG();
    this.termService.sendPost({tenant: this.G_TENANT, termType: '0'}, 'findTerm').then(result => {
      const signUpFormData = this.signUpForm.formData;
      signUpFormData.termList = result.data;

      this.onActiveStep(1).then(r => {
        signUpFormData.optionAll = signUpFormData.optionAll || false;
        signUpFormData.checkedId = signUpFormData.checkedId || false;

        for (const term of signUpFormData.termList) {
          term.termValue = term.termValue || false;
        }
        this.signUpOpen();
      });
    });
  }

  /*signup*/
  signUpOpen(): void {
    this.signUp.visible = true;
  }

  async onActiveStep(step): Promise<void> {
    const signUpFormData = this.signUpForm.formData;

    if (step === 2) {

      for (const term of signUpFormData.termList) {

        if (term.requiredYn === 'Y') {

          if (!term.termValue) {
            this.utilService.notify_error('필수항목은 반드시 동의하셔야 합니다.');
            return;
          }
        }
      }
      this.currentStep = step;
    } else if (step === 3) {
      const signUpFormValidate = this.signUpForm.instance.validate();

      if (!signUpFormValidate.isValid) {
        signUpFormValidate.brokenRules[0][COMMONINITDATA.VALIDATOR].focus();
        return;
      }

      if (!signUpFormData.checkedId) {
        this.utilService.notify_error('사용자 ID확인이 필요합니다.');
        return;
      }
      const userType = this.utilService.getUserType();

      signUpFormData.tenant = this.G_TENANT;
      signUpFormData.userType = userType;
      signUpFormData.shortName = this.signUpForm.formData.name;
      signUpFormData.smsYn = this.signUpForm.formData.smsYn ? COMMONINITDATA.FLAG_TRUE : COMMONINITDATA.FLAG_FALSE;
      signUpFormData.emailYn = this.signUpForm.formData.emailYn ? COMMONINITDATA.FLAG_TRUE : COMMONINITDATA.FLAG_FALSE;
      signUpFormData.appPushYn = this.signUpForm.formData.appPushYn ? COMMONINITDATA.FLAG_TRUE : COMMONINITDATA.FLAG_FALSE;

      this.authService.sendPost(signUpFormData, 'signon').then(saveResult => {

        if (saveResult.success) {
          this.currentStep = step;
        } else {
          this.utilService.notify_error('관리자에게 문의하세요.');
        }
      });
    } else {
      this.currentStep = step;
    }
  }

  allValueChanged(e): void{
    const signUpFormData = this.signUpForm.formData;

    for (const term of signUpFormData.termList) {
      term.termValue = !this.allCheckValue;
    }
  }

  valueChanged(e): void{
    const signUpFormData = this.signUpForm.formData;
    let finishFlg = false;

    for (const term of signUpFormData.termList) {

      if (!term.termValue) {
        finishFlg = false;
        break;
      } else {
        finishFlg = true;
      }
    }
    this.allCheckValue = finishFlg;
  }

  changeId(e): void {

    // if (this.signUpForm.formData.checkedId) {
    //   this.signUpForm.formData.checkedId = false;
    // }
  }

  checkId(): void {
    const signUpFormData = this.signUpForm.formData;

    if (!signUpFormData.usr) {
      return;
    }

    if (!this.idPattern.test(signUpFormData.usr)) {
      this.utilService.notify_error(this.idPatternMsg);
      return;
    }
    const userType = this.utilService.getUserType();
    const checkData = {tenant: this.G_TENANT, userType, usr: signUpFormData.usr};

    this.authService.sendPost(checkData, 'countSignUser').then(result => {

      if (result.data > 0) {
        signUpFormData.checkedId = false;
        this.utilService.notify_error('이미존재하는 ID입니다.');
      } else {
        signUpFormData.checkedId = true;
        this.utilService.notify_success('사용 가능한 아이디입니다.');
      }
    });
  }

  passwordConfirm = () => this.signUpForm.formData.password;



  // socialLogin(snsType): void {
  //   console.log(snsType);
  //
  //   if (snsType === 'google') {
  //     this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then();
  //   } else if (snsType === 'facebook') {
  //     this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).then();
  //   }
  // }

  signInWithGoogle(): void {
  }

  signInWithFB(): void {
  }

  // phone 양식 커서 위치
  focusIn(e: any): void {
    let len = 1;
    const textValue = e.component._textValue?.trimEnd();
    if (textValue && textValue.charAt(textValue.length - 1) !== ')') {
      len = textValue.length + 1;
    } else {
      len = e.component._value?.trimEnd().length + 1;
    }

    e.element.children[1].children[0].children[0].onclick = () => {
      if (e.element.children[1].children[0].children[0].selectionStart < textValue.length) {

      } else {
        e.element.children[1].children[0].children[0].selectionStart = len || 1;
        e.element.children[1].children[0].children[0].selectionEnd = len || 1;
      }
    };
  }

  setChangeMask(e): void {
    const dataField = e.target.id.split('_').pop();

    if (dataField === 'phone' || dataField === 'tel') {
      const popFormIsc = this.signUpForm.instance;
      const getId = 'getItemID';
      const elId = popFormIsc[getId](dataField);
      let mask;

      if (elId === e.target.id) {

        if (e.type === 'focusin') {

          mask = dataField === 'phone' ? COMMONINITDATA.DEFAULT_PHONE_MASK : COMMONINITDATA.DEFAULT_TEL_MASK;
        } else if (e.type === 'focusout') {
          const value = this.signUpForm.formData[dataField];

          if (!value) {
            mask = dataField === 'phone' ? COMMONINITDATA.DEFAULT_PHONE_MASK : COMMONINITDATA.DEFAULT_TEL_MASK;
          } else {

            if (dataField === 'phone') {
              mask = this.utilService.getPhoneMask(value);
            } else if (dataField === 'tel') {
              mask = this.utilService.getTelMask(value);
            }
          }
        }
        popFormIsc.getEditor(dataField).option('mask', mask);
      }
    }
  }

  signUpClose(): void {
    this.signUp.visible = false;
  }

  onHiddenSignUp(): void {
    this.allCheckValue = false;
    this.signUpForm.formData = {};
  }

  async pwdPopupSaveClick(): Promise<void> {
    const pwdPopData = this.pwdPopupForm.instance.validate();
    const saveData = Object.assign(this.loginForm.formData, this.pwdPopupData);

    if (pwdPopData.isValid) {

      try {
        const result = await this.service.updatePwd(saveData);

        if (!result.success) {
          this.utilService.notify_error(result.msg);
          return;
        } else {
          this.utilService.notify_success('Save success');
          this.pwdPopup.visible = false;
          this.loginForm.instance.getEditor('password').option('value', '');
        }
      } catch {
        this.utilService.notify_error('There was an error!');
      }
    }
  }

  passwordComparison = () => this.pwdPopupData.changePassword;

  onHidden(): void {
    this.pwdPopupForm.instance.resetValues();
  }

  onEnterKey(e): void {

    if (e.dataField === 'password') {
      this.onSignIn().then();
    }
  }

  countryChanged = (e: any) => {
    let lang: string;
    lang = e.value;
    localStorage.setItem(APPCONSTANTS.TEXT_LOCALE, lang);
  }

  returnMSG(): void {
    const msg = this.utilService.convert1('Please contact the administrator.', 'Please contact the administrator.');
    this.utilService.notify_error(msg);
  }
}
