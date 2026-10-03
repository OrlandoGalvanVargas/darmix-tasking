<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $demo = User::factory()->create([
            'name' => 'Usuario Demo',
            'email' => 'demo@darmixista.test',
            'password' => Hash::make('password123'),
        ]);

        Project::factory(3)
            ->for($demo)
            ->has(Task::factory()->count(8))
            ->create();

        User::factory()
            ->has(Project::factory()->has(Task::factory()->count(3)))
            ->create([
                'name' => 'Otro Usuario',
                'email' => 'otro@darmixista.test',
                'password' => Hash::make('password123'),
            ]);
    }
}
