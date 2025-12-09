<?php
// app/Models/UserAddress.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserAddress extends Model
{
    protected $fillable = [
        'user_id',
        'full_name',
        'phone_number',
        'region',
        'province',
        'city',
        'barangay',
        'postal_code',
        'street_building_house',
        'label',
        'is_default'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
