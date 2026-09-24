package planet.moon;
import planet.*;

public class Phobos {
    private Mars mars;
    private String landingSite;

    public Phobos(Mars mars, String landingSite) {
        this.mars = mars;
        this.landingSite = landingSite;
        if (this.mars != null){
            System.out .println("Phobos placed in orbit");

        }else {
            System.out.println("No planet given");
        }
    }

    public Mars getMars() {
        return mars;
    }

    public String getLandingSite() {
        return landingSite;
    }
}
