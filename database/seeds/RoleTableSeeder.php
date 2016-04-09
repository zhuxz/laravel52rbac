<?php

use Illuminate\Database\Seeder;

class RoleTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
//		DB::table('roles')->truncate();
		DB::table('roles')->insert([
			['id' =>'1', 'name' =>'sysmgr', 'display_name' =>'系统管理员', 'description' =>'系统管理员', 'created_at' =>'2015-12-01 16:37:03', 'updated_at' =>'2015-12-01 16:37:03'],
			['id' =>'2', 'name' =>'rootmgr', 'display_name' =>'省行管理员', 'description' =>'省行管理员', 'created_at' =>'2015-12-01 16:37:39', 'updated_at' =>'2015-12-01 16:37:39'],
			['id' =>'3', 'name' =>'branchmgr', 'display_name' =>'分行管理员', 'description' =>'分行管理员', 'created_at' =>'2015-12-01 16:37:41', 'updated_at' =>'2015-12-03 18:27:25'],
			['id' =>'4', 'name' =>'guest', 'display_name' =>'来宾', 'description' =>'来宾', 'created_at' =>'2015-12-01 16:37:41', 'updated_at' =>'2015-12-03 18:27:25'],
			['id' =>'5', 'name' =>'tester', 'display_name' =>'测试人员', 'description' =>'测试', 'created_at' =>'2015-12-01 16:37:25', 'updated_at' =>'2015-12-01 16:37:25'],
		]);
		$this->command->info('roles table seeded!');
    }
}
