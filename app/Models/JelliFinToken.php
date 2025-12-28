<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JelliFinToken extends Model
{
    protected $fillable = ["user_id", "token"];

    public function user()
    {
        return $this->belongsTo(User::class); // Fixed: User::class not "users"
    }
}
