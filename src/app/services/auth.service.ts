import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {}

  
  private obterUsuarios(): any[] {
    const usuariosSalvos = localStorage.getItem('studyflow_users');
    if (!usuariosSalvos) {
      const listaInicial = [{ nome: 'admin', senha: '123456' }];
      localStorage.setItem('studyflow_users', JSON.stringify(listaInicial));
      return listaInicial;
    }
    return JSON.parse(usuariosSalvos);
  }

  
  login(nome: string, senha: string) {
    const usuarios = this.obterUsuarios();
    const contaValida = usuarios.find(u => u.nome === nome && u.senha === senha);

    if (contaValida) {
      return of({ sucesso: true, usuario: nome });
    } else {
      return throwError(() => new Error('Usuário ou senha inválidos.'));
    }
  }

  
  cadastrar(nome: string, senha: string) {
    const usuarios = this.obterUsuarios();
    const usuarioExiste = usuarios.some(u => u.nome.toLowerCase() === nome.toLowerCase());

    if (usuarioExiste) {
      return throwError(() => new Error('Este nome de usuário já está em uso.'));
    }

    usuarios.push({ nome, senha });
    localStorage.setItem('studyflow_users', JSON.stringify(usuarios));
    return of({ sucesso: true });
  }

}
