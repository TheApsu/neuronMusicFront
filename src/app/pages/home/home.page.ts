import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ReproductorComponent } from '../../components/reproductor/reproductor.component';
import { HttpService } from 'src/app/services/http.service';
import { CommonModule } from '@angular/common';
import { UiServices } from 'src/app/services/ui-services';
import { SelectCompanyComponent } from './components/select-company/select-company.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    ReproductorComponent,
  ],
})
export class HomePage implements OnInit {

  constructor(
    private uiSv: UiServices,
    private httpSv: HttpService
  ){}

  async ngOnInit() {
    const { data } = await this.uiSv.showPopover(
      SelectCompanyComponent,
      {}, '', null, 'md','', false
    );
    if(data){
      
    }
  }
}
