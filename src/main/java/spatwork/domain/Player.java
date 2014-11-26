package spatwork.domain;

import org.jongo.marshall.jackson.oid.Id;
import org.jongo.marshall.jackson.oid.ObjectId;

/**
 *  Simple POJO of a sport player
 */
public class Player {
    @Id @ObjectId
    private String key;

    // Player
    private String firstName;
    private String lastName;

    // Arbitrary attribute (from 1 to 5)
    private int rating = 3;
    private int skills = 3;
    private int stamina = 3;
    private int defense = 3;


    // Statistics built up over the games
    private int goals;
    private int wins;
    private int losses;
    private int draws;

    // Membership
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

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public int getSkills() {
        return skills;
    }

    public void setSkills(int skills) {
        this.skills = skills;
    }

    public int getStamina() {
        return stamina;
    }

    public void setStamina(int stamina) {
        this.stamina = stamina;
    }

    public int getDefense() {
        return defense;
    }

    public void setDefense(int defense) {
        this.defense = defense;
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

    public int getDraws() {
        return draws;
    }

    public void setDraws(int draws) {
        this.draws = draws;
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
     * This method register the result of the game for the current player.
     * @param won Whether the player was in the winning team or not.
     * @param result Result of the game.
     */
    public void finishGame(boolean won, GameResult result) {
        if(won) { this.wins++; }
        else if(GameResult.DRAW.equals(result)) { this.draws++; }
        else { losses++; }
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
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", rating=" + rating +
                ", skills=" + skills +
                ", stamina=" + stamina +
                ", defense=" + defense +
                ", goals=" + goals +
                ", wins=" + wins +
                ", losses=" + losses +
                ", draws=" + draws +
                ", subscription=" + subscription +
                ", certificate=" + certificate +
                '}';
    }
}
