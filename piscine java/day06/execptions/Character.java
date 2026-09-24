public abstract class Character implements Movable{

    protected String name;
    protected String RPGClass;
    protected int life;
    protected int agility;
    protected int strength;
    protected int wit;

    protected Character(String name, String RPGClass) {
        this.name = name;
        this.RPGClass = RPGClass;
        this.life = 50;
        this.agility = 2;
        this.strength = 2;
        this.wit = 2;
    }

    public String getName() {
        return name;
    }

    public String getRPGClass() {
        return RPGClass;
    }

    public int getLife() {
        return life;
    }

    public int getAgility() {
        return agility;
    }

    public int getStrength() {
        return strength;
    }

    public int getWit() {
        return wit;
    }

    public void attack(String weapon) throws WeaponException{
        System.out.println(name + ": Rrrrrrrrr....");
    }

    public void tryToAttack(String weapon){
        try{
            attack(weapon);
        }catch (WeaponException error){
            System.out.println(error.getMessage());
        }
    }

    @Override
    public void moveRight(){
        System.out.println(name + ": moves right");
    }

    @Override
    public void moveLeft(){
        System.out.println(name + ": moves left");
    }

    @Override
    public void moveForward(){
        System.out.println(name + ": moves forward");
    }

    @Override
    public void moveBack(){
        System.out.println(name + ": moves back");
    }

    public final void unsheathe(){
        System.out.println(name + ": unsheathes his a weapon.");
    }
}