import { Injectable } from '@angular/core';
import CryptoJS from 'crypto-js';
import { Environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class EncDcrpService {
  key = CryptoJS.enc.Utf8.parse(Environment.ENCRYPT_KEY);
  iv = CryptoJS.enc.Utf8.parse(Environment.ENCRYPT_IV);

  constructor() {}

  encrptionFn(data: any) {
    const plaintext = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(plaintext, this.key, { iv: this.iv });
    return encrypted.toString();
  }
}
