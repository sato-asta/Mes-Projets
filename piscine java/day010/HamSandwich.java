import java.util.Arrays;

public class HamSandwich extends Sandwich{
    public HamSandwich(){
        super(4.00f, 230);
        this.vegetarian = false;
        this.ingredients = Arrays.asList("tomato", "salad", "cheese", "ham", "butter");
    }
}
