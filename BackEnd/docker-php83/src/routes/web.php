<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/fix-db', function () {
    try {
        // 1. Drop table
        Schema::dropIfExists('carts');

        // 2. Recreate table with raw SQL to be absolutely sure
        DB::statement('
            CREATE TABLE carts (
                id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                user_id BIGINT UNSIGNED NOT NULL,
                product_id BIGINT UNSIGNED NOT NULL,
                quantity INT NOT NULL DEFAULT 1,
                created_at TIMESTAMP NULL,
                updated_at TIMESTAMP NULL,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
            )
        ');

        return "Database Fixed! Table 'carts' dropped and recreated successfully.";
    } catch (\Throwable $e) {
        return "Error: " . $e->getMessage();
    }
});
