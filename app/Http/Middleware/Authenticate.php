<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class Authenticate
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \Closure $next
     * @param  string|null $guard
     * @return mixed
     */
    public function handle($request, Closure $next, $guard = null)
    {
        //info("User.Authenticate.begin");
        if(Auth::guard($guard)->guest()) {
            if($request->ajax()) {
                return response('Unauthorized.', 401);
            } else {
                if($guard == 'admin') {
                    return redirect()->guest('admin/login');
                }
                return redirect()->guest('login');
            }
        }
        //info("User.Authenticate.finish");

        return $next($request);
    }
}
