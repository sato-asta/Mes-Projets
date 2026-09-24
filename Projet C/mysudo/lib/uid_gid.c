/*
** EPITECH PROJECT, 2025
** my_sudp
** File description:
** lib
*/

#include "main.h"

static uid_t resolve_uid(const char *user)
{
    struct passwd *pw = my_getpwnam(user);

    if (!pw)
        return (uid_t)-1;
    return pw->pw_uid;
}

static gid_t resolve_gid(const char *group)
{
    struct group *gr = my_getgrnam(group);

    if (!gr)
        return (gid_t)-1;
    return gr->gr_gid;
}

static struct passwd *resolve_user_identity(const char *user,
    uid_t *uid, gid_t *gid)
{
    struct passwd *pw;

    if (user) {
        *uid = resolve_uid(user);
        if (*uid == (uid_t)-1)
            return NULL;
        pw = my_getpwnam(user);
        if (!pw)
            return NULL;
        *gid = pw->pw_gid;
    } else {
        *uid = 0;
        *gid = 0;
        pw = my_getpwnam("root");
    }
    return pw;
}

static int resolve_group_identity(const char *group, gid_t *gid)
{
    if (group) {
        *gid = resolve_gid(group);
        if (*gid == (gid_t)-1)
            return FAILURE;
    }
    return 0;
}

static int apply_identity(const char *user, gid_t gid, uid_t uid)
{
    if (initgroups(user ? user : "root", gid) != 0)
        return FAILURE;
    if (setgid(gid) != 0)
        return FAILURE;
    if (setuid(uid) != 0)
        return FAILURE;
    return 0;
}

int switch_identity(const char *user, const char *group)
{
    struct passwd *pw = NULL;
    uid_t uid;
    gid_t gid;

    pw = resolve_user_identity(user, &uid, &gid);
    if (!pw)
        return FAILURE;
    if (resolve_group_identity(group, &gid) != 0)
        return FAILURE;
    return apply_identity(user, gid, uid);
}

int execute_command(char **cmd)
{
    if (!cmd || !cmd[0]) {
        print_error("[my_sudo] error: no command to execute\n");
        return FAILURE;
    }
    if (execvp(cmd[0], cmd) == -1) {
        perror("[my_sudo] execvp");
        return FAILURE;
    }
    return 0;
}
