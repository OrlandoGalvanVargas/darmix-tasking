<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'name'          => $this->name,
            'description'   => $this->whenHas('description', $this->description),
            'tasks_count'   => $this->whenCounted('tasks'),
            'tasks_summary' => $this->when(
                isset($this->pending_tasks_count) || isset($this->completed_tasks_count),
                fn () => [
                    'pending'     => $this->pending_tasks_count ?? 0,
                    'in_progress' => $this->in_progress_tasks_count ?? 0,
                    'completed'   => $this->completed_tasks_count ?? 0,
                ]
            ),
            'tasks'         => TaskResource::collection($this->whenLoaded('tasks')),
            'created_at'    => $this->whenHas('created_at', fn () => $this->created_at?->toIso8601String()),
            'updated_at'    => $this->whenHas('updated_at', fn () => $this->updated_at?->toIso8601String()),
        ];
    }
}