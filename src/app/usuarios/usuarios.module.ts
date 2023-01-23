import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { RegistroVehiculoComponent } from './components/registro-vehiculo/registro-vehiculo.component';
import { UsuariosRoutingModule } from './usuarios-routing.module';



@NgModule({
  declarations: [
    LoginComponent,
    RegistroVehiculoComponent
  ],
  imports: [
    UsuariosRoutingModule,
    FontAwesomeModule,
    CommonModule
  ]
})
export class UsuariosModule { }
