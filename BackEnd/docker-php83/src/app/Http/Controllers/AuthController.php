<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserAddress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // ------------------------
    // REGISTER USER
    // ------------------------
    public function register(Request $request)
    {
        $user = User::create([
            'username'     => $request->username,
            'email'        => $request->email,
            'password'     => Hash::make($request->password),
            'full_name'    => $request->full_name,
            'phone_number' => $request->phone_number,
            'role'         => 'user'
        ]);

        // Store address
        $user->addresses()->create([
            'region'                => $request->region,
            'province'              => $request->province,
            'city'                  => $request->city,
            'barangay'              => $request->barangay,
            'postal_code'           => $request->postal_code,
            'street_building_house' => $request->street_building_house,
            'label'                 => $request->label,      // home or work
            'is_default'            => $request->is_default, // boolean toggle
        ]);

        return response()->json([
            'message' => 'Registration successful',
            'user'    => $user->load('addresses')
        ], 201);
    }



    // ------------------------
    // CUSTOMER LOGIN
    // ------------------------
    public function customerLogin(Request $request)
    {
        $user = User::where('username', $request->username)
                    ->where('role', 'user')
                    ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['error' => 'Invalid customer credentials'], 401);
        }

        return response()->json([
            'message' => 'Login successful',
            'user' => $user->load('addresses')
        ]);
    }



    // ------------------------
    // ADMIN LOGIN
    // ------------------------
    public function adminLogin(Request $request)
    {
        $admin = User::where('username', $request->username)
                     ->where('role', 'admin')
                     ->first();

        if (!$admin || !Hash::check($request->password, $admin->password)) {
            return response()->json(['error' => 'Invalid admin credentials'], 401);
        }

        return response()->json([
            'message' => 'Admin login successful',
            'admin' => $admin
        ]);
    }
}
