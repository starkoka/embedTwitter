# embedTwitter
twitter.comやx.comのリンクを自動でvxtwitter.comに書き換えて送信します

招待リンクは[こちら](https://discord.com/api/oauth2/authorize?client_id=1184735822331785268&permissions=2147503168&scope=bot)

動作には以下のconfig.jsonが必要です。
```json
{
  "token": "YOUR_BOT_TOKEN",
  "logSystem": "LOG_CHANNEL_ID",
  "errorSystem": "ERROR_LOG_CHANNEL_ID",
  "client": "YOUR_BOT_ID"
}
```