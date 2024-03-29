import { RegistroRostroComponent } from './components/registro-rostro/registro-rostro.component';
import { ListarGuardiasComponent } from './components/listar-guardias/listar-guardias.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Ruta de los componentes
import { LoginComponent } from './components/login/login.component';
import { RegistroUsuarioComponent } from './components/registro-usuario/registro-usuario.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegistroVehiculoComponent } from './components/registro-vehiculo/registro-vehiculo.component';


//Rutas hijas
const routes:Routes =[
  {
    path: '',
    children: [
      { path: 'login', component: LoginComponent},
      { path: 'registro-usuario', component: RegistroUsuarioComponent},
      { path: 'dashboard', component: DashboardComponent},
      { path: 'dashboard/listar-guardias', component: ListarGuardiasComponent},
      { path: 'dashboard/registro-rostro', component: RegistroRostroComponent},
      { path: 'registroVehiculo', component: RegistroVehiculoComponent},
      /*Path cuando no se especifica una ruta correcta*/
      { path: '**', redirectTo:'login'}
    ]
  }
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class UsuariosRoutingModule { }
