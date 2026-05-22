<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!in_array($request->user()?->role, ['admin', 'super_admin'], true)) {
            return response()->json([
                'message' => 'Akses admin diperlukan.',
            ], 403);
        }

        return $next($request);
    }
}
