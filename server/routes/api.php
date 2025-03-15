<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\IpController;
use Illuminate\Container\Attributes\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\JwtMiddleware; 



Route::middleware([JwtMiddleware::class])->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->withoutMiddleware([JwtMiddleware::class]);
    Route::post('/register', [AuthController::class, 'register'])->withoutMiddleware([JwtMiddleware::class]);
     Route::get('/ip', [IpController::class, 'getIp'] );
    Route::post('/logout', [AuthController::class,'logout'])->withoutMiddleware([JwtMiddleware::class]);
  });