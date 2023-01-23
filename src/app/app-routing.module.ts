import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/*Apliando la carga perezosa*/
const routes: Routes = [
  {
    path: 'usuarios',
    loadChildren:() => import('./usuarios/usuarios.module').then(m=>m.UsuariosModule)
  },
  {
    path:'*',
    redirectTo: 'usuarios'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
