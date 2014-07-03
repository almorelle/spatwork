package spatwork;

import com.google.common.base.Charsets;
import io.userapp.client.UserApp;
import restx.security.SignatureKey;
import restx.factory.Module;
import restx.factory.Provides;
import restx.mongo.MongoModule;

import javax.inject.Named;

@Module
public class AppModule {
    @Provides
    public SignatureKey signatureKey() {
         return new SignatureKey("9341429873785201943 b3754614-d7a5-4778-923f-40c11479534d restx-spatwork restx-spatwork".getBytes(Charsets.UTF_8));
    }

    @Provides @Named(MongoModule.MONGO_DB_NAME)
    public String dbName() {
        return "restx-spatwork";
    }

    @Provides
    public UserApp.API userapp() { return new UserApp.API("53aad3e4212d8"); }
}
