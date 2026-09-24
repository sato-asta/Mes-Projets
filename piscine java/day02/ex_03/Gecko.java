public class Gecko {
    private String name;
    public Gecko(String name) {
        this.name = name;
        System.out.println("Hello" + " " + name + "!");
    }

    public Gecko() {
        System.out.println("Hello!");
        this.name = "Unknown";
    }

    public String getName() {
        return this.name;
    }
}
