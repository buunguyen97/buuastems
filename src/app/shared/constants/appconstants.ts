/*
 * Copyright (c) 2021 JFLab All rights reserved.
 * File Name : appconstants.ts
 * Author : jbh5310
 * Lastupdate : 2021-10-03 12:46:57
 */

import {environment} from '../../../environments/environment';

export class APPCONSTANTS {
  public static HEADER_TOKEN = 'Authorization';
  // public static TOKEN_KEY = 'jflab_wm_token';
  public static TOKEN_USER_TENANT_KEY = 'jflab_allRight_user_tenant';
  public static TOKEN_USER_USERID_KEY = 'jflab_allRight_user_user';
  public static TOKEN_USER_USERID_UID = 'jflab_allRight_user_uid';
  // public static TOKEN_USER_REMEMBERME = 'jflab_wm_remember';
  public static TOKEN_USER_COMPANYID = 'jflab_allRight_companyid';

  // public static TOKEN_ACCEPT_TOKEN = 'jflab_wm_accept_token';

  public static LANG_KO = 'ko'/*'ko-KR'*/;
  public static LANG_US = 'en'/*'en-US'*/;
  public static LANG_DEFAULT = APPCONSTANTS.LANG_KO;

  public static TEXT_LOCALE = 'locale';
  public static TEXT_TIMEZONE = 'timeZone';

  public static TEXT_PATH_SEPARATOR = ' > ';  // 페이지 경로 구분
  public static TEXT_PAGE_PATH = 'page_path';
  public static TEXT_WAREHOUSE_ID = 'warehouseId';
  public static TEXT_WAREHOUSE_VO = 'warehouseVO';
  public static TEXT_OWNER_ID = 'ownerId';
  public static TEXT_ITEMADMIN_ID = 'itemAdminId';

  public static BASE_URL_WM = environment.URL.WM;
  public static BASE_URL_RP = environment.URL.RP;

  public static ISLOGIN = 'isLogin';

  public static TEXT_SYSTEM_TYPE = 'system_type';
  public static DEFAULT_SYSTEMT_TYPE = 'ADMIN';

  public static USER_TYPE = 'user_type';

  public static PAGE_INFO = 'page_info';

  public static APPLIED_UTSETTING = 'applied_utSetting';
  public static DEFAULT_THEME = 'light.custom';
  public static DEFAULT_FONTSIZE = '16';
  public static DEFAULT_FONT = 'nanumgothic';

  public static CHANGE_PASSWORD_REQUIRED = 'changePasswordRequired';




  // Alporter Key로 변경 2022-06-21
  // public static GOOGLE_MAP_API_KEY = 'AIzaSyDI3ChJAmSoajg3HmNQNvIoViojmg7HOTo';
  // public static NAVER_MAP_API_KEY = '0oaj1imazi';
  public static GOOGLE_MAP_API_KEY = environment.KEY.GOOGLE_MAP_API_KEY;
  public static NAVER_MAP_API_KEY = environment.KEY.NAVER_MAP_API_KEY;
  public static T_MAP_API_KEY = environment.KEY.T_MAP_API_KEY;
  public static OPEN_WEATHER_API_KEY = environment.KEY.OPEN_WEATHER_API_KEY;

  // 암복호화 키 : allright 2022-12-15
  public static CRYPTO_KEY = 'U2FsdGVkX18vJn0QMd6aRdZ+hOTrRyqTMq3/lFd8pJI=';
}
