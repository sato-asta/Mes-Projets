package Factory;

public class NoSuchToyException extends Exception {

    public NoSuchToyException(String toyName) {
        super("No such toy: " + toyName + ".");
    }
}