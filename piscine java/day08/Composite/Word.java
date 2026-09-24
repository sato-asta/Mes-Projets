package Composite;

public class Word implements Sentence{
    private String str;

    public Word(String str){
        this.str = str;
    }

    @Override
    public void print(){
        System.out.println(str);
    }
}
