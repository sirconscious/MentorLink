<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;
    public function roles()
    {
        return $this->belongsToMany(Roles::class , "role_user");
    } 
    public function info(){
        return $this->hasOne(Info::class , "user_id");
    }
    public function hasInfo(): bool
    {
        // If relationship is already loaded, check the object
        if ($this->relationLoaded('info')) {
            return !is_null($this->info);
        }

        // Otherwise, perform a query check
        return $this->info()->exists();
    }
    /** 
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password', 
        'google_id' , 
        "github_id"
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
