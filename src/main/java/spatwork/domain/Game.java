package spatwork.domain;

import org.jongo.marshall.jackson.oid.Id;
import org.jongo.marshall.jackson.oid.ObjectId;

/**
 * Simple POJO of a game
 */
public class Game {
    @Id @ObjectId
    private String key;

    private String teamARef;
    private String teamBRef;

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getTeamARef() {
        return teamARef;
    }

    public void setTeamARef(String teamARef) {
        this.teamARef = teamARef;
    }

    public String getTeamBRef() {
        return teamBRef;
    }

    public void setTeamBRef(String teamBRef) {
        this.teamBRef = teamBRef;
    }

    @Override
    public String toString() {
        return "Game{" +
                "key='" + key + '\'' +
                ", teamARef=" + teamARef +
                ", teamBRef=" + teamBRef +
                '}';
    }

    /**
     * Possible game results.
     */
    public static enum GameResult {
        TEAM_A_WON, TEAM_B_WON, DRAW
    }
}
