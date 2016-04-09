<?php

use Illuminate\Database\Seeder;

class UserTableSeeder extends Seeder {

  public function run()
  {
//    DB::table('users')->truncate();
    DB::table('users')->insert([
    	['id' =>'1', 'name' =>'admin', 'email' =>'admin', 'password' =>'$2y$10$CpZrPfvBXC8gV04UIygSwu1hHtpjJPtKPVLWq0fLzgZd9lxm7lsd2', 'is_super' => 1, 'mobile' =>'13866742661', 'desc' =>'超级管理员', 'real_name' =>'管理员', 'organization_id' =>'1', 'status' =>'1', 'created_at' =>'2015-10-26 02:56:49', 'updated_at' =>'2016-01-04 11:12:03'],
        ['id' =>'2', 'name' =>'test', 'email' =>'test', 'password' =>'$2y$10$CpZrPfvBXC8gV04UIygSwu1hHtpjJPtKPVLWq0fLzgZd9lxm7lsd2', 'is_super' => 0, 'mobile' =>'13866742661', 'desc' =>'测试', 'real_name' =>'测试', 'organization_id' =>'1', 'status' =>'1', 'created_at' =>'2015-10-26 02:56:49', 'updated_at' =>'2016-01-04 11:12:03'],
    ]);
    $this->command->info('users table seeded!');
  }

}