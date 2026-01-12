# 🎵 Как да добавите музика към приложението

## Метод 1: Локални MP3 файлове (Препоръчан)

### Стъпка 1: Подгответе вашите музикални файлове
Копирайте вашите `.mp3` файлове в папката `music/`:

```
music/
├── track1.mp3
├── track2.mp3
├── track3.mp3
├── track4.mp3
├── track5.mp3
├── track6.mp3
└── track7.mp3
```

### Стъпка 2: Именуване
Именувайте файловете точно както са в HTML:
- `track1.mp3` → Blinding Lights
- `track2.mp3` → Levitating
- `track3.mp3` → Good 4 U
- `track4.mp3` → As It Was
- `track5.mp3` → Heat Waves
- `track6.mp3` → Stay
- `track7.mp3` → Starboy

### Стъпка 3: Рестартирайте приложението
Презаредете `index.html` в браузъра и натиснете върху някоя песен!

---

## Метод 2: Използване на URL адреси

Можете да използвате онлайн MP3 файлове. Редактирайте `index.html` и променете `data-track`:

```html
<div class="track-item" data-track="https://example.com/song.mp3">
```

---

## Метод 3: Безплатни тестови аудио файлове

Можете да използвате тези безплатни sample URLs за тестване:

Отворете `index.html` и променете атрибутите `data-track`:

```html
<!-- Track 1 -->
<div class="track-item" data-track="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3">

<!-- Track 2 -->
<div class="track-item" data-track="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3">

<!-- И т.н. -->
```

---

## 🎧 Къде да намерите безплатна музика

### Легални източници за тестване:
1. **Free Music Archive** - https://freemusicarchive.org/
2. **YouTube Audio Library** - https://www.youtube.com/audiolibrary
3. **Incompetech** - https://incompetech.com/music/
4. **Bensound** - https://www.bensound.com/
5. **SoundHelix** - https://www.soundhelix.com/audio-examples

### За собствена музика:
- Използвайте вашите собствени MP3 файлове
- Уверете се, че имате правото да ги използвате
- Формати: `.mp3`, `.wav`, `.ogg`, `.m4a`

---

## ⚙️ Технически детайли

### Поддържани формати:
- ✅ MP3 (.mp3)
- ✅ WAV (.wav)
- ✅ OGG (.ogg)
- ✅ M4A (.m4a)
- ✅ AAC (.aac)

### Browser поддръжка:
Всички модерни браузъри поддържат HTML5 Audio API.

---

## 🐛 Решаване на проблеми

### "Cannot load audio file" грешка:
1. Проверете дали файловете са в папката `music/`
2. Проверете правилното именуване (track1.mp3, не Track1.MP3)
3. Уверете се, че файловете са валидни MP3

### Музиката не се пуска:
1. Проверете конзолата за грешки (F12)
2. Уверете се, че браузърът не блокира autoplay
3. Натиснете върху песента преди да натиснете Play

### CORS грешки (при URL):
- Някои URL адреси може да имат CORS ограничения
- Използвайте локални файлове вместо това

---

## 📝 Пример: Пълна конфигурация

```html
<div class="track-item" 
     data-track="music/my-song.mp3" 
     data-duration="215">
    <!-- 215 секунди = 3:35 минути -->
</div>
```

---

## 🎯 Кратък старт (3 стъпки)

1. **Копирайте** MP3 файлове в `music/` папката
2. **Именувайте ги** като track1.mp3, track2.mp3, и т.н.
3. **Отворете** index.html и натиснете върху песен!

---

## 💡 Съвети

- За най-добри резултати, използвайте MP3 файлове с битрейт 192-320 kbps
- Препоръчителен размер: 3-5 MB на песен
- ID3 тагове не са задължителни (информацията е в HTML)

---

## 🔗 Полезни линкове

- [HTML5 Audio API Documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio)
- [Supported Audio Formats](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Audio_codecs)

---

**Готово! Сега имате работещ музикален плейър с реално възпроизвеждане на аудио! 🎉**
