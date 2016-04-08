<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

abstract class Request extends FormRequest
{
    public function rules()
    {
        return [
            'name' => 'required|max:20|alpha_dash|unique:users,name',
            'password' => 'required|max:20',
        ];
    }
}
