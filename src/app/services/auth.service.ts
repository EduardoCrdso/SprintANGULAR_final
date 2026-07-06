import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {}

  login(nome: string, senha: string) {
    if (nome === 'admin' && senha === '123456') {
      return of({ sucesso: true, usuario: nome });
    } else {
      return throwError(() => new Error('Usuário ou senha inválidos.'));
    }
  }

}
