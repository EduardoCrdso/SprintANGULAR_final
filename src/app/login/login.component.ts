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
  aceitouTermos = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  entrar() {
    this.erroLogin = '';

    this.authService.login(this.nome, this.senha).subscribe({
      next: (res) => {
        console.log('Login realizado com sucesso!', res);
        localStorage.setItem('logado', 'true');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.log('Erro no login', err);
        this.erroLogin = 'Usuário ou senha inválidos.';
      }
    });
  }

}
