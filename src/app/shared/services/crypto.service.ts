/*
 * Copyright (c) 2021 JFLab All rights reserved.
 * File Name : session-storage.service.ts
 * Author : jbh5310
 * Lastupdate : 2021-06-17 17:49:51
 */

import {Injectable} from '@angular/core';
import {APPCONSTANTS} from '../constants/appconstants';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  constructor() {
  }

  public generatorKey(conversion: string, text: string): string {
    const k = 'concplay1!';

    if (conversion === 'encrypt') {
      return CryptoJS.AES.encrypt( text, k ).toString();
    } else if (conversion === 'decrypt') {
      return CryptoJS.AES.decrypt( text, k ).toString(CryptoJS.enc.Utf8);
    }
  }

  public cryptoAesEncode(data: string): string {

    const key = this.generatorKey('decrypt', APPCONSTANTS.CRYPTO_KEY);

    return CryptoJS.AES.encrypt(data, key).toString();
  }

  public cryptoAesDecode(data: string): string {

    const key = this.generatorKey('decrypt', APPCONSTANTS.CRYPTO_KEY);

    return CryptoJS.AES.decrypt(data, key).toString(CryptoJS.enc.Utf8);
  }
}
