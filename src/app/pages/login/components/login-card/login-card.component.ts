import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { LoginService } from 'src/app/services/login.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-card',
  templateUrl: './login-card.component.html',
  styleUrls: ['./login-card.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ]
})
export class LoginCardComponent  implements OnInit {
  public loginForm!: FormGroup ;
  public icon = environment.neuronLogo;
  public showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private loginSv: LoginService
  ) { }

  ngOnInit() {

    this.loginForm = this.fb.group({
      email: ['', Validators.pattern(/^[\w\.g]+@+[\w]+[.]+[\D]{2,10}$/) ],
      password: ['', Validators.minLength(5)],
      confirmPassword: [{value: '', disabled: true}, Validators.minLength(5)],
      name: [{value: '', disabled: true}],
    })
  }

  onSubmit(){
    this.loginSv.submitInfo(this.showConfirmPassword, this.loginForm);
  }

  forgottenPassword(){
    if(this.showConfirmPassword){
      this.register();
    }
  }

  register(){
    this.showConfirmPassword = !this.showConfirmPassword;
    this.controlInputs('confirmPassword');
    this.controlInputs('name');
  }

  controlInputs(name: string){
    const input = this.loginForm.get(name);
    this.showConfirmPassword 
      ? input?.enable()
      : input?.disable();

  }
}
