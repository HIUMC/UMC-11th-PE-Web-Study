package com.umc.umcine;

import com.umc.umcine.controller.GlobalExceptionHandler;
import org.junit.jupiter.api.Test;
import org.springframework.dao.DataIntegrityViolationException;
import java.sql.SQLException;
import static org.assertj.core.api.Assertions.assertThat;

class DatabaseErrorHandlingTest {
    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void onlyUniqueViolationsBecome409() {
        for (SQLException sql : new SQLException[]{new SQLException("opaque", "23000", 1062),
                new SQLException("opaque", "23505", 23505)}) {
            var response = handler.handleDataIntegrity(new DataIntegrityViolationException("opaque", sql));
            assertThat(response.getStatusCode().value()).isEqualTo(409);
            assertThat(response.getBody().code()).isEqualTo("COMMON4091");
        }
        for (SQLException sql : new SQLException[]{new SQLException("duplicate", "23000", 1452),
                new SQLException("duplicate", "23000", 1048), new SQLException("duplicate", "23506"),
                new SQLException("duplicate", "23502")}) {
            var response = handler.handleDataIntegrity(new DataIntegrityViolationException("duplicate", sql));
            assertThat(response.getStatusCode().value()).isEqualTo(500);
            assertThat(response.getBody().code()).isEqualTo("COMMON5001");
        }
    }

    @Test
    void internalIllegalArgumentIsNotAClientConflictOrBadRequest() {
        var response = handler.handleIllegalArgument(new IllegalArgumentException("internal details"));
        assertThat(response.getStatusCode().value()).isEqualTo(500);
        assertThat(response.getBody().message()).doesNotContain("internal details");
    }
}
