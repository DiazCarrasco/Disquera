import { Component, inject } from '@angular/core';
import { Cantante } from '../../../core/models/cantante';
import { CantantesServiceService } from '../../../core/services/cantantes-service.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cantantes',
  imports: [CommonModule, RouterLink],
  templateUrl: './cantantes.component.html',
  styleUrl: './cantantes.component.css'
})
export class CantantesComponent {

  cantantesList: Cantante[] = [];
  cantanteService: CantantesServiceService = inject(CantantesServiceService);

  constructor() {
    this.cantanteService.getAllCantante().then((cantantesList: Cantante[]) => {
      this.cantantesList = cantantesList;
      this.cantantesList = cantantesList;
    });
  }

}
