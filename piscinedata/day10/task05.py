from task01 import *
from sklearn.tree import DecisionTreeClassifier, plot_tree
import matplotlib as plt

model_tree = DecisionTreeClassifier(max_depth=3)
model_tree.fit(X, y)

fig_tree = plt.figure(figsize=(10, 6))
plot_tree(model_tree, filled=True)

RESULT["model_tree"] = model_tree
RESULT["fig_tree"] = fig_tree
