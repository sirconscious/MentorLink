<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    protected $fillable = [ "roomName" , "metered_room_id" , "access_token" , "demande_id" , "room_url"]; 
    public function demande(){
        return $this->belongsTo(Demande::class ); 

    }
}
