package models;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class ListModel {
    private UUID id;
    private String name;
    private List<Page> items;

    public ListModel(String name) {
        this.id = UUID.randomUUID();
        setName(name);
        this.items = new ArrayList<>();
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

    public List<Page> getItems() {
        return items;
    }

    public void addItem(Page page) {
        this.items.add(page);
    }

    private String sanitize(String input) {
        return input.replaceAll("[<>]", "");
    }
}
