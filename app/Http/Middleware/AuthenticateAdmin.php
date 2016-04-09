<?php

namespace App\Http\Middleware;

use Closure;
use Zizaco\Entrust\EntrustFacade as Entrust;
use Route,URL,Auth;

class AuthenticateAdmin
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
        //info("Admin.AuthenticateAdmin.begin");
        if(Auth::guard('admin')->user()->is_super){
            return $next($request);
        }

        $previousUrl = URL::previous();
        //info("previousUrl=".$previousUrl);
        if(!Auth::guard('admin')->user()->can(Route::currentRouteName())) {
            if($request->ajax() && ($request->getMethod() != 'GET')) {
                return response()->json([
                    'status' => -1,
                    'code' => 403,
                    'msg' => '您没有权限执行此操作'
                ]);
            } else {
                if (URL::to("admin/login") == $previousUrl) {
                    $previousUrl = URL::to("admin/logout");
                    return view('admin.errors.403', compact('previousUrl'));
                } else {
                    return view('admin.errors.403', compact('previousUrl'));
                }
                //return view('admin.errors.403', compact('previousUrl'));
            }
        }

        //info("Admin.AuthenticateAdmin.finish");

        return $next($request);
    }
}
