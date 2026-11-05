package com.taskflow.dto;

import java.time.Instant;

public class HealthResponse {
    private String status;
    private Instant timestamp;
    private String service;
    private String version;
    private String database;
    private long uptimeSeconds;

    public HealthResponse() {}

    public HealthResponse(String status, String service, String version, String database, long uptimeSeconds) {
        this.status = status;
        this.timestamp = Instant.now();
        this.service = service;
        this.version = version;
        this.database = database;
        this.uptimeSeconds = uptimeSeconds;
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
    public String getService() { return service; }
    public void setService(String service) { this.service = service; }
    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }
    public String getDatabase() { return database; }
    public void setDatabase(String database) { this.database = database; }
    public long getUptimeSeconds() { return uptimeSeconds; }
    public void setUptimeSeconds(long uptimeSeconds) { this.uptimeSeconds = uptimeSeconds; }
}
