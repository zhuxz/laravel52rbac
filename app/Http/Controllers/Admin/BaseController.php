<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;

use App\Http\Requests;
use Breadcrumbs;

class BaseController extends Controller
{
    public function __construct()
    {
        //info("Admin.BaseController.__construct.begin");
        $this->middleware('auth:admin');
        $this->middleware('auth.admin');

        Breadcrumbs::register('dashboard', function ($breadcrumbs) {
            $breadcrumbs->push('系统管理', route('admin.user.index'));
        });
        //info("Admin.BaseController.__construct.finish");
    }
}
