![](https://i.imgur.com/p924bGV.png)

# Note



> Note是一個筆記軟體



主要功能參考至notion。目前為測試版，有許多小問題... 後續會增加更多實用功能

## 涉及知識點
+ vue 3
    + composition api
    + 遞迴組件(樹狀結構)
+ vuex 4 
    + 使用modules管理不同的數據
    + store.watch監聽mutation的更新
+ vue router
    + 路由導航
+ imgur api
+ localstorage
+ firestore
+ firebase auth
+ bootstrap 5
+ scss

## 功能說明

## **page**

### 增加page或者內嵌page
+ 可從兩處增加新頁面
+ 點擊 + 號增加內嵌 page

![](https://i.imgur.com/vX2XEns.gif)

### 在page內跳轉至其他內嵌page
![](https://i.imgur.com/IIAgZud.gif)

### 刪除page
+ 可連inner page以及內部block一併刪除

![](https://i.imgur.com/CbkfeGI.gif)

## **block**

### 可使用block種類

+ 大標題
+ 中標題
+ 小標題
+ 影片
+ 圖片
+ 文字片段
+ 內嵌頁面
+ 順序列表
+ 無序列表
+ 切換列表
+ 核取框
+ 分割線
+ 程式碼
+ 引言

### 增加標題、文字片段

> 按下鍵盤Enter鍵會預設新增一個文字片段block

![](https://i.imgur.com/bBu2tdd.gif)

### 增加影片(youtube)、圖片 & 縮放影片、圖片大小

> 請先新增對應block之後...
>
> 影片 : 請貼上youtube影片網址，目前僅支援youtube影片
> 圖片 : 請先 ctrl + c 或者右鍵複製圖片，再貼上

> 滑鼠靠近媒體時，媒體兩側會顯示出滑桿，按住不放可以拖移縮放

- 影片block

![](https://i.imgur.com/RXbplwL.gif)

- 圖片block

![](https://i.imgur.com/qXzEkTs.gif)


### 增加順序列表、無序列表

> 當前輸入塊為順序或無序列表時，按下Enter鍵可以新增同樣的block

![](https://i.imgur.com/4SJbANS.gif)

### 增加程式碼

> 功能 : 
> 1. 貼上程式碼
> 2. 按下tab或者shift+tab鍵可以往前或往後縮排
> 3. 反白多行程式碼後同上可以多行縮排

![](https://i.imgur.com/Fv4dJqQ.gif)

### 增加核取框、分割線、引言

> 當前輸入塊為核取框時，按下Enter鍵可以新增同樣的block

> 補充 : 只要是可輸入文字的block，按下shift + Enter都可在同block內換行

![](https://i.imgur.com/KgBVSWI.gif)

## **block操作**

主要可操作block功能包含
+ 框選單或多個block
+ 拖移單或多個block
+ 複製、貼上單或多個block
+ 新增選取到的單或多個block

### 單個block的操作

> 拖移block到其他block的位置

![](https://i.imgur.com/aeKOysx.gif)

> ctrl + d 複製當前block到下方(可連續複製)

![](https://i.imgur.com/e0FTf4C.gif)

### 框選中多個block的操作

框選後，被選取到的多個block，可以做的後續操作 &nbsp;&dArr;&dArr;&dArr;
> **ctrl + c 複製選取到的block到剪貼簿，ctrl + v 貼上剪貼簿中的block(可貼到其他page)**

![](https://i.imgur.com/HnxWB7v.gif)

> **ctrl + d 新增選取到的單或多個block到原位置底下**

![](https://i.imgur.com/Xhmx1tq.gif)

> **拖移被選取到的某個block的"錨點"至某個位置**

![](https://i.imgur.com/32VaCm9.gif)

> **刪除被框選到的所有block**

![](https://i.imgur.com/tLCcBoP.gif)

## **修改block樣式**

> 點擊某個block的style小圖標，即可呼叫block樣式編輯器。
> block樣式編輯器可以挑選顏色，並且修改樣式為
> + 文字上色
> + 背景填色
> + 外框上色

![](https://i.imgur.com/FRliv1s.gif)


## **搜尋Page或者block**

> 篩選出符合的頁面後，點擊可進入此頁

![](https://i.imgur.com/PpO50H1.gif)

## **顯示或隱藏左側sidebar**
![](https://i.imgur.com/zXQ2Tuu.gif)
