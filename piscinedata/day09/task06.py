from task00 import RESULTS
from task02 import y_binary_virginica
from task03 import scores_virginica
from sklearn.metrics import precision_recall_curve

pr_result = precision_recall_curve(
    y_binary_virginica,
    scores_virginica
)

precision_curve = pr_result[0]
recall_curve = pr_result[1]
thresholds_pr = pr_result[2]

RESULTS["task06"] = {
    "n_thresholds": int(len(thresholds_pr)),
    "precision_max": float(precision_curve.max()),
    "recall_max": float(recall_curve.max())
}
