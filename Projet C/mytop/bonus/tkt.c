#include <stdlib.h>
#include "../include/main.h"

int p1test(app_t *app)
{
    system("aplay bonus/res/tkt.wav > /dev/null 2>&1 &");
    return 0;
}
