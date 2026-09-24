public class TestMain {
    public static void main(String[] args) {
        System.out.println("=== Etat initial (tout doit etre a 0) ===");
        Animal.getNumberOfAnimals();
        Animal.getNumberOfMammals();
        Animal.getNumberOfFish();
        Animal.getNumberOfBirds();

        System.out.println("\n=== Creation d'un seul animal (test singulier) ===");
        Animal dog = new Animal("Dog", 4, Animal.Type.MAMMAL);
        Animal.getNumberOfAnimals();
        Animal.getNumberOfMammals();

        System.out.println("\n=== Creation d'animaux supplementaires (test pluriel) ===");
        Animal salmon = new Animal("Salmon", 0, Animal.Type.FISH);
        Animal tuna = new Animal("Tuna", 0, Animal.Type.FISH);
        Animal eagle = new Animal("Eagle", 2, Animal.Type.BIRD);
        Animal cat = new Animal("Cat", 4, Animal.Type.MAMMAL);

        System.out.println("\n=== Etat final ===");
        int total = Animal.getNumberOfAnimals();
        int mammals = Animal.getNumberOfMammals();
        int fish = Animal.getNumberOfFish();
        int birds = Animal.getNumberOfBirds();

        System.out.println("\n=== Verification des valeurs retournees ===");
        System.out.println("Total attendu: 5, obtenu: " + total);
        System.out.println("Mammals attendu: 2, obtenu: " + mammals);
        System.out.println("Fish attendu: 2, obtenu: " + fish);
        System.out.println("Birds attendu: 1, obtenu: " + birds);

        System.out.println("\n=== Test des getters d'instance ===");
    }
}