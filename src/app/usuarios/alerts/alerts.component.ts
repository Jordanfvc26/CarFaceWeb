/*Importamos la librería de SweetAlert2 para poder usar las alertas emergentes personalizadas*/
import Swal from 'sweetalert2'

export class Alerts {

    //Método que muestra una alerta con un mensaje de estado OK recargando y con botón
    public alertaOKConReloadBtn(mensaje: string) {
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: mensaje,
            showConfirmButton: true,
        }).then((result) => {
            window.location.reload();
        })
    }

    //Método que muestra una alerta con un mensaje de estado OK recargando y sin botón
    public alertaOKConReload(mensaje: string) {
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: mensaje,
            showConfirmButton: false,
            timer: 1500
        }).then((result) => {
            window.location.reload();
        })
    }

    //Método que muestra alerta con un mensaje de estado OK, sin recargar la página y con botón
    public alertaOKSinReloadBtn(mensaje: string) {
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: mensaje,
            showConfirmButton: true,
        })
    }

    //Método que muestra alerta con un mensaje de estado OK, sin recargar la página y sin botón de confirmación
    public alertaOKSinReload(mensaje: string) {
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: mensaje,
            showConfirmButton: false,
            timer: 1500
        })
    }

    //Método que muestra una alerta con un mensaje de estado ERROR, sin recargar y con botón
    public alertaErrorSinReloadBtn(mensaje: string) {
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: mensaje,
            showConfirmButton: true,
        })
    }

    //Método que muestra una alerta con un mensaje de estado ERROR, sin recargar y sin botón
    public alertaErrorSinReload(mensaje: string) {
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: mensaje,
            showConfirmButton: false,
            timer: 1500
        })
    }

    //Método que muestra una alerta con un mensaje de estado ERROR, sin recargar y sin botón
    public alertaErrorConReload(mensaje: string) {
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: mensaje,
            showConfirmButton: false,
            timer: 1500
        }).then((result) => {
            window.location.reload();
        })
    }

    //Método para confirmar si se quiere hacer una acción o no
    public alertaAceptarCancelar(mensajePregunta: string, mensajeOK: string) {
        Swal.fire({
            /*title: 'Are you sure?',*/
            text: mensajePregunta,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar'
        }).then((result) => {
            if (result.isConfirmed) {
                this.alertaOKSinReload(mensajeOK)
            }
        })
    }

    //Método que muestra alerta con un mensaje de estado ADVERTENCIA, sin recargar la página y con botón
    public alertaWarningSinReloadBtn(mensaje: string, mensaje2) {
        Swal.fire({
            position: 'center',
            icon: 'warning',
            title: mensaje,
            text: mensaje2,
            showConfirmButton: true,
        })
    }
}