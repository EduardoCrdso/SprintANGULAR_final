import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  login(nome: string, senha: string) {
    return this.http.post(
      'http://localhost:3001/login',
      {
        nome: nome,
        senha: senha
      }
    );
  }

}