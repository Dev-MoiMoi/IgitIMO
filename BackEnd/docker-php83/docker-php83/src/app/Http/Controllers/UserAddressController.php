<?php

// app/Http/Controllers/UserAddressController.php

namespace App\Http\Controllers;

use App\Models\UserAddress;
use Illuminate\Http\Request;

class UserAddressController extends Controller
{
    // Get default address
    public function getDefaultAddress($user_id)
    {
        $address = UserAddress::where('user_id', $user_id)
                    ->where('is_default', true)
                    ->first();

        if (!$address) {
            return response()->json(null, 404);
        }

        return response()->json([
            'full_name' => $address->full_name ?? '',
            'phone_number' => $address->phone_number ?? '',
            'region' => $address->region,
            'province' => $address->province,
            'city' => $address->city,
            'barangay' => $address->barangay,
            'postal_code' => $address->postal_code,
            'street_building_house' => $address->street_building_house,
            'label' => $address->label,
            'is_default' => $address->is_default
        ]);
    }
}
