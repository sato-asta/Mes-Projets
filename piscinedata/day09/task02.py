from task00 import X, y, target_names, RESULTS
from sklearn.svm import LinearSVC

virginica_class_index = list(target_names).index("virginica")
y_binary_virginica = (y == virginica_class_index).astype(int)

virginica_detector = LinearSVC(dual="auto", max_iter=5000)
virginica_detector.fit(X, y_binary_virginica)

RESULTS["task02"] = {
    "positive_ratio": float(y_binary_virginica.mean()),
    "coef_norm": float((virginica_detector.coef_ ** 2).sum()),
    "n_features": int(virginica_detector.coef_.shape[1])
}
