<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title>登录</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="format-detection" content="telephone=no">
    <meta name="renderer" content="webkit">
    <meta http-equiv="Cache-Control" content="no-siteapp" />
    <link rel="alternate icon" type="image/png" href="../assets/i/favicon.png">
    <link rel="stylesheet" href="../assets/css/amazeui.min.css"/>
    <style>
        .header {
            text-align: center;
        }
        .header h1 {
            font-size: 200%;
            color: #333;
            margin-top: 30px;
        }
        .header p {
            font-size: 14px;
        }
    </style>
</head>
<body>
<div class="header">
    <div class="am-g">
        <h1><img src="../assets/images/logo1.png" alt=""> IT设备管理系统 - 权限管理</h1>
    </div>
    <hr />
</div>

@yield('content')

<footer data-am-widget="footer"
        class="am-footer am-footer-default"
        data-am-footer="{  }">
    <hr>
    <p class="am-padding-left">© 2015安徽中杰计算机设备管理系统-V1.0 &nbsp;&nbsp;&nbsp;&nbsp;电话：0551-63624995-8808.</p>
</footer>

</body>
</html>
