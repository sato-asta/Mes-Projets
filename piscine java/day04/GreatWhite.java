public class GreatWhite extends Shark{
    public GreatWhite(String name){
        super(name);
    }

    @Override
    public boolean canEat(Animal animal){
        if (animal == this)
            return false;
        if (animal instanceof Canary)
            return false;
        return true;
    }

    @Override
    public void eat(Animal animal){
        boolean GoingToEat;

        if (animal instanceof Canary){
            System.out.println(name + ": Next time you try to give me that to eat, I'll eat you instead.");
            return;
        }
        GoingToEat = canEat(animal);
        super.eat(animal);

        if (GoingToEat && animal instanceof Shark)
            System.out.println(name + ": The best meal one could wish for.");
    }
}
