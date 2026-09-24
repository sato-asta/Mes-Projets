public class AfternoonTea<Drinks extends Drink, Meal extends Dessert> extends Menu<Drinks, Meal> {

    public AfternoonTea(Drinks drink, Meal meal) {
        super(drink, meal);
    }
}