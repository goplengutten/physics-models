import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { LandingComponent } from './landing/landing.component';
import { QuantumComponent } from './quantum/quantum.component';
import { SolarComponent } from './solar/solar.component';
import { SolarInfoComponent } from './solar/info/solar-info.component';
import { SolarSimulationComponent } from './solar/solar-simulation/solar-simulation.component';
import { ElmagComponent } from './elmag/elmag.component';
import { QuantumInfoComponent } from './quantum/info/quantum-info.component';
import { Type1Component } from './quantum/type1/type1.component';
import { QuantumSimulationComponent } from './quantum/simulation/quantum-simulation.component';
import { IsingComponent } from './ising/ising.component';
import { IsingInfoComponent } from './ising/ising-info/ising-info.component';
import { IsingSimulationComponent } from './ising/ising-simulation/ising-simulation.component';

const appRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: "home", component: LandingComponent },

  { path: 'quantum', redirectTo: "quantum/info", pathMatch: 'full' },
  { path: "quantum", component: QuantumComponent, children: [
    { path: "info", component: QuantumInfoComponent },
    { path: "type1", component: Type1Component },
    { path: ":type/simulation", component: QuantumSimulationComponent },
  ] },
  
  { path: 'solar', redirectTo: "solar/info", pathMatch: 'full' },
  { path: "solar", component: SolarComponent, children: [
    { path: "info", component: SolarInfoComponent },
    { path: "simulation", component: SolarSimulationComponent},
  ] },  

  { path: 'ising', redirectTo: "ising/info", pathMatch: 'full' },
  { path: "ising", component: IsingComponent, children: [
    { path: "info", component: IsingInfoComponent },
    { path: "simulation", component: IsingSimulationComponent},
  ] },  


  { path: 'elmag', component: ElmagComponent},
  { path: '**', redirectTo: "home", pathMatch: "full" }
]

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    LandingComponent,
    QuantumComponent,
    QuantumInfoComponent,
    Type1Component,
    QuantumSimulationComponent,
    SolarComponent,
    SolarInfoComponent,
    SolarSimulationComponent,
    ElmagComponent,
    IsingComponent,
    IsingInfoComponent,
    IsingSimulationComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    HttpModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
