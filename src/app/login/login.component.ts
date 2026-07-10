import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  nome = '';
  senha = '';
  erroLogin = '';
  sucessoMensagem = '';
  aceitouTermos = false;
  isLoginMode = true; 
  mostrarSenha = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  alternarModo() {
    this.isLoginMode = !this.isLoginMode;
    this.erroLogin = '';
    this.sucessoMensagem = '';
  }

  entrar() {
    this.erroLogin = '';
    this.sucessoMensagem = '';

    this.authService.login(this.nome, this.senha).subscribe({
      next: (res) => {
        console.log('Login realizado com sucesso!', res);
        localStorage.setItem('logado', 'true');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.log('Erro no login', err);
        this.erroLogin = err.message || 'Usuário ou senha inválidos.';
      }
    });
  }

  executarCadastro() {
    this.erroLogin = '';
    this.sucessoMensagem = '';

    if (!this.nome.trim() || !this.senha.trim()) {
      this.erroLogin = 'Por favor, preencha todos os campos.';
      return;
    }

    this.authService.cadastrar(this.nome, this.senha).subscribe({
      next: () => {
        this.sucessoMensagem = 'Cadastro realizado com sucesso! Faça seu login.';
        this.senha = ''; 
        this.isLoginMode = true; 
      },
      error: (err) => {
        this.erroLogin = err.message || 'Erro ao realizar o cadastro.';
      }
    });
  }

}
