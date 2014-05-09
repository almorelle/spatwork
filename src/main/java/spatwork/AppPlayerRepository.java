package spatwork;

import org.bson.types.ObjectId;
import restx.admin.AdminModule;
import restx.factory.Component;
import restx.jongo.JongoCollection;
import restx.jongo.JongoUserRepository;
import restx.security.CredentialsStrategy;
import spatwork.domain.Player;

import javax.inject.Named;
import java.util.Arrays;

import static spatwork.AppModule.Roles.ADMIN;

@Component
public class AppPlayerRepository extends JongoUserRepository<Player> {
    public static final Player defaultAdminUser = new Player()
            .setKey(new ObjectId().toString())
            .setEmail("admin@spatwork.com")
            .setRoles(Arrays.asList(ADMIN, AdminModule.RESTX_ADMIN_ROLE));

    public static final RefUserByNameStrategy<Player> USER_REF_STRATEGY = new RefUserByNameStrategy<Player>() {
        @Override
        public String getNameProperty() {
            return "email";
        }
    };

    public AppPlayerRepository(@Named("players") JongoCollection players,
                             @Named("playersCredentials") JongoCollection playersCredentials,
                             CredentialsStrategy credentialsStrategy) {
        super(
                players, playersCredentials,
                USER_REF_STRATEGY, credentialsStrategy,
                Player.class, defaultAdminUser
        );
    }
}
