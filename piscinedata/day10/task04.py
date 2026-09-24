from task01 import *
from sklearn.metrics import precision_score

k_scores = {}

for k in range(1, 11):
    model = KNeighborsClassifier(n_neighbors=k)
    model.fit(X, y)
    pred = model.predict(X)
    scores = precision_score(y, pred, average="macro")
    k_scores[k] = scores

best_k = max(k_scores, key=k_scores.get)

RESULT["k_scores"] = k_scores
RESULT["best_k"] = best_k
