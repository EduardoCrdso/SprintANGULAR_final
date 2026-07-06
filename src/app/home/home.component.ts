import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  menuAberto = false;
  mostrarBoasVindas = true;

  constructor(private router: Router) {}

  toggleMenu() {
    this.menuAberto = !this.menuAberto;
    this.mostrarBoasVindas = false;
  }

  esconderBoasVindas() {
    this.mostrarBoasVindas = false;
  }

  logout() {
    localStorage.removeItem('logado');
    this.router.navigate(['/']);
  }
}
