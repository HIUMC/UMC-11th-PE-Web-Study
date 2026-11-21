package com.umc.umcine.exception;

import java.sql.SQLException;
import java.util.Collections;
import java.util.IdentityHashMap;
import java.util.Set;

public final class DatabaseErrorClassifier {
    private DatabaseErrorClassifier() {}

    public static boolean isUniqueViolation(Throwable error) {
        Set<Throwable> visited = Collections.newSetFromMap(new IdentityHashMap<>());
        for (Throwable cause = error; cause != null && visited.add(cause); cause = cause.getCause()) {
            if (cause instanceof SQLException sql) {
                Set<SQLException> sqlVisited = Collections.newSetFromMap(new IdentityHashMap<>());
                for (SQLException current = sql; current != null && sqlVisited.add(current);
                     current = current.getNextException()) {
                    // MySQL duplicate entry: 1062 / 23000. H2 UNIQUE violation: 23505.
                    // SQLState 23000 alone also includes foreign key / NOT NULL violations.
                    if ((current.getErrorCode() == 1062 && "23000".equals(current.getSQLState()))
                            || "23505".equals(current.getSQLState())) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}
