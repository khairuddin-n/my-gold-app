# My Gold

PWA pribadi untuk memantau emas GMI: nilai buyback, titik impas, saran harian, dan input harga dari screenshot.

- Data & logika: Google Apps Script + Google Sheet (repo lokal `my-gold`, `Api.js` = endpoint `doPost`).
- Akses butuh kunci pribadi (link `#k=…`), disimpan di perangkat.
- Rilis: naikkan `VERSION` di `app.js` dan `sw.js` (+ query `?v=` di `index.html` dan `SHELL`), lalu push.
