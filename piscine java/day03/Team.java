import java.util.ArrayList;
import java.util.List;


public class Team {
    private String name;
    private List<Astronaut> members;

    public Team(String name){
        this.name = name;
        this.members = new ArrayList<>();
    }

    public String getName(){
        return this.name;
    }

    public void add(Astronaut astronaut){
        this.members.add(astronaut);
    }

    public void remove(Astronaut astronaut){
        this.members.remove(astronaut);
    }

    public int countMembers(){
        return this.members.size();
    }

    public void showMembers(){
        if (this.members.isEmpty()){
            return;
        }
        StringBuilder result = new StringBuilder();
        result.append(this.name).append(": ");
    
        for (Astronaut member : this.members){
            result.append(member.getName()).append(" ");

            if (member.getDestination() != null){
                result.append("on mission");
            } else {
                result.append("on standby");
            }
            result.append(", ");
        }
        result.append(".");
        System.out.println(result);
    }
}
