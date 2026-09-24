/*
** EPITECH PROJECT, 2025
** my_sudo
** File description:
** lib
*/

#include "main.h"

static FILE *open_group_file(void)
{
    return fopen("/etc/group", "r");
}

static char **build_members_list(char *members)
{
    char *mems[64];
    int i = 0;
    char *m = NULL;
    char **result = NULL;

    if (members) {
        m = strtok(members, ",");
        while (m && i < 63) {
            mems[i] = strdup(m);
            i++;
            m = strtok(NULL, ",");
        }
    }
    mems[i] = NULL;
    result = malloc((i + 1) * sizeof(char *));
    for (int j = 0; j <= i; j++) {
        result[j] = mems[j];
    }
    return result;
}

static int validate_group(const char *grpname,
    const char *gidstr,
    const char *target,
    gid_t *gid)
{
    char *end = NULL;
    long gidv = strtol(gidstr, &end, 10);

    if (!grpname || !gidstr)
        return 0;
    if (strcmp(grpname, target) != 0)
        return 0;
    errno = 0;
    if (errno == ERANGE || end == gidstr || gidv < 0)
        return 0;
    *gid = (gid_t)gidv;
    return 1;
}

static int parse_group_line(char *buf, struct group *gr, const char *name)
{
    char *grpname = strtok(buf, ":");
    char *passwd = strtok(NULL, ":");
    char *gidstr = strtok(NULL, ":");
    char *members = strtok(NULL, "\n");
    gid_t gid;

    if (!validate_group(grpname, gidstr, name, &gid))
        return 0;
    gr->gr_name = strdup(grpname);
    gr->gr_passwd = strdup(passwd ? passwd : "");
    gr->gr_gid = gid;
    gr->gr_mem = build_members_list(members);
    if (!gr->gr_name || !gr->gr_passwd || (members && !gr->gr_mem))
        return 0;
    return 1;
}

struct group *my_getgrnam(const char *name)
{
    FILE *f = open_group_file();
    char buf[1024];
    struct group *gr = malloc(sizeof(struct group));

    if (!f)
        return NULL;
    if (!gr) {
        fclose(f);
        return NULL;
    }
    while (fgets(buf, sizeof(buf), f)) {
        if (parse_group_line(buf, gr, name)) {
            fclose(f);
            return gr;
        }
    }
    fclose(f);
    free(gr);
    return NULL;
}
