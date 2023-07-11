import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UiServices } from './ui-services';
import { HttpService } from './http.service';
import { StorageService } from './storage.service';
import { NavController } from '@ionic/angular';
import { NetworkConnectionService } from './network-connection.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private _user: any = undefined;
  private _permission: any = [];

  get permission(){
    return this._permission;
  }

  set permission(value){
    this._permission = value;
  }

  set user(value){
    this._user = value;
  }

  get user(){
    return this._user
  }

  constructor(
    private uiSv: UiServices,
    private httpSv: HttpService,
    private storageSv: StorageService,
    private navCtrl: NavController,
    private connectionSv: NetworkConnectionService
  ) {
  }

  async submitInfo(showConfirmPassword: boolean, loginForm: FormGroup){
    try{
      const action = showConfirmPassword ? 'register' : 'login';
      if(loginForm.value.password !== loginForm.value.confirmPassword && showConfirmPassword){
        return await this.uiSv.presentAlert('Las contraseñas deben coincidir');
      }
      await this.uiSv.showLoading();
      const res: any = await this.httpSv.post(loginForm.value, 'auth', action)
      const data = res.data;
      const userToJson = JSON.stringify(data);
      this.user = data.user;
      this.storageSv.setLocal('user', userToJson);
      this.httpSv.getToken();
      await this.uiSv.loading.dismiss();
      this.setPermissions();
      this.connectionSv.status = true;
      await this.navCtrl.navigateRoot('/home');
      return true;
    }catch(err){
      console.error(err);
      await this.uiSv.loading.dismiss();
      return false;
    }
  }

  async me(){
    return new Promise(async (resolve, reject) => {
      try{
        const res: any = await this.httpSv.get('auth', 'me');
        this.user = res.data;
        this.setPermissions();
        resolve(true);
      }catch(err: any){
        console.log('err :>> ', err);
        if(!err.token){
          reject('noToken')
        }
        reject(false);
      }
    })
  }

  setPermissions(){
    this.permission = this.user?.permission;
    this.storageSv.setLocal('permission', JSON.stringify(this.permission));
  }

  logout(){
    this.user = undefined;
    this.httpSv.clientToken = undefined;
    this.storageSv.removeLocal('user');
    this.navCtrl.navigateRoot('auth');
  }
}
