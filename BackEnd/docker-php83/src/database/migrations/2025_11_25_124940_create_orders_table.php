<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->foreignId('user_address_id')->nullable()->constrained('user_addresses')->onDelete('set null');
    $table->decimal('total', 10, 2)->default(0);
    $table->string('status')->default('pending');
    $table->string('full_name')->nullable();
    $table->string('phone_number')->nullable();
    $table->timestamps();
});

    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
