import java.lang.reflect.Method;

public class TestRunner {

    private boolean isEnabledTest(Method method) {
        if (!method.isAnnotationPresent(Test.class))
            return false;
        Test testAnnotation = method.getAnnotation(Test.class);
        return testAnnotation.enabled();
    }
    
    private void runIfTest(Method method, Object instance) throws Exception {
        if (!isEnabledTest(method))
            return;
        Test testAnnotation = method.getAnnotation(Test.class);
        System.out.println(testAnnotation.name());
        method.invoke(instance);
    }

    private Object createInstance(Class<?> classTest) throws Exception {
        return classTest.getDeclaredConstructor().newInstance();
    }

    public void runTests(Class<?> classTest) throws Exception {
        Object instance = createInstance(classTest);
        for (Method method : classTest.getDeclaredMethods()) {
            runIfTest(method, instance);
        }
    }
}