public class Animal {
    enum Type {
        MAMMAL,
        FISH,
        BIRD
    }

    protected String name;
    protected int legs;
    protected Type type;

    private static int numberOfAnimals = 0;
    private static int numberOfMammals = 0;
    private static int numberOfFish = 0;
    private static int numberOfBirds = 0;

    public String getType(){
        return type.toString().toLowerCase();
    }

    public int getLegs(){
        return legs;
    }

    public String getName(){
        return name;
    }

    protected Animal(String name, int legs, Type type){
        this.legs = legs;
        this.type = type;
        this.name = name;
        
        numberOfAnimals++;
        switch (type) {
            case MAMMAL:
                numberOfMammals++;
                break;
            case FISH:
                numberOfFish++;
                break;
            case BIRD:
                numberOfBirds++;
                break;
        }
        System.out.println("My name is " + name + " and I am a " + getType() + "!");
    }

    public static int getNumberOfAnimals(){
        if (numberOfAnimals >= 2){
            System.out.println("There are currently " + numberOfAnimals + " animals in our world.");
        }else if (numberOfAnimals == 1){
            System.out.println("There is currently 1 animal in our world.");
        }else {
            System.out.println("There are currently 0 animals in our world.");
        }
        return numberOfAnimals;
    }

    public static int getNumberOfFish(){
        System.out.println("There " + (numberOfFish == 1 ? "is" : "are") + " currently " + numberOfFish + " fish in our world.");
        return numberOfFish;
    }

     public static int getNumberOfBirds(){
        System.out.println("There " + (numberOfBirds == 1 ? "is" : "are") + " currently " + numberOfBirds + " bird" + (numberOfBirds == 1 ? "" : "s") + " in our world.");
        return numberOfBirds;
    }

     public static int getNumberOfMammals(){
        System.out.println("There " + (numberOfMammals == 1 ? "is" : "are") + " currently " + numberOfMammals + " mammal" + (numberOfMammals == 1 ? "" : "s") + " in our world.");
        return numberOfMammals;
    }
}
