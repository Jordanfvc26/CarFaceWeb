import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CargarScriptsJsService {

  constructor() { }

  //Función para poder cargar el JS que hace la animación del menú en la página de incio
  CargarJSDashboardCliente(archivos:string[]){
    for(let archivo of archivos){
      let script = document.createElement("script");
      script.src = "../../assets/JS/" + archivo + ".js";
      let body = document.getElementsByTagName("body")[0];
      body.appendChild(script);
    }
  }

  //Función para llamar el script del login
  CargarJSLogin(archivos:string[]){
    for(let archivo of archivos){
      let script = document.createElement("script");
      script.src = "../../assets/JS/" + archivo + ".js";
      let body = document.getElementsByTagName("body")[0];
      body.appendChild(script);
    }
  }
}

  