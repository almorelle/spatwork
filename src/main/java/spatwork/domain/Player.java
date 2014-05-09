package spatwork.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.google.common.collect.ImmutableSet;
import org.jongo.marshall.jackson.oid.Id;
import org.jongo.marshall.jackson.oid.ObjectId;
import restx.security.RestxPrincipal;

import java.util.Collection;

/**
 *  Simple POJO of a sport player
 */
public class Player implements RestxPrincipal {
    @Id @ObjectId
    private String key;

    private String firstName;
    private String lastName;
    private String email;
    private Collection<String> roles;

    private int goals;
    private int wins;
    private int losses;
    private int draws;

    private boolean subscription;
    private boolean certificate;

    public String getKey() {
        return key;
    }

    public Player setKey(String key) {
        this.key = key;
        return this;
    }

    public String getFirstName() {
        return firstName;
    }

    public Player setFirstName(String firstName) {
        this.firstName = firstName;
        return this;
    }

    public String getLastName() {
        return lastName;
    }

    public Player setLastName(String lastName) {
        this.lastName = lastName;
        return this;
    }

    public String getEmail() {
        return email;
    }

    public Player setEmail(final String email) {
        this.email = email;
        return this;
    }

    public Collection<String> getRoles() {
        return roles;
    }

    public Player setRoles(final Collection<String> roles) {
        this.roles = roles;
        return this;
    }

    public int getGoals() {
        return goals;
    }

    public Player setGoals(int goals) {
        this.goals = goals;
        return this;
    }

    public int getWins() {
        return wins;
    }

    public Player setWins(int wins) {
        this.wins = wins;
        return this;
    }

    public int getLosses() {
        return losses;
    }

    public Player setLosses(int losses) {
        this.losses = losses;
        return this;
    }

    public int getDraws() {
        return draws;
    }

    public Player setDraws(int draws) {
        this.draws = draws;
        return this;
    }

    public boolean getSubscription() {
        return subscription;
    }

    public Player setSubscription(boolean subscription) {
        this.subscription = subscription;
        return this;
    }

    public boolean getCertificate() {
        return certificate;
    }

    public Player setCertificate(boolean certificate) {
        this.certificate = certificate;
        return this;
    }

    @Override
    @JsonIgnore
    public ImmutableSet<String> getPrincipalRoles() {
        return ImmutableSet.copyOf(roles);
    }

    @Override
    @JsonIgnore
    public String getName() {
        return getEmail();
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
                ", email='" + email + '\'' +
                ", roles=" + roles +
                ", goals=" + goals +
                ", wins=" + wins +
                ", losses=" + losses +
                ", draws=" + draws +
                ", subscription=" + subscription +
                ", certificate=" + certificate +
                '}';
    }
}
