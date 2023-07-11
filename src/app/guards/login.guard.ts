import { inject } from '@angular/core';
import { LoginService } from '../services/login.service';
import { NavController } from '@ionic/angular';

export const LoginGuard = async () => {
  try{
    const loginSv = inject(LoginService);
    const navCtrl = inject(NavController);
    await loginSv.me();
    if(!loginSv.user){
      console.log('Yendo a login');
      return true;
    }
    return await navCtrl.navigateRoot('/home');
  }catch(err){
    console.error('err :>> ', err);
    if(err === 'noToken'){
      return true
    }
    return false
  }
  
}
