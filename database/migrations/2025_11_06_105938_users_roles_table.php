<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('role_user', function (Blueprint $table) {
            $table->id(); 
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('roles_id');
            // $table->foreignId('user_id')->constrained()->onDelete('cascade'); 
            $table->foreign("user_id")->references("id")->on("users")->onDelete("cascade");
            // $table->foreignId('role_id')->constrained()->onDelete('cascade'); 
            $table->foreign("roles_id")->references("id")->on("roles")->onDelete("cascade");
            $table->timestamps();

            // Prevent duplicate role assignments
            $table->unique(['user_id', 'roles_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('role_user');
    }
};
