
import numpy as np
import sys
import json
import random

message = sys.stdin.read()
message = json.loads(message)
heatmap = np.array(message["heatmap"])
sources = message["sources"]

#2d equation
Nx = heatmap.shape[0]
Ny = heatmap.shape[1]


Nt = 500
tfinal = 0.05

x = np.linspace(0,1,Nx)
y = np.linspace(0,1,Ny)


dt = tfinal/Nt
dx = x[1] - x[0]
alpha = dt/(dx**2)

if(alpha > 0.5):
  #print "alpha > 0.5 makes the solver unstable, decrease dt or increase dx)"
  sys.exit(1)


u = heatmap.copy()


u_list = []
u_new = u.copy()
for j in range(0,Nt+1):
  
  t = (j+1)*dt

  u_new[1:Nx-1,1:Ny-1] = u[1:Nx-1,1:Ny-1] + alpha*(u[2:Nx,1:Ny-1] + u[1:Nx-1,2:Ny] - 4.0*u[1:Nx-1,1:Ny-1] + u[1:Nx-1,0:Ny-2] + u[0:Nx-2,1:Ny-1])

  u_new[Nx-1,1:Ny-1] = u[Nx-1,1:Ny-1] + alpha*(u[0,1:Ny-1]  + u[Nx-1,2:Ny] - 4.0*u[Nx-1,1:Ny-1] + u[Nx-1,0:Ny-2] + u[Nx-2,1:Ny-1])
  u_new[1:Nx-1,Ny-1] = u[1:Nx-1,Ny-1] + alpha*(u[2:Nx,Ny-1] + u[1:Nx-1,0]  - 4.0*u[1:Nx-1,Ny-1] + u[1:Nx-1,Ny-2] + u[0:Nx-2,Ny-1])
  u_new[0,1:Ny-1]    = u[0,1:Ny-1]    + alpha*(u[1,1:Ny-1]  + u[0,2:Ny]    - 4.0*u[0,1:Ny-1]    + u[0,0:Ny-2]    + u[Nx-1,1:Ny-1])
  u_new[1:Nx-1,0]    = u[1:Nx-1,0]    + alpha*(u[2:Nx,0]    + u[1:Nx-1,1]  - 4.0*u[1:Nx-1,0]    + u[1:Nx-1,Ny-1] + u[0:Nx-2,0])

  u_new[0,0]         = u[0,0]       + alpha*(u[1,0]    + u[0,1]    - 4.0*u[0,0]       + u[0,Ny-1]    + u[Nx-1,0])
  u_new[Nx-1,0]      = u[Nx-1,0]    + alpha*(u[0,0]    + u[Nx-1,1] - 4.0*u[Nx-1,0]    + u[Nx-1,Ny-1] + u[Nx-2,0])
  u_new[0,Ny-1]      = u[0,Ny-1]    + alpha*(u[1,Ny-1] + u[0,0]    - 4.0*u[0,Ny-1]    + u[0,Ny-2]    + u[Nx-1,Ny-1])
  u_new[Nx-1,Ny-1]   = u[Nx-1,Ny-1] + alpha*(u[0,Ny-1] + u[Nx-1,0] - 4.0*u[Nx-1,Ny-1] + u[Nx-1,Ny-2] + u[Nx-2,Ny-1])

  for source in sources:
    u_new[source[0],source[1]] = heatmap[source[0], source[1]]

  u = u_new.copy()
  u_list.append(u.tolist())
 

#Dump to json
info = {
  "x": x.tolist(),
  "y": y.tolist(),
  "ut": u_list
}

info = json.dumps(info)
print info
sys.stdout.flush() 
