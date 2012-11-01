nodeCharRoom-test
=================
利用 socket.io 實作聊天室


功能說明
-------
除了一般的聊天室之外，另外實作了歷史聊天記錄自動載入功能，透過mongohg


indepandTest.html
-----------------
測試即使獨立開啟html(不在server底下開啟)，也可以使用聊天室的功能
其中只要將

	<script type="text/javascript" charset="utf-8" src="socket.io/socket.io.js">

指定為node運行中的服務

	<script type="text/javascript" charset="utf-8" src="http://localhost:3000/socket.io/socket.io.js">

就可以執行該server所定義好的功能


