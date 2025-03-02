import { Component, inject, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cantante } from '../../../core/models/cantante';
import { CancionesServiceService } from '../../../core/services/canciones-service.service';
import { CantantesServiceService } from '../../../core/services/cantantes-service.service';
import { FormsModule, FormGroup, ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-agregar-canciones',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './agregar-canciones.component.html',
  styleUrl: './agregar-canciones.component.css'
})
export class AgregarCancionesComponent {

  cantantesList: Cantante[] = [];
  cantanteService: CantantesServiceService = inject(CantantesServiceService);
  cancionService: CancionesServiceService = inject(CancionesServiceService);

  formularioCancion: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
  ) {

    this.formularioCancion = this.formBuilder.group({
      titulo: ['', [Validators.required, Validators.minLength(1)]] ,
      duracion: [0, [Validators.required, Validators.min(5)]],
      genero: ['', [Validators.required, Validators.minLength(1)]],
      cantante_id: [0, [Validators.required, this.validarCantante]]

    });

    this.cantanteService.getAllCantante().then((cantanteList: Cantante[]) => {
      this.cantantesList = cantanteList;
      this.cantantesList = cantanteList;
    });
  }

  validarCantante(control: AbstractControl): ValidationErrors | null {
    return control.value && control.value !== 0 ? null : { cantanteInvalidado: true };
  }

  async agregarCancion() {

    let nuevaCancion = this.formularioCancion.value;

    let cancionExiste = await this.cancionService.existeCancionByNombre(nuevaCancion.titulo);

    if (!cancionExiste) {

      this.cancionService.agregarCancion(nuevaCancion).then((cancionCreada) => {
        this.cantanteService.getCantanteById(nuevaCancion.cantante_id).then((cantante) => {
          if (!cantante) {
            alert("Cantante no encontrado");
            return;
          }
    
          cantante.canciones.push(cancionCreada.titulo);
    
          this.cantanteService.actualizarCantante(cantante.id, cantante).then(() => {
            alert("Cancion agregada correctamente");
            this.formularioCancion.reset();
          });
        });
      });
    } else {
      alert("Ya existe un cantante con esa cancion.");
    }
  }

}
