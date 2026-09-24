import java.util.ArrayList;

public class Ex05 {    
    public static ArrayList<String> myGetArgs(String... var)
    {
        ArrayList<String> args = new ArrayList<String>();
        for (String value : var){
            args.add(value);
    }
    return args;
    }
 }
