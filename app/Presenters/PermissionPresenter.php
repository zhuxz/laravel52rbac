<?php

namespace App\Presenters;

use App\Repositories\PermissionRepositoryEloquent;
use App\Transformers\PermissionTransformer;
use Prettus\Repository\Presenter\FractalPresenter;
use Route,Auth;

/**
 * Class PermissionPresenter
 *
 * @package namespace App\Presenters;
 */
class PermissionPresenter extends FractalPresenter
{
    protected $permission;

    public function __construct(PermissionRepositoryEloquent $permission)
    {
        $this->permission = $permission;
    }


    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new PermissionTransformer();
    }

    /**
     * top permission select
     * @param int $fid
     * @return string
     */
    public function topPermissionSelect($fid = 0)
    {
        $tops = $this->permission->topPermissions();
        $select = '<select class="form-control input-sm" name="fid">';
        $select .= '<option value="0">--顶级权限--</option>';
        if($tops->count()) {
            foreach ($tops as $top) {
                if($top->id == $fid) {
                    $select .= '<option  value="' . $top->id . '" selected >' . $top->display_name . '[' . $top->name . ']</option>';
                } elseif($top->id != $fid) {
                    $select .= '<option  value="' . $top->id . '">' . $top->display_name . '[' . $top->name . ']</option>';
                }
            }
        }
        $select .= '</select>';
        return $select;
    }

    /**
     * 用户根据权限可见的菜单
     * @return string
     */
    public function menus()
    {
        $menus = $this->permission->menus();
        $html = '';
        if($menus) {

            foreach ($menus as $menu) {
                if(($menu['name'] !== '#') && !Route::has($menu['name'])) {
                    continue;
                }

                $class = '';
                if(isset($menu['sub'])) {
                    $class .= ' nav-parent';
                }

                if($menu['name'] == Route::currentRouteName()) {
                    $class .= ' active';
                }

                if(!Auth::guard('admin')->user()->is_super && !Auth::guard('admin')->user()->can($menu['name'])){
                    $class .= ' hide';
                }

                $html .= '<li class="' . $class . '">';
                $href = ($menu['name'] == '#') ? '' : route($menu['name']);
                $html .= sprintf('<a class="menu-a" href="%s">%s <span>%s</span></a>', $href, $menu['icon_html'], $menu['display_name']);

                if(!isset($menu['sub'])) {
                    $html .= '</li>';
                    continue;
                }

                $html .= '<ul class="children">';
                foreach ($menu['sub'] as $sub) {

                    if(($sub['name'] !== '#') && !Route::has($sub['name'])) {
                        continue;
                    }
                    $href = ($sub['name'] == '#') ? '#' : route($sub['name']);
                    $icon = $sub['icon_html'] ? $sub['icon_html'] : '<i class="fa fa-caret-right"></i>';

                    if(!Auth::guard('admin')->user()->is_super && !Auth::guard('admin')->user()->can($sub['name'])){
                        $html .= sprintf('<li class="sub-menus hide"><a class="sub-menu-a" href="%s">%s %s</a></li>', $href, $icon, $sub['display_name']);
                    }else{
                        $html .= sprintf('<li class="sub-menus"><a class="sub-menu-a" href="%s">%s %s</a></li>', $href, $icon, $sub['display_name']);
                    }
                }
                $html .= '</ul>';
                $html .= '</li>';

            }
        }

        return $html;
    }

    public function adminMenus()
    {
        $menus = $this->permission->menus(1);
        
        $menuItems[] = "<div class='admin-sidebar am-offcanvas' id='admin-offcanvas'>";
        $menuItems[] = "<div class='am-offcanvas-bar admin-offcanvas-bar'>";
        $menuItems[] = "<ul id='sidebar-nav-0' class='am-nav am-nav-zj am-collapse am-in'>";
        $currentRoute = Route::currentRouteName();
        $parentRoute = strrpos($currentRoute, ".");
        
        if($menus) {
            foreach ($menus as $menu) {
	            if (!Auth::guard('admin')->user()->can($menu['name'])){
		            continue;
	            }
	            
                if(($menu['name'] !== '#') && !Route::has($menu['name'])) {
                    continue;
                }

                $subMenuItems = array();
                $isActive = false;

                if(isset($menu['sub'])) {
                    foreach ($menu['sub'] as $sub) {
	                    if (!Auth::guard('admin')->user()->can($sub['name'])){
				            continue;
			            }
	                    
	                    $subMenuItems[] = "<li class='am-panel am-panel-zj";
                        if($sub['name'] == $currentRoute) {
	                    	$subMenuItems[] = " am-active";
	                    	$isActive = true;
	                	} else {
                            if (strncmp($currentRoute, $sub['name'], $parentRoute) == 0) {
                                $subMenuItems[] = " am-active";
                                $isActive = true;
                            }
                        }
	                    $subMenuItems[] = "'>";
	                    
	                    $subMenuItems[] = "<a href='";
	                    $subMenuItems[] = ($sub['name'] == '#') ? '#' : route($sub['name']);
	                    $subMenuItems[] = "'>";
	                    
	                    $subMenuItems[] = "<span class='".$sub['icon']."'></span>";
	                    $subMenuItems[] = " ".$sub['display_name'];
	                    
	                    $subMenuItems[] = "</a>";
	                    $subMenuItems[] = "</li>";
	                }

	                $menuItems[] = "<li class='am-panel am-panel-zj'> ";
	                $menuItems[] = "<a class='am-cf' data-am-collapse=\"";
	                $menuItems[] = "{parent: '#sidebar-nav-0', target: '#sidebar-nav-".$menu['id']."'}";
	                $menuItems[] = "\">";
	                $menuItems[] = "<span class='".$menu['icon']."'></span>";
                    $menuItems[] = "<span class='am-icon-angle-right am-fr am-margin-right'></span>";
	                $menuItems[] = " ".$menu['display_name'];
	                $menuItems[] = "</a>";
	                
	                if (count($subMenuItems) > 0) {
		                $menuItems[] = "<ul id='sidebar-nav-".$menu['id']."'";
		                $menuItems[] = " class='am-nav am-nav-zj am-collapse";
		                if ($isActive) {
			                $menuItems[] = " am-in";
		                }
		                $menuItems[] = "'>";
		                $menuItems[] = join("", $subMenuItems);
		                $menuItems[] = "</ul>";
	                }
	                
	                $menuItems[] = "</li>";
                }
            }
            $menuItems[] = "</ul>";
            $menuItems[] = "</div>";
            $menuItems[] = "</div>";
        }

        return join("", $menuItems);


        $curRoute = Route::currentRouteName();

        if (Auth::guard('admin')->user()->is_super) {
            if (Auth::guard('admin')->user()->can("admin.user.index")
                || Auth::guard('admin')->user()->can("admin.user.create")
                || Auth::guard('admin')->user()->can("admin.user.edit")
                || Auth::guard('admin')->user()->can("admin.user.update")
                || Auth::guard('admin')->user()->can("admin.user.destroy")) {
                if ($curRoute == "admin.user.index"
                    ||$curRoute == "admin.user.create"
                    ||$curRoute == "admin.user.edit"
                    ||$curRoute == "admin.user.update"
                    ||$curRoute == "admin.user.destroy") {

                }
                $active = "admin.user.index" == $curRoute ? " am-active" : "";
                $html[] = "<li class='am-panel am-panel-zj".$active."'>";
                $html[] = "<a href='".route("admin.user.index")."'>";
                $html[] = "<span class='am-icon-tasks'></span> 用户管理";
                $html[] = "</a>";
                $html[] = "</li>";
            }

            if (Auth::guard('admin')->user()->can("admin.role.index")) {
                $active = "admin.role.index" == $curRoute ? " am-active" : "";
                $html[] = "<li class='am-panel am-panel-zj".$active."'>";
                $html[] = "<a href='".route("admin.role.index")."'>";
                $html[] = "<span class='am-icon-save'></span> 用户组管理";
                $html[] = "</a>";
                $html[] = "</li>";
            }

            if (Auth::guard('admin')->user()->can("admin.permission.index")) {
                $active = "admin.permission.index" == $curRoute ? " am-active" : "";
                $html[] = "<li class='am-panel am-panel-zj".$active."'>";
                $html[] = "<a href='".route("admin.permission.index")."'>";
                $html[] = "<span class='am-icon-check-square-o'></span> 权限查看";
                $html[] = "</a>";
                $html[] = "</li>";
            }

            if (Auth::guard('admin')->user()->can("admin.permission.index")) {
                $active = "admin.config.index" == $curRoute ? " am-active" : "";
                $html[] = "<li class='am-panel am-panel-zj".$active."'>";
                $html[] = "<a href='".route("admin.permission.index")."'>";
                $html[] = "<span class='am-icon-wrench'></span> 系统配置";
                $html[] = "</a>";
                $html[] = "</li>";
            }
        }

        $html[] = "</ul>";
        $html[] = "</li>";
        $html[] = "</ul>";

        $html[] = "<div class='background-color: #f3f3f3'>&nbsp;";
        $html[] = "</div>";

        $html[] = "</div>";
        $html[] = "</div>";

        return join("", $html);
    }
}