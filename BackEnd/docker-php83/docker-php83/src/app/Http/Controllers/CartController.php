<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Http\Resources\ProductResource;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index($user_id)
    {
        $cartItems = Cart::with('product')->where('user_id', $user_id)->get();

        // Include full product resource
        $cartItems->transform(function ($cart) {
            if ($cart->product) {
                $cart->product = new ProductResource($cart->product);
            }
            return $cart;
        });

        return response()->json(['cart' => $cartItems]);
    }

    public function add(Request $request)
    {
        \Illuminate\Support\Facades\Log::info("Cart add request:", $request->all());

        try {
            $request->validate([
                'user_id' => 'required|exists:users,id',
                'product_id' => 'required|exists:products,id',
                'quantity' => 'integer|min:1'
            ]);

            $item = Cart::where('user_id', $request->user_id)
                ->where('product_id', $request->product_id)
                ->first();

            if ($item) {
                $item->quantity += $request->quantity;
                $item->save();
            } else {
                $item = Cart::create($request->all());
            }

            if ($item->product) {
                $item->product = new ProductResource($item->product);
            }
            return response()->json($item, 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            \Illuminate\Support\Facades\Log::error("Validation failed:", $e->errors());
            return response()->json(['message' => 'Validation failed', 'errors' => $e->errors()], 422);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error("Cart add failed: " . $e->getMessage());
            return response()->json(['message' => 'Failed to add to cart', 'error' => $e->getMessage()], 500);
        }
    }

    public function updateQuantity(Request $request, $id)
    {
        \Illuminate\Support\Facades\Log::info("UpdateQuantity called for ID: $id", ['request' => $request->all()]);

        $cartItem = Cart::find($id);
        if (!$cartItem) {
            \Illuminate\Support\Facades\Log::error("Cart item not found for ID: $id");
            return response()->json(['message' => 'Cart item not found'], 404);
        }

        if ($request->has('quantity')) {
            $cartItem->quantity = max(1, $request->quantity); // minimum 1
            $cartItem->save();
            \Illuminate\Support\Facades\Log::info("Quantity updated to: " . $cartItem->quantity);
        }

        if ($cartItem->product) {
            try {
                $cartItem->product = new ProductResource($cartItem->product);
            } catch (\Throwable $e) {
                \Illuminate\Support\Facades\Log::error("Error creating ProductResource: " . $e->getMessage());
                return response()->json(['message' => 'Error processing product data'], 500);
            }
        } else {
            \Illuminate\Support\Facades\Log::warning("Product not found for cart item ID: $id");
        }

        return response()->json($cartItem);
    }

    public function remove($id)
    {
        Cart::destroy($id);
        return response()->json(['message' => 'Item removed']);
    }
}
