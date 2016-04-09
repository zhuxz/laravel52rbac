<?php

use Illuminate\Database\Seeder;
use App\Operation;

class OperationTableSeeder extends Seeder {

  public function run()
  {
    DB::table('operation')->truncate();
    DB::table('operation')->insert([
    	['name' =>'入库', 'order' =>'10', 'created_at' =>'2016-1-5 22:51:57', 'updated_at' =>'2016-1-5 22:51:57'],
		['name' =>'入分库', 'order' =>'20', 'created_at' =>'2016-1-5 22:51:57', 'updated_at' =>'2016-1-5 22:51:57'],
		['name' =>'验收', 'order' =>'30', 'created_at' =>'2016-1-5 22:51:57', 'updated_at' =>'2016-1-5 22:51:57'],
		['name' =>'验收确认', 'order' =>'40', 'created_at' =>'2016-1-5 22:51:57', 'updated_at' =>'2016-1-5 22:51:57'],
		['name' =>'出库', 'order' =>'50', 'created_at' =>'2016-1-5 22:51:57', 'updated_at' =>'2016-1-5 22:51:57'],
		['name' =>'领用', 'order' =>'60', 'created_at' =>'2016-1-5 22:51:57', 'updated_at' =>'2016-1-5 22:51:57'],
		['name' =>'调拨', 'order' =>'70', 'created_at' =>'2016-1-5 22:51:57', 'updated_at' =>'2016-1-5 22:51:57'],
		['name' =>'出库修改', 'order' =>'80', 'created_at' =>'2016-1-5 22:51:57', 'updated_at' =>'2016-1-5 22:51:57'],
		['name' =>'出库撤销', 'order' =>'90', 'created_at' =>'2016-1-5 22:51:57', 'updated_at' =>'2016-1-5 22:51:57'],
    ]);
    $this->command->info('operation table seeded!');
  }
  
}