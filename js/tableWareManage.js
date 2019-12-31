let healthPic;
if ($('.picBox').children().length == 0) {
  $('.testPic').show()
  $('.picBox').hide()
} else {
  $('.testPic').hide()
  $('.picBox').show()
}
layui.use(['layer', 'upload'], function () {
  layer = layui.layer;
  upload = layui.upload;

  // 上传合格证
  upload.render({
    elem: '#test8',
    url: url + port + '/file/uploadFile',
    auto: false,
    multiple: true,
    bindAction: '#test9',
    choose: function (obj) {
      //将每次选择的文件追加到文件队列
      var files = obj.pushFile();

      //预读本地文件，如果是多文件，则会遍历。(不支持ie8/9)
      obj.preview(function (index, file, result) {
        console.log(index); //得到文件索引
        console.log(file); //得到文件对象
        $('.testPic img').attr('src','../images/' + file.name)
        console.log(result); //得到文件base64编码，比如图片

        //obj.resetFile(index, file, '123.jpg'); //重命名文件名，layui 2.3.0 开始新增

        //这里还可以做一些 append 文件列表 DOM 的操作

        //obj.upload(index, file); //对上传失败的单个文件重新上传，一般在某个事件中使用
        //delete files[index]; //删除列表中对应的文件，一般在某个事件中使用
      });
    },
    done: function (res) {
      console.log(res)
      healthPic = res.data
      console.log(healthPic)
      // $.ajax({
      //   type: "post",
      //   url: url + port + "/tablewear/addTablewear",
      //   dataType: "json",
      //   contentType: "application/json;charset=UTF-8",
      //   data: JSON.stringify({
      //     "checkPic": healthPic 
      //   }),
      //   success: function (res) {
      //     layer.msg('添加成功');
      //     $('.picBox').empty();
      //     getPic();
      //   }
      // });
    }
  });

  $('')

  //删除合格证
  $('body').on('click', '.delPic', function () {
    $.ajax({
      type: "get",
      url: url + port + "/tablewear/delTablewearById",
      data: {
        id: $(this).attr('value')
      },
      success: function () {
        layer.msg('删除成功');
        $('.picBox').empty();
        getPic();
      }
    });
  });
});

// 查找合格证
getPic();

function getPic() {
  $.ajax({
    type: "post",
    url: url + port + "/tablewear/queryTablewear",
    dataType: "json",
    contentType: "application/json;charset=UTF-8",
    data: JSON.stringify({}),
    success: function (res) {
      console.log(res)
      let data = ''
      for (let i = 0; i < res.data.length; i++) {
        data += '<div class="onePicBox">' +
          '<img class="checkPic" src="http://192.168.31.215:8080' + res.data[i].checkPic + '" alt="">' +
          '<span class="delPic" value="' + res.data[i].id + '">x</span>' +
          '</div>'
      }
      $('.picBox').append(data)
    }
  });
}