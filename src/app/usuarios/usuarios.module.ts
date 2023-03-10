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
import { CrearGuardiaComponent } from './components/crear-guardia/crear-guardia.component';
import { ListarGuardiasComponent } from './components/listar-guardias/listar-guardias.component'

/*Importaciones necesarias para usar el formly */
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';

/*Archivo repeat para poder intectar contenido en el form del modal nueva columna*/
import { RepeatTypeComponent } from './repeat-section.type';
import { RegistroUsuarioComponent } from './components/registro-usuario/registro-usuario.component';

/*Para la camara */
import { WebcamModule } from 'ngx-webcam';
import { InicioComponent } from './components/inicio/inicio.component';
import { MovimientosComponent } from './components/movimientos/movimientos.component';

import 'boxicons';
import { EliminarGuardiaComponent } from './components/eliminar-guardia/eliminar-guardia.component';


@NgModule({
  declarations: [
    RepeatTypeComponent,
    LoginComponent,
    RegistroVehiculoComponent,
    DashboardComponent,
    RegistroUsuarioComponent,
    InicioComponent,
    MovimientosComponent,
    CrearGuardiaComponent,
    ListarGuardiasComponent,
    EliminarGuardiaComponent,
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
    WebcamModule
  ],
  providers:[
    CargarScriptsJsService,
    Alerts
  ]
})
export class UsuariosModule { }
