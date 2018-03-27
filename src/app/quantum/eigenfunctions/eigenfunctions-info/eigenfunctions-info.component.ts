import { Component, OnInit } from '@angular/core';

declare var MathJax:any

@Component({
  selector: 'app-eigenfunctions-info',
  templateUrl: './eigenfunctions-info.component.html',
  styleUrls: ['./eigenfunctions-info.component.css']
})
export class EigenfunctionsInfoComponent implements OnInit {

  testString

  constructor() { }

  ngOnInit() {
    this.testString = `
    The motion of one particle moving in a confining time independent potential $V(x)$ is governed by the Schrödinger equation (SE)
    \\begin{equation}
    i \\hbar \\frac{\\partial}{\\partial t} \\Psi(x,t) = \\left[ -\\frac{\\hbar^2}{2m} + V(x) \\right] \\Psi(x,t)
    \\end{equation}
    Under the assumption that $V(x)$ is independent of time one can find seperable solutions of the (SE) using the ansatz 
    \\begin{equation}
    \\Psi(x,t) = \\psi(x) \\phi(t).
    \\end{equation}
    Insertion of the ansatz into the (SE) yields two ordinary differential equations, one for $\\psi(x)$ and one for $\\phi(t)$
    \\begin{align*}
    \\frac{d \\phi}{d t} &= -\\frac{iE}{\\hbar} \\phi(t) \\\\
    \\left[ -\\frac{\\hbar^2}{2m} + V(x) \\right] \\psi(x) &= E \\psi(x),
    \\end{align*}
    where the last equation is widely known as the time independent Schrödinger equation (TDSE). The equation for $\\phi$ can be solved once and for all and the solution is given by
    \\begin{equation}
    \\phi(t) = e^{-iEt/ \\hbar}.
    \\end{equation}
    In order to solve the TDSE one has to specify a potential. 

    The separable solutions, 
    \\begin{equation}
    \\Psi(x,t) = \\psi(x) e^{-iEt/ \\hbar}
    \\end{equation}
    are known as stationary states, since the probability density is independent of time 
    \\begin{equation}
    \\left|\\Psi(x,t)\\right|^2 = \\Psi^* \\Psi = \\psi^* e^{+iEt/ \\hbar} \\psi e^{-iEt/ \\hbar} = \\left|\\psi(x)\\right|^2.
    \\end{equation}
    
    It turns out that the general solution can be taken as a (possibly infinite) linear combination of separable solutions, 
    \\begin{equation}
    \\Psi(x,t) = \\sum_{n=1}^\\infty c_n \\psi_n(x) e^{-iE_nt/ \\hbar}, \\ \\ \\sum_{n=1}^\\infty \\left|c_n\\right|^2 = 1
    \\end{equation}

    In particular this implies that if the initial wavefunction is taken as a finite linear combination of eigenstates
    \\begin{equation}
    \\Psi(x,0) = \\sum_{n=1}^N c_n \\psi_n(x),
    \\end{equation}
    the time evolution is given by 
    \\begin{equation}
    \\Psi(x,t) = \\sum_{n=1}^N c_n \\psi_n(x) e^{-iE_nt/ \\hbar}.
    \\end{equation}
    
    By going to the simulation you can experiment with the time evolution for a selection of potentials $V(x)$.
`

    setTimeout(() => {
      MathJax.Hub.Queue(["Typeset", MathJax.Hub])
    },5)
  }

}
