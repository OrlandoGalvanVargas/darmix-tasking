<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->softDeletes()->after('updated_at');
            // Optimiza: listado "proyectos del usuario ordenados por fecha"
            $table->index(['user_id', 'created_at'], 'projects_user_created_idx');
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropIndex('projects_user_created_idx');
            $table->dropSoftDeletes();
        });
    }
};