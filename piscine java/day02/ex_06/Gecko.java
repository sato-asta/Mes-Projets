public class Gecko {
    private String name;
    private int age;
    private int energy;
    public Gecko(String name, int age) {
        this(name);
        this.age = age;
        this.energy = 100;
    }

    public Gecko(String name) {
        this.name = name;
        System.out.println("Hello" + " " + name + "!");
        this.energy = 100;
    }

    public Gecko() {
        System.out.println("Hello!");
        this.name = "Unknown";
        this.energy = 100;
    }

    public String getName() {
        return this.name;
    }

    public int getAge() {
        return this.age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public int getEnergy() {
        return this.energy;
    }

    public void setEnergy(int energy) {
        if (energy < 0) {
            this.energy = 0;
        } else if (energy > 100) {
            this.energy = 100;
        } else {
            this.energy = energy;
        }
    }

    public void status(){
        switch(this.age){
            case 0:
                System.out.println("Unborn Gecko");
                break;
            case 1:
            case 2:
                System.out.println("Baby Gecko");
                break;
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
                System.out.println("Adult Gecko");
                break;
            case 11:
            case 12:
            case 13:
                System.out.println("Old Gecko");
                break;
            default:
                System.out.println("Impossible Gecko");
                break;
        }
    }

    public void hello(String string){
        System.out.println("Hello" + " " + string + ", I'm" + " " + this.name + "!");
    }

    public void hello(int number){
        for (int i = 0; i < number; i++){
            System.out.println("Hello, I'm" + " " + this.name + "!");
        }
    }

    public void eat(String food){
         if(food.equalsIgnoreCase("Meat")){
            setEnergy(getEnergy() + 10);
            System.out.println("Yummy!");
         }else if(food.equalsIgnoreCase("Vegetable")){
            setEnergy(getEnergy() - 10);
            System.out.println("Erk!");
         }else{
            System.out.println("I can't eat this!");
         }
    }
}
