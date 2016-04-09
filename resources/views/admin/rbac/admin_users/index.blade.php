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
                            @if ($user->id > 1)
                            <a title="删除" class="am-btn" href="javascript:void(0);" url="{{ route('admin.user.destroy',['id'=>$user->id]) }}" btndel>
                                <i class="am-icon-trash-o"></i>
                            </a>
                            @endif
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

    <!--删除模态框开始-->
    <div class="am-modal am-modal-confirm" tabindex="-1" id="mdlDel">
        <div class="am-modal-dialog">
            <!--<div class="am-modal-hd">Amaze UI</div>-->
            <div class="am-modal-bd">
                <input type="hidden" name="id" value="">
                确定要删除这条记录吗？
            </div>
            <div class="am-modal-footer">
                <span class="am-modal-btn" data-am-modal-cancel>取消</span>
                <span class="am-modal-btn" data-am-modal-confirm>确定</span>
            </div>
        </div>
    </div>
    <!--删除模态框结束-->
@endsection

@section('include-js')
    <script src="../refer/zTree/jquery.ztree.all-3.5.min.js"></script>
    <script src="../inc/ztree.js"></script>
    <script src="../inc/management.js"></script>
    <script src="../inc/admin/admin.js"></script>
    <script src="../inc/admin/user/user.js"></script>
    <script src="../inc/admin/user/index.js"></script>
@endsection