![](https://i.imgur.com/p924bGV.png)

# Note



> Note是一個筆記軟體



主要功能參考至notion。目前為測試版，後續會增加更多實用功能

github : https://github.com/winszhuang/note

note網站 : https://winszhuang.github.io/note/
> 請先註冊使用，或直接用測試用帳戶 : 
> 帳號123@gmail.com，密碼123456



## 涉及知識點
+ vue 3
    + composition api
    + 遞迴組件(樹狀結構)
+ vuex 4 
    + 使用modules管理不同的數據
    + store.watch監聽state變化順便更新到資料庫
    + store.subscribe監聽mutation的更新
+ vue router 4
    + 路由導航
+ 套件
    + secure LS (localstorage加密)
    + prismjs (程式碼高亮顯示)
    + bootstrap 5.0
    + font awesome 5.0
    + scss
    + eslint (使用airbnb風格)
    + firebase
        + Authentication
        + firestore
+ 使用到的api
    + LinkPreview API
    + imgur api

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

> 當前輸入塊為順序或無序列表時，按下Enter鍵可以新增同樣種類的block

> 後續更新 :
> 按下tab或者shift+tab可以往前或往後縮排(列表開頭第一個不行)


![](https://i.imgur.com/4SJbANS.gif)

### 增加程式碼

> 功能 : 
> 1. 貼上程式碼
> 2. 按下tab或者shift+tab鍵可以往前或往後縮排
> 3. 反白多行程式碼後同上可以多行縮排

![](https://i.imgur.com/Fv4dJqQ.gif)

### 增加連結預覽

> 貼上連結即可產生網址預覽
> 點擊預覽框會進入該網站(自動進入tab分頁)
> 補充 : 可能會有某些網站不支援

![](https://i.imgur.com/AxCd3dd.gif)

### 增加核取框、分割線、引言

> 當前輸入塊為核取框時，按下Enter鍵可以新增同樣的block

> 補充 : 只要是可輸入文字的block，按下shift + Enter都可在同block內換行

![](https://i.imgur.com/KgBVSWI.gif)

## 新增block的快捷鍵

![](https://i.imgur.com/nmmnoQ3.gif)

當光標在文字類型的block上時，可以輸入以下對應的快捷鍵並按下Enter，轉換成對應類型的block

| 快捷鍵        | 作用   | 
| --------   | -----:  | 
| /h1      | 轉換成大標題  | 
| /h2       | 轉換成中標題  | 
| /h3        | 轉換成小標題 | 
| /vid      | 轉換成影片類型  | 
| /img      | 轉換成圖片類型  | 
| /p       | 轉換成一般文字片段 | 
| /pag      | 轉換成內嵌頁面 | 
| /num       | 轉換成順序列表  | 
| /bul        | 轉換成無序列表 | 
| /todo      | 轉換成核取框  | 
| /div      | 轉換成分割線  | 
| /code      | 轉換成程式碼區塊 | 
| /quo     | 轉換成引言 | 
| /link      | 轉換成連結預覽  | 


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



















