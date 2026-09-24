from task00 import *
from task02 import *
from task03 import *
from sklearn.metrics import confusion_matrix

y_predicted_virginica = (scores_virginica > 0).astype(int)

confmat_virginica = confusion_matrix(
    y_binary_virginica,
    y_predicted_virginica,
    labels=[0, 1]
)

RESULTS["task04"] = {
    "tp": int(confmat_virginica[1, 1]),
    "tn": int(confmat_virginica[0, 0]),
    "fp": int(confmat_virginica[0, 1]),
    "fn": int(confmat_virginica[1, 0])
}
