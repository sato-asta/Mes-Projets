public abstract class Menu<Drinks extends Food, Meal extends Food> {
    private Drinks drink;
    private Meal meal;

    protected Menu(Drinks drink, Meal meal){
        this.drink = drink;
        this.meal = meal;
    }

    public Drinks getDrink(){
        return drink;
    }

    public Meal getMeal(){
        return meal;
    }

    public float getPrice(){
        return (drink.getPrice() + meal.getPrice()) * 0.9f;
    }
}
