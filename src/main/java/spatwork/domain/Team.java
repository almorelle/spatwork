package spatwork.domain;

import java.util.Collection;

/**
 * Teams.
 */
public class Team {

    private Collection<String> teammateRefs;
    private int score;

    private Collection<String> scorersRefs;

    public Collection<String> getScorersRefs() {
        return scorersRefs;
    }

    public void setScorersRefs(Collection<String> scorersRefs) {
        this.scorersRefs = scorersRefs;
    }

    public Collection<String> getTeammateRefs() {
        return teammateRefs;
    }

    public void setTeammateRefs(Collection<String> teammateRefs) {
        this.teammateRefs = teammateRefs;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    /**
     * Returns whether the player in parameter is from the team or not.
     * @param playerKey The reference of the player that should be part of the team.
     * @return true is the player is in the team and false otherwise.
     */
    public boolean isInTeam(String playerKey){
        return this.teammateRefs.contains(playerKey);
    }

    /**
     * Adds a {@see Player} to the team.
     * @param playerKey The reference of the player joining the team.
     * @return true if the team changed as a result of this call.
     */
    public boolean joinTeam(String playerKey){
        return teammateRefs.add(playerKey);
    }

    /**
     * Removes a {@see Player} from the team.
     * @param playerKey The reference of the player leaving the team.
     * @return true if the player was removed as a result of this call.
     */
    public boolean leaveTeam(String playerKey){
        return teammateRefs.remove(playerKey);
    }

    /**
     * When a team scores, his goal count is incremented.
     */
    public void scored(String scorerKey) {
        score++;
        scorersRefs.add(scorerKey);
    }

    @Override
    public String toString() {
        return "Team{" +
                "teammateRefs=" + teammateRefs +
                ", score=" + score +
                ", scorersRefs=" + scorersRefs +
                '}';
    }
}
