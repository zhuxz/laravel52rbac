@extends('layouts.auth')

@section('content')
    <div class="am-g">
        <div class="am-u-lg-6 am-u-md-8 am-u-sm-centered">
            <h3>登录</h3>
            <hr>

            <form method="post" class="am-form" role="form" action="{{ url('/login') }}">
                {!! csrf_field() !!}
                <div class="am-form-group{{ $errors->has('email') ? ' am-form-error' : '' }}">
                    <label for="user-name">邮箱：</label>
                    <input type="text" required="" placeholder="输入用户名" id="email" name="email" />
                    @if ($errors->has('email'))
                        <div class="am-alert am-alert-danger">{{ $errors->first('email') }}</div>
                    @endif
                </div>
                <div class="am-form-group{{ $errors->has('password') ? ' am-form-error' : '' }}">
                    <label for="password">密码:</label>
                    <input type="password" name="password" id="password" value="" />
                    @if ($errors->has('password'))
                        <div class="am-alert am-alert-danger">{{ $errors->first('password') }}</div>
                    @endif
                </div>
                <div class="am-checkbox">
                    <label>
                        <input type="checkbox" name="remember" /> 记住密码
                    </label>
                </div>
                <button type="submit" class="am-btn am-btn-primary am-btn-sm am-fl">登 录</button>
            </form>
        </div>
    </div>
@endsection