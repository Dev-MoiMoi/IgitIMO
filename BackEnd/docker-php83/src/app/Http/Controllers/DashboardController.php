<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $products = Product::count();
        $orders = Order::count();
        $users = User::where('role', 'user')->count();

        return response()->json([
            'products' => $products,
            'orders' => $orders,
            'users' => $users
        ]);
    }
}
