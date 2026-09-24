/*class TestCharacter extends Character {

    public TestCharacter(String name) {
        super(name, "SomethingSetByTestCharacter");
    }
}

public class Example {
    public static void main(String[] args) {
        Character perso = new TestCharacter("Jean-Luc");
        System.out.println(perso.getName());
        System.out.println(perso.getLife());
        System.out.println(perso.getAgility());
        System.out.println(perso.getStrength());
        System.out.println(perso.getWit());
        System.out.println(perso.getRPGClass());
        perso.attack("my weapon");
    }
}*/

/*public class Example {
    public static void main(String[] args) {
        Character warrior = new Warrior("Jean-Luc");
        Character mage = new Mage("Robert");
        warrior.attack("hammer");
        mage.attack("magic");
    }
}
*/

public class Example {
    public static void main(String[] args) {
        Warrior warrior = new Warrior("Jean-Luc");
        Mage mage = new Mage("Robert");
        warrior.moveRight();
        warrior.moveLeft();
        warrior.moveBack();
        warrior.moveForward();
        mage.moveRight();
        mage.moveLeft();
        mage.moveBack();
        mage.moveForward();
    }
}