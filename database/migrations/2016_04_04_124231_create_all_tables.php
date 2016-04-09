<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;


class CreateAllTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('organizations', function(Blueprint $table){
            $table->engine = 'InnoDB';
            $table->increments('id');

            $table->integer('father_id')->default(0);
            $table->string('name', 64);
            $table->string('code', 64);
            $table->string('director', 32);
            $table->string('mobile', 32);
            $table->integer('status')->default(1);
            $table->integer('order')->default(1);

            $table->timestamps();
        });

        Schema::Create('storage', function(Blueprint $table){
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->integer('father_id')->default(0);

            $table->string('name', 64);
            $table->string('code', 64);
            $table->string('director', 32);
            $table->string('mobile', 32);
            $table->integer('organization_id');
            $table->string('order')->default(1);
            $table->integer('status')->default(1);

//            $table->foreign('organization_id')->references('id')->on('organizations')
            //              ->onUpdate('cascade')->onDelete('cascade');
        });

        Schema::Create('modules', function(Blueprint $table){
            $table->engine = 'InnoDB';
            $table->increments('id');

            $table->string('name', 64);
            $table->string('link', 128);
            $table->string('desc', 64);
            $table->string('order')->default(1);
            $table->integer('status')->default(1);

            $table->timestamps();
        });

        Schema::Create('menus', function(Blueprint $table){
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->integer('father_id')->default(0);

            $table->string('name', 64);
            $table->string('link', 128);
            $table->string('desc', 64);
            $table->integer('module_id');
            $table->string('order')->default(1);
            $table->integer('status')->default(1);
            $table->timestamps();

//            $table->foreign('module_id')->references('id')->on('modules')
//                ->onUpdate('cascade')->onDelete('cascade');
        });

        Schema::Create('menu_permission', function(Blueprint $table){
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->integer('permission_id');
            $table->integer('module_id');
            $table->integer('menu_id');

            $table->integer('status')->default(1);
            $table->timestamps();

//            $table->foreign('module_id')->references('id')->on('modules')
//                ->onUpdate('cascade')->onDelete('cascade');
//            $table->foreign('menu_id')->references('id')->on('menus')
//                ->onUpdate('cascade')->onDelete('cascade');
//            $table->foreign('permission_id')->references('id')->on('permissions')
//                ->onUpdate('cascade')->onDelete('cascade');
//
        });

        Schema::Create('asset_unit', function(Blueprint $table){
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('name', 64);
            $table->integer('status')->default(1);
            $table->timestamps();
        });

        Schema::Create('asset_suppliers', function(Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('name', 128);
            $table->integer('status')->default(1);
            $table->timestamps();
        });

        Schema::Create('asset_contracts', function(Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('name', 128);
            $table->string('code', 64);
            $table->timestamp('sign_up');
            $table->string('desc', 128);
            $table->string('file_link',128);
            $table->integer('status')->default(1);
            $table->timestamps();
        });

        Schema::Create('asset_kinds', function(Blueprint $table){
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->integer('father_id')->default(0);
            $table->string('name', 128);
            $table->integer('status')->default(1);
            $table->timestamps();
        });

        Schema::Create('asset_brand', function(Blueprint $table){
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->integer('father_id')->default(0);
            $table->string('name', 128);
            $table->integer('status')->default(1);
            $table->timestamps();
        });

        Schema::Create('asset_models', function(Blueprint $table){
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->integer('brand_id');
            $table->string('name', 128);
            $table->integer('status')->default(1);
            $table->timestamps();
        });

        Schema::Create('asset_category', function(Blueprint $table){
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->integer('father_id')->default(0);
            $table->string('name', 128);
            $table->integer('status')->default(1);
            $table->timestamps();
        });

        Schema::Create('asset_source', function(Blueprint $table){
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->integer('father_id')->default(0);
            $table->string('name', 128);
            $table->integer('status')->default(1);
            $table->timestamps();
        });

        Schema::Create('assets', function(Blueprint $table){
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->integer('father_id')->default(0);

            //�����
            $table->string('in_code', 32);
            $table->integer('in_code_id');

            //�ʲ�����
            $table->integer('kind_id');
            //Ʒ��
            $table->integer('brand_id');
            //�ͺ�
            $table->string('model',32);
            //��ͬ���
            $table->string('contract_code', 64);
            //��Ӧ��
            $table->string('supplier', 128);
            //����
            $table->timestamp('maintain_start');
            $table->timestamp('maintain_stop');
            //�ʲ�����
            $table->integer('category_id');
            $table->integer('source_id');
            //�豸���
            $table->string('code', 64);
            //�ʲ����(������)
            $table->string('financial_code', 64);
            //�ʲ����к�
            $table->string('serials_code', 64);

            $table->timestamp('in_time');

            $table->integer('quantity');
            $table->double('price');
            $table->integer('unit_id');
            $table->integer("storage_id");
            $table->integer('organization_id');

            $table->integer('user_id');
            //��׼����
            $table->string('desc', 256);
            $table->integer('operate_user_id');
            //�ʲ���;
            $table->integer('purpose');

            //��ֿ�
            $table->integer('branch')->default(0);
            //����
            $table->integer('accept')->default(0);
            //����ȷ��
            $table->integer('accept_submit')->default(0);
            //����|����
            $table->integer('allot')->default(0);
            //����
            $table->integer('receive')->default(0);
            //����
            $table->integer('pool_allot')->default(0);
            //����ȷ��
            $table->integer('pool_allot_submit')->default(0);

            $table->string('accept_scan_path', 255);
            //������
            $table->string('receive_user', 128);

            $table->string('name', 128);
            $table->integer('status')->default(1);
            $table->timestamps();
        });

        Schema::Create('operation', function(Blueprint $table){
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('name');
            $table->integer('order')->default(0);
            $table->integer('status')->default(1);
            $table->timestamps();
        });

        Schema::Create('asset_operations', function(Blueprint $table){
            $table->engine = 'InnoDB';
            $table->increments('id');
            //�ڲ���ˮ��
            $table->string('operation_no', 32);
            //��������
            $table->integer('operation_id');
            $table->string('operation_code', 64);
            $table->string('in_code'); //�����Ψһ
            $table->integer('in_code_id');
            //����
            $table->integer('quantity');


            $table->integer('from_organization_id');
            $table->integer('to_organization_id');

            $table->integer('from_storage_id');
            $table->integer('to_storage_id');
            $table->integer('from_user_id');
            $table->integer('to_user_id');

            $table->integer('operate_user_id');

            $table->string('desc', 128);

            //��Ч����
            $table->timestamp('begin_at');
            //ʧЧ����
            $table->timestamp('end_at');


            $table->string('name', 128);
            $table->integer('status')->default(1);
            $table->timestamps();
        });

        Schema::create('employees', function(Blueprint $table){
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('name', 255);
            $table->integer('status')->default(1);
            $table->timestamps();
        });

        Schema::Create('asset_purposes', function(Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('name', 128);
            $table->integer('status')->default(1);
            $table->timestamps();
        });

        Schema::create('in_codes', function(Blueprint $table){
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('code', 128)->unique();

            $table->timestamps();
        });

        Schema::create('asset_operation', function (Blueprint $table) {
            $table->integer('asset_id')->unsigned();
            $table->integer('operation_id')->unsigned();

            $table->foreign('asset_id')->references('id')->on('assets')
                ->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('operation_id')->references('id')->on('asset_operations')
                ->onUpdate('cascade')->onDelete('cascade');

            $table->primary(['asset_id', 'operation_id']);
        });

        Schema::create('asset_pool_allots', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');

            $table->timestamp('begin_date');
            $table->timestamp('end_date');
            $table->integer('asset_operation_id')->default(0);
            $table->integer('organization_id')->default(0);
            $table->string('desc', 255);
            $table->string('report', 512);
            $table->timestamp('report_date');
            $table->string('scanned', 512);
            $table->timestamp('upload_date');
            $table->integer('status')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('menu_permission');
        Schema::dropIfExists('asset_category');

        Schema::dropIfExists('organizations');
        Schema::dropIfExists('storage');

        Schema::dropIfExists('modules');
        Schema::dropIfExists('menus');

        Schema::dropIfExists('asset_unit');
        Schema::dropIfExists('asset_suppliers');
        Schema::dropIfExists('asset_contracts');
        Schema::dropIfExists('asset_kinds');
        Schema::dropIfExists('asset_brand');
        Schema::dropIfExists('asset_models');
        Schema::dropIfExists('asset_source');

        Schema::dropIfExists('asset_operation');

        Schema::dropIfExists('assets');
        Schema::dropIfExists('operation');
        Schema::dropIfExists('asset_operations');

        Schema::dropIfExists('employees');
        Schema::dropIfExists('asset_purposes');
        Schema::dropIfExists('in_codes');
        Schema::dropIfExists('asset_pool_allots');
    }
}