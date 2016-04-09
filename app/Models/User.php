<?php

namespace App\Models;
use Illuminate\Support\Facades\DB;
use App\Organization;
use Zizaco\Entrust\Traits\EntrustUserTrait;
use Illuminate\Foundation\Auth\User as Authenticatable;


class User extends Authenticatable
{
    use EntrustUserTrait;

    protected $table = 'users';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'is_super',
        'organization_id',
        'real_name',
        'mobile',
        'desc',
        'status',
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function organization()
    {
        //Organization::
        return DB::table('organizations')->where("id", $this->organization_id)->first()->name;
//        return $this->hasOne('App\Organization', "id", "organization_id");
    }
}
