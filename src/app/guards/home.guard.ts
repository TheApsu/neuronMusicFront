import { inject } from '@angular/core';
import { LoginService } from '../services/login.service';
import { NetworkConnectionService } from '../services/network-connection.service';
import { UiServices } from '../services/ui-services';
import { NavController } from '@ionic/angular';

export const HomeGuard = async () => {
  console.log('Yendo a home');
  const navCtrl = inject(NavController)
  const connectionSv = inject(NetworkConnectionService);
  const uiSv = inject(UiServices);
  const loginSv = inject(LoginService);
  try{
    
    await uiSv.showLoading();
    await loginSv.me();
  }catch( err ){
    console.log('err :>> ', err);
    if(err === 'noToken'){
      await uiSv.loading.dismiss();
      console.log('Yendo a auth');
      await navCtrl.navigateRoot('auth');
      return false
    }
    connectionSv.status = false;
  }
  await uiSv.loading.dismiss();
  return true;
  
}
