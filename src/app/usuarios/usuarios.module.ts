import { Alerts } from './alerts/alerts.component';
import { ConsumirServiciosService } from './services/consumir-servicios.service';
import { CargarScriptsJsService } from './services/cargar-scripts-js.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { RegistroVehiculoComponent } from './components/registro-vehiculo/registro-vehiculo.component';
import { UsuariosRoutingModule } from './usuarios-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';

/*Importaciones necesarias para usar el formly */
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';

/*Archivo repeat para poder intectar contenido en el form del modal nueva columna*/
import { RepeatTypeComponent } from './repeat-section.type';
import { RegistroUsuarioComponent } from './components/registro-usuario/registro-usuario.component';



@NgModule({
  declarations: [
    RepeatTypeComponent,
    LoginComponent,
    RegistroVehiculoComponent,
    DashboardComponent,
    RegistroUsuarioComponent,
  ],
  imports: [
    UsuariosRoutingModule,
    FontAwesomeModule,
    CommonModule,
    ReactiveFormsModule,
    FormlyBootstrapModule,
    FormlyModule.forRoot({
      types: [{ name: 'repeat', component: RepeatTypeComponent }],
      validationMessages: [
        { name: 'required', message: 'Este campo es requerido' },
        { name: 'minLenght', message: 'Se requiere mínimo 8 caracteres' }],
    }),
  ],
  providers:[
    CargarScriptsJsService,
    Alerts
  ]
})
export class UsuariosModule { }
