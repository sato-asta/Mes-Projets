import java.util.List;

public abstract class Sandwich implements Food{
    private float price;
    private int calories;
    protected boolean vegetarian;
    protected List<String> ingredients;

    protected Sandwich(float price, int calories){
        this.calories = calories;
        this.price = price;
        this.vegetarian = false;
    }

    @Override
    public float getPrice() {
        return price;
    }

    @Override
    public int getCalories() {
        return calories;
    }

    public boolean isVegetarian() {
        return vegetarian;
    }

    public List<String> getIngredients(){
        return ingredients;
    }
}
