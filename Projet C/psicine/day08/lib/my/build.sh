#!/bin/bash
clang *.c -c -I../../include/
ar rc libmy.a *o
