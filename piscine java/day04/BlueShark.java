public class BlueShark extends Shark {
    
    public BlueShark(String name){
        super(name);
    }

    @Override
    public boolean canEat(Animal animal){
        if (animal == this){
            return false;
        }
        if (animal.type == Type.FISH){
            return true;
        }
        else {
            return false;
        }
    }
}
