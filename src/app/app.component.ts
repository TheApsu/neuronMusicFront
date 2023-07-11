import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NetworkConnectionService } from './services/network-connection.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class AppComponent implements OnInit {
  constructor(
    private networkConnectionSv: NetworkConnectionService
  ) {
    
  }

  ngOnInit(): void {
    this.networkConnectionSv.observeConnection();
  }

}
