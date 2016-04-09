@extends('layouts.admin-app')

@section('title', '添加用户')

@section('description', '添加用户')

@section('css')
    <link rel="stylesheet" href="{{ asset('refer/zTree/zTreeStyle/zTreeStyle.css') }}">
@endsection

@section('include-search')
    <div class="am-cf am-padding">
        {!! Breadcrumbs::render('admin-user-create') !!}
    </div>
@endsection

@section('include-content')
    <div class="am-g">
        <div class="am-u-sm-12 am-u-md-8 am-u-sm-centered">
            <form class="am-form am-form-horizontal" action="{{ route('admin.user.store') }}" method="POST" data-am-validator>
                <div class="am-form-group">
                    <label for="user-name" class="am-u-sm-3 am-form-label zj-label">所属用户组</label>
                    <div class="am-u-sm-9">
                        @inject('rolePresenter','App\Presenters\RolePresenter')
                        {!! $rolePresenter->rolesCheckbox() !!}
                    </div>
                </div>

                <div class="am-form-group">
                    <label for="user-name" class="am-u-sm-3 am-form-label zj-label">用户名 *</label>
                    <div class="am-u-sm-9">
                        <input type="text" id="user-name" name="name" value="{{ old('name') }}" placeholder="用户名" onchange="$(this).next().val(this.value)" required>
                        <input type="hidden" name="email">
                    </div>
                </div>

                <div class="am-form-group">
                    <label for="user-password" class="am-u-sm-3 am-form-label zj-label">密码 *</label>
                    <div class="am-u-sm-9">
                        <input type="password" id="user-password" name="password" placeholder="密码 - 默认值：000000" required>
                    </div>
                </div>

                <div class="am-form-group">
                    <label for="user-organization" class="am-u-sm-3 am-form-label zj-label">机构 *</label>
                    <div class="am-u-sm-9">
                        <input type="text" id="user-organization" name="user-organization" value="{{ old('user-organization') }}" placeholder="机构" readonly required>
                        <input type="hidden" id="organization_id" name="organization_id" value="{{ old('organization_id') }}">
                    </div>
                </div>

                <div class="am-form-group">
                    <label for="user-real-name" class="am-u-sm-3 am-form-label zj-label">真实姓名 *</label>
                    <div class="am-u-sm-9">
                        <input type="text" id="user-real-name" name="real_name" value="{{ old('real_name') }}" placeholder="真实姓名" required>
                    </div>
                </div>

                <div class="am-form-group">
                    <label for="user-mobile" class="am-u-sm-3 am-form-label zj-label">联系方式</label>
                    <div class="am-u-sm-9">
                        <input type="text" id="user-mobile" name="mobile" placeholder="联系方式" value="{{ old('mobile') }}" pattern="(\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$">
                    </div>
                </div>

                <div class="am-form-group">
                    <label for="user-is-super" class="am-u-sm-3 am-form-label zj-label">超级管理员</label>
                    <div class="am-u-sm-9">
                        <select id="user-is-super" name="is_super">
                            <option value="1" {{ old('is_super') == 1 ? 'selected':'' }}>是</option>
                            <option value="0" {{ old('is_super') == 0 ? 'selected':'' }}>否</option>
                        </select>
                        <span class="am-form-caret"></span>
                    </div>
                </div>

                <div class="am-form-group">
                    <div class="am-u-sm-9 am-u-sm-push-3">
                        <button type="submit" class="am-btn am-btn-primary">保存</button>
                    </div>
                </div>

                {{ csrf_field() }}
            </form>
        </div>
    </div>

    <div id="divOrgTree" class="menuContent" style="display:none; position: absolute; z-index: 1120; max-height: 600px;">
        <ul id="orgTree" class="ztree" style="margin-top:0; padding: 0.5em;background: #f0f6e4;border: 1px solid #617775;max-height: 400px;overflow:scroll"></ul>
    </div>
@endsection

@section('include-js')
    <script src="{{ asset('refer/zTree/jquery.ztree.all-3.5.min.js') }}"></script>
    <script src="{{ asset('inc/ztree.js') }}"></script>
    <script src="{{ asset('inc/management.js') }}"></script>
    <script src="{{ asset('inc/admin/admin.js') }}"></script>
    <script src="{{ asset('inc/admin/user/user.js') }}"></script>
    <script src="{{ asset('inc/admin/user/create.js') }}"></script>
@endsection