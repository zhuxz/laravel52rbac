@extends('layouts.admin-app')

@section('title', '权限查看')

@section('description', '权限查看')

@section('css')
    <link rel="stylesheet" href="../refer/zTree/zTreeStyle/zTreeStyle.css">
@endsection

@section('include-search')
    <div class="am-cf am-padding">
        {!! Breadcrumbs::render('admin-permission-index') !!}
    </div>
@endsection

@section('include-content')
    <div class="am-g">
        <div class="am-u-lg-12 am-scrollable-horizontal" id="divContainer">
            <table id='tblList' width='100%' table-layout='fixed' class='am-table am-table-striped am-text-nowrap zj-table'>
                <thead>
                <tr>
                    <th>序号</th>
                    <th>显示名称</th>
                    <th>路由</th>
                    <th>说明</th>
                    <th>是否菜单</th>
                </tr>
                </thead>
                <tbody>
                @foreach($permissions as $permission)
                    <tr>
                        <td>{{ $permission->id }}</td>
                        <td>{{ $permission->display_name }}</td>
                        <td>{{ $permission->name }}</td>
                        <td>{{ $permission->description }}</td>
                        <td>
                            @if($permission->is_menu)
                                <span class="am-badge am-badge-secondary am-radius">是</span>
                            @else
                                <span class="am-badge am-radius">否</span>
                            @endif
                        </td>
                    </tr>
                @endforeach
                </tbody>
            </table>
        </div>

    </div>
@endsection

@section('include-js')
    <script src="../refer/zTree/jquery.ztree.all-3.5.min.js"></script>
    <script src="../inc/ztree.js"></script>
    <script src="../inc/management.js"></script>
    <script src="../js/management_account.js"></script>
@endsection
