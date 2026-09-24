package Observer;

public class Customer implements Observer{
    @Override 
    public void update(Observable observable){
        if (observable instanceof Order){
            Order order = (Order) observable;
            System.out.println("Position (" + order.getPosition() + "), " + order.getTimeBeforeArrival() + " minutes before arrival at " + order.getDestination() + ".");
        }
    }
}