import { Routes } from '@angular/router';
import { Catalogo } from './catalogo/catalogo';
import { Cesta } from './cesta/cesta';

export const routes: Routes = [
  { path: '', component: Catalogo, title: 'Catálogo · Librería' },
  { path: 'cesta', component: Cesta, title: 'Cesta · Librería' },
];
