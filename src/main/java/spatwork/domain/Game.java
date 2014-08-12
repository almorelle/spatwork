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
     * @param playerKey The reference of the player.
     * @return true if the player left the game and false if he did not (e.g. was not playing).
     */
    public boolean leaveGame(String playerKey){
        return teamA.leaveTeam(playerKey) || teamB.leaveTeam(playerKey);
    }

    /**
     * Player joins the game.
     * @param playerKey The reference of the player.
     * @param keyTeam The team to join.
     * @return true if the player joined the game and false if he did not (e.g. was already playing).
     */
    public boolean joinGame(String playerKey, String keyTeam){
        switch(keyTeam) {
            case "A":
                teamB.leaveTeam(playerKey);
                return teamA.joinTeam(playerKey);
            case "B":
                teamA.leaveTeam(playerKey);
                return teamB.joinTeam(playerKey);
            default:
                return false;
        }
    }

    /**
     * Scoring a goal.
     * @param keyScorer The player who pushed the ball in.
     * @param keyTeam The team scoring.
     * @return true if the goal is recorded and false if not (e.g. player was not playing).
     */
    public boolean scoreGoal(String keyScorer, String keyTeam){
        if (teamA.isInTeam(keyScorer) || teamB.isInTeam(keyScorer)) {
            switch (keyTeam) {
                case "A":
                    teamA.scored(keyScorer);
                    break;
                case "B":
                    teamB.scored(keyScorer);
                    break;
                default:
                    return false;
            }
            return true;
        }
        return false;
    }

    public GameResult result(){
        return teamA.getScore() > teamB.getScore() ?
                GameResult.TEAM_A_WON : teamA.getScore() < teamB.getScore() ?
                GameResult.TEAM_B_WON : GameResult.DRAW;
    }
}
