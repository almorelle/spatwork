package spatwork;

import com.google.common.base.Charsets;
import restx.SignatureKey;
import restx.factory.Module;
import restx.factory.Provides;
import restx.jongo.JongoFactory;

import javax.inject.Named;

@Module
public class AppModule {
    @Provides
    public SignatureKey signatureKey() {
         return new SignatureKey("9341429873785201943 b3754614-d7a5-4778-923f-40c11479534d restx-spatwork restx-spatwork".getBytes(Charsets.UTF_8));
    }

    @Provides @Named(JongoFactory.JONGO_DB_NAME)
    public String dbName() {
        return "restx-spatwork";
    }
}
