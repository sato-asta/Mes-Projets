public class Solo<L>{
    private L value;

    public Solo(L value){
        this.value = value;
    }

    public L getValue(){
        return value;
    }

    public void setValue(L value){
        this.value = value;
    }
}