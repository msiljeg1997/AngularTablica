import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TablicaComponent } from './tablica/tablica.component';

const routes: Routes = [
  { path: 'tablica', component: TablicaComponent },
  { path: '', redirectTo: '/tablica', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
