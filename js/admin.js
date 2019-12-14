let userId;
// 登录半小时后退出系统
setTimeout(() => {
  $.ajax({
    type: "get",
    url: url + port + "/employee/logout",
    success: function (res) {
      setCookie('username', "", -1);
      window.location.href = '../html/adminLogin.html'
    }
  });
}, 1800000);

$('#home .userName').html('<img src="../images/avatar.jpg" class="layui-nav-img">' + getCookie('username'))

layui.use(['element', 'layer'], function () {
  element = layui.element;
  layer = layui.layer;

  //切换导航栏
  element.on('nav(test)', function (elem) {
    var event = event || window.event;
    if (event.preventDefault) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
    $('.contentShow').hide();
    if (elem[0].href.split('html/')[1] != '' && elem[0].href.split('html/')[1] != 'null' && elem[0].href.split('html/')[1] != null) {
      $('#changeIframes').attr('src', elem[0].href);
    }
    $('#iframeBox').css('height', '100%');
  });

  //退出登录
  $('#logout').click(function () {
    $.ajax({
      type: "get",
      url: url + port + "/employee/logout",
      success: function (res) {
        layer.msg('退出成功');
        setTimeout(() => {
          setCookie('username', "", -1);
          window.location.href = '../html/adminLogin.html'
        }, 2000);
        $(this).removeClass('layui-this');
      }
    });
  });
});

// 展开收缩导航栏
$('#sideNav-hide').click(function () {
  if ($(this).is('.nav-shrink')) {
    $(this).removeClass('nav-shrink');
    $('.layui-side').animate({
      width: '220px'
    }, 1000);
    $('.layui-layout-left,.layui-body,.layui-layout-admin .layui-footer').css('left', '220px');
    $(this).children().first().html('<i class="layui-icon layui-icon-shrink-right"></i>');
  } else {
    $(this).addClass('nav-shrink');
    $('.layui-side').animate({
      width: '54px'
    }, 1000);
    $('.layui-layout-left,.layui-body,.layui-layout-admin .layui-footer').css('left', '54px');
    $(this).children().first().html('<i class="layui-icon layui-icon-spread-left"></i>');
  }
});

$('.detailMsg').click(function () {
  $.ajax({
    type: "get",
    url: url + port + "/employee/getEmployee",
    xhrFields: {
      withCredentials: true
    },
    success: function (res) {
      console.log(res)
      userId = res.id;
      layer.open({
        title: '基本信息',
        content: '<form class="layui-form" action="" lay-filter="example">' +
          '<div class="layui-form-item">' +
          '<label class="layui-form-label">用户名</label>' +
          '<div class="layui-input-block">' +
          '<input id="detailUsername" type="text" name="username" lay-verify="title" autocomplete="off" class="layui-input">' +
          '</div>' +
          '</div>' +
          '<div class="layui-form-item">' +
          '<label class="layui-form-label">密码</label>' +
          '<div class="layui-input-block">' +
          '<input id="detailPassword" type="password" name="password" lay-verify="title" autocomplete="new-password" class="layui-input">' +
          '</div>' +
          '</div>' +
          '<div class="layui-form-item">' +
          '<label class="layui-form-label">姓名</label>' +
          '<div class="layui-input-block">' +
          '<input id="detailName" type="text" name="username" lay-verify="title" autocomplete="off" class="layui-input">' +
          '</div>' +
          '</div>' +
          '<div class="layui-form-item">' +
          '<label class="layui-form-label">电话</label>' +
          '<div class="layui-input-block">' +
          '<input id="detailTel" type="text" name="username" lay-verify="title" autocomplete="off" class="layui-input">' +
          '</div>' +
          '</div>' +
          '</form>',
        btn: '保存',
        btnAlign: 'c',
        yes: function (index, layero) {
          $.ajax({
            type: "post",
            url: url + port + "/employee/updateEmployeeById",
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            xhrFields: {
              withCredentials: true
            },
            data: JSON.stringify({
              "id": userId,
              "account": $('#detailUsername').val(),
              "pwd": $('#detailPassword').val(),
              "name": $('#detailName').val(),
              "tel": $('#detailTel').val(),
            }),
            xhrFields: {
              withCredentials: true
            },
            success: function () {
              layer.msg('修改成功');
              setCookie('username', $('#detailUsername').val(), 30);
              $('#home .userName').html('<img src="../images/avatar.jpg" class="layui-nav-img">' + $('#detailUsername').val());
            }
          });
        },
        cancel: function () {
          //右上角关闭回调

          //return false 开启该代码可禁止点击该按钮关闭
        }
      });
      $('#detailUsername').val(res.account);
      $('#detailPassword').val(res.pwd);
      $('#detailName').val(res.name);
      $('#detailTel').val(res.tel);
    }
  });
})