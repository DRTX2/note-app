package models;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class Reminder {
    private UUID id;
    private String name;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private List<Tag> tags;

    public Reminder(String name, LocalDateTime startDate, LocalDateTime endDate) {
        this.id = UUID.randomUUID();
        setName(name);
        setStartDate(startDate);
        setEndDate(endDate);
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

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        if (startDate.isBefore(endDate)) {
            this.startDate = startDate;
        } else {
            throw new IllegalArgumentException("Start date must be before end date.");
        }
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
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
