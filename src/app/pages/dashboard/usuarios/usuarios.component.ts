import { Component, OnInit, TemplateRef } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { UserService, TodoService } from '../../../services';
import { Usuario } from '../../../models/usuario';
import { Direccion } from '../../../models/direccion';
import { Ubicacion } from '../../../models/ubicacion';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'ngx-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [`
  nb-card {
    transform: translate3d(0, 0, 0);
  }
`],
})
export class UsuariosComponent implements OnInit {
  usuarios: any;
  usuario: Usuario;
  tareas: any;
  direccion: Direccion;
  ubicacion: Ubicacion;
  usuarioSeleccionado: string;

  settings = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      title: {
        title: 'Title',
        type: 'string',
      },
      completed: {
        title: 'Completed',
        type: 'html',
        editor: {
          type: 'checkbox'
        },
        filter: {
          type: "checkbox",
          config: {
            true: 'true',
            false: 'false',
            resetText: 'clear'
          }
        }
      }
    },
  };

  source: LocalDataSource = new LocalDataSource();
  modalRef: BsModalRef;

  constructor(
    private userService: UserService,
    private todoService: TodoService,
    private modalService: BsModalService) {
    this.usuarios = [];
    this.tareas = [];
    this.usuario = new Usuario();
    this.direccion = new Direccion();
    this.ubicacion = new Ubicacion();
    this.usuarioSeleccionado = "0";
  }

  ngOnInit() {
    this.obtenerLongitudLatitud();
    this.userService.consultar().subscribe((datos) => {
      if (datos) {
        this.usuarios = datos;
      }
    });
  }

  obtenerLongitudLatitud() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((objPosition) => {
        this.ubicacion.lng = objPosition.coords.longitude;
        this.ubicacion.lat = objPosition.coords.latitude;
      }, (objPositionError) => {
        switch (objPositionError.code) {
          case objPositionError.PERMISSION_DENIED:
            console.log("No se ha permitido el acceso a la posición del usuario.");
            break;
          case objPositionError.POSITION_UNAVAILABLE:
            console.log("No se ha podido acceder a la información de su posición.");
            break;
          case objPositionError.TIMEOUT:
            console.log("El servicio ha tardado demasiado tiempo en responder.");
            break;
          default:
            console.log("Error desconocido.");
        }
      }, {
          maximumAge: 75000,
          timeout: 15000
        });
    }
    else {
      console.log("Su navegador no soporta la API de geolocalización.");
    }
  }

  crearUsuario() {
    this.usuario.address = this.direccion;
    this.usuario.address.geo = this.ubicacion;
    this.userService.crear(this.usuario).
      then(response => response.json())
      .then(json => {
        console.log("Usuario creado:"); console.log(json);
        this.usuarios.push(json)
        this.closeFirstModal();
      })
  }

  seleccionarUsuario() {
    this.consultarTareas(this.usuarioSeleccionado);
  }

  consultarTareas(id: string) {
    this.todoService.listarPorUsuario(id).subscribe((respuesta: any) => {
      if (respuesta) {
        this.source.load(respuesta);
      }
    });
  }

  crearTarea(tarea) {
    this.todoService.crear(tarea).then(response => {
      if (response.ok) {
        response.json()
        console.log("Tarea creada");
      }
    });
  }

  editarTarea(tarea) {
    this.todoService.editar(tarea).then(response => {
      if (response.ok) {
        console.log("Tarea editada");
        response.json()
      }
    });
  }

  eliminarTarea(idTarea) {
    this.todoService.eliminar(idTarea)
      .then(response => {
        if (response.ok) {
          console.log("Registro eliminada");
          response.json()
        }
      })
  }

  cambiarEstadoTarea(estado, id) {
    this.todoService.completarTarea(id, estado)
      .then(response => response.json())
      .then(json => { alert(json.completed) })
  }

  onDeleteConfirm(event) {
    if (window.confirm('¿Estás seguro de que quieres eliminar?')) {
      this.eliminarTarea(event.data['id']);
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }
  onSaveConfirm(event) {
    if (window.confirm('¿Estás seguro de que quieres editar?')) {
      this.editarTarea(event.newData);
      event.confirm.resolve(event.newData);
    } else {
      event.confirm.reject();
    }
  }
  onCreateConfirm(event) {
    if (this.usuarioSeleccionado == "0") {
      window.alert("Seleccione un usuario");
    } else {
      if (window.confirm('¿Estás seguro de que quieres crear?')) {
        if(!event.newData['completed']){
          event.newData['completed'] = false;
        }
        event.newData['Id'] = null;
        event.newData['userId'] = this.usuarioSeleccionado;
        this.crearTarea(event.newData);
        event.confirm.resolve(event.newData);
      } else {
        event.confirm.reject();
      }
    }
  }

  limipiarCamposUsuario() {
    this.usuario = new Usuario();
    this.direccion = new Direccion();
  }
  // Modal
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }
  closeFirstModal() {
    this.modalRef.hide();
    this.modalRef = null;
  }
}
