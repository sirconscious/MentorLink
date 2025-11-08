<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable =[
        "user_id" , 
        "subject_id" ,
        "content" ,

    ] ; 
    public function user(){
        return $this->belongsTo(User::class);
    } 
    public function subject(){
        return $this->belongsTo(Subject::class);
    }
}
