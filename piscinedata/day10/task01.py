from sklearn.datasets import load_iris
from sklearn.neighbors import KNeighborsClassifier

data = load_iris()
X = data.data
y = data.target

model_knn = KNeighborsClassifier(n_neighbors=4)
model_knn.fit(X, y)

y_pred_knn = model_knn.predict(X)

RESULT = {}

RESULT["model_knn"] = model_knn
RESULT["y_pred_knn"] = y_pred_knn
