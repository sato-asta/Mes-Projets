from sklearn.metrics import confusion_matrix, precision_score, recall_score
from task05 import *

comfmat_tree = confusion_matrix(y, model_tree.predict(X))
precision_tree = precision_score(y, model_tree.predict(X), average="macro")
recall_tree = recall_score(y, model_tree.predict(X), average="macro")

RESULT["confmat_tree"] = comfmat_tree
RESULT["precision_tree"] = precision_tree
RESULT["recall_tree"] = recall_tree
