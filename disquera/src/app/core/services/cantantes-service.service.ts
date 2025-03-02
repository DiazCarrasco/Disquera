import { Injectable } from '@angular/core';
import { Cantante } from '../models/cantante';

@Injectable({
  providedIn: 'root'
})
export class CantantesServiceService {

  private url = "http://localhost:3000/cantantes"

  constructor() { }

  async getAllCantante(): Promise<Cantante[]> {
    const data = await fetch(this.url);
    return await data.json() ?? [];
  }

  async getCantanteById(id: number): Promise<Cantante | null> {
    const response = await fetch(`${this.url}/${id}`);
    const data = await response.json();
    return data? data : null;
  }
  
  async actualizarCantante(id: number, cantante: Cantante): Promise<void> {
    await fetch(`${this.url}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cantante)
    });
  }
}
