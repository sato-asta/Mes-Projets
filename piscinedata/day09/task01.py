from task00 import *
import matplotlib.pyplot as plt

fig_scatter, ax_scatter = plt.subplots()

for class_index in range(len(target_names)):
    ax_scatter.scatter(
        X[y == class_index, 0],
        X[y == class_index, 1],
        label=target_names[class_index]
    )

ax_scatter.set_xlabel("sepal length (cm)")
ax_scatter.set_ylabel("sepal width (cm)")
ax_scatter.legend()

RESULTS["task01"] = {
    "n_points": int(X.shape[0])
}
