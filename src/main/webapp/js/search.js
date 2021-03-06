﻿/*
 * 发送参数给负责转译的servlet
 */
function search() {
    var srcRegion = $('#srcRegion').val();
    var srcKeyWord = $('#srcKeyWord').val();
    var assKeyWord = $('#assKeyWord').val();
    var subHeading = $('#sub_heading').val();
    var knownHscode = $('#knownHscode').val();
    if((srcRegion === '')){
        alert('尚未开通该国的查询服务');
        return;
    }
    if (srcKeyWord.length === 0) {
    	alert('描述不能为空！');
        return;
    }
    console.log(srcRegion);
    console.log(assKeyWord);
    var data = {
        'srcRegion': srcRegion,
        'srcKeyWord': srcKeyWord,
        'assKeyWord': assKeyWord,
        'subHeading' : subHeading,
        'knownHscode' : knownHscode
    };
    $.ajax({
        cache: true,
        type: 'POST',
        url: '../../search-p',
        data: data,
        async: true,
        error: function () {
            console.log('ajax error');
        },
        success: function (res) {
            console.log(res);

            layui.use('table', function(){
                var table = layui.table;
                table.render({
                    elem: '#srcResultTable'
                    ,height: 170
                    ,url: '../json/data_table.json' //数据接口
                    ,parseData: function(res1){ //res 即为原始返回的数据
                        return {
                            "code": 0, //解析接口状态
                            "msg": '', //解析提示文本
                            "count": res.count, //解析数据长度
                            "data": res //解析数据列表
                        };
                    }
                    ,page: false //开启分页
                    ,cols: [[ //表头
                        {field: 'hscode', title: 'HSCODE编码', fixed: 'left'}
                        ,{field: 'description', title: '描述'}
                        ,{field: 'added', title: '增值税率', sort: true,}
                        ,{field: 'general', title: '进口一般税率', sort: true,}
                        ,{field: 'favor', title: '相关性', sort: true,}
                    ]]
                });

                //监听行单击事件
                table.on('row(resultTable)', function(obj){
                    console.log(obj.tr) //得到当前行元素对象
                    console.log(obj.data) //得到当前行数据
                    var resData = obj.data;
                    $("#srcResult").val(resData['hscode'] + ' : ' + resData['description']);
                    //obj.del(); //删除当前行
                    //obj.update(fields) //修改当前行数据
                });
            });
        }
    });
}

$(document).keyup(function(event){
	 if(event.keyCode ==13){
	  $("#search_btn").trigger("click");
	 }
	});
