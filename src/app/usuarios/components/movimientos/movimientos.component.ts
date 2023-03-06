import { Router } from '@angular/router';
import { ConsumirServiciosService } from './../../services/consumir-servicios.service';
import { Alerts } from './../../alerts/alerts.component';
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';

/*Para generar PDF*/
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.css']
})
export class MovimientosComponent implements OnInit {
  @ViewChild('tabla', { static: false }) tabla: ElementRef;
  movimientos: any[] = [];
  opciones: any;

  constructor(
    private api: ConsumirServiciosService,
    public alertaEmergente: Alerts,
    private ruta: Router,
  ) { }


  ngOnInit(): void {
    let headers = new Map();
    this.api.getDatos("/chofer").subscribe(data => {
      data.chofer.vehiculo.forEach(element => {
        element.registros.forEach(element2 => {

          const fechatTemp = element2.fecha;
          const fecha = new Date(fechatTemp);
          //Dando formato a la fecha
          this.opciones = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          };
          const fechaFormateada = fecha.toLocaleString('es-ES', this.opciones);
          //Dando formato al vector
          let vehiculo = {
            "marca": element.marca,
            "modelo": element.modelo,
            "color": element.color,
            "placa": element.placa,
            "fecha": fechaFormateada,
            "tipo": element2.tipo
          }
          //Agregando los datos finaes al vector
          this.movimientos.push(vehiculo);
        });
      });

    }, error => {
      console.log(error);
      this.alertaEmergente.alertMensajeError("No se pudieron cargar los recursos :(");
    })
  }

  //Método para imprimir los movimientos del chofer, en PDF
  downloadPDF() {
    //Se extrae la información a plasmar en el PDF
    const DATA = document.getElementById('htmlData');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 3
    };
    html2canvas(DATA, options).then((canvas) => {

      const img = canvas.toDataURL('image/PNG');
      //Agregar image Canvas al PDF
      const bufferX = 15;
      const bufferY = 15;
      const imgProps = (doc as any).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
      return doc;
    }).then((docResult) => {
      //Se obtiene la fecha actual del sistema y se le concatena el nombre para darle un nombre final al archivo descargado
      const fechaPDF = new Date().toISOString()
      const fecha = new Date(fechaPDF);
      this.opciones = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      };
      const fechaPDFDownload = fecha.toLocaleString('es-ES', this.opciones);
      docResult.save(`${fechaPDFDownload}_movimientos.pdf`);
    });
  }
}
