// TODO: 用户名称需修改为自己的名称
var userName = 'Lu仔酱';
// 朋友圈页面的数据
var data = [{
  user: {
    name: '阳和', 
    avatar: './img/avatar2.png'
  }, 
  content: {
    type: 0, // 多图片消息
    text: '华仔真棒，新的一年继续努力！',
    pics: ['./img/reward1.png', './img/reward2.png', './img/reward3.png', './img/reward4.png'],
    share: {},
    timeString: '3分钟前'
  }, 
  reply: {
    hasLiked: false,
    likes: ['Guo封面', '源小神'],
    comments: [{
      author: 'Guo封面',
      text: '你也喜欢华仔哈！！！'
    },{
      author: '喵仔zsy',
      text: '华仔实至名归哈'
    }]
  }
}, {
  user: {
    name: '伟科大人',
    avatar: './img/avatar3.png'
  },
  content: {
    type: 1, // 分享消息
    text: '全面读书日',
    pics: [],
    share: {
      pic: 'http://coding.imweb.io/img/p3/transition-hover.jpg',
      text: '飘洋过海来看你'
    },
    timeString: '50分钟前'
  },
  reply: {
    hasLiked: false,
    likes: ['阳和'],
    comments: []
  }
}, {
  user: {
    name: '深圳周润发',
    avatar: './img/avatar4.png'
  },
  content: {
    type: 2, // 单图片消息
    text: '很好的色彩',
    pics: ['http://coding.imweb.io/img/default/k-2.jpg'],
    share: {},
    timeString: '一小时前'
  },
  reply: {
    hasLiked: false,
    likes:[],
    comments: []
  }
}, {
  user: {
    name: '喵仔zsy',
    avatar: './img/avatar5.png'
  },
  content: {
    type: 3, // 无图片消息
    text: '以后咖啡豆不敢浪费了',
    pics: [],
    share: {},
    timeString: '2个小时前'
  }, 
  reply: {
    hasLiked: false,
    likes:[],
    comments: []
  }
}];

// 相关 DOM
var $page = $('.page-moments');
var $momentsList = $('.moments-list');

/**
 * 点赞内容 HTML 模板
 * @param {Array} likes 点赞人列表
 * @return {String} 返回html字符串
 */
function likesHtmlTpl(likes) {
  if (!likes.length) {                                                             //////直接初始化在页面上
    return '<div class="reply-like yincang"><i class="icon-like-blue"></i></div>';
  }
  var  htmlText = ['<div class="reply-like"><i class="icon-like-blue"></i>'];
  // 点赞人的html列表
  var likesHtmlArr = [];
  // 遍历生成
  for(var i = 0, len = likes.length; i < len; i++) {
    likesHtmlArr.push('<a class="reply-who who" href="#">' + likes[i] + '</a>');
  }
  // 每个点赞人以逗号加一个空格来相隔
  var likesHtmlText = likesHtmlArr.join(', ');
  htmlText.push(likesHtmlText);
  htmlText.push('</div>');
  return htmlText.join('');
}
/**
 * 评论内容 HTML 模板
 * @param {Array} likes 点赞人列表
 * @return {String} 返回html字符串
 */
function commentsHtmlTpl(comments) {
  if (!comments.length) {                                         ////////////直接初始化在页面上
    return '<div class="reply-comment yincang"></div>';
  }
  var  htmlText = ['<div class="reply-comment">'];
  for(var i = 0, len = comments.length; i < len; i++) {
    var comment = comments[i];
    htmlText.push('<div class="comment-item"><a class="reply-who" href="#">' + comment.author + '</a>：' + comment.text + '</div>');
  }
  htmlText.push('</div>');
  return htmlText.join('');
}
/**
 * 评论点赞总体内容 HTML 模板
 * @param {Object} replyData 消息的评论点赞数据
 * @return {String} 返回html字符串
 */
function replyTpl(replyData) {
  var htmlText = [];
  htmlText.push('<div class="reply-zone">');
  htmlText.push(likesHtmlTpl(replyData.likes));
  htmlText.push(commentsHtmlTpl(replyData.comments));
  htmlText.push('</div>');
  return htmlText.join('');
}
/**
 * 多张图片消息模版 （可参考message.html）
 * @param {Object} pics 多图片消息的图片列表
 * @return {String} 返回html字符串
 */
