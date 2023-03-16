import { PageEvent } from '@angular/material/paginator';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Alerts } from './../../alerts/alerts.component';
import { ConsumirServiciosService } from './../../services/consumir-servicios.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';

/*Para los íconos*/
import * as iconos from '@fortawesome/free-solid-svg-icons';

/*Para generar PDF y excel*/
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-movimientos-id',
  templateUrl: './movimientos-id.component.html',
  styleUrls: ['./movimientos-id.component.css']
})
export class MovimientosIdComponent implements OnInit {

  //Varibles y objetos a utilizar
  movimientos: any[] = [];
  opciones: any;
  nombrePDF: string = "Usuario";
  estadoSpinner = false;
  //Para la paginación
  pageSize = 7;
  desde = 0;
  hasta = 7;

  //Para la búsqueda en la tabla
  movimientosABuscar: any[] = [];
  opcionFiltro = "placa";

  static idChofer: any;

  constructor(
    public modal: NgbModal,
    private api: ConsumirServiciosService,
    public alertaEmergente: Alerts
  ) { }

  //Form que captura la etiqueta select para obtener el filtro
  formSelect = new FormGroup({
    filtro: new FormControl('placa', Validators.required),
  })

  ngOnInit(): void {
    /*this.estadoSpinner = true;
    this.api.getDatos("/admin/usuario/id?id=" + MovimientosIdComponent.idChofer).subscribe(data => {
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
          this.estadoSpinner = true;
        });
      });
      console.log(this.movimientos);
    }, error => {
      console.log(error);
      this.alertaEmergente.alertaErrorSinReload("No se pudieron cargar los datos");
      this.estadoSpinner = true;
    });*/
  }


  //Método que permite cambiar de una página a otra en las tablas
  cambiarPagina(e: PageEvent) {
    console.log(e);
    this.desde = e.pageIndex * e.pageSize;
    this.hasta = this.desde + e.pageSize;
  }

  //Método para imprimir los movimientos del chofer, en PDF
  downloadPDF() {
    this.estadoSpinner = false;
    const DATA = document.getElementById('htmlTablaPDF');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 3
    };
    //Datos para el encabezado
    const empresa = 'CarFace: Registro de movimientos de usuario';
    const fehcaEmision = 'Fecha de emisión: ' + this.obtenerFechaActual();
    const usuario = 'Usuario: ' + this.obtenerUsuario();
    html2canvas(DATA, options).then((canvas) => {

      const img = canvas.toDataURL('image/PNG');
      //Agregar image Canvas al PDF
      const bufferX = 15;
      const bufferY = 90; // Aumentamos el buffer en Y para dejar espacio para el encabezado
      const imgProps = (doc as any).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');

      // Agregamos el encabezado
      doc.setFontSize(18);
      doc.text(empresa, 15, 30); // Posicionamos el texto a 15,30 (X,Y)
      doc.setFontSize(11);
      doc.text(fehcaEmision, 15, 50);
      doc.setFontSize(11);
      doc.text(usuario, 15, 70);
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
      this.estadoSpinner = true;
    });
  }


  //Método que permite exportar los datos a excel
  exportToExcel() {
    this.estadoSpinner = false;
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
    this.estadoSpinner = true;
  }


  //Método que obtiene la fecha actual (Para usar en la impresión de PDF)
  obtenerFechaActual(): string {
    const fechaActual = new Date();
    const dia = fechaActual.getDate();
    const mes = fechaActual.getMonth() + 1; //Los meses van del 0 al 11, por eso se suma 1
    const anio = fechaActual.getFullYear();
    return `${dia}/${mes}/${anio}`;
  }

  //Método que obtiene los datos del usuario para editarlos
  obtenerUsuario() {
    this.api.getDatos("/chofer").toPromise().then(data => {
      const nombre = data.nombre;
      const apellido = data.apellido;
      console.log("enviando: " + `${nombre} ${apellido}`)
      return `${nombre} ${apellido}`;
    });
  }

  //Íconos a utilizar
  iconAceptar = iconos.faCheck;
  iconVerMovimientos = iconos.faEye;
  iconCalendario = iconos.faCalendar;
  iconPdf = iconos.faFilePdf;
  iconXlsx = iconos.faFileExcel;
}
