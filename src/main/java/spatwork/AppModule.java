package spatwork;

import com.google.common.base.Charsets;
import com.google.common.base.Optional;
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
        return Optional.fromNullable(System.getenv("MONGOHQ_DB_NAME")).or("restx-spatwork");
    }

    @Provides @Named(MongoModule.MONGO_URI)
    public String dbUri() {
        return Optional.fromNullable(System.getenv("MONGOHQ_URL")).or("mongodb://localhost");
    }
}
