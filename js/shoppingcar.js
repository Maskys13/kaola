$(function() {
    userState()
    function userState() {
        const nickname = getCookie('nickname')
        if (!nickname) return
    
        $('.login').replaceWith($(`<a href="javascript:;">${ nickname }</a>`))
        $('.register').replaceWith($(`<a href="javascript:;" class="log">退出</a>`))
    
        $('.head_left').on('click', '.log', function() {
            setCookie('nickname', '', -1)
            window.history.go(0)
        })
    }

    const nickname = getCookie('nickname')
    if (!nickname) return window.location.href = './login.html'
    const cart = JSON.parse(window.localStorage.getItem('cart')) || []
    if (!cart.length) {
        $('#car').addClass('hide')
        $('.empty').removeClass('hide')
        return
    }
    $('.empty').addClass('hide')
    $('#car').removeClass('hide')

    bindHtml()
    function bindHtml() {
        const selectAll = cart.every(item => item.is_select === '1')
        let total = 0
        let totalMoney = 0
        cart.forEach(item => {
        if (item.is_select === '1') {
            total += item.cart_number - 0
            totalMoney += item.cart_number * item.goods_price
        }
        })


        $('.item').find('input').replaceWith($(`<input type="checkbox" ${ selectAll ? 'checked' : '' }>`))
        
        let str = ''
        cart.forEach(item => {

        str += `<li>
                    <div class="col1">
                        <input type="checkbox" class="select" data-id="${ item.goods_id }" type="checkbox" ${ item.is_select === '0' ? '' : 'checked' }>
                    </div>
                    
                    <div class="col2">
                        <img src="${ item.goods_small_logo }" alt="">
                        <p> ${ item.goods_name }</p>
                    </div>
                    <span class="col3">￥${ item.goods_price }</span>
                    <div class="col4">
                        <a href="javascript:;" class="subNum" data-id="${ item.goods_id }">-</a>
                        <input type="text" value="${ item.cart_number }">
                        <a href="javascript:;" data-id="${ item.goods_id } class="addNum">+</a>
                    </div>
                    <span class="col5">${ (item.goods_price * item.cart_number).toFixed(2) }</span>
                    <i class="col6 del" data-id="${ item.goods_id }">删除</i>
                </li>`
        
        })
        $('.acgoods').html(str)
        let str1 = ''
        str1 += `<div>
                    <span class="first">已选商品${ total }件</span>
                    <span class="first">总价(不含运费税)</span>
                    <span class="last">￥${ totalMoney.toFixed(2) }</span>
                    <a href="javascript:;">结算</a>
                </div>`
        $('.totalBox').html(str1)
    }

     // 选择按钮点击
    $('#car').on('click', '.select', function () {
        const type = this.checked
        const id = $(this).data('id')
        const info = cart.filter(item => item.goods_id == id)[0]
        info.is_select = type ? '1' : '0'
        bindHtml()
        window.localStorage.setItem('cart', JSON.stringify(cart))
    })

    // 数量 +
    $('#car').on('click', '.addNum', function () {
        const id = $(this).data('id')
        const info = cart.filter(item => item.goods_id == id)[0]
        info.cart_number = info.cart_number - 0 + 1
        bindHtml()
        window.localStorage.setItem('cart', JSON.stringify(cart))
    })

    // 数量-
    $('#car').on('click', '.subNum', function () {

        const id = $(this).data('id')
        const info = cart.filter(item => item.goods_id == id)[0]
        if (info.cart_number === 1) return
        info.cart_number = info.cart_number - 0 - 1
        bindHtml()
        window.localStorage.setItem('cart', JSON.stringify(cart))
    })

    // 删除操作
    $('#car').on('click', '.del', function () {
        const id = $(this).data('id')
        for (let i = 0; i < cart.length; i++) {
            if (cart[i].goods_id == id) {
                cart.splice(i, 1)
                break
            }
        }
        bindHtml()
        window.localStorage.setItem('cart', JSON.stringify(cart))
        if (!cart.length) return window.location.reload()
    })

    // 全选
    $('.item').on('click', 'input', function(){
        console.log(this.checked)
        if(this.checked) {
            for(let i = 0; i < cart.length; i++) {
                cart[i].is_select = '1'
            }
        } else {
            for(let i = 0; i < cart.length; i++) {
                cart[i].is_select = '0'
            }
        }
        bindHtml()

        for(let i = 0; i < cart.length; i++) {
            cart[i].is_select = '0'
        }
        window.localStorage.setItem('cart', JSON.stringify(cart))
    })
})