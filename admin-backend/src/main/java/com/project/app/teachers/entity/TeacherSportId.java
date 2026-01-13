// file: src/main/java/com/project/app/teachers/entity/TeacherSportId.java
package com.project.app.teachers.entity;

import java.io.Serializable;
import java.util.Objects;

public class TeacherSportId implements Serializable {
    private String userId;
    private Long sportId;

    public TeacherSportId() {}

    public TeacherSportId(String userId, Long sportId) {
        this.userId = userId;
        this.sportId = sportId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof TeacherSportId that)) return false;
        return Objects.equals(userId, that.userId) && Objects.equals(sportId, that.sportId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, sportId);
    }
}
