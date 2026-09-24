/*
** EPITECH PROJECT, 2025
** my_radar
** File description:
** lib
*/


static char **allocate_memory_per_words(char **array, char *str, char *delim)
{
    int word_index = 0;
    int word_size = 0;

    for (int i = 0; str[i] != '\0';) {
        if (is_alpha_numeric(str[i], delim)) {
            while (is_alpha_numeric(str[i], delim)) {
                word_size++;
                i++;
            }
            array[word_index] = malloc(sizeof(char) * (word_size + 1));
            if (array[word_index] == NULL)
                return free_word_array(array);
            word_index++;
            word_size = 0;
        }
        if (str[i] != '\0')
            ++i;
    }
    return array;
}

static char **copy_words_in_array(char **array, char *str, char *delim)
{
    int word_index = 0;
    int char_index = 0;

    for (int i = 0; str[i] != '\0';) {
        if (is_alpha_numeric(str[i], delim)) {
            while (is_alpha_numeric(str[i], delim)) {
                array[word_index][char_index] = str[i];
                i++;
                char_index++;
            }
            array[word_index][char_index] = '\0';
            word_index++;
            char_index = 0;
        }
        if (str[i] != '\0')
            ++i;
    }
    return array;
}

char **my_str_to_word_array(char *str, char *delim)
{
    char **array;
    int words = count_words(str, delim);

    array = malloc(sizeof(char *) * (words + 1));
    if (array == NULL)
        return NULL;
    array[words] = NULL;
    array = allocate_memory_per_words(array, str, delim);
    if (array == NULL)
        return NULL;
    array = copy_words_in_array(array, str, delim);
    return array;
}
