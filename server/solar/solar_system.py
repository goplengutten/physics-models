import sys
import numpy as np
import json

Msun_SI   = (1.988544*10**30)
Msun = 1.0 #[solar mass]
radius_sun =  695700.0 #km
G = 4.0*np.pi**2
allPlanets = []
dt = 1*10**(-3)
Tfinal = 20
Nt = int(Tfinal/dt)
t_vec = np.linspace(0,Tfinal,Nt)
AU = 149597871.0 # 1 AU in km

class Planet:
  def __init__(self,name,mass,r_init,v_init,radius):
    self.r = r_init
    self.v = v_init
    self.mass = mass
    self.name = name
    self.radius = radius
    self.Fnet = 0
    self.acc = 0

planets = json.loads(sys.argv[1])
for i in range(0, len(planets)):
  planet = planets[i]
  initPosVec = np.array(planet["initPosVec"])
  initVelVec = np.array(planet["initVelVec"])
  name = planet["name"]
  mass = planet["mass"]    
  radius = planet["radius"]
  planet = Planet(name,mass/Msun_SI,initPosVec,initVelVec*365.2422,radius/AU)
  allPlanets.append(planet)

nrOfPlanets = len(allPlanets)

def computeForces():
    
  for i in range(0,nrOfPlanets):
    allPlanets[i].Fnet = 0

  for i in range(0,nrOfPlanets):
    pl_i = allPlanets[i]
    r_i = pl_i.r
    for j in range(i+1,nrOfPlanets):
      pl_j = allPlanets[j]
      r_j = pl_j.r
      r_ij = np.sqrt((r_i[0]-r_j[0])**2+(r_i[1]-r_j[1])**2 +(r_i[2]-r_j[2])**2) # |r_e-r_s|
      r_ij_squared = r_ij**2  
      Fgravity = G*pl_i.mass*pl_j.mass/r_ij_squared

      F_ij = -Fgravity/r_ij * (r_i-r_j)
      pl_i.Fnet +=  F_ij
      pl_j.Fnet += -F_ij #applying Newtons 3 law

def stepForwardEulerCromer(tstep):   
  #EulerCromer integration 
  computeForces()
  for i in range(0,nrOfPlanets):
    pl_i = allPlanets[i]            
    pl_i.v = pl_i.v + dt*(pl_i.Fnet/pl_i.mass)
    pl_i.r = pl_i.r + dt*pl_i.v
       
def stepForwardVelocityVerlet(tstep):
  #VelcoityVerlet integration
  computeForces()
  for i in range(0,nrOfPlanets):
    pl_i = allPlanets[i]
    pl_i.acc = pl_i.Fnet/pl_i.mass
    pl_i.r = pl_i.r + dt*pl_i.v + 0.5*pl_i.acc*dt**2
    
    computeForces()
    for i in range(0,nrOfPlanets):
      pl_i = allPlanets[i]
      acc_new = pl_i.Fnet/pl_i.mass
      pl_i.v = pl_i.v + 0.5*(pl_i.acc+acc_new)*dt


frames = []
for tstep in range(1,Nt): 
  #stepForwardVelocityVerlet(tstep)
  stepForwardEulerCromer(tstep)  

  #timeStepInfo = []
  x = []
  y = []
  z = []
  for i in range(0,nrOfPlanets):
    x.append(allPlanets[i].r[0])
    y.append(allPlanets[i].r[1])
    z.append(allPlanets[i].r[2])

    """
    tmp = []
    tmp.append(allPlanets[i].r[0])
    tmp.append(allPlanets[i].r[1])
    tmp.append(allPlanets[i].radius)
    tmp.append(allPlanets[i].name)
    timeStepInfo.append(tmp)
    """
  frame = {
    "x": x,
    "y": y
  }
  #fullSimulation.append(timeStepInfo)
  frames.append(frame)



p = json.dumps(frames)
print p
sys.stdout.flush()






  