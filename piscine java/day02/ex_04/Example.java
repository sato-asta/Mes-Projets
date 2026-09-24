public class Example {
    public static void main(String[] args) {
        Gecko arthur = new Gecko("Arthur", 1);
        Gecko benjy = new Gecko();
        System.out.println(arthur.getName());
        System.out.println(benjy.getName());
        System.out.println(arthur.getAge());
        benjy.setAge(13);
        System.out.println(benjy.getAge());
        arthur.status();
        benjy.status();

    }
}