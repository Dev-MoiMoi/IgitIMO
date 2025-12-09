<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@example.com'], // Check by email to avoid duplicates
            [
                'username' => 'admin',
                'full_name' => 'System Administrator',
                'password' => Hash::make('adminpassword'),
                'role' => 'admin',
                'phone_number' => '0000000000',
            ]
        );
    }
}
