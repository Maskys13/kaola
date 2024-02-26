$(function() {

    $('.login-wrap p a').click(function() {
        $('.login-wrap').removeClass('active').next().addClass('active')
    })
    $('.reg-wrap p span').click(() => {
        $('.reg-wrap').removeClass('active').prev().addClass('active')
    })

    // 表单验证
    $('#register').validate({
        // 规则配置
        rules: {
          username: {
            required: true,
            minlength: 5,
            maxlength: 10
          },
          password: {
            required: true,
            minlength: 6,
            maxlength: 12
          },
          repeat: {
              equalTo: "#password"
          }
        },
        // 提示信息配置
        messages: {
          username: {
            required: '请填写用户名信息',
            minlength: '最少 5 个字符',
            maxlength: '最多 10 个字符'
          },
          password: {
              required: '请填写密码',
              minlength: '最少6个字符',
              maxlength: '最多12个字符'
          },
          repeat: {
            equalTo: '两次填写密码不一致'
          }
        },
        // 表单提交事件
        submitHandler (form) {
          // 2. 进行表单提交
          // 2-1. 拿到用户填写的内容
          const info = $(form).serialize()
          console.log(info)
          // 2-2. 发送请求到后端, 准备接受结果
          $.post('../server/register.php', info, null, 'json').then(res => {
    
            if(res.code === 1) {
                alert('注册成功')
                $('.reg-wrap').removeClass('active').prev().addClass('active')
            } else if (res.code === 0) {
                alert('注册失败')
            }
            
          })
        }
      })


    // 登录验证
    $('.login-wrap').on('click', 'button', function () {
        const username = $('.login-wrap .username').val()
        const password = $('.login-wrap .password').val()
        $.post('../server/login.php', { username: username, password: password }, null, 'json')
        .then((res) => {
            if (res.code === 1) {
                setCookie('nickname', res.nickname, 30)
                window.location.href = '../index.html'
            } else if (res.code === 0) {
                $('.login-wrap h3').css('opacity', 1)
            }
        })
    })

})