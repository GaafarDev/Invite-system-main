<?php

namespace App\Http\Middleware;

use Closure;

class CustomCors
{
    public function handle($request, Closure $next)
    {
        $allowedOrigins = ['https://invite-system-backend.up.railway.app', 'https://invite-system-frontend1.up.railway.app'];
        $origin = $request->headers->get('Origin');
    
        $headers = [
            'Access-Control-Allow-Methods' => 'POST, GET, OPTIONS, PUT, DELETE',
            'Access-Control-Allow-Headers' => 'Content-Type, X-Auth-Token, Authorization, Origin',
        ];
    
        if (in_array($origin, $allowedOrigins)) {
            $headers['Access-Control-Allow-Origin'] = $origin;
        }
    
        // Handle OPTIONS requests
        if ($request->getMethod() === 'OPTIONS') {
            return response()->json('OK', 200, $headers);
        }
    
        $response = $next($request);
    
        // Add CORS headers to the response
        foreach ($headers as $key => $value) {
            $response->headers->set($key, $value);
        }
    
        return $response;
    }
}