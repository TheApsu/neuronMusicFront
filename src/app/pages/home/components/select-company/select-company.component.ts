import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule, PopoverController } from '@ionic/angular';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-select-company',
  templateUrl: './select-company.component.html',
  styleUrls: ['./select-company.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class SelectCompanyComponent  implements OnInit {
  public open = false;
  public companies: any[] = [];

  constructor(
    private httpSv: HttpService,
    private popoverController: PopoverController
  ) {}

  async ngOnInit(){
    try{
      const res: any = await this.httpSv.get('client/company', 'index');
      this.companies = res.data;
      this.open = true;
      console.log('res :>> ', res);
    }catch(err){
      await this.popoverController.dismiss('no-internet');
    }
  }

  selectCompany(company: any){
    this.popoverController.dismiss(company);
  }
}
