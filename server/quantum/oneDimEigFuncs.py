import sys
import numpy as np
import scipy.linalg
import json


v_ho = lambda x, omega=1: 0.5*omega**2*x**2
v_dw = lambda x, omega=1, R=2: v_ho(x,omega)+0.5*omega**2*(0.25*R**2 - R*np.abs(x))

parameters           = json.loads(sys.argv[1])
which_potential      = parameters["potential"]
grid_parameters      = parameters["gridParams"]
potential_parameters = parameters["potentialParams"]
timeParams           = parameters["timeParams"]
coeffs               = parameters["coeffs"]
nrOfEigFuncs         = int(parameters["nrOfEigFuncs"])


#Grid parameters
Lx      = float(grid_parameters[0]) #Range of x-axis: [-Lx,Lx]
N       = int(grid_parameters[1]) #Number of grid points
x       = np.linspace(-Lx, Lx, N)
dx      = x[1]-x[0]

#Different potential and potential parameters
potential_vec = np.zeros(N)

if(which_potential == "HO"):
    omega = float(potential_parameters[0])
    potential_vec = v_ho(x,omega)   
elif(which_potential == "DW"):
    omega = float(potential_parameters[0])
    R     = float(potential_parameters[1])
    potential_vec = v_dw(x,omega,R)
else:
    #print("Provide predefined potential")
    sys.exit(1)

def computeEigenStates(potential):
  H     = np.zeros((N-2,N-2)) #Solving for internal grid points only
  for i in range(0,N-2):
    H[i, i] = 1.0/(dx**2) + potential[i+1]
    if i + 1 < N - 2:
      H[i+1,i] = -1.0/(2*dx**2)
      H[i,i+1] = -1.0/(2*dx**2)
  eigvecs = np.zeros((N,N-2))
  eigvals, eigvecs[1:-1,:] = scipy.linalg.eigh(H)
  eigvecs = 1.0/np.sqrt(dx)*eigvecs #Ensure that the wavefunction is normalized wrp. to the integral
  return eigvals, eigvecs

eigvals, eigvecs = computeEigenStates(potential_vec)

#Time evolution
#Time evolution of linear comb
dt = timeParams[0]
Tfinal = timeParams[1]
coeffs = np.array(coeffs)
norm_c = np.linalg.norm(coeffs)
coeffs = 1.0/norm_c*coeffs
Nt = int(Tfinal/dt)

psi_time_list = []
for tstep in range(0,Nt+1):
    t = tstep*dt
    psi_tmp = np.zeros(N,dtype=np.complex128)
    for i in range(0,nrOfEigFuncs):
        psi_tmp += coeffs[i]*eigvecs[:,i]*np.exp(-1j*eigvals[i]*t)
    psi_tmp = np.abs(psi_tmp)**2
    psi_time_list.append(psi_tmp.tolist())

#Dump to JSON format
x = x.tolist()
eigFuncs_list = []


#loop over nrOfEigFuncs and append to eigFuncs_list
for i in range(0,nrOfEigFuncs):
    probDensity = abs(eigvecs[:,i])**2 + np.ones(N)*eigvals[i]
    probDensity = probDensity.tolist()
    eigFuncs_list.append(probDensity)

#Potential
pot = potential_vec
pot = pot.tolist()

result = {
    "x": x,
    "eigFuncs": eigFuncs_list,
    "animation": psi_time_list,
    "potential": pot
}

result = json.dumps(result)
print result
sys.stdout.flush()