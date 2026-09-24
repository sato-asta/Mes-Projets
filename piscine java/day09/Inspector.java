public class Inspector<Inspect> {

    private Class<Inspect> inspectedClass;

    public Inspector(Class<Inspect> inspectedClass) {
        this.inspectedClass = inspectedClass;
    }

    public void displayInformations() {
        System.out.println("Information of the \"" + inspectedClass.getName() + "\" class:");
        System.out.println("Superclass: " + inspectedClass.getSuperclass().getName());

        System.out.println(inspectedClass.getDeclaredMethods().length + " methods:");
        for (java.lang.reflect.Method method : inspectedClass.getDeclaredMethods())
            System.out.println("- " + method.getName());

        System.out.println(inspectedClass.getDeclaredFields().length + " fields:");
        for (java.lang.reflect.Field field : inspectedClass.getDeclaredFields())
            System.out.println("- " + field.getName());
    }

    public Inspect createInstance() throws Exception{
        return inspectedClass.getDeclaredConstructor().newInstance();
    }
}