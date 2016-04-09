@extends('layouts.admin-app')

@section('title', '添加用户组')

@section('description', '添加用户组')

@section('css')
@endsection

@section('include-search')
    <div class="am-cf am-padding">
        {!! Breadcrumbs::render('admin-role-create') !!}
    </div>
@endsection

@section('include-content')
    <div class="am-g">
        <div class="am-u-sm-12 am-u-md-8 am-u-sm-centered">
            <form class="am-form am-form-horizontal" action="{{ route('admin.role.store') }}" method="POST" data-am-validator>

                <div class="am-form-group">
                    <label for="role-name" class="am-u-sm-3 am-form-label zj-label">角色标识 *</label>
                    <div class="am-u-sm-9">
                        <input type="text" id="role-name" name="name" value="{{ old('name') }}" placeholder="角色标识" pattern="[a-zA-Z]" required>
                    </div>
                </div>

                <div class="am-form-group">
                    <label for="role-display-name" class="am-u-sm-3 am-form-label zj-label">显示名称 *</label>
                    <div class="am-u-sm-9">
                        <input type="text" id="role-display-name" name="display_name" value="{{ old('display_name') }}" placeholder="显示名称" required>
                    </div>
                </div>

                <div class="am-form-group">
                    <label for="role-description" class="am-u-sm-3 am-form-label zj-label">说明</label>
                    <div class="am-u-sm-9">
                        <input type="text" id="role-description" name="description" placeholder="说明" value="{{ old('description') }}">
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
@endsection

@section('include-js')
    <script src="{{ asset('refer/zTree/jquery.ztree.all-3.5.min.js') }}"></script>
    <script src="{{ asset('inc/ztree.js') }}"></script>
    <script src="{{ asset('inc/management.js') }}"></script>
    <script src="{{ asset('inc/admin/admin.js') }}"></script>
    <script src="{{ asset('inc/admin/user/user.js') }}"></script>
    <script src="{{ asset('inc/admin/user/create.js') }}"></script>
@endsection
