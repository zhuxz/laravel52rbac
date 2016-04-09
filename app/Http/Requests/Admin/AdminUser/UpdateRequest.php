<?php

namespace App\Http\Requests\Admin\AdminUser;

use App\Http\Requests\Admin\Request;

class UpdateRequest extends Request
{

    public function rules()
    {
        return [
            'name' => 'required|max:20|alpha_dash',
            'password' => 'sometimes|max:20',
            'real_name' => 'required|max:128',
            'organization_id' => 'required|integer|min:1',
        ];
    }

    public function messages()
    {
        return [
            'name.required' => '用户名称必须填',
            'name.alpha_dash' => '用户仅允许字母、数字、破折号（-）以及底线（_）',
            'name.max' => '用户名称最多20个字符',
            'password.max' => '密码最多20个字符',
            'real_name.required' => '真实姓名必须填',
            'real_name.max' => '真实姓名最多128个字符',
            'organization_id.required' => '机构必须填',
            'organization_id.integer' => '机构必须填',
            'organization_id.min' => '机构必须填'
        ];
    }
}
