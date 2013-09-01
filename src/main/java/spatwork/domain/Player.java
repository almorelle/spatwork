package spatwork.domain;

import org.jongo.marshall.jackson.oid.Id;
import org.jongo.marshall.jackson.oid.ObjectId;

/**
 *  Simple POJO of a sport player
 */
public class Player {
    @Id @ObjectId
    private String key;

    private String firstName;
    private String lastName;

    private int goals;
    private int wins;
    private int losses;

    private boolean subscription;
    private boolean certificate;

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public int getGoals() {
        return goals;
    }

    public void setGoals(int goals) {
        this.goals = goals;
    }

    public int getWins() {
        return wins;
    }

    public void setWins(int wins) {
        this.wins = wins;
    }

    public int getLosses() {
        return losses;
    }

    public void setLosses(int losses) {
        this.losses = losses;
    }

    public boolean getSubscription() {
        return subscription;
    }

    public void setSubscription(boolean subscription) {
        this.subscription = subscription;
    }

    public boolean getCertificate() {
        return certificate;
    }

    public void setCertificate(boolean certificate) {
        this.certificate = certificate;
    }

    /**
     * When a player scores, his goal count is incremented.
     */
    public void scored() {
        goals++;
    }

    /**
     * This method register the result of the game for the current player and sets him out of the team.
     * @param won Whether the player was in the winning team or not.
     */
    public void finishGame(boolean won) {
        if(won) { this.wins++; }
        else { this.losses++; }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Player player = (Player) o;

        if (key != null ? !key.equals(player.key) : player.key != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return key != null ? key.hashCode() : 0;
    }

    @Override
    public String toString() {
        return "Player{" +
                "key='" + key + '\'' +
                ", first_name='" + firstName + '\'' +
                ", last_name='" + lastName + '\'' +
                ", goals='" + goals + '\'' +
                ", wins='" + wins + '\'' +
                ", losses='" + losses + '\'' +
                ", subscription='" + subscription + '\'' +
                ", certificate='" + certificate + '\'' +
                '}';
    }
}
