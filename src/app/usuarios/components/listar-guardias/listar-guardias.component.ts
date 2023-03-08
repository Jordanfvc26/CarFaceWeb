import { Alerts } from './../../alerts/alerts.component';
import { ChoferService } from './../../services/chofer.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-listar-guardias',
  templateUrl: './listar-guardias.component.html',
  styleUrls: ['./listar-guardias.component.css']
})
export class ListarGuardiasComponent implements OnInit {

  guardias: any[] = [];

  constructor(
    private _choferService: ChoferService,
    public alertaEmergente: Alerts
  ) { }

  ngOnInit(): void {
  }

}
