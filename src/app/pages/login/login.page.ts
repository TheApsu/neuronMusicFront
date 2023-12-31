import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginCardComponent } from 'src/app/pages/login/components/login-card/login-card.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonicModule, 
    CommonModule, 
    FormsModule,
    LoginCardComponent
  ]
})
export class LoginPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
