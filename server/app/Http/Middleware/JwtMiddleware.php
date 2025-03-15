<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;

class JwtMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();
        $user = null;

        // Tenter d'authentifier l'utilisateur si un token est fourni
        if ($token) {
            try {
                $user = JWTAuth::setToken($token)->authenticate();
            } catch (TokenExpiredException $e) {
                return response()->json(['message' => 'Token has expired'], 401);
            } catch (TokenInvalidException $e) {
                return response()->json(['message' => 'Token is invalid'], 401);
            } catch (JWTException $e) {
                return response()->json(['message' => 'Token error'], 401);
            }
        }

        // 1️⃣ Empêcher les non-authentifiés d’accéder à `/api/ip-page`
        if ($request->is('api/ip-page') && !$user) {
            return response()->json(['message' => 'Unauthorized access to IP Page'], 401);
        }

        // 2️⃣ Empêcher les authentifiés d’accéder à `/api/login` et `/api/register`
        if ($user && ($request->is('api/login') || $request->is('api/register'))) {
            return response()->json(['message' => 'Already authenticated'], 403);
        }

        // Ajouter l'utilisateur authentifié à la requête
        if ($user) {
            $request->attributes->add(['user' => $user]);
        }

        return $next($request);
    }
}
