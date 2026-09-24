import chocolate.*;
import planet.*;

public class Astronaut {
    private static int next_id;
    private int id;
    private String name;
    private int snacks;
    private String destination;

    public Astronaut(String name) {
        this.id = next_id;
        next_id++;
        this.name = name;
        this.snacks = 0;
        this.destination = null;
        System.out.println(this.name + " " + "ready for launch!");
    }
    
    public int getId() {
        return this.id;
    }

    public String getName() {
        return this.name;
    }

    public int getSnacks() {
        return this.snacks;
    }

    public String getDestination() {
        return this.destination;
    }

    private void checkDestination(){
        if (this.destination == null) {
            System.out.println(this.name + ": I may have done nothing, but I have " + this.snacks + " Mars to eat at least!");
        } 
    }

    public void doActions(){
        System.out.println(this.name + ": Nothing to do.");
        this.checkDestination();
    }

    public void doActions(planet.Mars mars){
        this.destination = mars.getLandingSite();
        System.out.println(this.name + ": Started mission!");
        this.destination = mars.getLandingSite();
        this.checkDestination();
    }

    public void doActions(chocolate.Mars mars){
        System.out.println("Thanks for this Mars number " + mars.getId());
        this.snacks++;
        this.checkDestination();
    }
}