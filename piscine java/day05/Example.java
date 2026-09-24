class TestMonster extends Monster {
    public TestMonster(String name) {
        super(name, 80, 50);
        this.damage = 25;
        this.apcost = 8;
    }
}

class TestTarget extends Unit {
    public TestTarget(String name) {
        super(name, 100, 20);
    }

    @Override
    public boolean equip(Weapon weapon) {
        return false;
    }

    @Override
    public boolean attack(Fighter target) {
        return false;
    }
}

public class Example {
    public static void main(String[] args) {
        TestMonster monster = new TestMonster("RadScorpion");
        TestTarget target = new TestTarget("Joe");

        System.out.println("Test equip");
        monster.equip(null);

        System.out.println("\nTest attack not close");
        monster.attack(target);

        System.out.println("\nTest moveCloseTo");
        monster.moveCloseTo(target);

        System.out.println("\nTest attack close");
        monster.attack(target);

        System.out.println("\ntarget' HP after damage: " + target.getHp());

        System.out.println("\nTest receiveDamage (died)");
        target.receiveDamage(1000);
        System.out.println("HP after big damage: " + target.getHp());
        System.out.println("moveCloseTo (died): " + monster.moveCloseTo(target));
    }
}