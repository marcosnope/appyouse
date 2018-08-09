import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Tarea } from '../../models/tarea';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor(
    private http: HttpClient
  ) { }
  
  crear(param: Tarea) {
    return fetch('https://jsonplaceholder.typicode.com/todos', {
      method: 'POST',
      body: JSON.stringify(param),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
  }

  editar(param: Tarea) {
    return fetch('https://jsonplaceholder.typicode.com/todos/1', {
      method: 'PUT',
      body: JSON.stringify(param),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
  }

  eliminar(idTarea: number) {
    return fetch('https://jsonplaceholder.typicode.com/todos/' + idTarea.toString(), {
      method: 'DELETE'
    })
  }

  completarTarea(idTarea: string, estado: boolean) {
    return fetch('https://jsonplaceholder.typicode.com/todos/' + idTarea, {
      method: 'PATCH',
      body: JSON.stringify({
        completed: estado
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
  }

  listarPorUsuario(userId: string) {
    return this.http.get('https://jsonplaceholder.typicode.com/todos?userId=' + userId);
  }
}

