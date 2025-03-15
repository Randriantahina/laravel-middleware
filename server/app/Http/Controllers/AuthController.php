<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User; 
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth; 
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request) {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|confirmed|min:6',
        ]);
  
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }
        
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);
        
        $token = JWTAuth::fromUser($user); 

        return response()->json([
            'status' => 'success',
            'message' => 'User created successfully',
            'user' => $user,
            'authorisation' => [
                'token' => $token,
                'type' => 'bearer',
            ]
        ]);
    }
    public function login(Request $request)
{
    
    $request->validate([
        'email' => ['required', 'email'],
        'password' => ['required', 'min:6'],
    ]);
    $user = User::where('email', $request->email)->first();
    if (!$user) {
        return response()->json(["error" => 'Invalid email'], 401);
    }

    if (!Hash::check($request->password, $user->password)) {
        return response()->json(['error' => 'Incorrect password'], 401);
    }
    $token = JWTAuth::fromUser($user);
    return response()->json([
        'message' => 'Login successfully',
        'user' => $user->makeHidden(['password']),
        'token' => $token,
    ], 201);
}

public function logout(Request $request)
{
    try {
        $token = JWTAuth::getToken();

        if (!$token) {
            return response()->json(['error' => 'Token not provided'], 401);
        }

        JWTAuth::invalidate($token);

        return response()->json(['message' => 'Logged out successfully'], 200);
    } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
        return response()->json(['error' => 'Provided token is invalid'], 401);
    } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
        return response()->json(['error' => 'Provided token is expired'], 401);
    } catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {
        return response()->json(['error' => 'Failed to log out'], 500);
    }
}
}
