package Factory;

public class GiftPaper {

    private Toy gift;

    public void wrap(Toy toy) {
        this.gift = toy;
    }

    public Toy unwrap() {
        Toy toy = this.gift;
        this.gift = null;
        return toy;
    }
}