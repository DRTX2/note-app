package models;

import java.util.UUID;

public class User {
    private UUID id;
    private String name;
    private String description;
    private String photo;

    public User() {
        this.id = UUID.randomUUID();
        setName("Pablo Neruda");
        setDescription("Soy un nuevo usuario en la aplicacion");
        setPhoto("./assets/img/foto.jpeg");
    }
    
    public User(String name, String description, String photo) {
        this.id = UUID.randomUUID();
        setName(name);
        setDescription(description);
        setPhoto(photo);
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        if (name != null && name.length() <= 50) {
            this.name = sanitize(name);
        } else {
            throw new IllegalArgumentException("Name must be 50 characters or less.");
        }
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        if (description != null && description.length() <= 150) {
            this.description = sanitize(description);
        } else {
            throw new IllegalArgumentException("Description must be 150 characters or less.");
        }
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        if (photo != null && photo.matches("https?://.*")) { // Validación simple para URL
            this.photo = photo;
        } else {
            throw new IllegalArgumentException("Invalid photo URL.");
        }
    }

    private String sanitize(String input) {
        return input.replaceAll("[<>]", "");
    }
}