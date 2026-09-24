public abstract class Dessert implements Food {

    private float price;
    private int calories;

    protected Dessert(float price, int calories) {
        this.price = price;
        this.calories = calories;
    }

    @Override
    public float getPrice() {
        return price;
    }

    @Override
    public int getCalories() {
        return calories;
    }
}