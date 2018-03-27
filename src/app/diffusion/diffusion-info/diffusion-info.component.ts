import { Component, OnInit } from '@angular/core';

declare var MathJax:any

@Component({
  selector: 'app-diffusion-info',
  templateUrl: './diffusion-info.component.html',
  styleUrls: ['./diffusion-info.component.css']
})
export class DiffusionInfoComponent implements OnInit {

  infoText

  constructor() { 
  }

  ngOnInit() {
    
    this.infoText = `
    Heat equation
    \\begin{equation}
    u_t = u_{xx} + f(x,t), \\ \\ x \\in [0,L]\\ \\ 
    \\end{equation}
    
    Initial cond:
    \\begin{equation}
    u(x,0) = g(x), \\ \\ x \\in (0,L)
    \\end{equation}
    
    Boundary conds:
    \\begin{align*}
    u(0,t) &= u_0 = g(0) \\\\ 
    u(L,t) &= u_{N_x+1} = g(L)
    \\end{align*}
    
    Approximations:
    
    \\begin{equation}
    u(x,t) \\approx u(x_i,t_n) = u_i^n
    \\end{equation}

    \\begin{equation}
    u_t \\approx \\frac{u_i^{n+1} - u_i^n}{\\Delta t}
    \\end{equation}

    \\begin{align}
    u_{xx} &\\approx \\frac{u_{i-1}^{n} - 2u_i^n + u_{i+1}^n}{\\Delta x^2}, \\ \\ i=1,\\cdots, N_x \\\\
    u_x &\\approx \\frac{u_{i+1}-u_{i-1}}{2 \\Delta x}
    \\end{align}

    First scheme:

    \\begin{align*}
    \\frac{u_i^{n+1} - u_i^n}{\\Delta t} = \\frac{u_{i-1}^{n} - 2u_i^n + u_{i+1}^n}{\\Delta x^2} + f_i^n \\\\
    u_i^{n+1} = u_i^n + \\alpha\\left(u_{i-1}^{n} - 2u_i^n + u_{i+1}^n\\right) + \\Delta t f_i^n, \\ \\ \\alpha \\equiv \\frac{\\Delta t}{\\Delta x^2}, \\ \\ i=1,\\cdots, N_x 
    \\end{align*}
    `

    setTimeout(() => {
      MathJax.Hub.Queue(["Typeset", MathJax.Hub])
    },5)
  }
}
