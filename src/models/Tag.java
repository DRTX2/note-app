package models;

import java.util.UUID;

public class Tag {
    private UUID id;
    private String name;

    public Tag(String name) {
        this.id = UUID.randomUUID(); // Genera un UUID aleatorio
        setName(name);
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

    // Método para sanitizar el input
    private String sanitize(String input) {
        return input.replaceAll("[<>]", ""); // Simplificado para evitar XSS
    }
}