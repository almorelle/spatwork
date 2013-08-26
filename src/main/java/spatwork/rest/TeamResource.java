package spatwork.rest;

import com.google.common.base.Optional;
import org.bson.types.ObjectId;
import restx.HttpStatus;
import restx.Status;
import restx.WebException;
import restx.annotations.*;
import restx.factory.Component;
import restx.jongo.JongoCollection;
import restx.security.PermitAll;
import spatwork.domain.Player;
import spatwork.domain.Team;

import javax.inject.Named;

import static restx.common.MorePreconditions.checkEquals;

@Component
@RestxResource
public class TeamResource {

    private final JongoCollection teams;
    private final PlayerResource playerResource;

    public TeamResource(@Named("teams") JongoCollection teams, PlayerResource playerResource) {
        this.teams = teams;
        this.playerResource = playerResource;
    }

    /**
     * Returns the list of all existing teams.
     * @return the list of teams
     */
    @PermitAll
    @GET("/teams")
    public Iterable<Team> findTeams() {
        return teams.get().find().as(Team.class);
    }

    /**
     * Optionally returns the team associated to the reference in parameter.
     * @param key the reference of the team to look for.
     * @return A non-null reference to the team.
     */
    @PermitAll
    @GET("/teams/{key}")
    public Optional<Team> findTeamByKey(String key) {
        return Optional.fromNullable(teams.get().findOne(new ObjectId(key)).as(Team.class));
    }

    /**
     * Adds a team.
     * @param team the team to add.
     * @return the added team.
     */
    @PermitAll
    @POST("/teams")
    public Team createTeam(Team team) {
        teams.get().save(team);
        return team;
    }

    /**
     * Updates a team.
     * @param key the reference of the team to update.
     * @param team the team to update.
     * @return the updated team.
     * @throws @WebException (HTTP404) whenever the key doesn't correspond to any team.
     */
    @PermitAll
    @PUT("/teams/{key}")
    public Team updateTeam(String key, Team team) {
        Optional<Team> teamByKey = findTeamByKey(key);
        if(teamByKey.isPresent()){
            checkEquals("key", key, "team.key", team.getKey());
            teams.get().save(team);
            return team;
        } else {
            throw new WebException(HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Deletes a team.
     * @param key the iod of the team to delete.
     * @return a deletion confirmation.
     * @throws @WebException HTTP404 whenever the referenced team doesn't exist.
     */
    @PermitAll
    @DELETE("/teams/{key}")
    public Status deleteTeam(String key) {
        Optional<Team> team = findTeamByKey(key);
        if(team.isPresent()){
            teams.get().remove(new ObjectId(key));
            return Status.of("deleted");
        } else {
            throw new WebException(HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Adds a {@see Player} in the team.
     * @param key the reference of the team to update.
     * @param keyPlayer the reference of the player to add.
     * @return the updated team.
     * @throws @WebException HTTP404 whenever the referenced team or player don't exist.
     */
    @PermitAll
    @PUT("/teams/player/join/{key}/{keyPlayer}")
    public Team joinTeam(String key, String keyPlayer) {
        Optional<Team> teamByKey = findTeamByKey(key);
        if(teamByKey.isPresent() && playerResource.findPlayerByKey(keyPlayer).isPresent()){
            Team team = teamByKey.get();
            if(!team.isInTeam(keyPlayer)) { team.joinTeam(keyPlayer); }
            teams.get().save(team);
            return team;
        } else {
            throw new WebException(HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Remove a {@see Player} from the team.
     * @param key the reference of the team to update.
     * @param keyPlayer the reference of the player to remove.
     * @return the updated team.
     * @throws @WebException HTTP404 whenever the referenced team or player don't exist.
     */
    @PermitAll
    @PUT("/teams/player/leave/{key}/{keyPlayer}")
    public Team leaveTeam(String key, String keyPlayer) {
        Optional<Team> teamByKey = findTeamByKey(key);
        if(teamByKey.isPresent() && playerResource.findPlayerByKey(keyPlayer).isPresent()){
            Team team = teamByKey.get();
            team.leaveTeam(keyPlayer);
            teams.get().save(team);
            return team;
        } else {
            throw new WebException(HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Records a goal.
     * @param key the reference of the team to update.
     * @param keyScorer the reference of the player who scored the goal.
     * @return the updated team.
     * @throws @WebException HTTP404 whenever the referenced team or player don't exist and HTTP400 if the player
     * is not in the team.
     */
    @PermitAll
    @PUT("/teams/player/goal/{key}/{keyScorer}")
    public Team goal(String key, String keyScorer) {
        Optional<Team> teamByKey = findTeamByKey(key);
        Optional<Player> playerByKey = playerResource.findPlayerByKey(keyScorer);
        if(playerByKey.isPresent() && teamByKey.isPresent()){
            Team team = teamByKey.get();
            team.scored();
            teams.get().save(team);
            if(team.isInTeam(keyScorer)){
                Player player = playerByKey.get();
                player.scored();
                playerResource.updatePlayer(keyScorer, player);
            }
            return team;
        } else {
            throw new WebException(HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Records the result and reset the team.
     * @param team the team to update.
     * @param result true if the team has won or if the game was a draw, false otherwise.
     */
    public void finishGame(Team team, boolean result) {
        for(String playerKey : team.getTeammateRefs()){
            Optional<Player> playerByKey = playerResource.findPlayerByKey(playerKey);
            if(playerByKey.isPresent()){
                Player player = playerByKey.get();
                player.endOfGame(result);
                playerResource.updatePlayer(playerKey, player);
            }
        }
        team.setScore(0);
        team.getTeammateRefs().clear();
        teams.get().save(team);
    }
}
