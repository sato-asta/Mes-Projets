#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import math
import sys
from calcul_matrix import inverse_matrix_2x2, inverse_matrix_3x3

def create_str_matrix(text):
    size = int(math.ceil(math.sqrt(len(text))))
    matrice = []
    index = 0
    for i in range(size):
        line = []
        for j in range(size):
            if index < len(text):
                line.append(ord(text[index]))
            else:
                line.append(0)
            index += 1
        matrice.append(line)
    return matrice

def str_n_matrix(text, n):
    matrice = []
    index = 0
    while index < len(text):
        ligne = []
        for j in range(n):
            if index < len(text):
                if isinstance(text[index], int):
                    ligne.append(text[index])
                else:
                    ligne.append(ord(text[index]))
            else:
                ligne.append(0)
            index += 1
        matrice.append(ligne)
    return matrice

def mult_matrice(m1, m2):
    lignes = len(m1)
    colonnes = len(m2[0])
    res = [[0]*colonnes for _ in range(lignes)]
    for i in range(lignes):
        for j in range(colonnes):
            for k in range(len(m2)):
                res[i][j] += m1[i][k] * m2[k][j]
    return res

def transpose_matrix(m):
    lignes = len(m)
    colonnes = len(m[0])
    res = [[0]*lignes for _ in range(colonnes)]
    for i in range(lignes):
        for j in range(colonnes):
            res[j][i] = m[i][j]
    return res

def matrix_to_text(m):
    text = ""
    for line in m:
        for val in line:
            code = int(round(val))
            if 0 <= code <= 255:
                text += chr(code)
    return text

if __name__ == "__main__":
    if len(sys.argv) != 4:
        sys.stderr.write("USAGE: ./103cipher message key flag\n")
        sys.exit(84)

    message = sys.argv[1]
    cle = sys.argv[2]
    try:
        flag = int(sys.argv[3])
    except:
        sys.stderr.write("Flag must be 0 (encrypt) or 1 (decrypt)\n")
        sys.exit(84)

    cle_matrice = create_str_matrix(cle)

    if flag == 0:
        message_matrice = str_n_matrix(message, len(cle_matrice[0]))
        chiffre = mult_matrice(message_matrice, cle_matrice)
        print("Key matrix:")
        for ligne in cle_matrice:
            print("\t".join(str(x) for x in ligne))
        print("\nEncrypted message:")
        print(" ".join(str(x) for row in chiffre for x in row))

    elif flag == 1:
        try:
            if len(cle_matrice) == 2:
                inv = inverse_matrix_2x2(cle_matrice)
            elif len(cle_matrice) == 3:
                inv = inverse_matrix_3x3(cle_matrice)
            else:
                sys.stderr.write("Inverse not implemented for this size\n")
                sys.exit(84)
        except ValueError as e:
            sys.stderr.write(str(e) + "\n")
            sys.exit(84)

        try:
            nums = [int(x) for x in message.split()]
        except:
            sys.stderr.write("Encrypted message must be numbers\n")
            sys.exit(84)

        message_matrice = str_n_matrix(nums, len(cle_matrice[0]))
        clair = mult_matrice(message_matrice, inv)
        texte = matrix_to_text(clair)

        print("Key matrix (inverse shown for info):")
        for ligne in inv:
            formatted = []
            for x in ligne:
                val = round(x, 3)
                if abs(val) < 1e-9:
                    formatted.append("0.0")
                else:
                    formatted.append(f"{val:.3f}")
            print("\t".join(formatted))
        print("\nDecrypted message:")
        print(texte)
    else:
        sys.stderr.write("Flag must be 0 (encrypt) or 1 (decrypt)\n")
        sys.exit(84)
