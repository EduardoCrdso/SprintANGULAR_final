import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  constructor(private http: HttpClient) { }

  getVehicles() {
    return this.http.get(
      'http://localhost:3001/vehicles'
    );
  }

  getVehicleData(vin: string) {
    return this.http.post(
      'http://localhost:3001/vehicleData',
      {
        vin: vin
      }
    );
  }

}