public abstract class Bread implements Food{
    private float price;
    private int calories;
    protected int bakingTime;

    protected Bread(float price, int calories){
        this.price = price;
        this.calories = calories;
        this.bakingTime = 0;
    }

    @Override
    public float getPrice(){
        return price;
    }

    @Override
    public int getCalories(){
        return calories;
    }

    public int getBakingTime(){
        return bakingTime;
    }
}
