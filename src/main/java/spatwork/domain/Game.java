package spatwork.domain;

import org.jongo.marshall.jackson.oid.Id;
import org.jongo.marshall.jackson.oid.ObjectId;

/**
 * Simple POJO of a game
 */
public class Game {
    @Id @ObjectId
    private String key;

    private Team teamA;
    private Team teamB;

    private boolean finished = false;

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

    public boolean getFinished() {
        return finished;
    }

    public void setFinished(boolean finished) {
        this.finished = finished;
    }

    @Override
    public String toString() {
        return "Game{" +
                "key='" + key + '\'' +
                ", teamA=" + teamA +
                ", teamB=" + teamB +
                ", finished=" + finished +
                '}';
    }

    /**
     * Player leaves the game.
     * @param playerKey The reference of the player leaving the team.
     */
    public void leaveGame(String playerKey){
        if(teamA.isInTeam(playerKey)) teamA.leaveTeam(playerKey);
        else teamB.leaveTeam(playerKey);
    }

    public GameResult result(){
        return teamA.getScore() > teamB.getScore() ?
                GameResult.TEAM_A_WON : teamA.getScore() < teamB.getScore() ?
                GameResult.TEAM_B_WON : GameResult.DRAW;
    }
}
