import { Injectable } from '@angular/core';
import { PopoverController, ToastController, ModalController, LoadingController, AlertController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class UiServices {
  toastMsg!: HTMLIonToastElement;
  loading!: HTMLIonLoadingElement;
  modal!: HTMLIonModalElement;

  constructor(
    private toastCtrl: ToastController, 
    private popoverCtrl: PopoverController,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private alertController: AlertController,
  ) { }

  async showToast(msg?: any){
    // if(window.location.pathname !== '/cart'){
      if(this.toastMsg){
        await this.toastMsg.dismiss();
      }
      this.toastMsg = await this.toastCtrl.create({
        message: msg,
        duration: 3000,
        cssClass: 'toastMsg',
        htmlAttributes: { tabindex: undefined }
      });
      await this.toastMsg.present();
    // }
  }

  async showPopover(component: any, componentProps?: any, cssClass?: any, event?: any, mode?: any, side?: any, backdropDismiss?: boolean){
    // console.log('event :>> ', event);
    // console.log('event.target.clientX :>> ', event.clientX);
    // console.log('document.body.offsetWidth :>> ', document.body.offsetWidth / 2);
    // if(side && event.clientX > (document.body.offsetWidth / 2)){
    //   side = 'left';
    // }
    // console.log('side :>> ', side);
    const popover = await this.popoverCtrl.create({
      component,
      componentProps,
      cssClass,
      event,
      mode,
      side,
      backdropDismiss
    });
    await popover.present();
    const { data, role } = await popover.onDidDismiss();
    return { data, role };
  }

  async showModal(component: any, componentProps?: any, cssClass?: any, backdropDismiss?: any){
    this.modal = await this.modalController.create({
      component,
      componentProps,
      cssClass,
      backdropDismiss
    });

    await this.modal.present();
    const { data, role } = await this.modal.onDidDismiss();
    return { data, role };
  }

  async showLoading(messageArg = 'Por favor espera') {
    if(this.loading){
      await this.loading.dismiss();
    }
    this.loading = await this.loadingController.create({
      message: messageArg,
      spinner: 'bubbles',
      cssClass: 'loading'
    });
    await this.loading.present();
  }

  async presentAlert(
    message: any, 
    showCancelButton = true, 
    okText = 'Aceptar', 
    backdropDismiss: boolean = true, 
    headerTxt ='Alerta'
  ) {
    const buttons = [
      {
        text: okText,
        role: 'accept'
      }
    ]
    if(showCancelButton){
      buttons.push({
        text: 'Cancelar',
        role: 'cancel'
      })
    }
    const alert = await this.alertController.create({
      header: headerTxt,
      message,
      buttons,
      backdropDismiss
    });
    
    await alert.present();
    const { role }  = await alert.onDidDismiss();
    return { role };
  }
}
