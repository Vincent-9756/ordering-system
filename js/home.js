let userId;

$('#home .userName').html('<img src="../images/avatar.jpg" class="layui-nav-img">' + getCookie('username'))

layui.use(['element', 'layer', 'carousel', 'form'], function () {
  element = layui.element;
  layer = layui.layer;
  carousel = layui.carousel;
  form = layui.form;

  // 图片轮播
  carousel.render({
    elem: '#test10',
    width: '778px',
    height: '440px',
    interval: 5000
  });

  //退出登录
  $('#logout').click(function () {
    $.ajax({
      type: "get",
      url: url + port + "/client/logout",
      xhrFields: {
        withCredentials: true
      },
      success: function (res) {
        layer.msg('退出成功');
        setTimeout(() => {
          setCookie('username', "", -1);
          window.location.href = '../html/userLogin.html'
        }, 2000);
        $(this).removeClass('layui-this');
      }
    });
  });
});

//公告列表滚动
var timeId = setInterval(play, 3000);

function play() {
  $("#notict-list").animate({
      "marginTop": "-45px"
    },
    1000,
    function () {
      $(this).css({
        "marginTop": 0
      }).children("li:first").appendTo(this);
    });
}
$("#notict-listt").hover(function () {
  clearInterval(timeId);
}, function () {
  timeId = setInterval(play, 3000);
});

// 获取公告列表
$.ajax({
  type: "post",
  url: url + port + "/notice/queryNotice",
  dataType: "json",
  contentType: "application/json;charset=UTF-8",
  xhrFields: {
    withCredentials: true
  },
  data: JSON.stringify({}),
  success: function (res) {
    console.log(res)
    var data = '';
    for (let i = 0; i < res.data.length; i++) {
      data += '<li>' + res.data[i].title + '</li>'
      $('#notict-list').append(data)
    }
  }
});

// 获取用户基本信息
$('.detailMsg').click(function () {
  $.ajax({
    type: "get",
    url: url + port + "/client/getClient",
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
          '<div class="layui-form-item">' +
          '<label class="layui-form-label">地址</label>' +
          '<div class="layui-input-block">' +
          '<input id="detailAddress" type="text" name="username" lay-verify="title" autocomplete="off" class="layui-input">' +
          '</div>' +
          '</div>' +
          '</form>',
        btn: '保存',
        btnAlign: 'c',
        yes: function (index, layero) {
          $.ajax({
            type: "post",
            url: url + port + "/client/updateClientById",
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
              "address": $('#detailAddress').val(),
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
      $('#detailAddress').val(res.address);
    }
  });
});

//获取菜品
getCategoryMenu()

function getCategoryMenu() {
  var data = '';
  for (let index = 0; index < 8; index++) {
    data += '<span class="menu">小炒</span>'
  }
  $('.menuBox').empty().append(data);
}

// 切换菜品
$('.menuBox').on('click', '.menu', function () {
  $(this).addClass('selectMenu').siblings().removeClass('selectMenu')
});
$('.menuBox span').eq(0).click();

// 菜单分页
function changePage(el) {
  layui.use(['laypage', 'layer'], function () {
    var laypage = layui.laypage,
      layer = layui.layer;
    laypage.render({
      elem: el,
      count: 50,
      limit: 5,
      first: '首页',
      last: '尾页',
      prev: '<em>←</em>',
      next: '<em>→</em>',
      jump: function (obj, first) {
        // menuObj.pageNum = obj.curr;
        if (!first) {
          getMenu(1);
        }
      }
    });
  });
}

// 获取菜单
getMenu()

function getMenu(first) {
  if (!first) {
    changePage(pagetion);
  }
  var data = '';
  for (let index = 0; index < 50; index++) {
    data += '<a href="javascript:;" class="rstblock">\n' +
      '<div class="rstblock-logo">\n' +
      '<img\n' +
      'src="//fuss2.ele.me/6/1f/993fa328d94b957336b3191d8bee0jpeg.jpeg?imageMogr2/thumbnail/70x70/format/webp/quality/85"\n' +
      'alt="粤佬港式烧腊(万达店)" class="rstblock-logo-icon">\n' +
      '</div>\n' +
      '<div class="rstblock-content">\n' +
      '<div class="rstblock-title">粤佬港式烧腊(万达店)</div>\n' +
      '<div class="rstblock-activity">\n' +
      '<i style="background:#fff;color:#999999;border:1px solid;padding:0;">保</i>\n' +
      '<i style="background:#fff;color:#999999;border:1px solid;padding:0;">赔</i>\n' +
      '</div>\n' +
      '</div>\n' +
      '</a>'
  }
  $('.foodBox').empty().append(data);
  // $.ajax({
  //   type: "post",
  //   url: url + port + "/notice/queryNotice",
  //   dataType: "json",
  //   contentType: "application/json;charset=UTF-8",
  //   data: JSON.stringify(studentObj),
  //   success: function (res) {
  //     console.log(res)
  //     tableLength = res.total
  //     if (!first) {
  //       changePage(pagetion);
  //     }
  //     var data = '';
  //     for (let index = 0; index < res.data.length; index++) {
  //       data += '<tr>\n' +
  //         '<td>\n' +
  //         '<div>' + ((index + 1) + (studentObj.pageNum - 1) * 5) + '</div>\n' +
  //         '</td>\n' +
  //         '<td>\n' +
  //         '<div>' + res.data[index].title + '</div>\n' +
  //         '</td>\n' +
  //         '<td style="width:200px;">\n' +
  //         '<div style="width:200px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">' + res.data[index].context + '</div>\n' +
  //         '</td>\n' +
  //         '<td>\n' +
  //         '<div>' + res.data[index].createTime + '</div>\n' +
  //         '</td>\n' +
  //         '<td>\n' +
  //         '<div class="operate">\n' +
  //         '<span class="checkDetail" value="' + res.data[index].id + '">查看详情</span>\n' +
  //         '<span class="editStudent" value="' + res.data[index].id + '">编辑</span>\n' +
  //         '<span class="deleteStudent" value="' + res.data[index].id + '">删除</span>\n' +
  //         '</div>\n' +
  //         '</td>\n' +
  //         '</tr>\n'
  //     }
  //     $('#studentTable').empty().append(data);
  //   }
  // });
}

//获取菜单详情
$('body').on('click', '.rstblock', function () {
  $('.dialog').show();
  var data = '';
  data += '<div class="menu-pic">\n' +
    '<img\n' +
    'src="https://fuss2.ele.me/3/dd/2f6b7ac863f07f670f6f3897877a9jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/85"\n' +
    'alt="">\n' +
    '</div>\n' +
    '<div class="menu-detail">\n' + 
    '<div class="menu-detail-close">x</div>\n' +
    '<div class="menu-title">叉烧拼烤鸭饭配冻柠茶</div>\n' +
    '<div class="menu-main">叉烧根据本地口味特制，与广东口味有偏差，吃不惯勿拍 主要原料：鸭肉</div>\n' +
    '<div class="price-box">\n' +
    '<div class="menu-price">\n' +
    '<span class="yen">¥</span>\n' +
    '<span class="price">34.8</span>\n' +
    '</div>\n' +
    '<button class="menu-buy">加入购物车</button>\n' +
    '</div>' +
    '</div>'
  $('.menuDetail').empty().append(data);
});

$('body').on('click', '.dialog', function () {
  $(this).hide();
});

$('body').on('click','.menuDetail', function () {
  event.stopPropagation();
  return false;
});

$('body').on('click', '.menu-detail-close', function () {
  $('.dialog').hide();
});