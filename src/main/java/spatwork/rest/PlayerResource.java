package spatwork.rest;

import com.google.common.base.Optional;
import org.bson.types.ObjectId;
import restx.http.HttpStatus;
import restx.Status;
import restx.WebException;
import restx.annotations.*;
import restx.factory.Component;
import restx.jongo.JongoCollection;
import restx.security.PermitAll;
import restx.security.RestxSession;
import restx.security.RolesAllowed;
import spatwork.AppModule.Roles;
import spatwork.AppPlayerRepository;
import spatwork.domain.Player;
import spatwork.domain.Signup;

import javax.inject.Named;

import java.util.ArrayList;

import static java.util.Arrays.asList;
import static restx.common.MorePreconditions.checkEquals;

@Component @RestxResource
public class PlayerResource {

    private final JongoCollection players;
    private final AppPlayerRepository playerRepository;

    public PlayerResource(@Named("players") JongoCollection players, AppPlayerRepository playerRepository) {
        this.players = players;
        this.playerRepository = playerRepository;
    }

    /**
     * Returns the list of all existing players.
     * @return the list of players
     */
    @PermitAll
    @GET("/players")
    public Iterable<Player> findPlayers() {
        return players.get().find().as(Player.class);
    }

    @RolesAllowed(Roles.ADMIN)
    @GET("/users")
    public Iterable<Player> findUsers() {
        return playerRepository.findAllUsers();
    }

    /**
     * Optionally returns the player associated to the reference in parameter.
     * @param key the reference of the player to look for.
     * @return A non-null reference to the player.
     */
    @PermitAll
    @GET("/players/{key}")
    public Optional<Player> findPlayerByKey(String key) {
        return Optional.fromNullable(players.get().findOne(new ObjectId(key)).as(Player.class));
    }

    @PermitAll
    @GET("/users/:email")
    public Optional<Player> getCurrentUser(String email) {
        Optional<Player> principal = (Optional<Player>) RestxSession.current().getPrincipal();
        if ("current".equals(email)) {
            return principal;
        } else {
            if (principal.isPresent()
                    || (
                    !principal.get().getEmail().equals(email)
                            && !principal.get().getRoles().contains(Roles.ADMIN))) {
                throw new WebException(HttpStatus.UNAUTHORIZED);
            }

            return playerRepository.findUserByName(email);
        }
    }

    @PermitAll
    @POST("/users")
    public Player signup(Signup signup) {
        Player player = playerRepository.createUser(
                new Player().setEmail(signup.getEmail()).setFirstName(signup.getFirstName()).setLastName(signup.getLastName())
                        .setRoles(new ArrayList<>(asList(Roles.USER)))
        );

        playerRepository.setCredentials(player.getName(), signup.getPasswordHash());

        if (!RestxSession.current().getPrincipal().isPresent()) {
            RestxSession.current().authenticateAs(player);
        }

        return player;
    }

    /**
     * Updates a player.
     * @param key the reference of the player to update.
     * @param player the player to update.
     * @return the updated player.
     * @throws @WebException (HTTP404) whenever the key doesn't correspond to any player.
     */
    @RolesAllowed(Roles.ADMIN)
    @PUT("/players/{key}")
    public Player updatePlayer(String key, Player player) {
        Optional<Player> playerByKey = findPlayerByKey(key);
        if(playerByKey.isPresent()){
            checkEquals("key", key, "player.key", player.getKey());
            players.get().save(player);
            return player;
        } else {
            throw new WebException(HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Deletes a player.
     * @param key the iod of the player to delete.
     * @return a deletion confirmation.
     * @throws @WebException (HTTP404) whenever the key doesn't correspond to any player.
     */
    @RolesAllowed(Roles.ADMIN)
    @DELETE("/players/{key}")
    public Status deletePlayer(String key) {
        Optional<Player> player = findPlayerByKey(key);
        if(player.isPresent()){
            players.get().remove(new ObjectId(key));
            return Status.of("deleted");
        } else {
            throw new WebException(HttpStatus.NOT_FOUND);
        }
    }
}
