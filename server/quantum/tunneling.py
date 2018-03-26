import numpy as np
from scipy.linalg import expm
import sys
import json

def Gaussian(x,alpha,x0,p0,gamma0):
  N = (2.0*alpha/np.pi)**0.25
  return N*np.exp(-alpha*(x-x0)**2+1j*p0*(x-x0)+1j*gamma0)    

def Barrier(x,V0,L):
  if(-L/2.0 <= x <= L/2.0):
    return V0
  return 0

message = json.loads(sys.argv[1])
V0 = message["V"] #Strength of barrier
L  = message["L"] #Size of barrier
p0 = message["p"]
x0 = message["x"]
alpha = message["alpha"]

Lx = 20
T =  1 # How long to run simulation
Ngrid = 200

dt = 1e-4 # The time step

x = np.linspace(-Lx,Lx,Ngrid+1)
dx = x[1]-x[0]
Psi = Gaussian(x, alpha, x0, p0, gamma0=0)


barr = np.zeros(Ngrid+1)
for i in range(0,Ngrid+1):
  barr[i] = Barrier(x[i],V0,L)

H  = np.zeros((Ngrid-1,Ngrid-1))
for i in range(0,Ngrid-1):			
	H[i,i] = 1.0/dx**2 + barr[i+1] 			
	if(i < Ngrid-2):
		H[i,i+1] = -1.0/(2.0*dx**2)
		H[i+1,i] = -1.0/(2.0*dx**2)

# Time parameters
counter = 0
time_steps = int( T / dt ) # Number of time steps
psi0_dens = np.abs(Psi)**2
psit_list = []
psit_list.append(psi0_dens.tolist())

# Time loop
while counter < time_steps:
  counter += 1
  t = counter*dt
  Psi[1:Ngrid] = np.dot(expm(-1j*dt*H),Psi[1:Ngrid])
  psit_list.append((np.abs(Psi)**2).tolist())

info = {
  "x": x.tolist(),
  "V": barr.tolist(),
  "psi_t": psit_list
} 

info = json.dumps(info)
print info 
sys.stdout.flush()
