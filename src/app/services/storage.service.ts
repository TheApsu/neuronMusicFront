import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage-angular';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private theStorage: Storage | null = null;
  saveCartSrc = new Subject();
  saveCartObs = this.saveCartSrc.asObservable();

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this.theStorage = storage;
  }

  public async set(key: string, value: any) {
    return await this.theStorage?.set(key, value);
  }

  public async get(key: string) {
    return await this.theStorage?.get(key) || undefined;
  }

  public async remove(key: string) {
    return await this.theStorage?.remove(key);
  }

  public async clear() {
    return await this.theStorage?.clear();
  }

  setLocal(key: string, value: any){
    localStorage.setItem(key, value)
  }

  getLocal(key: string){
    const value = localStorage.getItem(key);
    if(value) return JSON.parse(value);
  }

  removeLocal(key: string){
    localStorage.removeItem(key);
  }
}
 