<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            ['name'=>'Piece-of-Cake','price'=>499,'description'=>'[NEW FLAVOR]Everything is easy when you have the cake they want','image'=>'Products/Piece of cake.png','quantity'=>5,'created_at'=>Carbon::now(),'updated_at'=>Carbon::now()],
            ['name'=>'Freaky Cake','price'=>499,'description'=>'[NEW FLAVOR]You got the freak, I got the freak, we all got the freak.','image'=>'Products/Freaky cake.png','quantity'=>3,'created_at'=>Carbon::now(),'updated_at'=>Carbon::now()],
            ['name'=>'Cake of Melancholia','price'=>999,'description'=>'[NEW FLAVOR]You know what\'s gonna happen...','image'=>'Products/Cake of Melancholia.png','quantity'=>8,'created_at'=>Carbon::now(),'updated_at'=>Carbon::now()],
            ['name'=>'Mushroom Delight','price'=>499,'description'=>'[NEW FLAVOR]Earthy and sweet.','image'=>'Products/Mushroom Delight.png','quantity'=>2,'created_at'=>Carbon::now(),'updated_at'=>Carbon::now()],
            ['name'=>'Watermelon Zest','price'=>499,'description'=>'Fresh and tangy.','image'=>'Products/Watermelon Zest.png','quantity'=>10,'created_at'=>Carbon::now(),'updated_at'=>Carbon::now()],
            ['name'=>'Black Forest Cake','price'=>999,'description'=>'Classic Black Forest with cherries and chocolate.','image'=>'Products/Black Forest Cake.png','quantity'=>6,'created_at'=>Carbon::now(),'updated_at'=>Carbon::now()],
            ['name'=>'Carrot Cake','price'=>999,'description'=>'Moist carrot cake with cream cheese frosting.','image'=>'Products/Carrot Cake.png','quantity'=>4,'created_at'=>Carbon::now(),'updated_at'=>Carbon::now()],
            ['name'=>'Coffee Cake','price'=>499,'description'=>'Warm coffee flavor with crumb topping.','image'=>'Products/Coffe Cake.png','quantity'=>7,'created_at'=>Carbon::now(),'updated_at'=>Carbon::now()],
            ['name'=>'Hair Themed Cake','price'=>499,'description'=>'Novelty hair-themed design for stylists.','image'=>'Products/Hair Themed Cake.png','quantity'=>2,'created_at'=>Carbon::now(),'updated_at'=>Carbon::now()],
            ['name'=>'Heart Cake','price'=>499,'description'=>'Perfect for romantic occasions.','image'=>'Products/Heart Cake.png','quantity'=>5,'created_at'=>Carbon::now(),'updated_at'=>Carbon::now()],
            ['name'=>'Hotdog Cake','price'=>999,'description'=>'Savory-styled cake shaped like a hotdog (sweet inside).','image'=>'Products/Hotdog Cake.png','quantity'=>1,'created_at'=>Carbon::now(),'updated_at'=>Carbon::now()],
            ['name'=>'IGIT Cake','price'=>499,'description'=>'Signature IGIT cake.','image'=>'Products/IGIT Cake.png','quantity'=>3,'created_at'=>Carbon::now(),'updated_at'=>Carbon::now()],
            ['name'=>'Lemon Poppy Cake','price'=>499,'description'=>'Citrus lemon cake with poppy seeds.','image'=>'Products/Lemon Poppy Cake.png','quantity'=>6,'created_at'=>Carbon::now(),'updated_at'=>Carbon::now()],
            ['name'=>'Pickle Drizzle','price'=>499,'description'=>'Bold and experimental pickle-drizzle cake.','image'=>'Products/Pickle Drizzle.png','quantity'=>2,'created_at'=>Carbon::now(),'updated_at'=>Carbon::now()],
            ['name'=>'Red Velvet Cake','price'=>499,'description'=>'Classic red velvet with cream cheese.','image'=>'Products/Red Velvet Cake.png','quantity'=>8,'created_at'=>Carbon::now(),'updated_at'=>Carbon::now()],
            ['name'=>'Terrarium Cake','price'=>499,'description'=>'Decorative terrarium-style cake.','image'=>'Products/Terrarium Cake.png','quantity'=>2,'created_at'=>Carbon::now(),'updated_at'=>Carbon::now()],
            ['name'=>'Three Layer Chocolate Cake','price'=>999,'description'=>'Decadent three-layer chocolate.','image'=>'Products/Three Layer Chocolate Cake.png','quantity'=>9,'created_at'=>Carbon::now(),'updated_at'=>Carbon::now()],
            ['name'=>'Tripo Cake','price'=>499,'description'=>'Triple-texture tripo cake.','image'=>'Products/Tripo Cake.png','quantity'=>4,'created_at'=>Carbon::now(),'updated_at'=>Carbon::now()],
            ['name'=>'Urchin Cake','price'=>999,'description'=>'Artful urchin-inspired design.','image'=>'Products/Urchin Cake.png','quantity'=>1,'created_at'=>Carbon::now(),'updated_at'=>Carbon::now()],
            ['name'=>'Arachnid Cake','price'=>999,'description'=>'Halloween arachnid themed cake.','image'=>'Products/Arachnid Cake.png','quantity'=>2,'created_at'=>Carbon::now(),'updated_at'=>Carbon::now()],
        ];

        DB::table('products')->insert($products);
    }
}
