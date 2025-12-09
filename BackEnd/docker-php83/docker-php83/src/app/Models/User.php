<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    protected $fillable = [
        'username',
        'email',
        'password',
        'full_name',
        'phone_number',
        'role'
    ];

    protected $hidden = ['password'];

    public function addresses()
    {
        return $this->hasMany(UserAddress::class);
    }
}
