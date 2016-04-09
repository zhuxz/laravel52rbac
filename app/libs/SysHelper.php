<?php

/**
 * Created by PhpStorm.
 * User: zxz
 * Date: 3/10/2015
 * Time: 13:42 PM
 */

namespace App\libs;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\AssetKind;
use App\AssetPurposes;
use App\Brand;
use App\RoleUser;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

use App\User;
use App\Organization;
use App\Storage;
use App\InCode;
use App\Role;
use App\Permission;
use Input;

class PageParameter
{
    static public $user = "user";
    static public $organizations = "organizations";
    static public $storage = "storage";
    static public $permissions = "permissions";
    static public $roles = "roles";
    static public $asset_kinds = "asset_kinds";
    static public $asset_brands = "asset_brands";
    static public $purposes = "purposes";

    static public function all()
    {
        $ret[self::$user] = 0;
        $ret[self::$organizations] = 0;
        $ret[self::$storage] = 0;
        $ret[self::$permissions] = 0;
        $ret[self::$roles] = 0;
        $ret[self::$asset_brands] = 0;
        $ret[self::$asset_kinds] = 0;
        $ret[self::$purposes] = 0;
        return $ret;
    }
}

class SysHelper extends Controller
{
    static public function getPageInitData($option)
    {
        $ret = array();

        //$option = array_merge(PageParameter::all(), $option);

        if ($option[PageParameter::$user] == 1) {
            $ret[PageParameter::$user] = self::getAuthUser();
        }

        if ($option[PageParameter::$organizations] == 1) {
            $ret[PageParameter::$organizations] = Organization::all();
        }

        if ($option[PageParameter::$storage] == 1) {
            $ret[PageParameter::$storage] = Storage::all();
        }

        if ($option[PageParameter::$permissions] == 1) {
            $ret[PageParameter::$permissions] = Permission::all();
        }

        if ($option[PageParameter::$roles] == 1) {
            $ret[PageParameter::$roles] = Role::all();
        }

        if ($option[PageParameter::$asset_kinds] == 1) {
            $ret[PageParameter::$asset_kinds] = AssetKind::all();
        }

        if ($option[PageParameter::$asset_brands] == 1) {
            $ret[PageParameter::$asset_brands] = Brand::all();
        }

        if ($option[PageParameter::$purposes] == 1) {
            $ret[PageParameter::$purposes] = AssetPurposes::all();
        }

        return $ret;
    }

    static public function getAuthUser ()
    {
        $auth_user = Auth::user();
        $ret["name"] = $auth_user->name;
        $ret["real_name"] = $auth_user->real_name;
        $ret["organization_id"] = $auth_user->organization_id;

        $organization = Organization::find($ret["organization_id"]);
        if (is_null($organization)) {
            $ret["storage_id"] = 0;
        } else {
            $storage = $organization->storage;
            $ret["storage_id"] = (is_null($storage) ? 0 : $storage->id);
        }

        $role_user = RoleUser::where("user_id", "=", $auth_user->id)->first();
        if (!is_null($role_user)) {
            //$role = \App\Role::find($role_user->role_id);
            //$role_info["display_name"] = $role->display_name;
            $permissions = DB::table("permission_role")
                ->leftJoin('permissions', 'permission_role.permission_id', '=', 'permissions.id')
                ->where("permission_role.role_id", "=", $role_user->role_id)
                ->select(array("permissions.id", "permissions.name"))
                ->get();
            $ret["permissions"] = $permissions;
        } else{
            $ret["permissions"] = array();
        }
        return $ret;
    }

    static public function getUserInfo (Request $request)
    {
        $user = Auth::guard('admin')->user();
        $option = PageParameter::all();

        foreach ($option as $key=>$value) {
            if ($request->has($key)) $option[$key] = intval($request->get($key));
        }

        return self::getPageInitData($option);
    }

    static public function downloadFile($file_path, $file_name)
    {
        if(!file_exists($file_path)){
            info("没有该文件文件");
            return ;
        }
        $fp = fopen($file_path, "r");
        $file_size = filesize($file_path);

        Header("Content-type: application/octet-stream");
        Header("Accept-Ranges: bytes");
        Header("Accept-Length:".$file_size);
        Header("Content-Disposition: attachment; filename=".$file_name);
        //Header("Content-Disposition: attachment; filename=".iconv("UTF-8", "GBK", $file_name));
        $buffer=1024;
        $file_count=0;
        while(!feof($fp) && $file_count<$file_size){
            $file_con=fread($fp,$buffer);
            $file_count+=$buffer;
            echo $file_con;
        }
        fclose($fp);
    }
}