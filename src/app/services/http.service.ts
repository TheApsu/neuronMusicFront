import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';
import { UiServices } from './ui-services';
import { NetworkConnectionService } from './network-connection.service';

@Injectable({
  providedIn: 'root'
})

export class HttpService {
  private _baseApi = environment.api;
  private _clientToken = undefined;
  private _permission: any[] = [];
  public clientData = undefined;

  get permission(){
    return this._permission;
  }

  set permission(value){
    this._permission = value;
  }

  set clientToken(value){
    this._clientToken = value;
  }

  get clientToken(){
    return this._clientToken;
  }

  constructor(
    private httpClient: HttpClient,
    private storageSv: StorageService,
    private uiSv: UiServices,
    private networkSv: NetworkConnectionService
  ) { 
    this.getToken();
  }

  getToken(){
    const user = this.storageSv.getLocal('user') || '';
    const tokenData = user?.token;
    this.clientData = user?.user;
    console.log('this.clientData :>> ', this.clientData);
    this.clientToken = tokenData.token;
  }

  get(uri: string, action: string, params?: any){
    return new Promise(async (resolve, reject) => {

      this.httpClient.get(
        `${this._baseApi}/${uri}/${action}`,
        {
          params,
          headers: {
            'Authorization': `bearer ${this.clientToken}`
          }
        }
      )
        .subscribe(
          {
            next: (value) => {
              resolve(value)
            },
            error: (err) => {
              this.uiSv.showToast('Ha ocurrido un error.');
              if(!this.clientToken){
                reject({ token: false })
              }else{
                this.networkSv.status = false;
                resolve({data: this.clientData});
              }
              reject(err)
            },
          }
        )
    })
  }

  reportError( err: any, type: string, request: string ){
    const errToJson = JSON.stringify(err);
    const body = {
      error: errToJson,
      type,
      request,
    }
    this.httpClient.post(`${this._baseApi}/errorReporting/store`, body)
  }

  post(body: any, uri: string, action: string){
    return new Promise(async (resolve, reject) => {

      this.httpClient.post(
          `${this._baseApi}/${uri}/${action}`, 
          body,
          {
            headers: {
              'Authorization': `bearer ${this.clientToken}`
            }
          }
        )
        .subscribe({
          next: (value) => {
            resolve(value)
          },
          error: (err) => {
            this.uiSv.showToast('Ha ocurrido un error.');
            reject(err)

          }
        })
    })
  }

  
}
