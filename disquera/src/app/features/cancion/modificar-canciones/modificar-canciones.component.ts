import { Component, inject, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cantante } from '../../../core/models/cantante';
import { CantantesServiceService } from '../../../core/services/cantantes-service.service';
import { Cancion } from '../../../core/models/cancion';
import { CancionesServiceService } from '../../../core/services/canciones-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule, FormGroup, ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-modificar-canciones',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './modificar-canciones.component.html',
  styleUrl: './modificar-canciones.component.css'
})
export class ModificarCancionesComponent {

  cantanteList: Cantante[] = [];
  cantanteService: CantantesServiceService = inject(CantantesServiceService);
  cancion: Cancion | null = null;
  cancionService: CancionesServiceService = inject(CancionesServiceService);
  formularioCancion!: FormGroup;
  id: string | null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private ruta: ActivatedRoute
  ) {

    this.id = this.ruta.snapshot.paramMap.get('id');

    if (this.id) {
      this.cancionService.getCancionById(this.id!).then((cancionID: Cancion) => {
        this.cancion = cancionID;

        this.formularioCancion = this.formBuilder.group({
          titulo: [this.cancion.titulo, [Validators.required, Validators.minLength(3)]],
          duracion: [this.cancion.duracion, [Validators.required, Validators.min(10)]],
          genero: [this.cancion.genero, [Validators.required, Validators.minLength(3)]],
          cantante_id: [this.cancion.cantante_id, [Validators.required, this.validarCantante]]

        });
      });
    }


    this.cantanteService.getAllCantante().then((cantantesList: Cantante[]) => {
      this.cantanteList = cantantesList;
      this.cantanteList = cantantesList;
    });
  }

  validarCantante(control: AbstractControl): ValidationErrors | null {
    return control.value && control.value !== 0 ? null : { cantanteInvalido: true };
  }

  async actualizarCancion() {

    let nuevaCancion = this.formularioCancion.value;

    this.cancionService.modificarCancion(this.id!, nuevaCancion).then((cancionCreada) => {
      this.cantanteService.getCantanteById(nuevaCancion.cantante_id).then((cantante) => {
        if (!cantante) {
          alert("Cantante no encontrado");
          return;
        }

        this.cantanteService.getCantanteById(this.cancion!.cantante_id).then(async (cantanteAnterior) => {
          if (!cantanteAnterior) {
            alert("Cantante anterior sin encontrar");
            return;
          }

          if (cantanteAnterior.id === cantante.id) {
            const index = cantanteAnterior.canciones.findIndex(cancionSegunda => cancionSegunda === this.cancion!.titulo);
            if (index !== -1) {
              cantanteAnterior.canciones.splice(index, 1);
            }
            cantanteAnterior.canciones[index] = cancionCreada.titulo;
            cantante.canciones[index] = cancionCreada.titulo;
          } else {
            const index = cantanteAnterior.canciones.findIndex(cancionSegunda => cancionSegunda === this.cancion!.titulo);
            if (index !== -1) {
              cantanteAnterior.canciones.splice(index, 1);
            }
            cantante.canciones.push(cancionCreada.titulo);
          }

          Promise.all([
            this.cantanteService.actualizarCantante(cantanteAnterior.id, cantanteAnterior),
            this.cantanteService.actualizarCantante(cantante.id, cantante)
          ]).then(() => {
            alert("Cancion modificado correctamente");
            this.router.navigate(["/canciones"])
          });
        });
      });
    });
  }
}
