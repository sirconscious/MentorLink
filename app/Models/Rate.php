<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rate extends Model
{
    protected $fillable = [
        "note",
        "comment",
        "problem_resolved",
        "user_id",
        "mentor_id",
        "demande_id"
    ];

    // Relation avec le mentoré qui a donné la note
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Relation avec le mentor qui a reçu la note
    public function mentor()
    {
        return $this->belongsTo(User::class, 'mentor_id');
    }

    // Relation avec la demande/session concernée
    public function demande()
    {
        return $this->belongsTo(Demande::class, 'demande_id');
    }
}
