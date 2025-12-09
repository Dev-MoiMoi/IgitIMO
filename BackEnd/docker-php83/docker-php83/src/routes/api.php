<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\UserAddressController;
use App\Http\Controllers\DashboardController;

// ------------------------
// Authentication
// ------------------------

// User Registration
Route::post('/register', [AuthController::class, 'register']);

// Customer Login
Route::post('/login/customer', [AuthController::class, 'customerLogin']);

// Admin Login
Route::post('/login/admin', [AuthController::class, 'adminLogin']);

// ------------------------
// Products
// ------------------------
Route::get('/products', [ProductController::class, 'index']);
Route::post('/products', [ProductController::class, 'store']); // admin only
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::put('/products/{id}', [ProductController::class, 'update']); // admin only
Route::delete('/products/{id}', [ProductController::class, 'destroy']); // admin only

// Cart routes
Route::get('/cart/{user_id}', [CartController::class, 'index']);
Route::post('/cart/add', [CartController::class, 'add']);
Route::patch('/cart/update-quantity/{id}', [CartController::class, 'updateQuantity']);
Route::delete('/cart/remove/{id}', [CartController::class, 'remove']);

// ------------------------
// Orders / Checkout
// ------------------------
Route::post('/checkout', [OrderController::class, 'checkout']);
Route::get('/orders/{user_id}', [OrderController::class, 'userOrders']);



// Get default address
Route::get('/user/address/default/{user_id}', [UserAddressController::class, 'getDefaultAddress']);

// oder
Route::post('/checkout', [OrderController::class, 'checkout']);
Route::get('/orders/{user_id}', [OrderController::class, 'userOrders']);
Route::patch('/orders/{id}/status', [OrderController::class, 'updateStatus']);

// Dashboard Stats
Route::get('/dashboard/stats', [DashboardController::class, 'index']);