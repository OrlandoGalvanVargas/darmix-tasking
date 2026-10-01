<?php

use App\Enums\TaskPriority;
use App\Enums\TaskStatus;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;

beforeEach(function () {
    $this->user     = User::factory()->create();
    $this->token    = auth('api')->login($this->user);
    $this->project  = Project::factory()->for($this->user)->create();
    $this->endpoint = '/api/tasks';
});

it('lists only tasks from the authenticated user projects', function () {
    Task::factory(3)->for($this->project)->create();
    Task::factory(2)->for(Project::factory()->for(User::factory()))->create();

    $this->withToken($this->token)
        ->getJson($this->endpoint)
        ->assertOk()
        ->assertJsonCount(3, 'data');
});

it('filters tasks by status', function () {
    Task::factory(2)->for($this->project)->create(['status' => TaskStatus::Pending]);
    Task::factory(1)->for($this->project)->create(['status' => TaskStatus::Completed]);

    $this->withToken($this->token)
        ->getJson("{$this->endpoint}?status=pending")
        ->assertOk()
        ->assertJsonCount(2, 'data');
});

it('filters tasks by priority', function () {
    Task::factory(1)->for($this->project)->create(['priority' => TaskPriority::High]);
    Task::factory(3)->for($this->project)->create(['priority' => TaskPriority::Low]);

    $this->withToken($this->token)
        ->getJson("{$this->endpoint}?priority=high")
        ->assertOk()
        ->assertJsonCount(1, 'data');
});

it('rejects invalid filter values', function () {
    $this->withToken($this->token)
        ->getJson("{$this->endpoint}?status=invalid")
        ->assertUnprocessable()
        ->assertJsonValidationErrors('status');
});

it('creates a task in own project', function () {
    $this->withToken($this->token)
        ->postJson($this->endpoint, [
            'project_id' => $this->project->id,
            'title'      => 'New Task',
            'priority'   => 'high',
        ])
        ->assertCreated()
        ->assertJsonPath('data.title', 'New Task')
        ->assertJsonPath('data.priority', 'high');

    $this->assertDatabaseHas('tasks', ['title' => 'New Task', 'project_id' => $this->project->id]);
});

it('rejects creating task in another user project', function () {
    $foreign = Project::factory()->for(User::factory())->create();

    $this->withToken($this->token)
        ->postJson($this->endpoint, [
            'project_id' => $foreign->id,
            'title'      => 'Hack Task',
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('project_id');
});

it('validates required fields when creating task', function () {
    $this->withToken($this->token)
        ->postJson($this->endpoint, [])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['project_id', 'title']);
});

it('updates own task', function () {
    $task = Task::factory()->for($this->project)->create(['status' => TaskStatus::Pending]);

    $this->withToken($this->token)
        ->patchJson("{$this->endpoint}/{$task->id}", ['status' => 'completed'])
        ->assertOk()
        ->assertJsonPath('data.status', 'completed');
});

it('forbids updating another user task', function () {
    $foreign = Task::factory()->for(Project::factory()->for(User::factory()))->create();

    $this->withToken($this->token)
        ->patchJson("{$this->endpoint}/{$foreign->id}", ['status' => 'completed'])
        ->assertForbidden();
});

it('deletes own task', function () {
    $task = Task::factory()->for($this->project)->create();

    $this->withToken($this->token)
        ->deleteJson("{$this->endpoint}/{$task->id}")
        ->assertOk();

    $this->assertSoftDeleted('tasks', ['id' => $task->id]);
});

it('forbids deleting another user task', function () {
    $foreign = Task::factory()->for(Project::factory()->for(User::factory()))->create();

    $this->withToken($this->token)
        ->deleteJson("{$this->endpoint}/{$foreign->id}")
        ->assertForbidden();
});