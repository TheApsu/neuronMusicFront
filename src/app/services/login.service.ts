import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UiServices } from './ui-services';
import { HttpService } from './http.service';
import { StorageService } from './storage.service';
import { NavController } from '@ionic/angular';

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
    private navCtrl: NavController
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
      console.log('res :>> ', res);
      const data = res.data;
      const userToJson = JSON.stringify(data);
      this.user = data.user;
      this.storageSv.setLocal('user', userToJson);
      this.httpSv.getToken();
      await this.uiSv.loading.dismiss();
      this.setPermissions();
      await this.navCtrl.navigateRoot('/home');
      return true;
    }catch(err){
      console.error(err);
      await this.uiSv.loading.dismiss();
      return false;
    }
  }

  async me(){
    try{
      const res: any = await this.httpSv.get('auth', 'me')
      this.user = res.data;
      this.setPermissions();
      return true;
    }catch(err: any){
      console.error(err);
      if(!err.token){
        return true;
      }
      return false;
    }
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
