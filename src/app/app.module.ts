import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { LandingComponent } from './landing/landing.component';
import { SolarComponent } from './solar/solar.component';
import { SolarInfoComponent } from './solar/solar-info/solar-info.component';
import { SolarSimulationComponent } from './solar/solar-simulation/solar-simulation.component';
import { ElmagComponent } from './elmag/elmag.component';
import { IsingComponent } from './ising/ising.component';
import { IsingInfoComponent } from './ising/ising-info/ising-info.component';
import { IsingSimulationComponent } from './ising/ising-simulation/ising-simulation.component';
import { DiffusionComponent } from './diffusion/diffusion.component';
import { DiffusionInfoComponent } from './diffusion/diffusion-info/diffusion-info.component';
import { DiffusionSimulationComponent } from './diffusion/diffusion-simulation/diffusion-simulation.component';
import { WaveComponent } from './wave/wave.component';
import { WaveInfoComponent } from './wave/wave-info/wave-info.component';
import { WaveSimulationComponent } from './wave/wave-simulation/wave-simulation.component';
import { QuantumComponent } from './quantum/quantum.component';
import { QuantumInfoComponent } from './quantum/quantum-info/quantum-info.component';
import { EigenfunctionsComponent } from './quantum/eigenfunctions/eigenfunctions.component';
import { EigenfunctionsInfoComponent } from './quantum/eigenfunctions/eigenfunctions-info/eigenfunctions-info.component';
import { EigenfunctionsSimulation1dComponent } from './quantum/eigenfunctions/eigenfunctions-simulation-1d/eigenfunctions-simulation-1d.component';
import { EigenfunctionsSimulation2dComponent } from './quantum/eigenfunctions/eigenfunctions-simulation-2d/eigenfunctions-simulation-2d.component';

const appRoutes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "home", component: LandingComponent },

  { path: "quantum", redirectTo: "quantum/theory", pathMatch: 'full' },
  { path: "quantum", component: QuantumComponent, children: [
    { path: "theory", component: QuantumInfoComponent },
    { path: "eigenfunctions", component: EigenfunctionsComponent,  children: [
      { path: "theory", component: EigenfunctionsInfoComponent },      
      { path: "simulation/1d", component: EigenfunctionsSimulation1dComponent },
      { path: "simulation/2d", component: EigenfunctionsSimulation2dComponent },

     ]}
  ] },
  
  { path: 'solar', redirectTo: "solar/theory", pathMatch: 'full' },
  { path: "solar", component: SolarComponent, children: [
    { path: "theory", component: SolarInfoComponent },
    { path: "simulation", component: SolarSimulationComponent},
  ] },  

  { path: 'ising', redirectTo: "ising/theory", pathMatch: 'full' },
  { path: "ising", component: IsingComponent, children: [
    { path: "theory", component: IsingInfoComponent },
    { path: "simulation", component: IsingSimulationComponent},
  ] }, 
  
  { path: 'diffusion', redirectTo: "diffusion/theory", pathMatch: 'full' },
  { path: "diffusion", component: DiffusionComponent, children: [
    { path: "theory", component: DiffusionInfoComponent },
    { path: "simulation", component: DiffusionSimulationComponent},
  ] }, 

  { path: 'wave', redirectTo: "wave/theory", pathMatch: 'full' },
  { path: "wave", component: WaveComponent, children: [
    { path: "theory", component: WaveInfoComponent },
    { path: "simulation", component: WaveSimulationComponent},
  ] }, 

  { path: 'elmag', component: ElmagComponent},
  { path: '**', redirectTo: "home", pathMatch: "full" }
]

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    LandingComponent,
    SolarComponent,
    SolarInfoComponent,
    SolarSimulationComponent,
    ElmagComponent,
    IsingComponent,
    IsingInfoComponent,
    IsingSimulationComponent,
    DiffusionComponent,
    DiffusionInfoComponent,
    DiffusionSimulationComponent,
    WaveComponent,
    WaveInfoComponent,
    WaveSimulationComponent,
    QuantumComponent,
    QuantumInfoComponent,
    EigenfunctionsComponent,
    EigenfunctionsInfoComponent,
    EigenfunctionsSimulation1dComponent,
    EigenfunctionsSimulation2dComponent
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
