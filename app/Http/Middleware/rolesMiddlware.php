<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class rolesMiddlware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $roles): Response
    {
        $user = auth()->user();

        // Check if user is authenticated
        if (!$user) {
            return redirect()->route('login');
        }

        $rolesArray = explode('|', $roles);

        // Check if user has any of the required roles
        foreach ($user->roles as $role) {
            if (in_array($role->name, $rolesArray)) {
                return $next($request);
            }
        }

        // If user doesn't have any required roles, redirect or abort
        return redirect()->route('login')->with('error', 'Unauthorized access.');
    }
}
