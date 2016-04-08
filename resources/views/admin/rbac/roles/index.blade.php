@extends('layouts.admin-app')

@section('title', '用户组管理')

@section('description', '用户组管理')

@section('css')
    <link rel="stylesheet" href="../refer/zTree/zTreeStyle/zTreeStyle.css">
@endsection

@section('include-search')
    <div class="am-cf am-padding">
        {!! Breadcrumbs::render('admin-role-index') !!}
    </div>
@endsection

@section('include-content')
    <div class="am-g">
        <div class="am-u-lg-12 am-scrollable-horizontal" id="divContainer">
            <table id='tblList' width='100%' table-layout='fixed' class='am-table am-table-striped am-text-nowrap zj-table'>
                <thead>
                <tr>
                    <th>序号</th>
                    <th>标识</th>
                    <th>用户组名称</th>
                    <th>说明</th>
                    <th>创建时间</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                @foreach($roles as $role)
                    <tr>
                        <td>{{ $role->id }}</td>
                        <td>{{ $role->name }}</td>
                        <td>{{ $role->display_name }}</td>
                        <td>{{ $role->description }}</td>
                        <td>{{ $role->created_at }}</td>
                        <td>
                            <a title="编辑" class="am-btn" href="{{ route('admin.role.edit',['id'=>$role->id]) }}">
                                <i class="am-icon-pencil-square-o"></i>
                            </a>
                            <a title="权限" class="am-btn" href="{{ route('admin.role.permissions',['id'=>$role->id]) }}">
                                <i class="am-icon-wrench"></i>
                            </a>
                            <a title="删除" class="am-btn" href="{{ route('admin.role.destroy',['id'=>$role->id]) }}">
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
        <a href="javascript:void(0)" btnadd>
            <img src="../assets/images/add_account.png" alt="">
        </a>
    </p>
@endsection

@section('include-js')
    <script src="../refer/zTree/jquery.ztree.all-3.5.min.js"></script>
    <script src="../inc/ztree.js"></script>
    <script src="../inc/management.js"></script>
    <script src="../js/management_account.js"></script>
@endsection