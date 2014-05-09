package spatwork.domain;

public class Signup {
    private String email;
    private String firstName;
    private String lastName;
    private String passwordHash;

    public String getEmail() {
        return email;
    }

    public Signup setEmail(final String email) {
        this.email = email;
        return this;
    }

    public String getFirstName() {
        return firstName;
    }

    public Signup setFirstName(String firstName) {
        this.firstName = firstName;
        return this;
    }

    public String getLastName() {
        return lastName;
    }

    public Signup setLastName(String lastName) {
        this.lastName = lastName;
        return this;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public Signup setPasswordHash(final String passwordHash) {
        this.passwordHash = passwordHash;
        return this;
    }

    @Override
    public String toString() {
        return "Signup{" +
                "email='" + email + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", passwordHash='" + passwordHash + '\'' +
                '}';
    }
}
