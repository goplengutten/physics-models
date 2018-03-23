# -*- coding: utf-8 -*-
"""
Created on Thu Mar 22 15:04:20 2018

@author: Haakon
"""

import numpy as np
import sys
import json

#2d equation
Nx = 50
Ny = 50
Nt = 4000
tfinal = 0.3

dt = tfinal/Nt
dx = 1.0/Nx
alpha = dt/dx**2

if(alpha > 0.5):
  print ("alpha > 0.5 makes the solver unstable, decrease dt or increase dx)")
  sys.exit(1)

u_list = []

u = np.zeros((Nx+1,Ny+1))
u[:,0]    = 0
u[0,:]    = 0
u[Nx,:]   = 0
u[:,Ny]   = 1

u_list.append(u.tolist())
 
for j in range(0,Nt):
  t = (j+1)*dt
  u[1:Nx,1:Ny] = u[1:Nx,1:Ny] + alpha*(u[2:Nx+1,1:Ny] + u[1:Nx,2:Ny+1] 
  - 4*u[1:Nx,1:Ny] + u[1:Nx,0:Ny-1] + u[0:Nx-1,1:Ny])
  if(j % 5 == 0):
    u_list.append(u.tolist())

x    = np.linspace(0,1,Nx+1)
y    = np.linspace(0,1,Ny+1)

#Dump to json
info = {
  "x": x.tolist(),
  "y": y.tolist(),
  "ut": u_list
}

info = json.dumps(info)
print (info)
sys.stdout.flush()    
    

