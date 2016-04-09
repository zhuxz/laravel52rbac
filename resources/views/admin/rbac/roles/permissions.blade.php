@extends('layouts.admin-app')

@section('title', '编辑用户组')

@section('description', '编辑用户组')

@section('css')
    <link rel="stylesheet" href="{{asset('refer/zTree/zTreeStyle/zTreeStyle.css')}}">
@endsection

@section('include-search')
    <div class="am-cf am-padding">
        {!! Breadcrumbs::render('admin-role-permission') !!}
    </div>
@endsection

@section('include-content')
    <div class="am-g am-padding-left am-padding-right">
        <form action="{{ route('admin.role.permissions',['id'=>$role->id]) }}" method="post" id="role-permissions-form">
            <ul class="am-nav">
                <li class="">
                    <span class="panel-title">编辑[<b>{{ $role->display_name }}</b>]权限</span>
                    <hr style="margin: 4px 0" />
                </li>
                @foreach($permissions as $permission)
                    <li>
                        <div class="am-checkbox"><label>
                            @if(in_array($permission['id'],array_keys($rolePermissions)))
                                <input type="checkbox" name="permissions[]" value="{{ $permission['id'] }}" class="am-field-valid" checked/>
                            @else
                                <input type="checkbox" name="permissions[]" value="{{ $permission['id'] }}" class="am-field-valid"/>
                            @endif
                                &nbsp;&nbsp;{{ $permission['display_name'] }}
                        </label></div>
                        @if(count($permission['subPermission']))
                            <ul class="am-avg-sm-2 am-avg-md-3 am-avg-lg-6 am-thumbnails am-padding-left-lg am-padding-right-lg">
                                @foreach($permission['subPermission'] as $sub)
                                    <li>
                                        <div class="am-checkbox"><label>
                                            @if($sub['is_menu'])
                                            <input type="checkbox" name="permissions[]"
                                                   value="{{ $sub['id'] }}"
                                                   pid="{{ $permission['id'] }}"
                                                   class="sub-permission-checkbox" {{ in_array($sub['id'],array_keys($rolePermissions)) ? 'checked':'' }}/>&nbsp;&nbsp;
                                                <span class="am-icon-reorder"></span>{{ $sub['display_name'] }}
                                            @else
                                                <input type="checkbox" name="permissions[]"
                                                       value="{{ $sub['id'] }}"
                                                       pid="{{ $permission['id'] }}"
                                                       class="sub-permission-checkbox" {{ in_array($sub['id'],array_keys($rolePermissions)) ? 'checked':'' }}/>&nbsp;&nbsp;{{ $sub['display_name'] }}
                                            @endif
                                        </label></div>
                                    </li>
                                @endforeach
                            </ul>
                        @endif
                    </li>
                @endforeach
            </ul>
            {{ csrf_field() }}
            <div class="am-form-group">
                <div class="am-u-sm-9 am-u-sm-push-3">
                    <button type="submit" class="am-btn am-btn-primary">保存</button>
                </div>
            </div>
            {{--<div class="panel-footer">--}}
                {{--<div class="row">--}}
                    {{--<div class="col-sm-6 col-sm-offset-3">--}}
                        {{--<button class="btn btn-primary" id="save-role-permissions">保存</button>--}}
                    {{--</div>--}}
                {{--</div>--}}
            {{--</div><!-- panel-footer -->--}}
        </form>
    </div>
@endsection

@section('javascript')
    @parent
    <script src="{{ asset('js/ajax.js') }}"></script>
    <script>
        $(".display-sub-permission-toggle").toggle(function () {
            $(this).children('span').removeClass('glyphicon-minus').addClass('glyphicon-plus')
                    .parents('.top-permission').next('.sub-permissions').hide();
        }, function () {
            $(this).children('span').removeClass('glyphicon-plus').addClass('glyphicon-minus')
                    .parents('.top-permission').next('.sub-permissions').show();
        });

        $(".top-permission-checkbox").change(function () {
            $(this).parents('.top-permission').next('.sub-permissions').find('input').prop('checked', $(this).prop('checked'));
        });

        $(".sub-permission-checkbox").change(function () {
            if ($(this).prop('checked')) {
                $(this).parents('.sub-permissions').prev('.top-permission').find('.top-permission-checkbox').prop('checked', true);
            }
        });
    </script>
    <script type="text/javascript">
        $("#save-role-permissions").click(function (e) {
            e.preventDefault();
            Rbac.ajax.request({
                href: $("#role-permissions-form").attr('action'),
                data: $("#role-permissions-form").serialize(),
                successTitle: '角色权限保存成功'
            });
        });
    </script>
@endsection

@section('include-js')
    <script src="{{ asset('refer/zTree/jquery.ztree.all-3.5.min.js') }}"></script>
    <script src="{{ asset('inc/ztree.js') }}"></script>
    <script src="{{ asset('inc/management.js') }}"></script>
    <script src="{{ asset('inc/admin/admin.js') }}"></script>
    <script src="{{ asset('inc/admin/role/role.js') }}"></script>
    <script src="{{ asset('inc/admin/role/role-permission.js') }}"></script>
@endsection