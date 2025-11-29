<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Demande extends Model
{
    protected $fillable = [
        "subject",
        "description",
        "date_debut",
        "type",
        "status",
        "user_id",
        "mentor_id"
    ];

    protected $casts = [
        'date_debut' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, "user_id");
    }

    public function mentor()
    {
        return $this->belongsTo(User::class, "mentor_id");
    } 
    public function room(){
        return $this->hasOne(Room::class , "demande_id" );
    }
}
