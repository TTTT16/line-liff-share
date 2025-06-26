const express = require('express');
const line = require('@line/bot-sdk');

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
};

const client = new line.Client(config);
const app = express();

app.post('/webhook', line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent)).then(() => res.end());
});

async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') return;

  const flexMsg = {
    type: 'flex',
    altText: 'แชร์ต่อให้เพื่อน',
    contents: {
      type: 'bubble',
      hero: {
        type: 'image',
        url: 'https://via.placeholder.com/600x200.png?text=แชร์เลย!',
        size: 'full',
        aspectRatio: '16:9',
        aspectMode: 'cover',
      },
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'button',
            action: {
              type: 'uri',
              label: 'เพิ่มเพื่อน',
              uri: 'https://line.me/R/ti/p/@yourlineid'
            },
            style: 'primary',
            color: '#00C300'
          }
        ]
      }
    }
  };

  return client.replyMessage(event.replyToken, flexMsg);
}

app.listen(3000, () => {
  console.log('Bot is running on port 3000');
});
