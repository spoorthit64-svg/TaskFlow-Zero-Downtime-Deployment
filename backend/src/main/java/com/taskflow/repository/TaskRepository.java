package com.taskflow.repository;

import com.taskflow.model.Task;
import com.taskflow.model.TaskPriority;
import com.taskflow.model.TaskStatus;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends MongoRepository<Task, String> {
    List<Task> findByUserId(String userId, Sort sort);

    Optional<Task> findByIdAndUserId(String id, String userId);

    List<Task> findByUserIdAndStatus(String userId, TaskStatus status, Sort sort);

    List<Task> findByUserIdAndPriority(String userId, TaskPriority priority, Sort sort);

    long countByUserId(String userId);

    long countByUserIdAndStatus(String userId, TaskStatus status);

    long countByUserIdAndPriority(String userId, TaskPriority priority);

    void deleteByIdAndUserId(String id, String userId);
}
