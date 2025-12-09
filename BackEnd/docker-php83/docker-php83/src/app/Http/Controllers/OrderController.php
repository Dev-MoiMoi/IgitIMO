<?php
namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Cart;
use App\Models\UserAddress;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function checkout(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'shipping_address' => 'required|array'
        ]);

        $user_id = $request->user_id;

        $cartItems = Cart::where('user_id', $user_id)->get();
        if ($cartItems->isEmpty()) {
            return response()->json(['error' => 'Cart is empty'], 400);
        }

        // Check stock availability first
        foreach ($cartItems as $item) {
            if ($item->product->quantity < $item->quantity) {
                return response()->json(['message' => "You are placing an order for {$item->product->name} more than the stock (Available: {$item->product->quantity})"], 400);
            }
        }

        $total = $cartItems->sum(fn($item) => $item->product->price * $item->quantity);

        $addr = $request->shipping_address;
        $addr['user_id'] = $user_id;
        if ($addr['is_default'] ?? false) {
            UserAddress::where('user_id', $user_id)->update(['is_default' => false]);
        }

        // Remove full_name and phone_number from address data
        $addressData = collect($addr)->except(['full_name', 'phone_number'])->toArray();

        $address = UserAddress::updateOrCreate(
            ['user_id' => $user_id, 'is_default' => $addr['is_default'] ?? false],
            $addressData
        );

        $order = Order::create([
            'user_id' => $user_id,
            'user_address_id' => $address->id,
            'total' => $total,
            'full_name' => $addr['full_name'],
            'phone_number' => $addr['phone_number'],
            'status' => 'pending'
        ]);

        foreach ($cartItems as $item) {
            // Decrement stock
            $item->product->decrement('quantity', $item->quantity);

            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item->product_id,
                'quantity' => $item->quantity,
                'price_each' => $item->product->price
            ]);
        }

        Cart::where('user_id', $user_id)->delete();

        return response()->json([
            'message' => 'Order placed successfully',
            'order_id' => $order->id
        ]);
    }

    public function userOrders($user_id)
    {
        return Order::with('items.product', 'userAddress')
            ->where('user_id', $user_id)
            ->get();
    }
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:completed'
        ]);

        $order = Order::find($id);
        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        $order->status = $request->status;
        $order->save();

        return response()->json(['message' => 'Order status updated', 'order' => $order]);
    }
}
