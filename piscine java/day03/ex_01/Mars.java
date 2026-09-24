public class Mars {
    private static int next_id;
    private int id;

    public Mars(){
        this.id = next_id;
        next_id++;
    }
    
    public int getId() {
        return this.id;
    }
}
