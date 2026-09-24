from sklearn.metrics import confusion_matrix, precision_score, recall_score
from task01 import *


confmat_knn = confusion_matrix(y, y_pred_knn)
precision_knn = precision_score(y, y_pred_knn, average="macro")
recall_knn = recall_score(y, y_pred_knn, average="macro")

RESULT["confmat_knn"] = confmat_knn
RESULT["precision_knn"] = precision_knn
RESULT["recall_knn"] = recall_knn
