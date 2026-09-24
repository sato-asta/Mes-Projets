import matplotlib as plt
from task01 import *
import numpy as np

X2 = X[:, 2:4]

model_knn2 = KNeighborsClassifier(n_neighbors=3)
model_knn2.fit(X2, y)

XX = np.linespaces(0, 7, 200)
yy = np.linespaces(0, 3, 200)

Z = np.zeros(len(yy), len(XX))

for i in range(len(XX)):
    for j in range(len(yy)):
        point = [[XX[i], yy[j]]]
        Z[j, i] = model_knn2.predict(point)

fig_boundaries_knn = plt.figure(figsize=(6, 5))
plt.contourf(XX, yy, Z, alpha=0.3)
plt.scatter(X2[:, 0], X2[:, 1], c=y, edgecolor="m")
plt.xlabel("Petal Length (cm)")
plt.ylabel("Petal Width (cm)")
plt.title("KNN Decision Boundaries")

RESULT["fig_boundaries_knn"] = fig_boundaries_knn
