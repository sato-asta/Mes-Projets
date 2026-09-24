public class Example {
    public static void main(String[] args) {
        Solo<String> strSolo = new Solo<>("toto");
        String strValue = strSolo.getValue();
        strSolo.setValue("tata");
        System.out.println(strValue);
        System.out.println(strSolo.getValue());

        Solo<Integer> intSolo = new Solo<>(Integer.valueOf(42));
        Integer intValue = intSolo.getValue();
        intSolo.setValue(Integer.valueOf(1337));
        System.out.println(intValue);
        System.out.println(intSolo.getValue());
    }
}