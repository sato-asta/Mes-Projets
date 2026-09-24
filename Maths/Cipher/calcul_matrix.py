def inverse_matrix_2x2(m):
    a, b = m[0][0], m[0][1]
    c, d = m[1][0], m[1][1]
    det = a*d - b*c
    if det == 0:
        raise ValueError("Matrix has no determinants")
    return [[d/det, -b/det],
            [-c/det, a/det]]

def inverse_matrix_3x3(m):
    a, b, c = m[0]
    d, e, f = m[1]
    g, h, i = m[2]

    det = a*(e*i - f*h) - b*(d*i - f*g) + c*(d*h - e*g)
    if det == 0:
        raise ValueError("Matrice non inversible (det=0)")
    cof = [
        [ (e*i - f*h), -(d*i - f*g),  (d*h - e*g)],
        [-(b*i - c*h),  (a*i - c*g), -(a*h - b*g)],
        [ (b*f - c*e), -(a*f - c*d),  (a*e - b*d)]
    ]
    adj = [[cof[j][i] for j in range(3)] for i in range(3)]
    return [[adj[r][c] / det for c in range(3)] for r in range(3)]
