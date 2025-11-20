# Video Diary App - Kurulum Planı

## 📦 Gerekli Kütüphaneler

### Core Technologies (Zorunlu)

```bash
# State Management
npm install zustand

# Async Operations & API Management
npm install @tanstack/react-query

# Video Processing
npm install expo-trim-video

# Styling
npm install nativewind
npm install --save-dev tailwindcss

# Video Playback
npm install expo-video

# Video Selection
npm install expo-image-picker

# Storage (Zustand ile AsyncStorage)
npm install @react-native-async-storage/async-storage
```

### Bonus Technologies (İsteğe Bağlı - Önerilir)

```bash
# Database
npm install expo-sqlite

# Validation
npm install zod

# React Native Reanimated (zaten kurulu ✓)
# react-native-reanimated ~4.1.1
```

## 🎯 Proje Planı

### Faz 1: Temel Kurulum ve Yapılandırma

1. ✅ Tüm kütüphaneleri kur
2. ✅ NativeWind yapılandırması (tailwind.config.js, babel.config.js)
3. ✅ Tanstack Query Provider kurulumu
4. ✅ Zustand store yapısı oluştur
5. ✅ AsyncStorage entegrasyonu

### Faz 2: Ana Ekran (Home Screen)

1. Video listesi görünümü
2. Zustand store ile video listesi yönetimi
3. AsyncStorage ile persist storage
4. Video kartları komponenti
5. Boş state gösterimi

### Faz 3: Detay Sayfası (Details Page)

1. Video detay sayfası route'u
2. Video player entegrasyonu
3. Name ve Description gösterimi
4. Navigasyon entegrasyonu

### Faz 4: Crop Modal (3 Adımlı)

1. Modal yapısı ve navigasyon
2. **Adım 1:** Video seçimi (expo-image-picker)
3. **Adım 2:** Video cropping UI (scrubber ile 5 saniye seçimi)
4. **Adım 3:** Metadata form (Name, Description)
5. Tanstack Query ile video cropping işlemi
6. expo-trim-video entegrasyonu

### Faz 5: Bonus Özellikler

1. Edit sayfası (Name ve Description düzenleme)
2. Expo SQLite entegrasyonu (AsyncStorage yerine)
3. React Native Reanimated animasyonları
4. Zod validation entegrasyonu

## 📁 Klasör Yapısı Önerisi

```
app/
  (tabs)/
    index.tsx          # Ana ekran (video listesi)
    explore.tsx        # (opsiyonel - mevcut)
  video/
    [id].tsx           # Detay sayfası
    edit/[id].tsx      # Edit sayfası (bonus)
  crop/
    index.tsx          # Crop modal - Adım 1
    trim.tsx           # Crop modal - Adım 2
    metadata.tsx       # Crop modal - Adım 3

components/
  video/
    VideoCard.tsx      # Video kartı komponenti
    VideoPlayer.tsx    # Video oynatıcı komponenti
  crop/
    VideoScrubber.tsx # Video scrubber komponenti
  forms/
    MetadataForm.tsx   # Metadata form komponenti

store/
  videoStore.ts        # Zustand store

lib/
  queryClient.ts       # Tanstack Query client
  storage.ts           # AsyncStorage helpers
  validation.ts        # Zod schemas

hooks/
  useVideos.ts         # Video listesi hook
  useVideoCrop.ts      # Video cropping hook
```

## 🚀 İlk Adım: Kütüphane Kurulumu

Tüm kütüphaneleri kurduktan sonra yapılandırma dosyalarını hazırlayacağız.
