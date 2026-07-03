import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { VehicleService } from '../services/vehicle.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  vehicles: any[] = [];

  selectedVehicle: any = null;

  vin = '';

  vehicleData: any = null;

  menuAberto = false;

  constructor(
    private vehicleService: VehicleService,
    private router: Router
  ) {}

  ngOnInit() {

    this.vehicleService.getVehicles().subscribe({
      next: (res: any) => {

        this.vehicles = res.vehicles;
        this.selectedVehicle = this.vehicles[0];

      },
      error: (err) => {
        console.log(err);
      }
    });

  }

  toggleMenu() {
    this.menuAberto = !this.menuAberto;
  }

  logout() {
    localStorage.removeItem('logado');
    this.router.navigate(['/']);
  }

  selectVehicle(vehicle: any) {
    this.selectedVehicle = vehicle;
  }

  selectVehicleById(event: any) {

    const id = Number(event.target.value);

    this.selectedVehicle =
      this.vehicles.find(
        vehicle => vehicle.id === id
      );

  }

  buscarVin() {

    this.vehicleService.getVehicleData(this.vin).subscribe({
      next: (res: any) => {

        this.vehicleData = res;

      },
      error: () => {

        alert('VIN não encontrado');

      }
    });

  }

}