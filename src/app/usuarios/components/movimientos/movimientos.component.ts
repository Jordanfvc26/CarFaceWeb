import { Router } from '@angular/router';
import { ConsumirServiciosService } from './../../services/consumir-servicios.service';
import { Alerts } from './../../alerts/alerts.component';
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import * as iconos from '@fortawesome/free-solid-svg-icons';

/*Para generar PDF y excel*/
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

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
      this.alertaEmergente.alertaErrorSinReload("No se pudieron cargar los datos");
    })
  }


  //Método para imprimir los movimientos del chofer, en PDF
  downloadPDF() {
    //Se extrae la información a plasmar en el PDF
    const DATA = document.getElementById('htmlTablaPDF');
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


  //Método que permite exportar los datos a excel
  exportToExcel() {
    // Obtener la tabla desde el DOM
    const table = document.getElementById('htmlTablaExcel');
    
    // Crear una matriz para almacenar los datos de la tabla
    const rows = [];
    const cells = table.querySelectorAll('td');
    cells.forEach((cell2, index) => {
      if (!rows[Math.floor(index / 6)]) {
        rows[Math.floor(index / 6)] = [];
      }
      rows[Math.floor(index / 6)][index % 6] = cell2.innerText;
    });

    // Crear un libro de Excel y agregar una hoja con los datos de la tabla
    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Movimientos');
  
    //Se obtiene la fecha actual del sistema y se le concatena el nombre para darle un nombre final al archivo descargado
    const fechaPDF = new Date().toISOString()
    const fecha = new Date(fechaPDF);
    this.opciones = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    };
    const fechaPDFDownload = fecha.toLocaleString('es-ES', this.opciones);
    XLSX.writeFile(workbook, `${fechaPDFDownload}_movimientos.xlsx`);
  }

   //Iconos a utilizar
   iconPdf = iconos.faFilePdf;
   iconXlsx = iconos.faFileExcel;
   iconCalendario = iconos.faCalendar;
}
