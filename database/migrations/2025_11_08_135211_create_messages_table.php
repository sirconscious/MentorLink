<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->id(); 
            $table->unsignedBigInteger("user_id");
            $table->unsignedBigInteger("subject_id"); 
            $table->longText("content"); 
            $table->foreign("user_id")->references("id")->on("users");
            $table->foreign("subject_id")->references("id")->on("subjects");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
