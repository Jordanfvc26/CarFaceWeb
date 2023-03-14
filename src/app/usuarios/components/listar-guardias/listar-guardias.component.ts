import { Validators, FormGroup, FormControl } from '@angular/forms';
import { EditarGuardiaComponent } from './../editar-guardia/editar-guardia.component';
import { Router } from '@angular/router';
import { ConsumirServiciosService } from './../../services/consumir-servicios.service';
import { Alerts } from './../../alerts/alerts.component';
import { ChoferService } from './../../services/chofer.service';
import { Component, OnInit } from '@angular/core';
/*Para los íconos*/
import * as iconos from '@fortawesome/free-solid-svg-icons';

/*Para generar PDF y Excel*/
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
/*Para la ventana emergente*/
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-listar-guardias',
  templateUrl: './listar-guardias.component.html',
  styleUrls: ['./listar-guardias.component.css']
})
export class ListarGuardiasComponent implements OnInit {

  //Variables y objetos a utilizar
  guardias: any[] = [];
  opciones: any;
  estadoGuardia: any;
  estadoSpinner = false;
  //Para la paginación
  pageSize = 7;
  desde = 0;
  hasta = 7;

  guardiasABuscar: any[] = [];
  opcionFiltro = "empresa";

  constructor(
    private _choferService: ChoferService,
    public alertaEmergente: Alerts,
    private api: ConsumirServiciosService,
    public modal: NgbModal
  ) { }

  formSelect = new FormGroup({
    filtro: new FormControl('empresa', Validators.required),
  })

  ngOnInit(): void {
    this.estadoSpinner = false;
    let headers = new Map();
    this.api.getDatos("/guardia/all").subscribe(data => {
      data.forEach(element => {
        //Dando formato al vector
        if (element.estado == true) {
          this.estadoGuardia = "ACTIVO";
        }
        else {
          this.estadoGuardia = "INACTIVO";
        }

        //Formateando los nombres
        const nombreCompleto = element.nombre;
        const nombresSeparados = nombreCompleto.split(" ");
        const nombre1 = nombresSeparados[0];
        const nombre2 = nombresSeparados[1];
        const apellido1 = nombresSeparados[2];
        const apellido2 = nombresSeparados[3];

        let guardia = {
          "id": element.id,
          "ci": element.ci,
          "nombre": nombre1 + " " + nombre2,
          "apellido": apellido1 + " " + apellido2,
          "correo": element.correo,
          "empresa": element.empresa,
          "estado": this.estadoGuardia
        }
        //Agregando los datos finales al vector
        this.guardias.push(guardia);
        this.estadoSpinner = true;
      });
    }, error => {
      console.log(error);
      this.alertaEmergente.alertaErrorSinReloadBtn("No se pudieron cargar los registros");
      this.estadoSpinner = true;
    })
  }


  //Método para capturar el valor del select el cual proporciona el filtro de búsqueda
  obtenerFiltro(){
    console.log(this.opcionFiltro);
  }
  

  //Método que permite cambiar de una página a otra en las tablas
  cambiarPagina(e:PageEvent){
    console.log(e);
    this.desde = e.pageIndex * e.pageSize;
    this.hasta = this.desde + e.pageSize;
  }

  //Método para imprimir los movimientos del chofer, en PDF
  downloadPDF() {
    this.estadoSpinner = false;
    //Se extrae la información a plasmar en el PDF
    const DATA = document.getElementById('htmlTablaPDF');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 3
    };
    //Datos para el encabezado
    const empresa = 'CarFace: Listado de registro de guardias';
    const fehcaEmision = 'Fecha de emisión: ' + this.obtenerFechaActual();
    const usuario = 'Usuario: Administrador';
    html2canvas(DATA, options).then((canvas) => {

      const img = canvas.toDataURL('image/PNG');
      //Agregar image Canvas al PDF
      const bufferX = 15;
      const bufferY = 90;
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
      if (!rows[Math.floor(index / 7)]) {
        rows[Math.floor(index / 7)] = [];
      }
      rows[Math.floor(index / 7)][index % 7] = cell2.innerText;
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


  //Método para cambiar el estado de un guardia
  cambiarEstadoGuardia(guardiaID: number, estado: string) {
    this.estadoGuardia = false;
    let estadoConsumir = true;
    if (estado == 'ACTIVO') {
      estado = 'INACTIVO';
      estadoConsumir = false;
    }
    this.api.putDatos("/guardia/" + guardiaID + "/" + estadoConsumir, guardiaID).subscribe(data => {
      this.estadoGuardia = true;
    }, error => {
      this.alertaEmergente.alertaErrorSinReload("No se pudo procesar su consulta");
      this.estadoSpinner = true;
    })
  }


  //Método que abre el modal para cargar los datos del guardia
  abrirModalEditarGuardia(modalGuardia, guardia) {
    this.modal.open(modalGuardia, { size: 'lg', centered: true });
    EditarGuardiaComponent.objectGuardia = guardia;
  }

  //Método que obtiene la fecha actual para mostrarla en el archivo PDF
  obtenerFechaActual(): string {
    const fechaActual = new Date();
    const dia = fechaActual.getDate();
    const mes = fechaActual.getMonth() + 1; //Los meses van del 0 al 11, por eso se suma 1
    const anio = fechaActual.getFullYear();
    return `${dia}/${mes}/${anio}`;
  }


  //Iconos a utilizar
  iconEditar = iconos.faEdit;
  iconEliminar = iconos.faTrash;
  iconPdf = iconos.faFilePdf;
  iconXlsx = iconos.faFileExcel;
  iconGuardia = iconos.faUserShield;
}
