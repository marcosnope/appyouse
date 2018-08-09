import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  constructor(
    private http: HttpClient
  ) { }

  crear(param: Usuario) {
    return fetch('https://jsonplaceholder.typicode.com/users', {
      method: 'POST',
      body: JSON.stringify(param),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
  }
  consultar() {
    return this.http.get('https://jsonplaceholder.typicode.com/users');
  }
}