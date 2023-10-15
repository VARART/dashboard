import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneralTableComponent } from './general-table/general-table.component';
import { ShortInfoComponent } from './short-info/short-info.component';

const routes: Routes = [
  { path: 'general-table', component: GeneralTableComponent },
  { path: 'short-info', component: ShortInfoComponent },
  { path: '', redirectTo: '/general-table', pathMatch: 'full' } // Встановлення стартового маршруту
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
