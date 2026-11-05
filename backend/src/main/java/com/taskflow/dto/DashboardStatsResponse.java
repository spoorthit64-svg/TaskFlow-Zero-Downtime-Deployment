package com.taskflow.dto;

import java.util.List;
import java.util.Map;

public class DashboardStatsResponse {
    private long totalTasks;
    private long completedTasks;
    private long pendingTasks;
    private long inProgressTasks;
    private double completionRate;
    private Map<String, Long> tasksByPriority;
    private Map<String, Long> tasksByStatus;
    private List<TaskResponse> recentTasks;

    public DashboardStatsResponse() {}

    public long getTotalTasks() { return totalTasks; }
    public void setTotalTasks(long totalTasks) { this.totalTasks = totalTasks; }
    public long getCompletedTasks() { return completedTasks; }
    public void setCompletedTasks(long completedTasks) { this.completedTasks = completedTasks; }
    public long getPendingTasks() { return pendingTasks; }
    public void setPendingTasks(long pendingTasks) { this.pendingTasks = pendingTasks; }
    public long getInProgressTasks() { return inProgressTasks; }
    public void setInProgressTasks(long inProgressTasks) { this.inProgressTasks = inProgressTasks; }
    public double getCompletionRate() { return completionRate; }
    public void setCompletionRate(double completionRate) { this.completionRate = completionRate; }
    public Map<String, Long> getTasksByPriority() { return tasksByPriority; }
    public void setTasksByPriority(Map<String, Long> tasksByPriority) { this.tasksByPriority = tasksByPriority; }
    public Map<String, Long> getTasksByStatus() { return tasksByStatus; }
    public void setTasksByStatus(Map<String, Long> tasksByStatus) { this.tasksByStatus = tasksByStatus; }
    public List<TaskResponse> getRecentTasks() { return recentTasks; }
    public void setRecentTasks(List<TaskResponse> recentTasks) { this.recentTasks = recentTasks; }
}
