import { Injectable } from '@angular/core';
import { Cancion } from '../models/cancion';

@Injectable({
  providedIn: 'root'
})
export class CancionesServiceService {

  private url = "http://localhost:3001/canciones"

  constructor() { }

  async getAllCanciones(): Promise<Cancion[]> {
    const data = await fetch(this.url);
    return await data.json() ?? [];
  }

  async agregarCancion(cancion: Cancion): Promise<Cancion> {
    const response = await fetch(`${this.url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cancion)
    });
    return response.json();
  }

  async getCancionById(id: string): Promise<Cancion> {
    const data = await fetch(`${this.url}/${id}`);
    return await data.json();
  }

  async existeCancionByNombre(nombre: string): Promise<boolean> {
    let canciones = await this.getAllCanciones();
    return canciones.some(cancion => cancion.titulo.toLowerCase() === nombre.toLowerCase());
  }

  async borrarCancion(id: number): Promise<Cancion> {
    const response = await fetch(`${this.url}/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  }

  async modificarCancion(id: string, cancion: Cancion): Promise<Cancion> {
    const response = await fetch(`${this.url}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cancion)
    });
    return response.json();
  }

}
