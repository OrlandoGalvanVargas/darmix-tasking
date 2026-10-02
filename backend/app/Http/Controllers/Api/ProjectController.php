<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Project\StoreProjectRequest;
use App\Http\Requests\Project\UpdateProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use App\Services\ProjectService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function __construct(
        private readonly ProjectService $service,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Project::class);

        $projects = $this->service->listForUser(
            $request->user(),
            $request->only('per_page'),
        );

        return ApiResponse::paginated(
            $projects,
            ProjectResource::class,
            'Proyectos obtenidos correctamente.',
        );
    }

    public function store(StoreProjectRequest $request): JsonResponse
    {
        $this->authorize('create', Project::class);

        $project = $this->service->create($request->user(), $request->validated());

        return ApiResponse::created(
            new ProjectResource($project),
            'Proyecto creado correctamente.',
        );
    }

    public function show(Project $project): JsonResponse
    {
        $this->authorize('view', $project);

        $project = $this->service->loadDetails($project);

        return ApiResponse::success(
            new ProjectResource($project),
            'Proyecto obtenido correctamente.',
        );
    }

    public function update(UpdateProjectRequest $request, Project $project): JsonResponse
    {
        $this->authorize('update', $project);

        $project = $this->service->update($project, $request->validated());

        return ApiResponse::success(
            new ProjectResource($project),
            'Proyecto actualizado correctamente.',
        );
    }

    public function destroy(Project $project): JsonResponse
    {
        $this->authorize('delete', $project);

        $this->service->delete($project);

        return ApiResponse::noContent('Proyecto eliminado correctamente.');
    }
}
