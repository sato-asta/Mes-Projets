/*
** EPITECH PROJECT, 2025
** my_hunter
** File description:
** lib
*/

#include "../../include/main.h"
#include <stdio.h>

static int init_score_font(game_t *g, const char *font_path)
{
    g->ui = malloc(sizeof(score_ui_t));
    if (!g->ui || !font_path)
        return 84;
    g->ui->font = sfFont_createFromFile(font_path);
    if (!g->ui->font) {
        free(g->ui);
        g->ui = NULL;
        return 84;
    }
    g->ui->current = 0;
    g->ui->best = 0;
    return 0;
}

static int init_score_text(game_t *g)
{
    if (!g->ui)
        return 84;
    g->ui->text = sfText_create();
    if (!g->ui->text) {
        sfFont_destroy(g->ui->font);
        free(g->ui);
        g->ui = NULL;
        return 84;
    }
    sfText_setFont(g->ui->text, g->ui->font);
    sfText_setCharacterSize(g->ui->text, 24);
    sfText_setFillColor(g->ui->text, sfWhite);
    sfText_setPosition(g->ui->text, (sfVector2f){10.f, 10.f});
    sfText_setString(g->ui->text, "Score: 0 | Best: 0");
    return 0;
}

int score_ui_init(game_t *g, const char *font_path)
{
    if (init_score_font(g, font_path) == 84)
        return 84;
    if (init_score_text(g) == 84)
        return 84;
    return 0;
}

void score_ui_update(score_ui_t *ui, unsigned score)
{
    char buf[64];
    int len = 0;

    ui->current = score;
    len += my_strcpy(buf + len, "Score: ");
    len += my_itostr(buf + len, ui->current);
    len += my_strcpy(buf + len, " | Best: ");
    len += my_itostr(buf + len, ui->best);
    buf[len] = '\0';
    sfText_setString(ui->text, buf);
}

void score_ui_draw(const score_ui_t *ui, sfRenderWindow *win)
{
    if (ui && ui->text)
        sfRenderWindow_drawText(win, ui->text, NULL);
}

void score_ui_destroy(score_ui_t *ui)
{
    if (!ui)
        return;
    if (ui->text)
        sfText_destroy(ui->text);
    if (ui->font)
        sfFont_destroy(ui->font);
    free(ui);
}
