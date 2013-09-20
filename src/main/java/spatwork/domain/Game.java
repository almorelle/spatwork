package spatwork.domain;

import com.google.common.base.Optional;
import org.jongo.marshall.jackson.oid.Id;
import org.jongo.marshall.jackson.oid.ObjectId;

import java.util.Collection;

/**
 * Simple POJO of a game
 */
public class Game {
    @Id @ObjectId
    private String key;

    private Team teamA;
    private Team teamB;

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public void setTeamA(Team teamA) {
        this.teamA = teamA;
    }

    public Team getTeamA() {
        return teamA;
    }

    public void setTeamB(Team teamB) {
        this.teamB = teamB;
    }

    public Team getTeamB() {
        return teamB;
    }

    @Override
    public String toString() {
        return "Game{" +
                "key='" + key + '\'' +
                ", teamA=" + teamA +
                ", teamB=" + teamB +
                '}';
    }

    /**
     * Player leaves the game.
     * @param playerKey The reference of the player leaving the team.
     */
    public void leaveGame(String playerKey){
        getTeamA().leaveTeam(playerKey);
        getTeamB().leaveTeam(playerKey);
    }

    public GameResult winner(){
        return teamA.getScore() > teamB.getScore() ?
                GameResult.TEAM_A_WON : teamA.getScore() < teamB.getScore() ?
                GameResult.TEAM_B_WON : GameResult.DRAW;
    }

    /**
     * Possible game results.
     */
    public static enum GameResult {
        TEAM_A_WON, TEAM_B_WON, DRAW
    }
}
