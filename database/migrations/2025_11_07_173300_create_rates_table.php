<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rates', function (Blueprint $table) {
            $table->id();
            $table->integer('note'); // Note de 1 à 5 étoiles (obligatoire)
            $table->text('comment')->nullable(); // Commentaire (optionnel)
            $table->enum('problem_resolved', ['oui', 'partiellement', 'non']); // Statut résolution problème
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Mentoré qui donne le feedback
            $table->foreignId('mentor_id')->constrained('users')->onDelete('cascade'); // Mentor qui reçoit le feedback
            $table->foreignId('demande_id')->constrained()->onDelete('cascade'); // Session concernée
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rates');
    }
};
