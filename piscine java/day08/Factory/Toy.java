package Factory;

public abstract class Toy {

    private String title;

    protected Toy(String title) {
        this.title = title;
    }

    public String getTitle() {
        return title;
    }
}