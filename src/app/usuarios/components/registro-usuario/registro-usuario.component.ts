import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ChoferService } from './../../services/chofer.service';
import { CargarFotosService } from './../../services/cargar-fotos.service'
import { Router } from '@angular/router';
import { ConsumirServiciosService } from './../../services/consumir-servicios.service';
import { Alerts } from './../../alerts/alerts.component';
import { CargarScriptsJsService } from './../../services/cargar-scripts-js.service';
import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

/*Para íconos y animación*/
import * as iconos from '@fortawesome/free-solid-svg-icons';
import * as AOS from 'aos';
import { WebcamUtil, WebcamInitError, WebcamImage, WebcamComponent } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';


@Component({
  selector: 'app-registro-usuario',
  templateUrl: './registro-usuario.component.html',
  styleUrls: ['./registro-usuario.component.css', './registro-usuario2.component.css']
})
export class RegistroUsuarioComponent implements OnInit {
  //Creando el viewChild
  @ViewChild('webcamComponent') webcamComponent: WebcamComponent;
  capturedImage: string;

  @Output() getPicture = new EventEmitter<WebcamImage>();
  showWebCam = true;
  isCameraExist = true;
  errors: WebcamInitError[] = [];
  //Yo
  fotosAEnviar: WebcamImage[] = [];
  numFotos = 0;
  formData = new FormData();


  //Webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();

  constructor(
    private _choferService: ChoferService,
    private _cargarFotos: CargarFotosService,
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
    /*WebcamUtil.getAvailableVideoInputs().then(
      (mediaDevices: MediaDeviceInfo[]) => {
        this.isCameraExist = mediaDevices && mediaDevices.length > 0;
      }
    );*/
  }

  registrarFotos() {
    let headers = new Map();

    const files: File[] = [];
    for (let i = 0; i < this.fotosAEnviar.length; i++) {
      const imgBlob = this.dataURItoBlob(this.fotosAEnviar[i].imageAsDataUrl);
      const file = new File([imgBlob], 'imagen_' + i + '.jpg', { type: imgBlob.type });
      files.push(file);
    }
    console.log(files);

    // Crea un objeto FormData y agrega cada archivo al campo 'files'

    for (let i = 0; i < files.length; i++) {
      this.formData.append('files', files[i]);
    }
    console.log(this.formData.getAll("files"));

    if (this.formData.getAll("files") != null) {
      this._cargarFotos.putDatos("/chofer/fotos", this.formData).subscribe(data => {
        this.alertaEmergente.alertaMensajeOK("Se ha registrado correctamente su rostro");
        this.ruta.navigateByUrl('/dashboard');
      }, error => {
        console.log(error)
        this.alertaEmergente.alertMensajeError("No se ha podido registrar su rostro");
      });
    }

  }

  //Método sacado de no se donde
  private dataURItoBlob(dataURI: string) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  //Toma la foto y las agrega a una lista
  capturePhoto() {
    for (let index = 0; index < 5; index++) {
      this.webcamComponent.takeSnapshot()
      this.numFotos = index + 1;
    }
  }

  handleImage(webcamImage: WebcamImage) {
    this.capturedImage = webcamImage.imageAsDataUrl;
    //La ruta de la imagen se guarda aquí imageAsDataUrl
    this.fotosAEnviar.push(webcamImage);
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
      this.alertaEmergente.alertaMensajeOKSinRecargar("Se ha registrado correctamente en CarFace");
      this.iniciarSesion();
      //this.ruta.navigateByUrl('/login');
    }, error => {
      this.alertaEmergente.alertMensajeError("No se ha podido registrar en CarFace");
    });
  }


  //Método para iniciar sesión
  iniciarSesion() {
    let headers = new Map();
    headers.set("correo", this.formDatosChofer.value.correo);
    headers.set("clave", this.formDatosChofer.value.clave);
    //console.log(headers);
    this.api.postDatos("/sesion/login", null, headers).subscribe(data => {
      sessionStorage.setItem("usuario", data.token);
      sessionStorage.setItem("rol", data.rol)

    }, error => {
      console.log(error);
      this.alertaEmergente.alertMensajeError("Hubo error al registrarlo");
    })
  }



  alertaRellenar() {
    if (this.formDatosChofer.value.ci == "" || this.formDatosChofer.value.nombre == "" || this.formDatosChofer.value.apellido == "" || this.formDatosChofer.value.telefono == "" || this.formDatosChofer.value.licencia == "Tipo-licencia") {
      this.alertaEmergente.alertMensajeError("Debe rellenar todos los campos");
    }
  }

  iconCedula = iconos.faIdCard;
}
