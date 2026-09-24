from task04 import *

true_positive = confmat_virginica[1, 1]
true_negative = confmat_virginica[0, 0]
false_positive = confmat_virginica[0, 1]
false_negative = confmat_virginica[1, 0]

precision_v = true_positive / (true_positive + false_positive) if (true_positive + false_positive) > 0 else 0.0
recall_v = true_positive / (true_positive + false_negative) if (true_positive + false_negative) > 0 else 0.0
f1_v = 2 * precision_v * recall_v / (precision_v + recall_v) if (precision_v + recall_v) > 0 else 0.0

RESULTS["task05"] = {
    "precision": float(precision_v),
    "recall": float(recall_v),
    "f1": float(f1_v)
}
