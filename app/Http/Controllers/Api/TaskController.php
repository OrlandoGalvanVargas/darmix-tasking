<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Task\IndexTaskRequest;
use App\Http\Requests\Task\StoreTaskRequest;
use App\Http\Requests\Task\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use App\Services\TaskService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

class TaskController extends Controller
{
    public function __construct(
        private readonly TaskService $service,
    ) {}

    public function index(IndexTaskRequest $request): JsonResponse
    {
        $this->authorize('viewAny', Task::class);

        $tasks = $this->service->listForUser(
            $request->user(),
            $request->validated(),
        );

        return ApiResponse::paginated(
            $tasks,
            TaskResource::class,
            'Tareas obtenidas correctamente.',
        );
    }

    public function store(StoreTaskRequest $request): JsonResponse
    {
        $this->authorize('create', Task::class);

        $task = $this->service->create($request->user(), $request->validated());

        return ApiResponse::created(
            new TaskResource($task),
            'Tarea creada correctamente.',
        );
    }

    public function show(Task $task): JsonResponse
    {
        $this->authorize('view', $task);

        $task->load('project:id,name,description'); 

        return ApiResponse::success(
            new TaskResource($task),
            'Tarea obtenida correctamente.',
        );
    }

    public function update(UpdateTaskRequest $request, Task $task): JsonResponse
    {
        $this->authorize('update', $task);

        $task = $this->service->update($task, $request->validated());

        return ApiResponse::success(
            new TaskResource($task),
            'Tarea actualizada correctamente.',
        );
    }

    public function destroy(Task $task): JsonResponse
    {
        $this->authorize('delete', $task);

        $this->service->delete($task);

        return ApiResponse::noContent('Tarea eliminada correctamente.');
    }
}