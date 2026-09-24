package Factory;
import java.util.ArrayList;
import java.util.List;

public class Elf {
    private Toy toy;
    private List<GiftPaper> papers;
    private Factory factory;

    public Elf(Factory factory){
        this.factory = factory;
        this.papers = new ArrayList<>();
    }

    public boolean pickToy(String toyName){
        if (this.toy != null){
            System.out.println("Minute please?! I'm not that fast.");
            return false;
        }
        try{
            this.toy = factory.create(toyName);
        }catch(NoSuchToyException error){
            System.out.println("I didn't find any " + toyName + ".");
            return false;
        }
        System.out.println("What a nice one! I would have liked to keep it...");
        return true;
    }

    public boolean pickPapers(int nb){
        papers.addAll(factory.getPapers(nb));
        return true;
    }

    public GiftPaper pack(){
        if (papers.isEmpty()){
            System.out.println("Wait... I can't pack it with my shirt.");
            return null;
        }
        GiftPaper paper = papers.remove(0);
        if (toy == null)
            System.out.println("I don't have any toy, but hey at least it's paper!");
        else{
            paper.wrap(toy);
            toy = null;
            System.out.println("And another kid will be happy!");
        }
        return paper;
    }
}
