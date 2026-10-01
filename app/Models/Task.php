<?php

namespace App\Models;

use App\Enums\TaskPriority;
use App\Enums\TaskStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Task extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'status',
        'priority',
        'due_date',
    ];

    protected $attributes = [
        'status' => 'pending',
        'priority' => 'medium',
    ];

    protected function casts(): array
    {
        return [
            'status' => TaskStatus::class,
            'priority' => TaskPriority::class,
            'due_date' => 'date',
            'deleted_at' => 'datetime',
        ];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function scopeForProject(Builder $query, Project|int $project): Builder
    {
        return $query->where('project_id', $project instanceof Project ? $project->id : $project);
    }

    public function scopeFilter(Builder $query, array $filters): Builder
    {
        return $query
            ->when(
                ! empty($filters['status']),
                fn (Builder $q) => $q->where('status', $filters['status'])
            )
            ->when(
                ! empty($filters['priority']),
                fn (Builder $q) => $q->where('priority', $filters['priority'])
            )
            ->when(
                ! empty($filters['search']),
                fn (Builder $q) => $q->where(function (Builder $q) use ($filters) {
                    $term = '%'.$filters['search'].'%';
                    $q->where('title', 'like', $term)
                        ->orWhere('description', 'like', $term);
                })
            );
    }

    public function scopeOverdue(Builder $query): Builder
    {
        return $query->where('due_date', '<', now()->startOfDay())
            ->where('status', '!=', TaskStatus::Completed->value);
    }
}
