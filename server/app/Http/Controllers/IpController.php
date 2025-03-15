<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class IpController extends Controller
{
    public function getIp(Request $request)
    {
        return response()->json([
            'ip' => $request->ip()
        ]);
    }
}
