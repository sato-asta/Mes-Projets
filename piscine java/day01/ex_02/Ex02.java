public class Ex02 {
    public static String getAngryDog(int nbr)
    {
        String word = "";
        
        for (int i = 0; i < nbr; i++){
            word += "woof";
        }
        word = word + "\n";
        return word;
    }
}