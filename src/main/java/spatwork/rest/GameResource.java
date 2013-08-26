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
import spatwork.domain.Team;

import javax.inject.Named;

import static restx.common.MorePreconditions.checkEquals;

@Component
@RestxResource
public class GameResource {

    private final JongoCollection games;
    private final TeamResource teamResource;

    public GameResource(@Named("games") JongoCollection games, TeamResource teamResource) {
        this.games = games;
        this.teamResource = teamResource;
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
        Optional<Game> playerByKey = findGameByKey(key);
        if(playerByKey.isPresent()){
            checkEquals("key", key, "game.key", game.getKey());
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
     * Closes a game by recording the result, clearing all the players and resetting the score.
     * @param key the reference game to update.
     * @return the updated game.
     * @throws WebException HTTP400 if one of the referenced teams doesn't exists or HTTP404 if the referenced game
     * doesn't exists.
     */
    @PermitAll
    @PUT("/games/end/{key}")
    public Game finishGame(String key) {
        Optional<Game> gameByKey = findGameByKey(key);
        if(gameByKey.isPresent()){
            Game game = gameByKey.get();
            Optional<Team> teamAByKey = teamResource.findTeamByKey(game.getTeamARef());
            Optional<Team> teamBByKey = teamResource.findTeamByKey(game.getTeamBRef());
            if(teamAByKey.isPresent() && teamBByKey.isPresent()) {
                Team teamA = teamAByKey.get();
                Team teamB = teamBByKey.get();
                switch (getWinner(teamA, teamB)) {
                    case TEAM_A_WON:
                        teamResource.finishGame(teamA, true);
                        teamResource.finishGame(teamB, false);
                        break;
                    case TEAM_B_WON:
                        teamResource.finishGame(teamA, false);
                        teamResource.finishGame(teamB, true);
                        break;
                    case DRAW:
                        teamResource.finishGame(teamA, true);
                        teamResource.finishGame(teamB, true);
                        break;
                }
                games.get().save(game);
                return game;
            } else {
                throw new WebException(HttpStatus.BAD_REQUEST);
            }
        } else {
            throw new WebException(HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Returns the current winner of the game (may change as the game continues).
     * @param teamA the first team of the game.
     * @param teamB the second team of the game.
     * @return The team that is currently winning.
     */
    public Game.GameResult getWinner(Team teamA, Team teamB){
        Game.GameResult winner = Game.GameResult.DRAW;
        if (teamA.getScore() > teamB.getScore()) {
            winner = Game.GameResult.TEAM_A_WON;
        } else if (teamA.getScore() < teamB.getScore()) {
            winner = Game.GameResult.TEAM_B_WON;
        }
        return winner;
    }
}
