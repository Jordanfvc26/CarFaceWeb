import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { EditarGuardiaComponent } from './components/editar-guardia/editar-guardia.component';
import { SpinnerComponent } from './components/spinner/spinner.component';

/*Para la paginación de las tablas*/
import { MatPaginatorModule } from '@angular/material';
import { BuscarRegistrosPipe } from './pipes/buscar-registros.pipe';
import { ListarVehiculosComponent } from './components/listar-vehiculos/listar-vehiculos.component';
import { EditarVehiculoComponent } from './components/editar-vehiculo/editar-vehiculo.component';
import { EliminarVehiculoComponent } from './components/eliminar-vehiculo/eliminar-vehiculo.component';
import { ListarChoferesComponent } from './components/listar-choferes/listar-choferes.component';
import { MovimientosIdComponent } from './components/movimientos-id/movimientos-id.component';
import { PerfilChoferComponent } from './components/perfil-chofer/perfil-chofer.component';
import { RegistroRostroComponent } from './components/registro-rostro/registro-rostro.component';
import { EditarChoferComponent } from './components/editar-chofer/editar-chofer.component';

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
    EditarGuardiaComponent,
    SpinnerComponent,
    BuscarRegistrosPipe,
    ListarVehiculosComponent,
    EditarVehiculoComponent,
    EliminarVehiculoComponent,
    ListarChoferesComponent,
    MovimientosIdComponent,
    PerfilChoferComponent,
    RegistroRostroComponent,
    EditarChoferComponent
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
    WebcamModule,
    HttpClientModule,
    MatPaginatorModule,
    FormsModule
  ],
  providers:[
    CargarScriptsJsService,
    Alerts,
    {provide: HTTP_INTERCEPTORS, useClass: ConsumirServiciosService, multi: true},
  ]
})
export class UsuariosModule { }
