package com.taskflow.service;

import com.taskflow.dto.DashboardStatsResponse;
import com.taskflow.dto.TaskRequest;
import com.taskflow.dto.TaskResponse;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.model.Task;
import com.taskflow.model.TaskPriority;
import com.taskflow.model.TaskStatus;
import com.taskflow.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    public List<TaskResponse> getTasks(String userId, String statusStr, String priorityStr, String search, String sortBy, String sortDir) {
        Sort.Direction direction = "ASC".equalsIgnoreCase(sortDir) ? Sort.Direction.ASC : Sort.Direction.DESC;
        String property = "createdAt";
        if (StringUtils.hasText(sortBy)) {
            switch (sortBy.toLowerCase()) {
                case "duedate" -> property = "dueDate";
                case "priority" -> property = "priority";
                case "title" -> property = "title";
                case "status" -> property = "status";
                default -> property = "createdAt";
            }
        }
        Sort sort = Sort.by(direction, property);

        List<Task> tasks;
        if (StringUtils.hasText(statusStr) && !"ALL".equalsIgnoreCase(statusStr)) {
            TaskStatus status = TaskStatus.fromString(statusStr);
            tasks = taskRepository.findByUserIdAndStatus(userId, status, sort);
        } else if (StringUtils.hasText(priorityStr) && !"ALL".equalsIgnoreCase(priorityStr)) {
            TaskPriority priority = TaskPriority.fromString(priorityStr);
            tasks = taskRepository.findByUserIdAndPriority(userId, priority, sort);
        } else {
            tasks = taskRepository.findByUserId(userId, sort);
        }

        // Apply in-memory search and multi-filtering if needed
        return tasks.stream()
                .filter(t -> {
                    if (StringUtils.hasText(statusStr) && !"ALL".equalsIgnoreCase(statusStr)) {
                        if (t.getStatus() != TaskStatus.fromString(statusStr)) return false;
                    }
                    if (StringUtils.hasText(priorityStr) && !"ALL".equalsIgnoreCase(priorityStr)) {
                        if (t.getPriority() != TaskPriority.fromString(priorityStr)) return false;
                    }
                    if (StringUtils.hasText(search)) {
                        String query = search.trim().toLowerCase();
                        boolean matchTitle = t.getTitle() != null && t.getTitle().toLowerCase().contains(query);
                        boolean matchDesc = t.getDescription() != null && t.getDescription().toLowerCase().contains(query);
                        boolean matchTags = t.getTags() != null && t.getTags().stream().anyMatch(tag -> tag.toLowerCase().contains(query));
                        return matchTitle || matchDesc || matchTags;
                    }
                    return true;
                })
                .map(TaskResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public TaskResponse getTaskById(String taskId, String userId) {
        Task task = taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
        return TaskResponse.fromEntity(task);
    }

    public TaskResponse createTask(TaskRequest request, String userId) {
        Task task = new Task();
        task.setUserId(userId);
        task.setTitle(request.getTitle().trim());
        task.setDescription(request.getDescription());
        task.setStatus(TaskStatus.fromString(request.getStatus()));
        task.setPriority(TaskPriority.fromString(request.getPriority()));
        task.setDueDate(request.getDueDate());
        task.setTags(request.getTags() != null ? request.getTags() : new ArrayList<>());
        task.setCreatedAt(Instant.now());
        task.setUpdatedAt(Instant.now());

        Task saved = taskRepository.save(task);
        return TaskResponse.fromEntity(saved);
    }

    public TaskResponse updateTask(String taskId, TaskRequest request, String userId) {
        Task task = taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));

        task.setTitle(request.getTitle().trim());
        task.setDescription(request.getDescription());
        if (request.getStatus() != null) {
            task.setStatus(TaskStatus.fromString(request.getStatus()));
        }
        if (request.getPriority() != null) {
            task.setPriority(TaskPriority.fromString(request.getPriority()));
        }
        task.setDueDate(request.getDueDate());
        if (request.getTags() != null) {
            task.setTags(request.getTags());
        }
        task.setUpdatedAt(Instant.now());

        Task saved = taskRepository.save(task);
        return TaskResponse.fromEntity(saved);
    }

    public TaskResponse updateTaskStatus(String taskId, String statusStr, String userId) {
        Task task = taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));

        task.setStatus(TaskStatus.fromString(statusStr));
        task.setUpdatedAt(Instant.now());

        Task saved = taskRepository.save(task);
        return TaskResponse.fromEntity(saved);
    }

    public void deleteTask(String taskId, String userId) {
        Task task = taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
        taskRepository.delete(task);
    }

    public DashboardStatsResponse getDashboardStats(String userId) {
        long totalTasks = taskRepository.countByUserId(userId);
        long completedTasks = taskRepository.countByUserIdAndStatus(userId, TaskStatus.COMPLETED);
        long pendingTasks = taskRepository.countByUserIdAndStatus(userId, TaskStatus.PENDING);
        long inProgressTasks = taskRepository.countByUserIdAndStatus(userId, TaskStatus.IN_PROGRESS);

        double completionRate = totalTasks > 0 ? Math.round(((double) completedTasks / totalTasks * 100.0) * 10.0) / 10.0 : 0.0;

        Map<String, Long> tasksByPriority = new HashMap<>();
        tasksByPriority.put("LOW", taskRepository.countByUserIdAndPriority(userId, TaskPriority.LOW));
        tasksByPriority.put("MEDIUM", taskRepository.countByUserIdAndPriority(userId, TaskPriority.MEDIUM));
        tasksByPriority.put("HIGH", taskRepository.countByUserIdAndPriority(userId, TaskPriority.HIGH));

        Map<String, Long> tasksByStatus = new HashMap<>();
        tasksByStatus.put("PENDING", pendingTasks);
        tasksByStatus.put("IN_PROGRESS", inProgressTasks);
        tasksByStatus.put("COMPLETED", completedTasks);

        List<Task> recent = taskRepository.findByUserId(userId, Sort.by(Sort.Direction.DESC, "createdAt"));
        List<TaskResponse> recentResponses = recent.stream()
                .limit(6)
                .map(TaskResponse::fromEntity)
                .collect(Collectors.toList());

        DashboardStatsResponse stats = new DashboardStatsResponse();
        stats.setTotalTasks(totalTasks);
        stats.setCompletedTasks(completedTasks);
        stats.setPendingTasks(pendingTasks);
        stats.setInProgressTasks(inProgressTasks);
        stats.setCompletionRate(completionRate);
        stats.setTasksByPriority(tasksByPriority);
        stats.setTasksByStatus(tasksByStatus);
        stats.setRecentTasks(recentResponses);

        return stats;
    }
}
