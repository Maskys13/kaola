// 入口函数
$(function () {
    userState()
    // 搜索热词
    searchHot()
    // 导航菜单
    nav()
    // banner轮播
    new Slideshow('.banner_box')
    // 搜索
    search()
    // 模块渲染
    bindHtml()
    // 滚动条
    scroll()
    // 楼层
    floorNav()
})


// 导航栏
async function nav () {
    const res = await $.get('/nav', '', null, 'json')
    const data = res.body.frontCategoryList

    data.splice(10, 1)
    for (let i = 0; i < data.length; i++) {
        let str = ''
        str = `<li>
                    <img src="../images/categorylist/${ i + 1 }a.png" alt="">
                    <img src="../images/categorylist/${ i + 1 }b.png" alt="">
                    <a href="./list.html" data-id="${ data[i].categoryId }">${ data[i].categoryName }</a>
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

// banner轮播图
class Slideshow {
    constructor (ele) {
        this.ele = document.querySelector(ele)
        this.index = 0
        this.time = null
        // this.autoPlay()
        // 
        this.init()
    }

    init () {
        this.autoPlay()
        this.overOut()
        this.leftRight()
        this.pointChange()
        this.windowChange()
    }
    // 切换
    nextChange (type) {
        $(this.ele).children().removeClass('change')
        $(this.ele).next().children().removeClass('active')

        if (type === true) {
            this.index++
        } else if (type === false) {
            this.index--
        } else {
            console.log(type)
            this.index = type
        }

        if (this.index >= $(this.ele).children().length) {
            this.index = 0
        } else if (this.index < 0) {
            this.index = $(this.ele).children().length - 1
        }

        $(this.ele).children().eq(this.index).addClass('change')
        $(this.ele).next().children().eq(this.index).addClass('active')
    }

    // 自动轮播
    autoPlay () {
        this.time = setInterval(() => {
            this.nextChange(true)
        }, 3000);
    }

    // 左右点击
    leftRight () {
        $('.lr_change').on('click', '.left_point', () => {
            // console.log(e)
            this.nextChange(false)
        })

        $('.lr_change').on('click', '.right_point', () => {
            // console.log(e)
            this.nextChange(true)
        })
    }

    // 鼠标移入移出
    overOut () {
        $(this.ele).parent().hover(
            () => { 
                // console.log('移入')
                clearInterval(this.time) 
            },
            () => { 
                // console.log('移出')
                this.autoPlay() 
            }
        )
    }

    // 焦点切换
    pointChange () {
        $(this.ele).next().children().mouseover((e) => {
            const target = e.target
            console.log(target)
            this.index = $(target).index()
            this.nextChange(this.index)
        })
    }
    
    // 窗口切换
    windowChange () {
        $(document).on('visibilitychange', () => {
            let c = document.visibilityState
            if (c === "hidden") {
                clearInterval(this.time)
            } else if (c === 'visible') {
                this.autoPlay()
            }

        })
    }
    
}

// 搜索框
function search () {
    $('.search_input').on('input', function(){
        if ($(this).val().trim() === '') {
            $(this).parent().find('ul').css('display', 'none')
            return
        }
        const value = $(this).val()
        getData(value)
        $(this).parent().find('ul').css('display', 'block')
    })

    async function getData (type) {
        const res = await $.post('/search', `oldQuery=&query=${ type }&size=10`, null, 'json')
        if (res.suggestKeycords.length === 0) {
            $('.search_input').parent().find('ul').css('display', 'none') 
            return
        }
        let str = ''
        for (let i = 0; i < res.suggestKeycords.length; i++) {
            
            str += `<li>${ res.suggestKeycords[i] }</li>`
            
        }
        $('.search_input').parent().find('ul').html(str)
    }
}

// 搜索热词
async function searchHot () {
    const res = await $.post('/searchhot', '', null, 'json')
    $('.search_input').attr('placeholder', `${ res.searchHotlistsDto.hotWord }`)
}

// 渲染各模块数据
function bindHtml () {
    data1()
    async function data1 () {
            const res1 = await $.get('/bh1', 'type=2&pageType=0', null, 'json')
            module(2, '#sports', res1)
            goodsSlide('#sports')
            module(5, '#skincare', res1)
            goodsSlide('#skincare')
            module(6, '#percare', res1)
            goodsSlide('#percare')

            const res2 = await $.get('/bh2', 'type=2&pageType=0', null, 'json')
            module(0, '#extrava', res2)
            goodsSlide('#extrava')

            const res3 = await $.get('/bh3', 'type=2&pageType=0', null, 'json')
            module(0, '#watch', res3)
            goodsSlide('#watch')

            const res4 = await $.get('/bh4', 'type=2&pageType=0', null, 'json')
            module(0, '#food', res4)
            goodsSlide('#food')

            const res5 = await $.get('/bh5', 'type=2&pageType=0', null, 'json')
            module(0, '#clothes', res5)
            goodsSlide('#clothes')

            const res6 = await $.get('/bh6', 'type=2&pageType=0', null, 'json')
            module(0, '#daily', res6)
            goodsSlide('#daily')

            const res7 = await $.get('/bh7', 'type=2&pageType=0', null, 'json')
            module(0, '#digital', res7)
            goodsSlide('#digital')

            const res8 = await $.get('/bh8', 'type=2&pageType=0', null, 'json')
            module(0, '#infant', res8)
            goodsSlide('#infant')

            const res9 = await $.get('/bh9', 'type=2&pageType=0', null, 'json')
            module(0, '#health', res9)
            goodsSlide('#health')

            
        }
    function module (index, ele, res) {
        const data = res.data[index].businessObj.content
        let str = ''
        str = `<div class="module_title clear_fix">
                    <h2 class="float_left">${ data.configData.floorTitle }</h2>
                    <ul class="float_left">
                        <li class="first">热搜词：</li>
                        <li class="last">
                            <a href="#">${ data.configData.hotSearchWord1 }</a>
                        </li>
                        <li class="last">
                            <a href="#">${ data.configData.hotSearchWord2 }</a>
                        </li>
                        <li class="last">
                            <a href="#">${ data.configData.hotSearchWord3 }</a>
                        </li>
                        <li class="last">
                            <a href="#">${ data.configData.hotSearchWord4 }</a>
                        </li>
                    </ul>
                    <a href="#" class="more float_right">更多好货></a>
                </div>`

        str += `<div class="content clear_fix">
                    <div class="content_l">
                        <a href="#">
                            <img src="${ data.configData.floorImage }" alt="" class="lazy_load">
                        </a>
                        <ul>
                            <li>
                                <a href="#">${ data.configData.secondCategory1 }</a>
                            </li>
                            <li>
                                <a href="#">${ data.configData.secondCategory2 }</a>
                            </li>
                            <li>
                                <a href="#">${ data.configData.secondCategory3 }</a>
                            </li>
                            <li>
                                <a href="#">${ data.configData.secondCategory4 }</a>
                            </li>
                            <li>
                                <a href="#">${ data.configData.secondCategory5 }</a>
                            </li>
                            <li>
                                <a href="#">${ data.configData.secondCategory6 }</a>
                            </li>
                        </ul>
                    </div>`  
            str += `<div class="content_c">
                            <ul class="clear_fix">
                                <li>
                                    <a href="#" title="">
                                        <h3>${ data.configData.activityTitle1 }</h3>
                                        <p>${ data.configData.sellPoint1 }</p>
                                        <img src="${ data.configData.activityImage1 }" alt="" class="lazy_load">
                                    </a>
                                </li>
                                <li>
                                    <a href="#" title="">
                                        <h3>${ data.configData.activityTitle2 }</h3>
                                        <p>${ data.configData.sellPoint2 }</p>
                                        <img src="${ data.configData.activityImage2 }" alt="" class="lazy_load">
                                    </a>
                                </li>
                                <li>
                                    <a href="#" title="">
                                        <h3>${ data.configData.activityTitle3 }</h3>
                                        <p>${ data.configData.sellPoint3 }</p>
                                        <img src="${ data.configData.activityImage3 }" alt="" class="lazy_load">
                                    </a>
                                </li>
                                <li>
                                    <a href="#" title="">
                                        <h3>${ data.configData.activityTitle4 }</h3>
                                        <p>${ data.configData.sellPoint4 }</p>
                                        <img src="${ data.configData.activityImage4 }" alt="" class="lazy_load">
                                    </a>
                                </li>
                            </ul>
                        </div>`
            str += `<div class="content_r">
                        <h4>
                            最近热卖
                            <ol>
                                <li class="active"></li>
                                <li></li>
                                <li></li>
                            </ol>
                        </h4>
                        <div class="slide_box">
                            <ul class="change">`
                        const arr1 = data.composeData.splice(0, 4)
                        for (let i = 0; i < arr1.length; i++) {
                            str += `<li>
                                        <a>
                                            <img src="${ arr1[i].imageUrl }" alt="">
                                        </a>
                                        <div>
                                            <p>
                                                <a href="#">
                                                ${ arr1[i].title }
                                                </a>
                                            </p>
                                            <div>
                                                <span>￥${ arr1[i].actualCurrentPrice }</span>
                                                <span>￥${ arr1[i].marketPrice }</span>
                                            </div>
                                        </div>
                                    </li>`
                        }
                                
                                
                    str += `</ul>
                            <ul>`
                        const arr2 = data.composeData.splice(0, 4)
                        for (let i = 0; i < arr2.length; i++) {
                            str += `<li>
                                        <a>
                                            <img src="${ arr2[i].imageUrl }" alt="">
                                        </a>
                                        <div>
                                            <p>
                                                <a href="#">
                                                ${ arr2[i].title }
                                                </a>
                                            </p>
                                            <div>
                                                <span>￥${ arr2[i].actualCurrentPrice }</span>
                                                <span>￥${ arr2[i].marketPrice }</span>
                                            </div>
                                        </div>
                                    </li>`
                        } 
                          
                        str += `</ul>
                            <ul>`
                            const arr3 = data.composeData.splice(0, 4)
                            for (let i = 0; i < arr3.length; i++) {
                                str += `<li>
                                            <a>
                                                <img src="${ arr3[i].imageUrl }" alt="">
                                            </a>
                                            <div>
                                                <p>
                                                    <a href="#">
                                                    ${ arr3[i].title }
                                                    </a>
                                                </p>
                                                <div>
                                                    <span>￥${ arr3[i].actualCurrentPrice }</span>
                                                    <span>￥${ arr3[i].marketPrice }</span>
                                                </div>
                                            </div>
                                        </li>`
                            } 
                        str += ` </ul>
                                </div>
                            </div>`
                    $(`${ ele } .module-wrap`).html($(str))
    }
    
}


// 滚动条事件
function scroll () {
    $(window).scroll(function () {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        // console.log(scrollTop)
        if (scrollTop > $('.head-wrap').outerHeight()) {
            $('.logo-wrap').addClass('logoWrapFixed').parent().addClass('logoFixed').css('margin-top', 0)
        } else {
            $('.logo-wrap').removeClass('logoWrapFixed').parent().removeClass('logoFixed').css('margin-top', 2)
        }

        if (scrollTop + $('.logo-wrap').outerHeight() > $('#redbag').offset().top) {
            $('.aside_left').addClass('aside_la')
            $('.aside_right').addClass('aside_ra')
        } else {
            $('.aside_left').removeClass('aside_la')
            $('.aside_right').removeClass('aside_ra')
        }
    })
}

// 楼层导航
function floorNav () {
    $('.aside_left ul').on('click', 'li', function() {
        
        const index = $(this).index()
        console.log($('.module-wrap').eq(index).parent().offset().top)
        window.scrollTo({
            top: $('.module-wrap').eq(index).parent().offset().top,
            behavior: "smooth"
        })
    }).prev().click(function() {
        window.scrollTo({
            top: $('#hotbrand').offset().top - 15,
            behavior: "smooth"
        })
    })
    $('.aside_right .backTop').click(function() {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    })
    
}
// 模块商品轮播图
function goodsSlide(ele) {
    let index = 0
    let timer = null

    autoPlay(ele)
    overOut(ele)
    pointChange(ele)
    windowChange(ele)


    function nextChange (ele, type) {
        $(`${ ele } .slide_box`).children().removeClass('change')
        $(`${ ele } .slide_box`).prev().find('li').removeClass('active')

        if (type === true) {
            index++
        } else {
            index = type
        }

        if (index >= $(`${ ele } .slide_box`).children().length) {
            index = 0
        } 

        $(`${ ele } .slide_box`).children().eq(index).addClass('change')
        $(`${ ele } .slide_box`).prev().find('li').eq(index).addClass('active')
    }

    // 自动轮播
    function autoPlay (ele) {
        timer = setInterval(() => {
            nextChange(ele, true)
        }, 3000);
    }


    // 鼠标移入移出
    function overOut (ele) {
        $(`${ ele } .slide_box`).hover(
            () => { 
                // console.log('移入')
                clearInterval(timer) 
            },
            () => { 
                // console.log('移出')
                autoPlay(ele) 
            }
        )
        $(`${ ele } .slide_box`).prev().find('li').hover(
            function() {clearInterval(timer)},
            function() { autoPlay(ele) }
        )
    }

    // 焦点切换
    function pointChange (ele) {
        $(`${ ele } .slide_box`).prev().find('li').mouseover((e) => {
            const target = e.target
            index = $(target).index()
            nextChange(ele, index)
        })
    }
    
    // 窗口切换
    function windowChange (ele) {
        $(document).on('visibilitychange', () => {
            let c = document.visibilityState
            if (c === "hidden") {
                clearInterval(timer)
            } else if (c === 'visible') {
                autoPlay(ele)
            }

        })
    }
}

// 用户登录状态
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