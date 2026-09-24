public abstract class Drink implements Food{
    private float price;
    private int calories;
    protected boolean aCan;

    protected Drink(float price, int calories){
        this.aCan = false;
        this.calories = calories;
        this.price = price;
    }

    @Override
    public float getPrice(){
        return price;
    }

    @Override
    public int getCalories(){
        return calories;
    }

    public boolean isACan(){
        return aCan;
    }
}
