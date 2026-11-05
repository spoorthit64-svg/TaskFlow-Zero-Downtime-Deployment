package com.taskflow.controller;

import com.taskflow.dto.HealthResponse;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.lang.management.ManagementFactory;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @Autowired(required = false)
    private MongoTemplate mongoTemplate;

    @GetMapping
    public ResponseEntity<HealthResponse> checkHealth() {
        String dbStatus = "DISCONNECTED";

        if (mongoTemplate != null) {
            CompletableFuture<String> pingFuture = CompletableFuture.supplyAsync(() -> {
                try {
                    mongoTemplate.executeCommand(new Document("ping", 1));
                    return "CONNECTED";
                } catch (Exception ex) {
                    return "DISCONNECTED: " + ex.getMessage();
                }
            });

            try {
                dbStatus = pingFuture.get(1500, TimeUnit.MILLISECONDS);
            } catch (TimeoutException te) {
                dbStatus = "DISCONNECTED (Database ping timed out - check MONGODB_URI in .env or Render dashboard)";
                pingFuture.cancel(true);
            } catch (Exception e) {
                dbStatus = "DISCONNECTED: " + e.getMessage();
            }
        }

        long uptimeSec = ManagementFactory.getRuntimeMXBean().getUptime() / 1000;
        HealthResponse response = new HealthResponse(
                "UP",
                "TaskFlow REST API",
                "1.0.0",
                dbStatus,
                uptimeSec
        );

        return ResponseEntity.ok(response);
    }
}