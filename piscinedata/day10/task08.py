from task01 import *
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import precision_score
from task05 import model_tree

proba_tree = model_tree.predict_proba(X)

RESULT["proba_tree"] = proba_tree