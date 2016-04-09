<?php

use Illuminate\Database\Seeder;

class PermissionTableSeeder extends Seeder {

  public function run()
  {
    //DB::table('permissions')->truncate();
    DB::table('permissions')->insert([
        ['id' => '1', 'fid' => '0', 'icon' => 'am-icon-cogs', 'name' => '#-1456129983', 'display_name' => '系统管理', 'description' => '菜单', 'is_menu' => '1', 'is_admin' => '1', 'sort' => '100', 'created_at' => '2016-03-11 10:01:25', 'updated_at' => '2016-03-11 10:01:25'],
        ['id' => '2', 'fid' => '1', 'icon' => 'am-icon-tasks', 'name' => 'admin.user.index', 'display_name' => '用户管理', 'description' => '页面', 'is_menu' => '1', 'is_admin' => '1', 'sort' => '0', 'created_at' => '2016-03-11 10:01:25', 'updated_at' => '2016-03-11 10:01:25'],
        ['id' => '3', 'fid' => '1', 'icon' => 'am-icon-save', 'name' => 'admin.role.index', 'display_name' => '用户组管理', 'description' => '页面', 'is_menu' => '1', 'is_admin' => '1', 'sort' => '0', 'created_at' => '2016-03-11 10:01:25', 'updated_at' => '2016-03-11 10:01:25'],
        ['id' => '4', 'fid' => '1', 'icon' => 'am-icon-check-square-o', 'name' => 'admin.permission.index', 'display_name' => '权限管理', 'description' => '页面', 'is_menu' => '1', 'is_admin' => '1', 'sort' => '0', 'created_at' => '2016-03-11 10:01:25', 'updated_at' => '2016-03-11 10:01:25'],
        ['id' => '5', 'fid' => '1', 'icon' => 'am-icon-wrench', 'name' => 'admin.parameter.index', 'display_name' => '系统配置', 'description' => '页面', 'is_menu' => '1', 'is_admin' => '1', 'sort' => '0', 'created_at' => '2016-03-11 10:01:25', 'updated_at' => '2016-03-11 10:01:25'],
        ['id' => '6', 'fid' => '1', 'icon' => '', 'name' => 'admin.user.create', 'display_name' => '新建用户', 'description' => '页面', 'is_menu' => '0', 'is_admin' => '1', 'sort' => '0', 'created_at' => '2016-03-11 10:01:25', 'updated_at' => '2016-03-11 10:01:25'],
        ['id' => '7', 'fid' => '1', 'icon' => '', 'name' => 'admin.user.store', 'display_name' => '保存新建用户', 'description' => '操作', 'is_menu' => '0', 'is_admin' => '1', 'sort' => '0', 'created_at' => '2016-03-11 10:01:25', 'updated_at' => '2016-03-11 10:01:25'],
        ['id' => '8', 'fid' => '1', 'icon' => '', 'name' => 'admin.user.edit', 'display_name' => '编辑用户', 'description' => '页面', 'is_menu' => '0', 'is_admin' => '1', 'sort' => '0', 'created_at' => '2016-03-11 10:01:25', 'updated_at' => '2016-03-11 10:01:25'],
        ['id' => '9', 'fid' => '1', 'icon' => '', 'name' => 'admin.user.update', 'display_name' => '保存编辑用户', 'description' => '操作', 'is_menu' => '0', 'is_admin' => '1', 'sort' => '0', 'created_at' => '2016-03-11 10:01:25', 'updated_at' => '2016-03-11 10:01:25'],
        ['id' => '10', 'fid' => '1', 'icon' => '', 'name' => 'admin.user.destroy', 'display_name' => '删除用户', 'description' => '操作', 'is_menu' => '0', 'is_admin' => '1', 'sort' => '0', 'created_at' => '2016-03-11 10:01:25', 'updated_at' => '2016-03-11 10:01:25'],
        ['id' => '11', 'fid' => '1', 'icon' => '', 'name' => 'admin.permission.create', 'display_name' => '新建权限', 'description' => '页面', 'is_menu' => '0', 'is_admin' => '1', 'sort' => '0', 'created_at' => '2016-03-11 10:01:25', 'updated_at' => '2016-03-11 10:01:25'],
        ['id' => '12', 'fid' => '1', 'icon' => '', 'name' => 'admin.permission.store', 'display_name' => '保存新建权限', 'description' => '操作', 'is_menu' => '0', 'is_admin' => '1', 'sort' => '0', 'created_at' => '2016-03-11 10:01:25', 'updated_at' => '2016-03-11 10:01:25'],
        ['id' => '13', 'fid' => '1', 'icon' => '', 'name' => 'admin.permission.edit', 'display_name' => '编辑权限', 'description' => '页面', 'is_menu' => '0', 'is_admin' => '1', 'sort' => '0', 'created_at' => '2016-03-11 10:01:25', 'updated_at' => '2016-03-11 10:01:25'],
        ['id' => '14', 'fid' => '1', 'icon' => '', 'name' => 'admin.permission.update', 'display_name' => '保存编辑权限', 'description' => '操作', 'is_menu' => '0', 'is_admin' => '1', 'sort' => '0', 'created_at' => '2016-03-11 10:01:25', 'updated_at' => '2016-03-11 10:01:25'],
        ['id' => '15', 'fid' => '1', 'icon' => '', 'name' => 'admin.permission.destroy', 'display_name' => '删除权限', 'description' => '操作', 'is_menu' => '0', 'is_admin' => '1', 'sort' => '0', 'created_at' => '2016-03-11 10:01:25', 'updated_at' => '2016-03-11 10:01:25'],

    ]);
    $this->command->info('permissions table seeded!');
  }

}