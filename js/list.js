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

    searchHot()
    nav()

    let list = null

    const list_info = {
        cat_one: 'all',
        sort_method: '价格',
        sort_type: 'ASC',
        current: 1,
        pagesize: 16
    }
    getCateOne()
    getGoodsList(list_info)
    getTotalPage(list_info)

    // 分类点击事件
    $('.show_right').on('click', 'a', function () {
        $(this).addClass('active').siblings().removeClass('active')
        const type = $(this).data('type')
    
        list_info.current = 1
        list_info.cat_one = type
        getTotalPage(list_info)
        getGoodsList(list_info)
      })

    // 排序方式
    $('.cat-wrap p').on('click', 'a', function () {
        const type = $(this).attr('data-type')
        list_info.sort_type = type
        getTotalPage(list_info)
        getGoodsList(list_info)
    
        $(this).attr('data-type', type === 'ASC' ? 'DESC' : 'ASC')
      })

    // 点击跳转
    $('.list_content ul').on('click', 'p', function () {
        console.log('点击了')
        const id = $(this).data('id')
        setCookie('goods_id', id)
        window.location.href = './detail.html'
    })

    $('.list_content ul').on('click', 'li > img', function () {
        console.log('点击了')
        const id = $(this).data('id')
        setCookie('goods_id', id)
        window.location.href = './detail.html'
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

// 获取一级分类
async function getCateOne() {
    const cat_one_list = await $.get('../server/getCateOne.php', null, null, 'json')

    let str = `<a href="javascript:;" data-type="all" class="active">全部</a>`

    cat_one_list.list.forEach(item => {
      str += `
        <a href="javascript:;" data-type="${ item.cat_one_id }">${ item.cat_one_id }</a>
      `
    })

    $('.show_right').html(str)
  }

// 渲染分页器
async function getTotalPage(list_info) {

    const totalInfo = await $.get('../server/getTotalPage.php', list_info, null, 'json')

    $('.pagination').pagination({
      pageCount: totalInfo.total,
      prevContent: '上一页',
      nextContent: '下一页',
      coping: true,
      callback (index) {
        list_info.current = index.getCurrent()

        getGoodsList(list_info)
      }
    })
  }


// 渲染列表
  async function getGoodsList(list_info) {
    // 3-1. 请求商品列表
    const goodsList = await $.get('../server/getGoodsList.php', list_info, null, 'json')

    // 给全局变量 list 进行赋值
    list = goodsList.list

    // 3-2. 渲染页面
    let str = ''
    goodsList.list.forEach(item => {
      str += `<li>
                <img src="${ item.goods_big_logo }" alt="" data-id="${ item.goods_id }">
                <div>
                        <h3>￥${ item.goods_price }</h3>
                        <h4>
                            <img src="https://img.alicdn.com/tfs/TB14A2jcAcx_u4jSZFlXXXnUFXa-156-48.png" alt="">
                        </h4>
                        <p data-id="${ item.goods_id }">${ item.goods_name }</p>
                        <h5>
                            <span>自营</span>
                            <span>津贴</span>
                            <span>99选2件</span>
                        </h5>
                        <h6>
                            <span>462829</span>
                            <i>日本</i>
                        </h6>
                        <div>考拉海购自营</div>
                </div>
            </li>`
    })
    $('.list_content > ul').html(str)
  }