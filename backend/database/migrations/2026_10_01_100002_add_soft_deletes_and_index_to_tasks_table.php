<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->softDeletes()->after('updated_at');
            // Optimiza filtro por priority dentro de un proyecto.
            // El índice (project_id, status, priority) ya cubre project_id + status.
            $table->index(['project_id', 'priority'], 'tasks_project_priority_idx');
        });
    }

    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropIndex('tasks_project_priority_idx');
            $table->dropSoftDeletes();
        });
    }
};
