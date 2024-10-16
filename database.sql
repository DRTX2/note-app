CREATE DATABASE NOTE_APP;

USE NOTE_APP;

CREATE TABLE IF NOT EXISTS Tags (
    id_Tag INT AUTO_INCREMENT PRIMARY KEY,
    nam_Tag VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS Pages (
    id_Pag INT AUTO_INCREMENT PRIMARY KEY,
    nam_Pag VARCHAR(50) NOT NULL,
    cre_at_Pag TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS PageFragment (
    id_Pag_Frag INT AUTO_INCREMENT PRIMARY KEY,
    id_page_Pag_Frag INT NOT NULL,
    fra_Pag_Frag VARCHAR(50) NOT NULL,
    fra_order_Pag_Frag INT NOT NULL,
    FOREIGN KEY (id_Pag_Frag) REFERENCES Pages(id_Pag) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Page_Tags (
    id_pag_pag_tag INT,
    id_tag_pag_tag INT,
    PRIMARY KEY (id_pag_pag_tag, id_tag_pag_tag),
    FOREIGN KEY (id_pag_pag_tag) REFERENCES Pages(id_Pag) ON DELETE RESTRICT,
    FOREIGN KEY (id_tag_pag_tag) REFERENCES Tags(id_Tag) ON DELETE RESTRICT
);

CREATE TABLE Users (
    id_Usr INT AUTO_INCREMENT PRIMARY KEY,
    name_Usr VARCHAR(50) NOT NULL,
    des_Usr VARCHAR(150),
    pho_Usr VARCHAR(255)
);

CREATE TABLE Reminders (
    id_Rem INT AUTO_INCREMENT PRIMARY KEY,
    name_Rem VARCHAR(50) NOT NULL,
    sta_dat_Rem TIMESTAMP NOT NULL,
    end_dat_Rem TIMESTAMP NOT NULL,
    cre_at_Rem TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Reminder_Tags (
    reminder_id INT,
    tag_id INT,
    PRIMARY KEY (reminder_id, tag_id),
    FOREIGN KEY (reminder_id) REFERENCES Reminders(id) ON DELETE RESTRICT,
    FOREIGN KEY (tag_id) REFERENCES Tags(id) ON DELETE RESTRICT
);

CREATE TABLE Lists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE List_Pages (
    list_id INT,
    page_id INT,
    PRIMARY KEY (list_id, page_id),
    FOREIGN KEY (list_id) REFERENCES Lists(id) ON DELETE RESTRICT,
    FOREIGN KEY (page_id) REFERENCES Pages(id) ON DELETE RESTRICT
);
