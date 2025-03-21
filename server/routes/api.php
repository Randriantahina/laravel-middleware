<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\IpController;
use Illuminate\Container\Attributes\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\JwtMiddleware; 
use App\Http\Controllers\StockController;

Route::get('/check-auth', [AuthController::class, 'checkAuth']);


Route::middleware([JwtMiddleware::class])->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->withoutMiddleware([JwtMiddleware::class]);
    Route::post('/register', [AuthController::class, 'register'])->withoutMiddleware([JwtMiddleware::class]);
    Route::get('/ip', [IpController::class, 'getIp'] );
    Route::get('/stocks', [StockController::class, 'index']);
    Route::post('/stocks', [StockController::class, 'store']);
    Route::put('/stocks/{id}', [StockController::class, 'update']);
    Route::delete('/stocks/{id}', [StockController::class, 'destroy']);
    Route::post('/logout', [AuthController::class,'logout'])->withoutMiddleware([JwtMiddleware::class]);
  });
