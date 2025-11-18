import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStoreService {
  private ls = window.localStorage;
  private ss = window.sessionStorage;

  constructor() {}

  public setItem(keyName: string, keyVal: string) {
    keyVal = JSON.stringify(keyVal);
    sessionStorage.setItem(keyName, keyVal);
    return true;
  }

  public getItem(keyName: string) {
    let value = sessionStorage.getItem(keyName);
    try {
      if (value != null) {
        return JSON.parse(value);
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  }

  public clearLSStore() {
    this.ls.clear();
    this.ss.clear();
  }
}
