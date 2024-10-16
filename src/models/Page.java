package models;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class Page {
    private UUID id;
    private String name;
    private String content;
    private List<Tag> tags;

    public Page(String name, String content) {
        this.id = UUID.randomUUID();
        setName(name);
        setContent(content);
        this.tags = new ArrayList<>();
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

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = sanitize(content);
    }

    public List<Tag> getTags() {
        return tags;
    }

    public void addTag(Tag tag) {
        this.tags.add(tag);
    }

    private String sanitize(String input) {
        return input.replaceAll("[<>]", "");
    }
}
