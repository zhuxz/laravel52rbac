@extends('layouts.admin-app')

@section('title', '用户管理')

@section('description', '用户管理')

@section('css')
    <link rel="stylesheet" href="../refer/zTree/zTreeStyle/zTreeStyle.css">
@endsection

@section('include-search')
    <div class="am-cf am-padding">
        {!! Breadcrumbs::render('admin-user-index') !!}
    </div>
@endsection

@section('include-content')
    <div class="am-g">
        <div class="am-u-lg-12 am-scrollable-horizontal" id="divContainer">
            <table id='tblList' width='100%' table-layout='fixed' class='am-table am-table-striped am-text-nowrap zj-table'>
                <thead>
                    <tr>
                        <th>序号</th>
                        <th>机构/部门名称</th>
                        <th>账号名称</th>
                        <th>真实名称</th>
                        <th>管理员</th>
                        <th>联系方式</th>
                        <th>用户组</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                @foreach($users as $user)
                    <tr>
                        <td>{{ $user->id }}</td>
                        <td>{{ $user->organization() }}</td>
                        <td>{{ $user->name }}</td>
                        <td>{{ $user->real_name }}</td>
                        <td>{!! $user->is_super ? '<span class="am-badge am-badge-danger am-radius">是</span>':'<span class="am-badge am-radius">否</span>' !!}</td>
                        <td>{{ $user->mobile }}</td>
                        <td>
                            @if($user->roles()->count())
                                @foreach($user->roles()->get() as $role)
                                    <span class="am-badge am-badge-secondary am-radius">{{ $role->display_name }}</span>
                                @endforeach
                            @else
                                <span class="am-badge am-radius">无</span>
                            @endif
                        </td>
                        <td>
                            <a title="编辑" class="am-btn" href="{{ route('admin.user.edit',['id'=>$user->id]) }}">
                                <i class="am-icon-pencil-square-o"></i>
                            </a>
                            <a title="删除" class="am-btn" href="{{ route('admin.user.destroy',['id'=>$user->id]) }}">
                                <i class="am-icon-trash-o"></i>
                            </a>
                        </td>
                    </tr>
                @endforeach
                </tbody>
            </table>
        </div>

    </div>

    <p style="text-align: center;">
        <a href="{{ route('admin.user.create') }}">
            <img src="../assets/images/add_account.png" alt="">
        </a>
    </p>

    <div id="menuContent" class="menuContent" style="display:none; position: absolute; z-index: 1120">
        <ul id="menuTree" class="ztree" style="margin-top:0; padding: 0.5em;height: 300px;background: #f0f6e4;border: 1px solid #617775;overflow:scroll;"></ul>
    </div>
@endsection

@section('include-js')
    <script src="../refer/zTree/jquery.ztree.all-3.5.min.js"></script>
    <script src="../inc/ztree.js"></script>
    <script src="../inc/management.js"></script>
    <script src="../js/management_account.js"></script>
@endsection