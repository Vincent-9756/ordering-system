// 查找订单
getOrder();

function getOrder() {
  $.ajax({
    type: "post",
    url: url + port + "/order/queryOrder",
    dataType: "json",
    contentType: "application/json;charset=UTF-8",
    data: JSON.stringify({
      "clientid": Number(getCookie('userid')),
      "pageNum": null,
      "pageSize": null
    }),
    success: function (res) {
      console.log(res)
      let data = '';
      for (let i = 0; i < res.data.length; i++) {
        data += '<div class="orderBox" id="orderBox">'+
          '<div class="orderPic">' + res.data[i].clientName + '</div>'+
          '<div class="orderDetail">' + res.data[i].clientAddress + '</div>'+
          '<div class="order-price">'+
          '<span class="yen">￥</span>'+
          '<span class="price">' + res.data[i].totalPrice + '</span>'+
          '</div>'+
          '<div class="order-operate">'+
          '<span class="checkDetail" value="' + res.data[i].id + '">查看详情</span>'+
          '</div>'+
          '</div>'
      }
      $('#orderTotalBox').empty().append(data);
    }
  });
}

// 查看详细信息
$('body').on('click', '.checkDetail', function () {
  getDetail($(this).attr('value'));
  $('.wrrap').show();
});

$('.closeStudentBox').click(function () {
  $('.wrrap').hide();
});

// 输入框赋值
function getDetail(e) {
  $.ajax({
    type: "post",
    url: url + port + "/orderItem/queryOrderItem",
    dataType: "json",
    contentType: "application/json;charset=UTF-8",
    data: JSON.stringify({
      orderId: e
    }),
    success: function (res) {
      let data = '';
      for (let i = 0; i < res.data.length; i++) {
        data += '<div class="layui-form-item">' +
          '<label class="layui-form-label">菜名:</label>' +
          '<div class="layui-input-block">' +
          '<input class="layui-input dishName" value="' + res.data[i].dishName + '" type="text" name="username" lay-verify="title" autocomplete="off" readonly>' +
          '</div>' +
          '</div>' +
          '<div class="layui-form-item">' +
          '<label class="layui-form-label">数量:</label>' +
          '<div class="layui-input-block">' +
          '<input class="layui-input num" value="' + res.data[i].quantity + '" type="text" name="username" lay-verify="title" autocomplete="off" readonly>' +
          '</div>' +
          '</div>' +
          '<div class="layui-form-item">' +
          '<label class="layui-form-label">单价:</label>' +
          '<div class="layui-input-block">' +
          '<input class="layui-input price" value="' + res.data[i].price + '" type="text" name="username" lay-verify="title" autocomplete="off" readonly>' +
          '</div>' +
          '</div>'
      }
      $('#detailBox').empty().append(data);
    }
  });
}