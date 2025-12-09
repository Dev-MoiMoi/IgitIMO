<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'user_address_id',
        'total',
        'status',
        'full_name',
        'phone_number'
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function userAddress()
    {
        return $this->belongsTo(UserAddress::class);
    }
}
