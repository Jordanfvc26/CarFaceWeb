import { Alerts } from './../../alerts/alerts.component';
import { ChoferService } from './../../services/chofer.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-guardias',
  templateUrl: './guardias.component.html',
  styleUrls: ['./guardias.component.css']
})
export class GuardiasComponent implements OnInit {

  guardias: any[] = [];

  constructor(
    private _choferService: ChoferService,
    public alertaEmergente: Alerts
    ) { }

  ngOnInit(): void {
    this._choferService.listarChoferes().subscribe((res) => {
      //this.alertaEmergente.alertaMensajeOKSinBtnConfirmar("Registro de información personal exitoso");
    }, error => {
      this.alertaEmergente.alertMensajeError("No se pudieron cargar los registros");
    });
  }
}
