import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Ruta de los componentes
import { LoginComponent } from './components/login/login.component';
import { RegistroVehiculoComponent } from './components/registro-vehiculo/registro-vehiculo.component';


//Rutas hijas
const routes:Routes =[
  {
    path: '',
    children: [
      { path: 'login', component: LoginComponent},
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