function multiplePicTpl(pics) {
  var htmlText = [];
  htmlText.push('<ul class="item-pic">');
  for (var i = 0, len = pics.length; i < len; i++) {
    htmlText.push('<img class="pic-item" src="' + pics[i] + '">')
  }
  htmlText.push('</ul>');
  return htmlText.join('');
}
function fenxiang(share) {//分享模板
  var htmlText = [];
  htmlText.push('<div class="fenxiang"><img class="fenxiangtu" src="'+share.pic+'" alt="" /><span>'+share.text+'</span></div>');
  return htmlText.join('');
}
function danzhang(pics) {//单张照片模板
  var htmlText = [];
  htmlText.push('<div><img class="danzhang" src="'+pics[0]+'" alt="" /></div>');
  return htmlText.join('');
}
/**
 * 循环：消息体 
 * @param {Object} messageData 对象
 */ 
function messageTpl(messageData) {
  var user = messageData.user;
  var content = messageData.content;
  var htmlText = [];
  htmlText.push('<div class="moments-item" data-index="0">');
  // 消息用户头像
  htmlText.push('<a class="item-left" href="#">');
  htmlText.push('<img src="' + user.avatar + '" width="42" height="42" alt=""/>');
  htmlText.push('</a>');
  // 消息右边内容
  htmlText.push('<div class="item-right">');
  // 消息内容-用户名称
  htmlText.push('<a href="#" class="item-name">' + user.name + '</a>');
  // 消息内容-文本信息
  htmlText.push('<p class="item-msg">' + content.text + '</p>');
  // 消息内容-图片列表 
  var contentHtml = '';
  // 目前只支持多图片消息，需要补充完成其余三种消息展示
  switch(content.type) {
      // 多图片消息
    case 0:
      contentHtml = multiplePicTpl(content.pics);
      break;
    case 1:
      contentHtml = fenxiang(content.share);
      break;
      // TODO: 实现分享消息
    case 2:
      contentHtml = danzhang(content.pics);
      break;
      // TODO: 实现单张图片消息
    case 3:
      // TODO: 实现无图片消息
  }
  htmlText.push(contentHtml);
  // 消息时间和回复按钮
  htmlText.push('<div class="item-ft">');
  htmlText.push('<span class="item-time">' + content.timeString + '</span>');
  htmlText.push('<div class="item-reply-btn">');
  htmlText.push('<span class="item-reply"></span>');
  htmlText.push('</div></div>');
  // 消息回复模块（点赞和评论）
  htmlText.push(replyTpl(messageData.reply));
  htmlText.push('</div></div>');
  return htmlText.join('');
}


/**
 * 页面渲染函数：render
 */
function render() {
  // TODO: 目前只渲染了一个消息（多图片信息）,需要展示data数组中的所有消息数据。
  var messageHtml = messageTpl(data[0])+messageTpl(data[1])+messageTpl(data[2])+messageTpl(data[3]);       //合并输出
  $momentsList.html(messageHtml);
}


/**
 * 页面绑定事件函数：bindEvent
 */
function bindEvent() {
  // TODO: 完成页面交互功能事件绑定
}

/**
 * 页面入口函数：init
 * 1、根据数据页面内容
 * 2、绑定事件
 */
function init() {
  // 渲染页面
  render();
  bindEvent();
}

init();




$(document).ready(function(){            //页面加载后默认隐藏掉空的点赞和评论列表
  var yincang=$('.page-moments').find('.yincang');
  yincang.hide();
})
$('body').on('click',function(){      //点击body隐藏面板
  $('.mianban').hide();
});
$('.mianban').on('click',function(){    //阻止事件冒泡
  event.stopPropagation();
});

var $curclick;                       //创建一个指向元素，用以后连续操作使用

$('.item-reply').bind('click',function(event){   //点击信息的回复按钮，弹出回复操作面板事件函数
  $curclick=$(this);                   //绑定指向元素
  event.stopPropagation();             //阻止事件冒泡
  var dingwei = $(this).offset();      //定位信息回复按钮位置
  var mianban = $('.mianban').outerWidth(); //获取面板宽度
  var mewidth = $(this).outerWidth();       //获取定位信息回复按钮宽度
  var top=dingwei.top-mewidth/3;      //综合定位面板位置-top
  var left=dingwei.left-mewidth/2-mianban;  //综合定位面板位置-left
  $('.mianban').offset({top,left});                           //定位面板最终位置
  var like=$(this).parents('.item-right').find('.who'); //寻找所有点赞人
  var how=[];                          //创建空数组
  how.length=like.length;
  for (i=0;i<like.length;i++){         //筛选出评论人，形成数组
    how[i]=like[i].innerText;
  }
  if (how.length === 0){               //若数组长度为0，表示无人点赞，弹出点赞面板
    $('#mianban').show();
    $('.mianban').offset({top,left});
  }else {                              //若数组长度不为0，判断点赞列表中是否有我，若有我弹出取消面板，若没有，弹出点赞面板
    for (i=0;i<how.length;i++){
      if (how[i] === ','+ userName||how[i] === userName){
        $('#mianban-tow').show();
        $('#mianban-tow').offset({top,left});
        break;
      }else {
        $('#mianban').show();
        $('#mianban').offset({top,left});
      }
    }
  }
  $('.mianban').css('animation','mianban-show 0.1s 1');   //引入面板弹出动画
})





