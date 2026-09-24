public class Breakfast<Drinks extends Drink, Meal extends Bread> extends Menu<Drinks, Meal> {

    public Breakfast(Drinks drink, Meal meal) {
        super(drink, meal);
    }
}