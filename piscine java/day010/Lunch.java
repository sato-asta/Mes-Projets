public class Lunch<Drinks extends Drink, Meal extends Sandwich> extends Menu<Drinks, Meal> {

    public Lunch(Drinks drink, Meal meal) {
        super(drink, meal);
    }
}