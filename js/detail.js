$(function () {

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

    nav()
    searchHot()

    let info = null

    const id = getCookie('goods_id')

    getGoodsInfo()
    async function getGoodsInfo() {
        const goodsInfo = await $.get('../server/getGoodsInfo.php', { goods_id: id }, null, 'json')
        bindHtml(goodsInfo.info)
        info = goodsInfo.info
    }

    // 渲染页面
    function bindHtml(info) {
        // 放大镜位置
        $('.showImgBox img').attr('src', info.goods_big_logo)
        $('.showImgBox').next().find('img').attr('src', info.goods_small_logo)
        $('.enlargeBox').css('background-image', `url(${ info.goods_big_logo })`)
    
        // 商品渲染
        $('.pInfo').html(`<p>${ info.goods_name }</p>
                                <div class="timer">
                                    <img src="https://kaola-haitao.oss.kaolacdn.com/9b1f1317-c97a-4cb3-90a6-e25dab6c405cT2011301728_200_80.png" alt="">
                                    <span>限时特价 再享包税</span>
                                    <a href="javascript:;">
                                        <span>距离结束还剩</span>
                                        <span class="day">02天</span>
                                        <span class="hour">11</span>
                                        <i>:</i>
                                        <span class="min">57</span>
                                        <i>:</i>
                                        <span class="sec">02</span>
                                    </a>
                                </div>
                                <div class="price">
                                    <div>
                                        <span>售价</span>
                                        <span>￥${ info.goods_price }</span>
                                        <span>特价</span>    
                                    </div>
                                </div>
                                <div class="quantity">
                                    <span>数量</span>
                                    <div>
                                        <a href="javascript:;" class="subNum">-</a>
                                        <input type="text" value="1" class="inpValue">
                                        <a href="javascript:;" class="addNum">+</a>
                                    </div>
                                    <p>单日限购8件</p>
                                </div>
                                <div class="explain">
                                    <span>说明</span>
                                    <i>正品保证</i>
                                    <i>30天无忧退货</i>
                                </div>
                                <div class="pickBtn">
                                    <div class="buy">立即购买</div>
                                    <div class="add" ${ info.goods_id }>加入购物车</div>
                                </div>`
        )
    
    }


    // 加入购物车
    $('.pInfo').on('click', '.add', function () {
        const res = getCookie('nickname')
        if(!res) {
            alert('请登录')
            window.location.href = './login.html'
            return
        }
        const cart = JSON.parse(window.localStorage.getItem('cart')) || []
        const flag = cart.some(item => item.goods_id === id)
        if (flag) {
          const cart_goods = cart.filter(item => item.goods_id === id)[0]
          cart_goods.cart_number = cart_goods.cart_number - 0 + ($('.inpValue').val() - 0)
        } else {
          info.cart_number = 1
          cart.push(info)
        }
        window.localStorage.setItem('cart', JSON.stringify(cart))
      })

    
    // 加减数量
    $('.pInfo')
      .on('click', '.subNum', function () {
        let num = $('.inpValue').val() - 0
        if (num === 1) return
        $('.inpValue').val(num - 1)
      })
      .on('click', '.addNum', function () {
        let num = $('.inpValue').val() - 0
        $('.inpValue').val(num + 1)
    })

    // 立即购买
    $('.pInfo').on('click', '.buy', function() {
            const res = getCookie('nickname')
            if(res) {
                const cart = JSON.parse(window.localStorage.getItem('cart')) || []
                const flag = cart.some(item => item.goods_id === id)
                if (flag) {
                const cart_goods = cart.filter(item => item.goods_id === id)[0]
                cart_goods.cart_number = cart_goods.cart_number - 0 + ($('.inpValue').val() - 0)
                } else {
                info.cart_number = 1
                cart.push(info)
                }
                window.localStorage.setItem('cart', JSON.stringify(cart))

                window.location.href = './shoppingcar.html'
        } else {
            alert('请登录')
            window.location.href = './login.html'
        }
    })

    $('.showImgBox').hover(
        () => {
            $('.mask').css('display', 'block')
            $('.enlargeBox').css('display', 'block')
        },
        () => {
            $('.mask').css('display', 'none')
            $('.enlargeBox').css('display', 'none')
        }
    )
    .mousemove(function(e) {
        let x = e.offsetX - 100
        let y = e.offsetY - 100
        if( x < 0 ) {
            x = 0
        }
        if(y < 0) {
            y = 0
        }
        if(x > $('.showImgBox').width() - $('.mask').width()) {
            x = $('.showImgBox').width() - $('.mask').width()
        }
        if(y > $('.showImgBox').height() - $('.mask').height()) {
            y = $('.showImgBox').height() - $('.mask').height()
        }
        $('.mask').css({
            left: x,
            top: y
        })
        $('.enlargeBox').css({
            backgroundPositionX: -2 * x,
            backgroundPositionY: -2 * y,
        })
    })



})



// 二级导航栏渲染
async function nav () {
    const res = await $.get('/nav', '', null, 'json')
    const data = res.body.frontCategoryList

    data.splice(10, 1)
    for (let i = 0; i < data.length; i++) {
        let str = ''
        str = `<li>
                    <img src="../images/categorylist/${ i + 1 }a.png" alt="">
                    <img src="../images/categorylist/${ i + 1 }b.png" alt="">
                    <a href="#" data-id="${ data[i].categoryId }">${ data[i].categoryName }</a>
                    <i>></i>
                    <div class="menu_card">
                            <div class="list_box float_left">`
                    const num = Math.ceil(data[i].childrenNodeList.length)
                    for (let k = 0; k < num; k++) {
                        str += `<div class="clear_fix">`
                        const newArr = data[i].childrenNodeList.splice(0, 2)
                        for (let j = 0; j < newArr.length; j++) {
                            str += `<div class="menu_item">
                                        <p></p>
                                        <div>
                                            <h2>
                                                <a href="#" target="_blank">${ newArr[j].categoryName }</a>
                                            </h2>
                                            <ul class="clear_fix">`
                            for (let u = 0; u < newArr[j].childrenNodeList.length; u++) {
                                str += `<li>
                                            <a href="#" target="_blank">${ newArr[j].childrenNodeList[u].categoryName }</a>
                                        </li>`
                            }
                                str += `  </ul>
                                        </div>
                                    </div>`
                                
                        }
                        str += `</div>`      
                    }
                
                    str += ` </div>
                            <div class="brand_box float_left">
                                <div class="clear_fix">`
                            const imgArr = data[i].brandList.splice(0, 6)
                        for(let p = 0; p < imgArr.length; p++) {
                            str += `<a href="#">
                                        <img src="${ imgArr[p].logoPic }" alt="">
                                    </a>`
                        }
                        str += `</div>
                            </div>
                                <div class="img_box float_right">
                                    <a href="#">
                                        <img src="${ data[i].bannerImageUrl }" alt="">
                                    </a>
                                </div>
                        </div>
                    </li>
                    <p><span></span></p>`
            $('.nav_menu').append($(str))
    }

    $('.nav_menu li').mouseenter(function () {
        $(this).addClass('active').siblings().removeClass('active')
    })
    $('.nav_left').mouseleave(function () {
        $(this).find('.nav_menu').find('li').removeClass('active')
    })
}

// 搜索热词
async function searchHot () {
    const res = await $.post('/searchhot', '', null, 'json')
    $('.search_input').attr('placeholder', `${ res.searchHotlistsDto.hotWord }`)
}