$('.dianzan').on('click',function(){   //点赞事件
  var like=$curclick.parents('.item-right').find('.reply-like');     //寻找点赞列表
  var how=like.find('.who')                                          //寻找点赞人
  like.show();                                                       //显示点赞列表
  if (how.length>0){                                              //判断点赞列表是否有人点赞
    like.append('<a class="reply-who who me" href="#">'+',' + userName + '</a>');
  }else {                                                          
    like.append('<a class="reply-who who me" href="#">' + userName + '</a>');
  }
  $('.mianban').css('animation','mianban-hide 0.1s 1');            //引入面板消失动画，并将时间设置和自定义动画相同
  $('.mianban').animate({width:"150px"},100,function(){            //为了避免hide与消失动画冲突，强行设置自定义动画之后隐藏面板
    $('.mianban').hide();
  });
})



$('.quxiao').on('click',function(){                               //取消点赞函数
  var like=$curclick.parents('.item-right').find('.reply-like');  //寻找到点赞列表
  var who=like.find('.who');                                      //寻找所有点赞人
  var me=like.find('.me');                                        //寻找到我
  me.remove();                                                    //删除我的点赞结构
  if (who.length === 1) {                                           //判断是否只有我一个人点赞
    like.hide();                                                //若只有我一人点赞，隐藏整个点赞列表
  }
  $('.mianban').css('animation','mianban-hide 0.1s 1');          //引入面板消失动画，并将时间设置和自定义动画相同
  $('.mianban').animate({width:"150px"},100,function(){             //为了避免hide与消失动画冲突，强行设置自定义动画之后隐藏面板
    $('.mianban').hide();
  });
});






$('.huifuzujian').hide();                                        //回复组件默认隐藏
$('.huifu').on('click',function(){                               //点击评论，回复组件出现
  $('.huifuzujian').show();
  $('.mianban').css('animation','mianban-hide 0.1s 1');            //引入面板消失动画，并将时间设置和自定义动画相同
  $('.mianban').animate({width:"150px"},100,function(){            //为了避免hide与消失动画冲突，强行设置自定义动画之后隐藏面板
    $('.mianban').hide();
  });
})

$().ready(function(){
  $('.huifukuang').keyup(function(){                             //键盘事件，按键抬起时状态
    var v=$('.huifukuang').val();                                //获取输入框内容
    if(!v){                                                      //输入框无内容，发送按钮灰色
      $('.fasong').css('background','#F0F0F0');
      $('.fasong').css('color','#ccc');
    }
    else{                                                        //输入框有内容，发送按钮绿色
      $('.fasong').css('background','#66CD00');
      $('.fasong').css('color','white');
      $('.fasong').css('border','0 solid #ccc');
    }
  });
});




$('.fasong').on('click',function(){        //发送按钮点击函数
  var pinglunliebiao=$curclick.parents('.item-right').find('.reply-comment');               //寻找评论列表
  var neirong=$('.huifukuang').val();  //获取输入框文字
  pinglunliebiao.show();                  //显示评论列表
  pinglunliebiao.append('<div class="comment-item"><a class="reply-who" href="#">' + userName + '</a>：'+ neirong +'</div>');//添加评论结构
  $('.huifuzujian').hide();                                                                  //隐藏评论组件
  $('.huifukuang').val('');                                                                  //清空回复框
})


$('.yulan').hide();                                //默认隐藏预览结构
$('.pic-item,.fenxiangtu,.danzhang').on('click',function(){  //点击图片事件
  $('.yulan').show();                                 //显示预览结构
  var src=($(this).attr("src"));                      //将点击图片的直至赋值给预览结构的img
  $('.dizhi').attr('src',src); 
})
$('.yulan').on('click',function(){                 //点击预览组件隐藏
  $('.yulan').hide();
})