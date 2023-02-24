import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ChoferService } from './../../services/chofer.service';
import { Router } from '@angular/router';
import { ConsumirServiciosService } from './../../services/consumir-servicios.service';
import { Alerts } from './../../alerts/alerts.component';
import { CargarScriptsJsService } from './../../services/cargar-scripts-js.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

/*Para íconos y animación*/
import * as iconos from '@fortawesome/free-solid-svg-icons';
import * as AOS from 'aos';
import { WebcamUtil, WebcamInitError, WebcamImage } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';





@Component({
  selector: 'app-registro-usuario',
  templateUrl: './registro-usuario.component.html',
  styleUrls: ['./registro-usuario.component.css', './registro-usuario2.component.css']
})
export class RegistroUsuarioComponent implements OnInit {
  @Output() getPicture = new EventEmitter<WebcamImage>();
  showWebCam = true;
  isCameraExist = true;
  errors: WebcamInitError[] = [];

  numFotos = 0;

  //Webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();

  constructor(
    private _choferService: ChoferService,
    private _cargarScripts: CargarScriptsJsService,
    private ruta: Router,
    private api: ConsumirServiciosService,
    public alertaEmergente: Alerts) {
    _cargarScripts.CargarJS(["registro-usuario/registro-usuario"]);
  }

  //Creando el formGroup del usuario a registrar
  formDatosChofer = new FormGroup({
    ci: new FormControl('', Validators.required),
    nombre: new FormControl('', Validators.required),
    apellido: new FormControl('', Validators.required),
    telefono: new FormControl('', Validators.required),
    licencia: new FormControl('Tipo-licencia', Validators.required),
    correo: new FormControl('', Validators.email),
    clave: new FormControl('', Validators.required)
  })

  ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs().then(
      (mediaDevices: MediaDeviceInfo[]) => {
        this.isCameraExist = mediaDevices && mediaDevices.length > 0;
      }
    );
  }

  tomarFoto() {
    //this.trigger.next();
    while (this.numFotos <= 7) {
      this.alertaEmergente.alertaMensajeOKSinRecargar("Se capturó correctamente la imagen " + this.numFotos)
      this.numFotos++;
      //Aqui agregar la foto tomada
    }
  }

  cambiarCamara(directionOrDeviceId: boolean | string) {
    this.nextWebcam.next(directionOrDeviceId);
  }

  onOffCamara() {
    this.showWebCam = !this.showWebCam;
  }

  handleInitError(error: WebcamInitError) {
    this.errors.push(error);
  }

  handleImage(webcamImage: WebcamImage) {
    this.getPicture.emit(webcamImage);
    //Comentar esta linea
    //this.showWebCam = false;
  }

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }


  //Método para registrar el chofer
  registrarChofer(): void {

    //Pasando los datos del formGroup a la interfaz
    let body: any = {
      "ci": this.formDatosChofer.value.ci,
      "nombre": this.formDatosChofer.value.nombre,
      "apellido": this.formDatosChofer.value.apellido,
      "correo": this.formDatosChofer.value.correo,
      "clave": this.formDatosChofer.value.clave,
      "tipolicencia": this.formDatosChofer.value.licencia,
      "direccion": "Quevedo",
      "telefono": this.formDatosChofer.value.telefono,
    }

    this._choferService.registerChofer(body).subscribe((res) => {
      //console.log(res);
      //Aquí consumir api para registrar fotos

      //Si se registro bien, lo lleva al login y que inicie sesión
      this.alertaEmergente.alertaMensajeOK("Se ha registrado correctamente en CarFace");
      this.ruta.navigateByUrl('/login');
    }, error => {
      this.alertaEmergente.alertMensajeError("No se ha podido registrar en CarFace");
    });
  }

  alertaRellenar() {
    if (this.formDatosChofer.value.ci == "" || this.formDatosChofer.value.nombre == "" || this.formDatosChofer.value.apellido == "" || this.formDatosChofer.value.telefono == "" || this.formDatosChofer.value.licencia == "Tipo-licencia") {
      this.alertaEmergente.alertMensajeError("Debe rellenar todos los campos");
    }
  }

  verificarFotos(){
    if(this.numFotos==0){
      this.alertaEmergente.alertMensajeError("Primero debe registrar su rostro");
    }
  }

  iconCedula = iconos.faIdCard;
}
