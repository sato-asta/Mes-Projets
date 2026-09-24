public abstract class Unit implements Fighter{
    protected String name;
    protected int hp;
    protected int ap;
    protected Fighter closeTarget;
    protected boolean dead;

    protected Unit(String name, int hp, int ap){
        this.name = name;
        this.hp = hp;
        this.ap = ap;
        this.closeTarget = null;
        this.dead = false;
    }

    @Override
    public String getName(){
        return name;
    }

    @Override
    public int getHp(){
        return hp;
    }

    @Override 
    public int getAp(){
        return ap;
    }

    @Override
    public void receiveDamage(int damage){
        if (dead)
            return;
        hp -= damage;
        if (hp <= 0 ){
            hp = 0;
            dead = true;
        }
    }

    public Fighter getCloseTarget(){
        return closeTarget;
    }

    @Override
    public boolean moveCloseTo(Fighter target){
        if (dead)
            return false;
        if (target == this)
            return false;
        if (closeTarget == target)
            return false;
        System.out.println(name + " is moving closer to " + target.getName() + ".");
        closeTarget = target;
        return true;
    }

    @Override
    public void recoverAP() {
        if (dead)
            return;
        ap += 7;
        if (ap > 50)
            ap = 50;
    }
}
