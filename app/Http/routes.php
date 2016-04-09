<?php

/*
|--------------------------------------------------------------------------
| Routes File
|--------------------------------------------------------------------------
|
| Here is where you will register all of the routes in an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

//Route::get('/', function () {
//    return view('welcome');
//});

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| This route group applies the "web" middleware group to every route
| it contains. The "web" middleware group is defined in your HTTP
| kernel and includes session state, CSRF protection, and more.
|
*/

Route::group(['middleware' => 'web'], function () {
    Route::auth();

    Route::get('/', 'HomeController@index');
    Route::get('/home', 'HomeController@index');
});

//Route::get('/admin', Route::get('/', 'Admin\HomeController@index'));
//Route::get('/admin', 'Admin\AdminUserController@index');
//Route::get('/admin', function () {
////    return view('admin.welcome');
//    Route::get('/admin', 'Admin\AdminUserController@index');
//});

Route::group(['middleware' => ['web'], 'namespace' => 'Admin', 'prefix' => 'admin'], function () {
    Route::auth();

    Route::get('/', function () {
        return redirect()->route('admin.user.index');
    });
    //Route::get('/home', ['as' => 'admin.home', 'uses' => 'HomeController@index']);

    Route::get('/user/all', 'AdminUserController@all');
    Route::post('/user/{id}', 'AdminUserController@update');
    Route::resource('user', 'AdminUserController');
    Route::delete('admin/admin_user/destoryall',['as'=>'admin.admin_user.destory.all','uses'=>'AdminUserController@destoryAll']);

    Route::post('/role/{id}', 'RoleController@update');
    Route::resource('role', 'RoleController');
    Route::delete('admin/role/destoryall',['as'=>'admin.role.destory.all','uses'=>'RoleController@destoryAll']);
    Route::get('role/{id}/permissions',['as'=>'admin.role.permissions','uses'=>'RoleController@permissions']);
    Route::post('role/{id}/permissions',['as'=>'admin.role.permissions','uses'=>'RoleController@storePermissions']);

    Route::resource('permission', 'PermissionController');
    Route::delete('admin/permission/destoryall',['as'=>'admin.permission.destory.all','uses'=>'PermissionController@destoryAll']);

    Route::resource('parameter', 'ParameterController');
});



//Route::get('/error', function () {
//    return view('admin.errors.403');
//});

//Route::group(['middleware' => 'web'], function () {
//    Route::auth();
//
//    Route::get('/home', 'HomeController@index');
//});
