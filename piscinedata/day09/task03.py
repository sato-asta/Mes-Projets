from task00 import X, RESULTS
from task02 import y_binary_virginica
from sklearn.model_selection import StratifiedKFold, cross_val_predict
from sklearn.svm import LinearSVC

cross_validator = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

virginica_detector_for_cv = LinearSVC(dual="auto", max_iter=5000)

scores_virginica = cross_val_predict(
    virginica_detector_for_cv,
    X,
    y_binary_virginica,
    cv=cross_validator,
    method="decision_function"
)

RESULTS["task03"] = {
    "scores_mean": float(scores_virginica.mean()),
    "scores_std": float(scores_virginica.std()),
    "score_range": float(scores_virginica.max() - scores_virginica.min())
}
