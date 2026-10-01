<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $demo = User::factory()->create([
            'name' => 'Usuario Demo',
            'email' => 'demo@grupobalak.test',
        ]);

        Project::factory(3)
            ->for($demo)
            ->has(Task::factory()->count(8))
            ->create();

        User::factory()
            ->has(Project::factory()->has(Task::factory()->count(3)))
            ->create([
                'email' => 'otro@grupobalak.test',
            ]);
    }
}
