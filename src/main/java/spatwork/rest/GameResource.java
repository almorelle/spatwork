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
import spatwork.domain.Game;
import spatwork.domain.Player;
import spatwork.domain.Team;

import javax.inject.Named;
import java.util.Collection;
import java.util.HashSet;

import static restx.common.MorePreconditions.checkEquals;

@Component
@RestxResource
public class GameResource {

    private final JongoCollection games;
    private final PlayerResource playerResource;

    public GameResource(@Named("games") JongoCollection games, PlayerResource playerResource) {
        this.games = games;
        this.playerResource = playerResource;
    }

    /**
     * Returns the list of all existing games.
     * @return the list of games.
     */
    @PermitAll
    @GET("/games")
    public Iterable<Game> findGames() {
        return games.get().find().as(Game.class);
    }

    /**
     * Optionally returns the game associated to the reference in parameter.
     * @param key the reference of the game to look for.
     * @return A non-null reference to the game.
     */
    @PermitAll
    @GET("/games/{key}")
    public Optional<Game> findGameByKey(String key) {
        return Optional.fromNullable(games.get().findOne(new ObjectId(key)).as(Game.class));
    }

    /**
     * Adds a game.
     * @param game the game to add.
     * @return the added game.
     */
    @PermitAll
    @POST("/games")
    public Game createGame(Game game) {
        games.get().save(game);
        return game;
    }

    /**
     * Updates a game.
     * @param key the reference of the game to update.
     * @param game the game to update.
     * @return the updated game.
     * @throws @WebException (HTTP404) whenever the key doesn't correspond to any game.
     */
    @PermitAll
    @PUT("/games/{key}")
    public Game updateGame(String key, Game game) {
        Optional<Game> gameByKey = findGameByKey(key);
        if(gameByKey.isPresent()){
            checkEquals("key", key, "game.key", game.getKey());
            Collection<String> playersInGame = new HashSet<String>();
            for(String playerKey: game.getTeamA().getTeammateRefs()){
                if(!playersInGame.add(playerKey)){
                    throw new WebException(HttpStatus.BAD_REQUEST);
                }
            }
            for(String playerKey: game.getTeamB().getTeammateRefs()){
                if(!playersInGame.add(playerKey)){
                    throw new WebException(HttpStatus.BAD_REQUEST);
                }
            }
            games.get().save(game);
            return game;
        } else {
            throw new WebException(HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Deletes a game.
     * @param key the reference of the game to delete.
     * @return a deletion confirmation.
     * @throws @WebException HTTP404 whenever the key doesn't correspond to any game.
     */
    @PermitAll
    @DELETE("/games/{key}")
    public Status deleteGame(String key) {
        Optional<Game> game = findGameByKey(key);
        if(game.isPresent()){
            games.get().remove(new ObjectId(key));
            return Status.of("deleted");
        } else {
            throw new WebException(HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Records a goal.
     * @param key the reference of the game to update.
     * @param keyTeam the reference of the team who scored (accept A or B).
     * @param keyScorer the reference of the player who scored the goal. The goal is not counted for the player
     *                  whenever he's not part of the team scoring the goal. If the player doesn't exist, the goal
     *                  is counted for the team and no error is returned.
     * @return the updated game.
     * @throws @WebException HTTP404 whenever the referenced game or HTTP400 if the team does not exist.
     */
    @PermitAll
    @PUT("/games/goal/{key}/{keyTeam}/{keyScorer}")
    public Game goal(String key, String keyTeam, String keyScorer) {
        Optional<Game> gameByKey = findGameByKey(key);
        if(gameByKey.isPresent()){
            Game game = gameByKey.get();
            Optional<Team> teamByKey;
            switch(keyTeam){
                case "A":
                    teamByKey = Optional.of(game.getTeamA());
                    break;
                case "B":
                    teamByKey = Optional.of(game.getTeamB());
                    break;
                default:
                    teamByKey = Optional.absent();
                    break;
            }
            if(teamByKey.isPresent()){
                Team team = teamByKey.get();
                teamByKey.get().scored();
                games.get().save(game);
                Optional<Player> playerByKey = playerResource.findPlayerByKey(keyScorer);
                if(playerByKey.isPresent() && team.isInTeam(keyScorer)){
                    Player player = playerByKey.get();
                    player.scored();
                    playerResource.updatePlayer(keyScorer, player);
                }
                return game;
            } else {
                throw new WebException(HttpStatus.BAD_REQUEST);
            }
        } else {
            throw new WebException(HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Closes a game by recording the result, clearing all the players and resetting the score.
     * @param key the reference game to update.
     * @return the updated game.
     * @throws WebException HTTP404 if the referenced game doesn't exists.
     */
    @PermitAll
    @PUT("/games/end/{key}")
    public Game endGame(String key) {
        Optional<Game> gameByKey = findGameByKey(key);
        if(gameByKey.isPresent()){
            Game game = gameByKey.get();
            switch (game.winner()) {
                case TEAM_A_WON:
                    finishGame(game.getTeamA(), true);
                    finishGame(game.getTeamB(), false);
                    break;
                case TEAM_B_WON:
                    finishGame(game.getTeamA(), false);
                    finishGame(game.getTeamB(), true);
                    break;
                case DRAW:
                    finishGame(game.getTeamA(), true);
                    finishGame(game.getTeamB(), true);
                    break;
            }
            games.get().save(game);
            return game;
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
                player.finishGame(result);
                playerResource.updatePlayer(playerKey, player);
            }
        }
        team.setScore(0);
        team.getTeammateRefs().clear();
    }
}
