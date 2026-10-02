<?php

namespace App\Services;

use App\Models\Project;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ProjectService
{
    public function listForUser(User $user, array $filters = []): LengthAwarePaginator
    {
        return $user->projects()
            ->withTaskCounts()
            ->orderByDesc('created_at')
            ->paginate($filters['per_page'] ?? 15);
    }

    public function loadDetails(Project $project): Project
    {
        return $project
            ->loadCount([
                'tasks',
                'tasks as pending_tasks_count' => fn ($q) => $q->where('status', 'pending'),
                'tasks as in_progress_tasks_count' => fn ($q) => $q->where('status', 'in_progress'),
                'tasks as completed_tasks_count' => fn ($q) => $q->where('status', 'completed'),
            ])
            ->load(['tasks' => fn ($q) => $q->orderByDesc('created_at')]);
    }

    public function create(User $user, array $data): Project
    {
        return $user->projects()->create($data);
    }

    public function update(Project $project, array $data): Project
    {
        $project->update($data);

        return $project->fresh();
    }

    public function delete(Project $project): void
    {
        $project->delete();
    }
}
