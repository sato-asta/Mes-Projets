package Factory;

import java.util.ArrayList;
import java.util.List;

public class Factory {

    public Toy create(String type) throws NoSuchToyException {
        if (type.equals("teddy"))
            return new TeddyBear();
        if (type.equals("gameboy"))
            return new Gameboy();
        throw new NoSuchToyException(type);
    }

    public List<GiftPaper> getPapers(int n) {
        List<GiftPaper> papers = new ArrayList<>();
        for (int i = 0; i < n; i++)
            papers.add(new GiftPaper());
        return papers;
    }
}