<!doctype html>
<html class="no-js">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>@yield('title')</title>
    <meta name="description" content="@yield('description')">
    <meta name="keywords" content="index">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="renderer" content="webkit">
    <meta http-equiv="pragma" content="no-cache" />
    <meta http-equiv="Cache-Control" content="no-cache" />
    <link rel="icon" type="image/png" href="{{ asset('assets/i/favicon.png') }}">
    <link rel="apple-touch-icon-precomposed" href="assets/i/app-icon72x72@2x.png">
    <meta name="apple-mobile-web-app-title" content="Amaze UI" />
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    @section('css-common')
        <link rel="stylesheet" href="{{ asset('/assets/css/amazeui.css') }}"/>
        <link rel="stylesheet" href="{{ asset('/assets/css/amazeui.datatables.css') }}"/>
        <link rel="stylesheet" href="{{ asset('/assets/css/admin.css') }}">
        <link rel="stylesheet" href="../../{{Config::get('app.product')}}/zj.css">
    @show
    @section('css')
    @show
</head>

<body>
<!--[if lte IE 9]>
<p class="browsehappy">你正在使用<strong>过时</strong>的浏览器，系统暂不支持。 请 <a href="http://browsehappy.com/" target="_blank">升级浏览器</a>
    以获得更好的体验！</p>
<![endif]-->

<header class="am-topbar am-topbar-fixed-top admin-header" style="display: none;">
    <div class="am-topbar-brand">
        <img src="{{ asset('assets/images/logo1.png') }}" alt=""> <small>IT设备管理系统</small>
    </div>

    <button class="am-topbar-btn am-topbar-toggle am-btn am-btn-sm am-btn-success am-show-sm-only" data-am-collapse="{target: '#topbar-collapse'}"><span class="am-sr-only">导航切换</span> <span class="am-icon-bars"></span></button>

    <div class="am-collapse am-topbar-collapse" id="topbar-collapse">

        <ul class="am-nav am-nav-pills am-topbar-nav am-topbar-right admin-header-list">
            <li class="am-dropdown" data-am-dropdown>
                <a class="am-dropdown-toggle" data-am-dropdown-toggle href="javascript:;">
                    <span class="am-icon-users"></span> {{ Auth::guard('admin')->user()->real_name }} <span class="am-icon-caret-down"></span>
                </a>
                <ul class="am-dropdown-content">
                    <li><a href="user" target="_blank"><span class="am-icon-user"></span> 资料</a></li>
                    <li><a href="#"><span class="am-icon-cog"></span> 设置</a></li>
                    <li><a href="{{ url('admin/logout ') }}"><span class="am-icon-power-off"></span> 退出</a></li>
                </ul>
            </li>
            <li class="am-hide-sm-only"><a href="javascript:;" id="admin-fullscreen"><span class="am-icon-arrows-alt"></span> <span class="admin-fullText">开启全屏</span></a></li>
        </ul>
    </div>
</header>

<div class="am-cf admin-main" style="display: none;">
    <!-- sidebar start -->
    @inject('permissionPresenter','App\Presenters\PermissionPresenter')
    {!! $permissionPresenter->adminMenus() !!}
    <!-- sidebar end -->

    <!-- content start -->
    <div class="admin-content">
        {{--<div class="am-cf am-padding">--}}
            {{--<div class="am-fl am-cf"><strong class="am-text-primary am-text-lg">首页</strong> / <small>一些常用模块</small></div>--}}
        {{--</div>--}}
        @section('include-search')
            <div class="am-g">
                <form class="am-form zj-form" onsubmit="return false;">
                    <ul class="am-avg-sm-1 am-avg-sm-2 am-avg-md-4 am-avg-lg-6 search_block">
                        <li>
                            <div class="am-form-group am-form-group-search am-form-group-sm">
                                <label class="am-form-label zj-label" for="contract_code">合同编号</label>
                                <input type="text" name="contract_code" class="am-form-field am-input-sm" id="contract_code" placeholder="输入合同编号" contract_code />
                            </div>
                        </li>
                        <li>
                            <div class="am-form-group am-form-group-search am-form-group-sm">
                                <label class="am-form-label zj-label" for="contract_code">购置起始日期</label>
                                <input type="text" name="in_time_start" class="am-form-field am-input-sm" value="{{date('Y-m-d', strtotime('-3 Months'))}}" placeholder="购置起始日期" title="购置起始日期" data-am-datepicker readonly in_time_start />
                            </div>
                        </li>
                        <li>
                            <div class="am-form-group am-form-group-search am-form-group-sm">
                                <label class="am-form-label zj-label" for="contract_code">购置结束日期</label>
                                <input type="text" name="in_time_end" class="am-form-field am-input-sm" value="{{date('Y-m-d', strtotime('+3 Months'))}}" placeholder="购置结束日期" title="购置结束日期" data-am-datepicker readonly in_time_end />
                            </div>
                        </li>
                        <li>
                            <div class="am-form-group am-form-group-search am-form-group-sm">
                                <label class="am-form-label zj-label" for="contract_code">&nbsp;</label>
                                <a class="am-btn am-btn-danger" href="http://www.bing.com" target="_blank">应用按钮样式的链接</a>
                                {{--<a type="button" name="contract_code" class="am-form-field am-input-sm search_btn" id="contract_code" contract_code></a>--}}
                                {{--<button type='submit' class='am-btn am-btn-primary am-btn-xs search_btn'>查询</button>--}}
                            </div>
                        </li>
                    </ul>
                </form>
            </div>
        @show

        @section('include-content')
        @show

    </div>
    <!-- content end -->

</div>

<a href="#" class="am-show-sm-only admin-menu" data-am-offcanvas="{target: '#admin-offcanvas'}">
    <span class="am-icon-btn am-icon-th-list"></span>
</a>

<footer data-am-widget="footer"
        class="am-footer am-footer-default"
        data-am-footer="{  }"
        style="display: none;">
    <hr>
    <p class="am-padding-left">© 2015安徽中杰计算机设备管理系统-V1.0 &nbsp;&nbsp;&nbsp;&nbsp;电话：0551-63624995-8808.</p>
</footer>

@section('loading')
@include('layouts.loading')
@show

<!--[if lt IE 9]>
<script src="{{ asset('assets/js/1.11.1/jquery.min.js') }}"></script>
<script src="{{ asset('assets/js/modernizr.js') }}"></script>
<script src="{{ asset('assets/js/amazeui.ie8polyfill.min.js') }}"></script>
<![endif]-->

<!--[if (gte IE 9)|!(IE)]><!-->
<script src="{{ asset('assets/js/jquery.min.js') }}"></script>
<!--<![endif]-->
<script src="{{ asset('assets/js/amazeui.min.js') }}"></script>
<script src="{{ asset('assets/js/app.js') }}"></script>

@section('include-js-dataTable')
    <script src="{{ asset('/assets/js/amazeui.datatables.min.js') }}"></script>
@show

@section('include-js-common')
    <script src="{{ asset('inc/u-functions.js') }}"></script>
    <script src="{{ asset('inc/functions.js') }}"></script>
    <script src="{{ asset('inc/log.js') }}"></script>
    <script src="{{ asset('inc/cache.js') }}"></script>
@show

@section('include-js')
    <script src="{{ asset('inc/ztree.js') }}"></script>
    <script src="{{ asset('inc/management.js') }}"></script>
@show
</body>
</html>

@section('documentReady')
    <script type="text/javascript">
        $(document).ready( function () {
            thisMgr().initialize();
            return true;
        });
    </script>

    {!! Toastr::render() !!}
@show