<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Illuminate\Database\Eloquent\Model::unguard();

        $this->call(PermissionTableSeeder::class);
        $this->call(RoleTableSeeder::class);
        $this->call(UserTableSeeder::class);
        $this->call(PermissionRoleTableSeeder::class);
        $this->call(RoleUserTableSeeder::class);
        $this->call(AssetKindTableSeeder::class);
        $this->call(AssetPurposeTableSeeder::class);
        $this->call(AssetUnitTableSeeder::class);
        $this->call(BrandTableSeeder::class);
        $this->call(OrganizationTableSeeder::class);
        $this->call(StorageTableSeeder::class);

        Illuminate\Database\Eloquent\Model::reguard();
    }
}
