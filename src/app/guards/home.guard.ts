import { inject } from '@angular/core';
import { LoginService } from '../services/login.service';
import { NavController } from '@ionic/angular';

export const HomeGuard = async () => {
  const loginSv = inject(LoginService);
  const navCtrl = inject(NavController);
  await loginSv.me();
  if(loginSv.user){
    return true;
  }

  return await navCtrl.navigateRoot('/auth');
  
}
