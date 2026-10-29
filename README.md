# Adhaan Klok OS 🕌

Een moderne, minimalistische en spirituele interface voor slimme Adhaan-klokken (geoptimaliseerd voor Android 4.4 / 6.0.1 WebView, resolutie 1024×600).

---

## 🌟 Belangrijkste Functies

- **Officiële Diyanet Gebedstijden**:
  - Offline-first zaaddata voor **Lahey (Den Haag)** met automatische astronomische berekening.
  - Automatische online synchronisatie zodra er Wi-Fi-verbinding is via de Diyanet API.
  - Rustgevende achtergronden met zachte tijd-gebaseerde aanpassingen.

- **Müezzin Stüdyosu & Turkse Makam Traditie**:
  - Ondersteuning voor de klassieke 5 Ottomaanse makams per gebedstijd:
    - **Sabah**: Sabâ Makamı
    - **Öğle**: Rast Makamı
    - **İkindi**: Hicaz Makamı
    - **Akşam**: Segâh Makamı
    - **Yatsı**: Uşşak Makamı
  - Beroemde müezzins: Mekke-i Mükerreme (Şeyh Ali Ahmed Mulla), Medine-i Münevvere, Mescid-i Aksa, Ayasofya-i Kebir Cami-i Şerifi, Mishary Rashid Alafasy.
  - Optie om per gebedstijd een aparte müezzin of makam in te stellen, inclusief volumeregeling en automatische Ezan Duası.

- **Maneviyat Hub**:
  - **Zikir & Tesbihat**: Namaz tesbihatı met ingebouwde digitale tellers en Hısnü'l-Müslim dagelijkse zikirleri.
  - **Esmâü'l-Hüsnâ**: De 99 Schone Namen van Allah met betekenissen.
  - **Kur’an ve Sünnet Duaları**: Rabbenâ duaları, İnşirah en profetische smeekbeden in het Arabisch met Turkse vertaling.
  - **Ayet ve Hadis Seçkisi**: Inspirerende dagelijkse verzen en hadiths die ook op het hoofdscherm getoond kunnen worden.

- **Slaapkamer-Vriendelijke Pitch-Black Gece Modu**:
  - Volledig zwart AMOLED/LCD-standbystand (`#000000`) met zacht gedimde grijze aftelcijfers (`#6E6A64`) die geen fel licht in een donkere slaapkamer uitstralen.
  - Met één tik op het scherm direct terugkeren naar de standaardweergave.

- **Android 6.0.1 / Chrome 49 WebView Compatibiliteit**:
  - Volledig compatibel geschreven en getranspileerd naar ES5 met polyfills voor oudere Android WebView-versies.
  - Geen afhankelijkheid van externe internetverbindingen voor basisfunctionaliteit; offline audiotracks en lokale lettertypes (Cormorant Garamond, Plus Jakarta Sans, Amiri).

---

## 📁 Projectstructuur

```text
├── index.html            # Hoofd UI structuur en responsive layouts
├── styles.css            # Gehele styling, thema's, animaties en typografie
├── app.es6.js            # Moderne broncode (ES6) van de klokfunctionaliteit
├── app.js                # ES5 getranspileerde runtime voor Android WebView
├── diyanet-lahey.js      # Officiële Diyanet kalender en vakit berekeningen
├── deploy-to-clock.sh    # ADB deploy-script om direct naar de klok te pushen
├── download-adhans.sh    # Script voor het lokaal downloaden van adhaan-audio
├── backup-clock-os.sh    # Backup-script voor de originele fabrieks-firmware
├── audio/                # Lokale MP3-bestanden van ezan en dua
├── fonts/                # Lokale lettertypes (Amiri, Plus Jakarta Sans, Averta)
├── img/                  # Geoptimaliseerde en geblurde achtergrondafbeeldingen
└── android-app/          # Android launcher-app project
```

---

## 🚀 Installatie & Deployen naar de Klok

1. Verbind de adhaanklok via USB en zorg dat ADB is ingeschakeld.
2. Voer het deploy-script uit:
   ```bash
   ./deploy-to-clock.sh
   ```
3. Het script pusht automatisch alle UI-bestanden, lettertypes, afbeeldingen en audiobestanden naar `/data/data/com.yij.outdoor/files/html/` en start de app direct opnieuw op.
