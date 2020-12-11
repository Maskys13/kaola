## 项目介绍

1. ### 项目名称：网易考拉仿站

2. ### 项目实现：使用前后端技术（html, css, js ,php...），加上VS code 编辑器和本地服务器进行项目实现

3. ### 项目功能：

   ```txt
   1.首页
   	首页搜索引擎（原网站引擎），下拉二级菜单，渐隐渐现轮播图，侧边导航二级菜单，登录/注册、购物车按钮均可实现跳转相应页面，楼层导航精准制导，回到顶部，商品版块小轮播图。
2.登录注册页
   	点击注册显示注册界面，注册成功会跳转到登录界面，登录成功会跳转到首页
   	注册的用户信息会添加到 数据库 kaola 下面的 表格  users 里面
   3.商品列表页
   	商品数据goods.sql里面的信息，将goods.sql 引入到kaola库中
   	顶部登录注册、搜索和侧边分类导航 与首页功能相同，一级分类功能实现，可进行数据渲染，价格可进行排序
   	点击商品图片和商品名称可进入商品详情页。
   	分页器功能也已实现
   4.商品详情页
   	放大镜功能，商品数量加减，加入购物车和立即购买会先验证是否登录，没有登录会跳转到登录页面，已登录点击立即购买会进入购物车页面。
   5.购物车页
   	进行商品加减，删除操作，全选按钮，功能均已实现。
   ```

4. ### 功能实现：

   ```txt
   需要先建立一个名叫kaola的库 里面有goods.sql 和users 两个表格 users 中有username 、password、nickname三个字段
   
   首页数据渲染需要用到代理，代理地址为
   	location = /nav {
                 proxy_pass https://search.kaola.com/api/getFrontCategory.html;
               }
               
           location = /banner {
                 proxy_pass https://gw.kaola.com/gw/indexPageBridge/banner;
               }
               
           location = /search {
                 proxy_pass https://search.kaola.com/api/getSuggestKeyword.html;
               }
               
           location = /searchhot {
                 proxy_pass https://search.kaola.com/api/getPcInboxQueryWord.html;
               }
               
           location = /bh1 {
                 proxy_pass https://pages.kaola.com/pages/region/advance/b8b317bd55374be4bcf49f76e9d52c69.html;
               }
               
           location = /bh2 {
                 proxy_pass https://pages.kaola.com/pages/region/detail/15075/60021/323195.html;
               }
            
           location = /bh3 {
                 proxy_pass https://pages.kaola.com/pages/region/detail/15075/60021/323200.html;
               }
           
           location = /bh4 {
                 proxy_pass https://pages.kaola.com/pages/region/detail/15075/60021/323202.html;
               }
               
           location = /bh5 {
                 proxy_pass https://pages.kaola.com/pages/region/detail/15075/60021/250758.html;
               }
               
           location = /bh6 {
                 proxy_pass https://pages.kaola.com/pages/region/detail/15075/60021/323204.html;
               }
               
           location = /bh7 {
                 proxy_pass https://pages.kaola.com/pages/region/detail/15075/60021/263329.html;
               }
           
           location = /bh8 {
                 proxy_pass https://pages.kaola.com/pages/region/detail/15075/60021/249073.html;
               }
               
           location = /bh9 {
                 proxy_pass https://pages.kaola.com/pages/region/detail/15075/60021/263157.html;
               }
               
           location = /bh10 {
                 proxy_pass https://gw.kaola.com/gw/indexPageBridge/getRecommendGoods;
               }
               
           location = /list {
                 proxy_pass https://pages.kaola.com/pages/region/detail/7828/1005/130133.html;
               }
   ```

   ### 5.遇到的问题

   ```txt
   html/css布局进度缓慢
   数据抓取太难，目前只能简单使用jsonp或代理进行请求。
   尝试使用nodejs中cheerio包进行爬虫抓取页面数据，最终没有实现
   尝试在nodejs中使用jquery包没有实现
   想过使用nodejs搭建一个服务器进行代理请求原网站数据，然后使用fs包将请求回来的文件写入到json文件中，没有进行操作，不知是否能够实现。6.总结
   ```

   ### 6.总结

   ```txt
   整体除了数据问题，没有遇到什么大问题，通过这个项目对前面的知识进行了巩固，原生JS的重要性得到体现，基本功扎实很有必要，搭建页面结构不够严谨，熟练度不足。后续还需多加练习。
   ```

   