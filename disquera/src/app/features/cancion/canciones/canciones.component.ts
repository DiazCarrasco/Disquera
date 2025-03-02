import { ChangeDetectorRef, Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cancion } from '../../../core/models/cancion';
import { CancionesServiceService } from '../../../core/services/canciones-service.service';
import { Cantante } from '../../../core/models/cantante';
import { CantantesServiceService } from '../../../core/services/cantantes-service.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-canciones',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './canciones.component.html',
  styleUrl: './canciones.component.css'
})
export class CancionesComponent implements OnInit, OnChanges{

  cancionesList: Cancion[] = [];
  cancionesServicios: CancionesServiceService = inject(CancionesServiceService);
  
  cantantesList: Cantante[] = [];
  cantanteService: CantantesServiceService = inject(CantantesServiceService);

  cantanteSeleccionado: string = '0';
  cancionesFiltradas: Cancion[] = [];

  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.cargarCanciones();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataChanged']) {
      this.cargarCanciones();
    }
  }

  cargarCanciones() {
    this.cancionesServicios.getAllCanciones().then((cancionesLista: Cancion[]) => {
      this.cancionesList = cancionesLista;
      this.filtrarCanciones();
    });

    this.cantanteService.getAllCantante().then((catanteLista: Cantante[]) => {
      this.cantantesList = catanteLista;
    });

    this.changeDetectorRef.detectChanges();

  }

  filtrarCanciones() {
    if (this.cantanteSeleccionado != "0") {
      this.cancionesFiltradas = this.cancionesList.filter(cancion => cancion.cantante_id == parseInt(this.cantanteSeleccionado));
    } else {
      this.cancionesFiltradas = this.cancionesList;
    }
  }

  async eliminarCancion(cancion: Cancion) {

    this.cantanteService.getCantanteById(cancion.cantante_id).then(async (cantante) => {
      if (!cantante) {
        alert("Cantante no encontrado");
        return;
      }

      const index = cantante.canciones.findIndex(cancion2 => cancion2 === cancion.titulo);
      if (index !== -1) {
        cantante.canciones.splice(index, 1);
      }

      await this.cantanteService.actualizarCantante(cancion.cantante_id, cantante)
      await this.cancionesServicios.borrarCancion(cancion.id!);

      this.cargarCanciones();

    });
  }



}
