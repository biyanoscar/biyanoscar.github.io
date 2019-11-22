var webPush = require('web-push');

const vapidKeys = {
  "publicKey": "BKkTOa2fHb4Q3qrDUm1sNOIWjXro1zp5qbAc36_X_mssxafMEv2ZU9v2crEz4zwoT0QFKbRMmyaMUUVHrJNVA6E",
  "privateKey": "Bauzsjr1lTn-1UkLIR0oOOIhlV4Mmo24kH-D57Lsfw4"
};


webPush.setVapidDetails(
   'mailto:example@biyan.org',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)
var pushSubscription = {
   "endpoint": "https://fcm.googleapis.com/fcm/send/clh9mtWqhBs:APA91bGrRrmhgYF0qt-H7OddwzonXQUAj9SFT6GxqQiUXUcGSpf3gHiYxMylf_RcIuA5a-PLiN80qvRCikezqYw40762sbLLax5UUJpro4hU4M_-ymlnkpidyaefJuRd0WeLCR9QjJ83",
   "keys": {
       "p256dh": "BNzf58ZQDJf6i1HY1aFrsilagKIhErQO3u21zYLXEIItbqgGFT35djYxM6KrosYm3Fp+Fn7JT7lSWzLnbnOgAcI=",
       "auth": "4d4EXyK+IC1kfysTaSkxKA=="
   }
};
var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';

var options = {
   gcmAPIKey: '408015280776',
   TTL: 60
};
webPush.sendNotification(
   pushSubscription,
   payload,
   options
);
