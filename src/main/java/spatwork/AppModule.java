package spatwork;

import com.google.common.base.Charsets;
import com.google.common.base.Optional;
import restx.*;
import restx.config.ConfigLoader;
import restx.config.ConfigSupplier;
import restx.http.HttpStatus;
import restx.security.*;
import restx.factory.Module;
import restx.factory.Provides;
import restx.mongo.MongoModule;

import javax.inject.Named;
import java.io.IOException;

@Module
public class AppModule {

    public static final class Roles {
        // we don't use an enum here because roles in @RolesAllowed have to be constant strings
        public static final String ADMIN = "admin";
        public static final String USER = "user";
    }

    @Provides
    public SignatureKey signatureKey() {
         return new SignatureKey("9341429873785201943 b3754614-d7a5-4778-923f-40c11479534d spatwork spatwork".getBytes(Charsets.UTF_8));
    }

    @Provides
    @Named("restx.admin.password")
    public String restxAdminPassword() {
        return "juma";
    }

    @Provides
    public ConfigSupplier appConfigSupplier(ConfigLoader configLoader) {
        // Load settings.properties in spatwork package as a set of config entries
        return configLoader.fromResource("spatwork/settings");
    }

    @Provides
    public CredentialsStrategy credentialsStrategy() {
        return new BCryptCredentialsStrategy();
    }

    @Provides @Named("restx.activation::restx.security.CORSFilter::CORSFilter")
    public String disableCorsFilter() {
        return "false";
    }

    @Provides
    public RestxFilter getCorsAuthorizerFilter() {
        return new RestxFilter() {
            @Override
            public Optional<RestxHandlerMatch> match(RestxRequest r) {
                return RestxHandlerMatch.of(Optional.of(new StdRestxRequestMatch(r.getRestxPath())),
                        new RestxHandler() {
                            @Override
                            public void handle(RestxRequestMatch match, RestxRequest req, RestxResponse resp, RestxContext ctx) throws IOException {
                                Optional<String> origin = req.getHeader("Origin");
                                if (origin.isPresent()) {
                                    resp.setHeader("Access-Control-Allow-Origin", origin.get());
                                    resp.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                                    resp.setHeader("Access-Control-Allow-Credentials", Boolean.TRUE.toString());
                                    resp.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");

                                    if ("OPTIONS".equals(req.getHttpMethod())) {
                                        resp.setStatus(HttpStatus.OK);
                                    } else {
                                        ctx.nextHandlerMatch().handle(req, resp, ctx);
                                    }
                                } else {
                                    ctx.nextHandlerMatch().handle(req, resp, ctx);
                                }
                            }
                        }
                );
            }
        };
    }

    @Provides
    public BasicPrincipalAuthenticator basicPrincipalAuthenticator(
            AppUserRepository userRepository, SecuritySettings securitySettings,
            CredentialsStrategy credentialsStrategy,
            @Named("restx.admin.passwordHash") String adminPasswordHash) {
        return new StdBasicPrincipalAuthenticator(
                new StdUserService<>(userRepository, credentialsStrategy, adminPasswordHash), securitySettings);
    }
}
