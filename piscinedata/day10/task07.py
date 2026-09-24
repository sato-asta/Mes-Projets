from task01 import *
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import precision_score

depth_scores = {}

for depth in range(1, 11):
    model = DecisionTreeClassifier(max_depth=depth)
    model.fit(X, y)
    pred = model.predict(X)
    score = precision_score(y, pred, average="macro")
    depth_scores[depth] = score

best_depth = max(depth_scores, key=depth_scores.get)

RESULT["depth_scores"] = depth_scores
RESULT["best_depth"] = best_depth
