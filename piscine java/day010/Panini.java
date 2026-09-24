import java.util.Arrays;

public class Panini extends Sandwich{
    public Panini(){
        super(3.50f, 120);
        this.vegetarian = true;
        this.ingredients = Arrays.asList("tomato", "salad", "cucumber", "avocado", "cheese");
    }
}
