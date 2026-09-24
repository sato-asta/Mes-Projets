import java.util.ArrayList;
import java.util.List;

public class Battalion {

    private List<Character> characters;

    public Battalion() {
        this.characters = new ArrayList<>();
    }

    public void add(List<? extends Character> newCharacters) {
        characters.addAll(newCharacters);
    }

    public void display() {
        for (Character character : characters) {
            System.out.println(character.getName());
        }
    }
}