/*
** EPITECH PROJECT, 2025
** my_sudo
** File description:
** lib
*/

#include "main.h"

static void extract_passwd_fields(char *buf, passwd_fields_t *out)
{
    out->login = strtok(buf, ":");
    out->x = strtok(NULL, ":");
    out->uid = strtok(NULL, ":");
    out->gid = strtok(NULL, ":");
    out->gecos = strtok(NULL, ":");
    out->home = strtok(NULL, ":");
    out->shell = strtok(NULL, ":\n");
}

static int validate_passwd(const passwd_fields_t *f,
    const char *target,
    ids_t *out)
{
    char *endu = NULL;
    char *endg = NULL;
    long u = strtol(f->uid, &endu, 10);
    long g = strtol(f->gid, &endg, 10);

    if (!f->login || !f->uid || !f->gid)
        return 0;
    if (strcmp(f->login, target) != 0)
        return 0;
    errno = 0;
    if (errno == ERANGE || endu == f->uid || endg == f->gid || u < 0 || g < 0)
        return 0;
    out->uid = (uid_t)u;
    out->gid = (gid_t)g;
    return 1;
}

static int build_passwd(const passwd_fields_t *f,
    const ids_t *idvals,
    struct passwd *pw)
{
    pw->pw_name = strdup(f->login);
    pw->pw_passwd = strdup(f->x ? f->x : "");
    pw->pw_uid = idvals->uid;
    pw->pw_gid = idvals->gid;
    pw->pw_gecos = strdup(f->gecos ? f->gecos : "");
    pw->pw_dir = strdup(f->home ? f->home : "");
    pw->pw_shell = strdup(f->shell ? f->shell : "/bin/sh");
    if (!pw->pw_name || !pw->pw_passwd || !pw->pw_gecos ||
        !pw->pw_dir || !pw->pw_shell)
        return 0;
    return 1;
}

static int search_passwd(FILE *f, const char *name, struct passwd *pw)
{
    char buf[1024];
    passwd_fields_t fields;
    ids_t idvals;

    while (fgets(buf, sizeof(buf), f)) {
        extract_passwd_fields(buf, &fields);
        if (validate_passwd(&fields, name, &idvals) &&
            build_passwd(&fields, &idvals, pw)) {
            return 1;
        }
    }
    return 0;
}

struct passwd *my_getpwnam(const char *name)
{
    struct passwd *pw = malloc(sizeof(struct passwd));
    FILE *f = fopen("/etc/passwd", "r");

    if (!f)
        return NULL;
    if (!pw) {
        fclose(f);
        return NULL;
    }
    if (search_passwd(f, name, pw)) {
        fclose(f);
        return pw;
    }
    fclose(f);
    free(pw);
    return NULL;
}
