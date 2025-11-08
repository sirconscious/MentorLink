<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    protected $fillable = [
        'name',
        'description'
    ];
    public function messages(){
        return $this->hasMany(Message::class , "subject_id");
    }
} 
