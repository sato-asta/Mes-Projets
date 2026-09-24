package Observer;

import java.util.*;

public class Order implements Observable{
    private String position;
    private String destination;
    private int timeBeforeArrival;
    private List<Observer> observers;

    public Order(){
        this.observers = new ArrayList<>();
    }

    public String getPosition(){
        return position;
    }

    public String getDestination(){
        return destination;
    }

    public int getTimeBeforeArrival(){
        return timeBeforeArrival;
    }

    @Override
    public boolean notifyObservers(){
        if (observers.isEmpty())
            return false;
        for (Observer observer : observers)
            observer.update(this);
        return true;
    }

    public void setData(String position, String destination, int timeBeforeArrival){
        this.destination = destination;
        this.position = position;
        this.timeBeforeArrival = timeBeforeArrival;
        notifyObservers();
    }

    @Override
    public void addObserver(Observer observer){
        observers.add(observer);
    }

}