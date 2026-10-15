import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectUnidades } from './cesta/cesta.selectors';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly store = inject(Store);

  /** Un signal que se actualiza cada vez que cambia lo que devuelve el selector. */
  protected readonly unidades = this.store.selectSignal(selectUnidades);
}
