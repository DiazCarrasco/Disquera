import { Routes } from '@angular/router';
import { BuscadorComponent } from './shared/buscador/buscador/buscador.component';
import { CantantesComponent } from './features/cantante/cantantes/cantantes.component';
import { CancionesComponent } from './features/cancion/canciones/canciones.component';
import { AgregarCancionesComponent } from './features/cancion/agregar-canciones/agregar-canciones.component';
import { ModificarCancionesComponent } from './features/cancion/modificar-canciones/modificar-canciones.component';

export const routes: Routes = [
    {
        path: '',
        component: BuscadorComponent,
        title: 'Inicio'
    },
    {
        path: 'cantantes',
        component: CantantesComponent,
        title: 'Cantantes'
    
    },
    {
        path: 'canciones',
        component: CancionesComponent,
        title: 'Canciones'
    
    },
    {
        path: 'agregarCanciones',
        component: AgregarCancionesComponent,
        title: 'Agregar canciones'
    
    },
    {
        path: 'modificarCanciones/:id',
        component: ModificarCancionesComponent,
        title: 'Modificar canciones'
    
    }

];


