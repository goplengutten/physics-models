import { Component, OnInit } from '@angular/core';
import { DiffusionSimulationService } from '../diffusion-simulation.service';


@Component({
  selector: 'app-diffusion-controllers',
  templateUrl: './diffusion-controllers.component.html',
  styleUrls: ['./diffusion-controllers.component.css']
})
export class DiffusionControllersComponent implements OnInit {

  constructor(private simSer: DiffusionSimulationService) { }

  ngOnInit() {
  }
}
