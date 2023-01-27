import { ConsumirServiciosService } from './services/consumir-servicios.service';
import { CargarScriptsJsService } from './services/cargar-scripts-js.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { RegistroVehiculoComponent } from './components/registro-vehiculo/registro-vehiculo.component';
import { UsuariosRoutingModule } from './usuarios-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    LoginComponent,
    RegistroVehiculoComponent,
    DashboardComponent
  ],
  imports: [
    UsuariosRoutingModule,
    FontAwesomeModule,
    CommonModule,
    ReactiveFormsModule
  ],
  providers:[
    CargarScriptsJsService
  ]
})
export class UsuariosModule { }
