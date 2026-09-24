public class Shark extends Animal {
    private boolean frenzy = false;

    public Shark(String name){
        super(name, 0, Type.FISH);
        System.out.println("A KILLER IS BORN!");
    }

    public void smellBlood(boolean isFrenzy){
        this.frenzy = isFrenzy;
    }

    public void status(){
        if (frenzy){
            System.out.println(name + " is smelling blood and wants to kill.");
        }else{
            System.out.println(name + " is swimming peacefully.");
        }
    }

    public boolean canEat(Animal animal){
        if (animal == this){
            return false;
        }
        return true;
    }

    public void eat(Animal animal){
        if(canEat(animal)){
            System.out.println(this.name + " ate a " + animal.getType() + " named " + animal.getName() + ".");
        }else{
            System.out.println(this.name + ": It's not worth my time.");
        }
        this.frenzy = false;
    }
}
