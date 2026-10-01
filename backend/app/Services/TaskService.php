<?php

namespace App\Services;

use App\Models\Task;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Arr;

class TaskService
{
    public function listForUser(User $user, array $filters = []): LengthAwarePaginator
    {
        return Task::query()
            ->whereHas('project', fn ($q) => $q->where('user_id', $user->id))
            ->with('project')
            ->filter($filters)
            ->when(
                ! empty($filters['project_id']),
                fn ($q) => $q->where('project_id', $filters['project_id'])
            )
            ->orderByDesc('created_at')
            ->paginate($filters['per_page'] ?? 15);
    }

    public function create(User $user, array $data): Task
    {
        $project = $user->projects()->findOrFail($data['project_id']);

        return $project->tasks()->create(Arr::except($data, 'project_id'));
    }

    public function update(Task $task, array $data): Task
    {
        $task->update($data);

        return $task->fresh()->load('project');
    }

    public function delete(Task $task): void
    {
        $task->delete();
    }
}
