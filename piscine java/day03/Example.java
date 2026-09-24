import planet.*;

public class Example {
    public static void main(String[] args) {
        Astronaut mutta = new Astronaut("Mutta");
        Astronaut hibito = new Astronaut("Hibito");
        Astronaut serika = new Astronaut("Serika");
        Team spaceBro = new Team("SpaceBrothers");
        spaceBro.add(mutta);
        spaceBro.add(hibito);
        spaceBro.add(serika);
        System.out.println(spaceBro.countMembers());
        planet.Mars titi = new planet.Mars("Hill");
        mutta.doActions(titi);
        spaceBro.showMembers();
        spaceBro.remove(hibito);
        System.out.println(spaceBro.countMembers());
    }
}