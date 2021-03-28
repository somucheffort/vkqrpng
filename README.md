# vkqrpng

Create QR codes using [`@vkontakte/vk-qr`](https://github.com/vkcom/vk-qr) and convert it to png

# Way of using it

1. Clone repo
```console
git clone https://github.com/redcarti/vkqrpng
```

2. Run `npm start`
```console
npm start
```

3. Set text
```console
qr > text url_here
qr | set url to 'url_here'
```

4. Generate QR
```console
qr > gen
qr | generated a qr with settings:
 { text: 'url_here', options: {} }
```

5. Save QR
```console
qr > save
qr | saved qr to 'qr.png'
```