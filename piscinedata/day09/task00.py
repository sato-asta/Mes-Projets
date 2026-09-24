from sklearn.datasets import load_iris

iris_dataset = load_iris()

X = iris_dataset.data
y = iris_dataset.target
feature_names = list(iris_dataset.feature_names)
target_names = list(iris_dataset.target_names)

RESULTS = {}
RESULTS["dataset"] = {
    "shape": X.shape,
    "n_classes": int(len(set(y)))
}
