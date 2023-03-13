import { ConsumirServiciosService } from './usuarios/services/consumir-servicios.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { UsuariosModule } from './usuarios/usuarios.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UsuariosModule,
    ReactiveFormsModule,
    FormlyModule.forRoot(),
    FormlyBootstrapModule,
    FontAwesomeModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: ConsumirServiciosService, multi: true },],
  bootstrap: [AppComponent,]
})
export class AppModule { }
