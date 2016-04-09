@extends('layouts.admin-app')

@section('title', '编辑用户')

@section('description', '编辑用户')

@section('css')
    <link rel="stylesheet" href="{{ asset('refer/zTree/zTreeStyle/zTreeStyle.css') }}">
@endsection

@section('include-search')
    <div class="am-cf am-padding">
        {!! Breadcrumbs::render('admin-user-edit') !!}
    </div>
@endsection

@section('include-content')
	<div class="am-g">
        <div class="am-u-sm-12 am-u-md-8 am-u-sm-centered">
            <form class="am-form am-form-horizontal" action="{{ route('admin.user.update',['id'=>$user->id]) }}" method="POST" AUTOCOMPLETE="OFF" data-am-validator>
                <div class="am-form-group">
                    <label for="user-name" class="am-u-sm-3 am-form-label zj-label">所属用户组</label>
                    <div class="am-u-sm-9">
                        @inject('rolePresenter','App\Presenters\RolePresenter')
                        {!! $rolePresenter->rolesCheckbox($hasRoles) !!}
                    </div>
                </div>

                <div class="am-form-group">
                    <label for="user-name" class="am-u-sm-3 am-form-label zj-label">用户名 *</label>
                    <div class="am-u-sm-9">
                        <input type="text" id="user-name" name="name" value="{{ $user->name }}" placeholder="用户名" onchange="$(this).next().val(this.value)" required>
                        <input type="hidden" name="email" value="{{ $user->name }}">
                    </div>
                </div>

                <div class="am-form-group">
                    <label for="user-password" class="am-u-sm-3 am-form-label zj-label">密码 *</label>
                    <div class="am-u-sm-9">
                        <input type="password" id="user-password" name="password" value="" placeholder="不修改密码请留空"  AUTOCOMPLETE="OFF">
                    </div>
                </div>

                <div class="am-form-group">
                    <label for="user-organization" class="am-u-sm-3 am-form-label zj-label">机构 *</label>
                    <div class="am-u-sm-9">
                        <input type="text" id="user-organization" name="user-organization" value="{{ $user->organization() }}" placeholder="机构" readonly>
                        <input type="hidden" id="organization_id" name="organization_id" value="{{ $user->organization_id }}">
                    </div>
                </div>

                <div class="am-form-group">
                    <label for="user-real-name" class="am-u-sm-3 am-form-label zj-label">真实姓名 *</label>
                    <div class="am-u-sm-9">
                        <input type="text" id="user-real-name" name="real_name" value="{{ $user->real_name }}" placeholder="真实姓名" required>
                    </div>
                </div>

                <div class="am-form-group">
                    <label for="user-mobile" class="am-u-sm-3 am-form-label zj-label">联系方式</label>
                    <div class="am-u-sm-9">
                        <input type="text" id="user-mobile" name="mobile" placeholder="联系方式" value="{{ $user->mobile }}" pattern="(\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$">
                    </div>
                </div>

                <div class="am-form-group">
                    <label for="user-is-super" class="am-u-sm-3 am-form-label zj-label">超级管理员</label>
                    <div class="am-u-sm-9">
                        <select id="user-is-super" name="is_super" @if($user->id == 1) disabled @endif>
                            <option value="1" {{ $user->is_super == 1 ? 'selected':'' }}>是</option>
                            <option value="0" {{ $user->is_super == 0 ? 'selected':'' }}>否</option>
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
    
    {{--<div class="pageheader">--}}
        {{--<h2><i class="fa fa-home"></i> Dashboard <span>系统设置</span></h2>--}}
        {{--{!! Breadcrumbs::render('admin-user-edit') !!}--}}
    {{--</div>--}}

    {{--<div class="contentpanel panel-email">--}}

        {{--<div class="row">--}}

            {{--@include('admin._partials.rbac-left-menu')--}}

            {{--<div class="col-sm-9 col-lg-10">--}}

                {{--<div class="panel panel-default">--}}
                    {{--<div class="panel-heading">--}}
                        {{--<div class="panel-btns">--}}
                            {{--<a href="" class="panel-close">×</a>--}}
                            {{--<a href="" class="minimize">−</a>--}}
                        {{--</div>--}}
                        {{--<h4 class="panel-title">编辑用户</h4>--}}
                    {{--</div>--}}

                    {{--<form class="form-horizontal form-bordered" action="{{ route('admin.user.update',['id'=>$user->id]) }}" method="POST">--}}

                        {{--<div class="panel-body panel-body-nopadding">--}}
                            {{--<div class="form-group">--}}
                                {{--<label class="col-sm-3 control-label" for="checkbox">所属角色组</label>--}}
                                {{--<div class="col-sm-6">--}}
                                    {{--@inject('rolePresenter','App\Presenters\RolePresenter')--}}

                                    {{--{!! $rolePresenter->rolesCheckbox($hasRoles) !!}--}}
                                {{--</div>--}}
                            {{--</div>--}}

                            {{--<div class="form-group">--}}
                                {{--<label class="col-sm-3 control-label">用户名 <span class="asterisk">*</span></label>--}}

                                {{--<div class="col-sm-6">--}}
                                    {{--<input type="text"  data-toggle="tooltip" name="name"--}}
                                           {{--data-trigger="hover" class="form-control tooltips"--}}
                                           {{--data-original-title="不可重复" value="{{ $user->name }}">--}}
                                {{--</div>--}}
                            {{--</div>--}}

                            {{--<div class="form-group">--}}
                                {{--<label class="col-sm-3 control-label">邮箱 <span class="asterisk">*</span></label>--}}

                                {{--<div class="col-sm-6">--}}
                                    {{--<input type="text"  data-toggle="tooltip" name="email"--}}
                                           {{--data-trigger="hover" class="form-control tooltips"--}}
                                           {{--data-original-title="不可重复" value="{{ $user->email }}">--}}
                                {{--</div>--}}
                            {{--</div>--}}

                            {{--<div class="form-group">--}}
                                {{--<label class="col-sm-3 control-label">密码 <span class="asterisk">*</span></label>--}}

                                {{--<div class="col-sm-6">--}}
                                    {{--<input type="password"  data-toggle="tooltip" name="password"--}}
                                           {{--data-trigger="hover" class="form-control tooltips"--}}
                                           {{--placeholder="不修改密码请留空"--}}
                                           {{--data-original-title="请输入密码" >--}}
                                {{--</div>--}}
                            {{--</div>--}}

                            {{--<div class="form-group">--}}
                                {{--<label class="col-sm-3 control-label">超级管理员 <span class="asterisk"></span></label>--}}

                                {{--<div class="col-sm-2">--}}
                                    {{--<select class="form-control input-sm" name="is_super">--}}
                                        {{--<option value="1" {{ $user->is_super == 1 ? 'selected':'' }}>是</option>--}}
                                        {{--<option value="0" {{ $user->is_super == 0 ? 'selected':'' }}>否</option>--}}
                                    {{--</select>--}}
                                {{--</div>--}}
                            {{--</div>--}}

                            {{--<input type="hidden" name="_method" value="PUT">--}}
                            {{--{{ csrf_field() }}--}}
                        {{--</div><!-- panel-body -->--}}

                        {{--<div class="panel-footer">--}}
                            {{--<div class="row">--}}
                                {{--<div class="col-sm-6 col-sm-offset-3">--}}
                                    {{--<button class="btn btn-primary">保存</button>--}}
                                    {{--&nbsp;--}}
                                    {{--<button class="btn btn-default">取消</button>--}}
                                {{--</div>--}}
                            {{--</div>--}}
                        {{--</div><!-- panel-footer -->--}}

                    {{--</form>--}}
                {{--</div>--}}

            {{--</div><!-- col-sm-9 -->--}}

        {{--</div><!-- row -->--}}

    {{--</div>--}}
@endsection

@section('include-js')
    <script src="{{ asset('refer/zTree/jquery.ztree.all-3.5.min.js') }}"></script>
    <script src="{{ asset('inc/ztree.js') }}"></script>
    <script src="{{ asset('inc/management.js') }}"></script>
    <script src="{{ asset('inc/admin/admin.js') }}"></script>
    <script src="{{ asset('inc/admin/user/user.js') }}"></script>
    <script src="{{ asset('inc/admin/user/edit.js') }}"></script>
@endsection