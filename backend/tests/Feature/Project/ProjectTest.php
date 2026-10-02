<?php

use App\Models\Project;
use App\Models\Task;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->token = auth('api')->login($this->user);
    $this->endpoint = '/api/projects';
});

it('lists only the authenticated user projects', function () {
    Project::factory(2)->for($this->user)->create();
    Project::factory(3)->for(User::factory())->create();

    $this->withToken($this->token)
        ->getJson($this->endpoint)
        ->assertOk()
        ->assertJsonPath('success', true)
        ->assertJsonCount(2, 'data')
        ->assertJsonStructure(['data', 'meta' => ['pagination' => ['current_page', 'per_page', 'total']]]);
});

it('creates a project', function () {
    $this->withToken($this->token)
        ->postJson($this->endpoint, [
            'name' => 'New Project',
            'description' => 'Desc',
        ])
        ->assertCreated()
        ->assertJsonPath('data.name', 'New Project');

    $this->assertDatabaseHas('projects', [
        'name' => 'New Project',
        'user_id' => $this->user->id,
    ]);
});

it('validates required fields when creating project', function () {
    $this->withToken($this->token)
        ->postJson($this->endpoint, [])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('name');
});

it('shows own project with its tasks', function () {
    $project = Project::factory()->for($this->user)->hasTasks(3)->create();

    $this->withToken($this->token)
        ->getJson("{$this->endpoint}/{$project->id}")
        ->assertOk()
        ->assertJsonPath('data.id', $project->id)
        ->assertJsonCount(3, 'data.tasks');
});

it('forbids viewing another user project', function () {
    $other = Project::factory()->for(User::factory())->create();

    $this->withToken($this->token)
        ->getJson("{$this->endpoint}/{$other->id}")
        ->assertForbidden()
        ->assertJsonPath('code', 'FORBIDDEN');
});

it('updates own project', function () {
    $project = Project::factory()->for($this->user)->create();

    $this->withToken($this->token)
        ->putJson("{$this->endpoint}/{$project->id}", ['name' => 'Updated'])
        ->assertOk()
        ->assertJsonPath('data.name', 'Updated');
});

it('forbids updating another user project', function () {
    $other = Project::factory()->for(User::factory())->create();

    $this->withToken($this->token)
        ->putJson("{$this->endpoint}/{$other->id}", ['name' => 'Hack'])
        ->assertForbidden();
});

it('deletes own project (soft delete)', function () {
    $project = Project::factory()->for($this->user)->create();

    $this->withToken($this->token)
        ->deleteJson("{$this->endpoint}/{$project->id}")
        ->assertOk();

    $this->assertSoftDeleted('projects', ['id' => $project->id]);
});

it('requires authentication', function () {
    auth('api')->logout();

    $this->getJson($this->endpoint)->assertUnauthorized();
});

it('includes tasks summary broken down by status', function () {
    $project = Project::factory()->for($this->user)->create();

    Task::factory(2)->for($project)->create(['status' => 'pending']);
    Task::factory(1)->for($project)->create(['status' => 'in_progress']);
    Task::factory(3)->for($project)->create(['status' => 'completed']);

    $this->withToken($this->token)
        ->getJson("{$this->endpoint}/{$project->id}")
        ->assertOk()
        ->assertJsonPath('data.tasks_summary.pending', 2)
        ->assertJsonPath('data.tasks_summary.in_progress', 1)
        ->assertJsonPath('data.tasks_summary.completed', 3);
});
