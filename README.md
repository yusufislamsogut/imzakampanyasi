# Ülkemde Siyonist İstemiyorum - İmza Kampanyası

Bu proje, HUDAPAR (Hür Dava Partisi) tarafından başlatılan "Ülkemde Siyonist İstemiyorum" imza kampanyası için geliştirilmiş modern bir web uygulamasıdır.

## 🎯 Proje Amacı

Meclis'e sunulan "Siyonist Faaliyetlerin Yasaklanması ve Soykırım Suçlularının Yargılanması Hakkında Kanun Teklifi"ni desteklemek ve kamuoyunun desteğini almak amacıyla hazırlanmıştır.

## 🚀 Özellikler

### ✅ Tamamlanan Özellikler
- **Responsive Tasarım**: Tüm cihazlarda uyumlu, modern arayüz
- **İmza Formu**: Ad-Soyad (zorunlu), E-posta (zorunlu), Şehir, Cinsiyet bilgileri
- **E-posta Doğrulama**: Mükerrer imza önleme sistemi
- **İmza Sayacı**: Gerçek zamanlı imza sayısı gösterimi
- **Sosyal Medya Paylaşımı**: Facebook, WhatsApp, X (Twitter) entegrasyonu
- **Çoklu Sayfa**: Ana sayfa, Kanun Teklifimiz, İletişim sayfaları
- **API Entegrasyonu**: RESTful API ile veri yönetimi
- **HUDAPAR Uyumlu Tasarım**: Ana web sitesi ile uyumlu renk paleti

### 🔧 Teknik Özellikler
- **SvelteKit**: Modern, performanslı framework
- **TailwindCSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first yaklaşım
- **SEO Optimized**: Meta tags ve Open Graph desteği
- **Form Validasyonu**: Client-side ve server-side validasyon
- **Error Handling**: Kullanıcı dostu hata yönetimi

## 🛠️ Teknoloji Yığını

- **Frontend**: SvelteKit 2.x
- **Styling**: TailwindCSS 4.x
- **Runtime**: Node.js
- **Package Manager**: npm
- **Build Tool**: Vite

## 📦 Kurulum

### Gereksinimler
- Node.js (v18 veya üzeri)
- npm (v9 veya üzeri)

### Adımlar

1. **Projeyi klonlayın:**
```bash
git clone <repository-url>
cd hudapar-imza-kampanyasi
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
```

3. **Geliştirme sunucusunu başlatın:**
```bash
npm run dev
```

4. **Tarayıcıda açın:**
```
http://localhost:5173
```

## 🏗️ Build ve Deploy

### Production Build
```bash
npm run build
```

### Preview (Production build'i test etmek için)
```bash
npm run preview
```

### Linting ve Formatting
```bash
npm run check      # Svelte type checking
npm run format     # Prettier ile kod formatı
npm run lint       # Prettier ile kod kontrolü
```

## 📁 Proje Yapısı

```
src/
├── routes/                 # Sayfa rotaları
│   ├── +layout.svelte     # Ana layout
│   ├── +page.svelte       # Ana sayfa (imza formu)
│   ├── kanun-teklifimiz/  # Kanun teklifi sayfası
│   ├── iletisim/          # İletişim sayfası
│   ├── dogrula/[kod]/     # E-posta doğrulama sayfası
│   └── api/               # API endpoints
│       ├── imza-ekle/     # İmza ekleme API
│       ├── imza-sayisi/   # İmza sayısı API
│       └── dogrula/       # E-posta doğrulama API
├── lib/                   # Paylaşılan bileşenler
├── app.html              # HTML template
├── app.css               # Global CSS
└── app.d.ts              # TypeScript definitions
```

## 🖼️ Statik Görseller

- `static/` klasörü altındaki dosyalar doğrudan kök URL'den yayınlanır.
- Kullanılan görseller:
  - Logo: `/favicon.svg`
  - Gazze afişi (hero arkaplanı): `/hero-gaza.jpg` → dosyayı `static/` içine kopyalayın.

Örnek kullanım:
```html
<img src="/hero-gaza.jpg" alt="Gazze" />
```

## 🔌 API Endpoints

### POST `/api/imza-ekle`
İmza ekleme endpoint'i
```json
{
  "adSoyad": "Ahmet Yılmaz",
  "email": "ahmet@example.com",
  "sehir": "İstanbul",
  "cinsiyet": "erkek"
}
```

### GET `/api/imza-sayisi`
İmza sayısı bilgisi
```json
{
  "toplam": 1247,
  "hedef": 10000,
  "yuzde": 12.47
}
```

### GET `/api/dogrula/[kod]`
E-posta doğrulama endpoint'i

## 🎨 Tasarım Sistemi

### Renk Paleti
- **Birincil Renk**: Green-700 (#15803d) - HUDAPAR teması
- **İkincil Renk**: Green-600 (#16a34a)
- **Arka Plan**: Gray-50 (#f9fafb)
- **Metin**: Gray-800 (#1f2937)

### Tipografi
- **Ana Font**: System font stack (Inter, sans-serif)
- **Başlıklar**: Font-bold
- **Gövde Metni**: Font-normal

## 🔒 Güvenlik Özellikleri

- **E-posta Validasyonu**: Regex ile format kontrolü
- **Mükerrer İmza Önleme**: E-posta bazlı kontrol
- **Form Validasyonu**: Client ve server-side
- **XSS Koruması**: SvelteKit built-in koruması
- **CSRF Koruması**: SvelteKit built-in koruması

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🚀 Deployment

### Vercel (Önerilen)
1. Vercel hesabınıza giriş yapın
2. Projeyi import edin
3. Build ayarları otomatik algılanacak
4. Deploy edin

### Netlify
1. Netlify hesabınıza giriş yapın
2. Projeyi drag & drop ile yükleyin
3. Build command: `npm run build`
4. Publish directory: `build`

### Geleneksel Hosting
```bash
npm run build
# build klasörünü sunucunuza yükleyin
```

## 🔮 Gelecek Geliştirmeler

### Planlanan Özellikler
- **Veritabanı Entegrasyonu**: PostgreSQL/MySQL
- **E-posta Servisi**: SMTP ile otomatik e-posta gönderimi
- **Admin Paneli**: İmza yönetimi ve istatistikler
- **Gelişmiş Analytics**: Google Analytics entegrasyonu
- **Multi-language**: İngilizce dil desteği
- **PWA**: Progressive Web App özellikleri

### Teknik İyileştirmeler
- **Caching**: Redis ile performans optimizasyonu
- **Rate Limiting**: API abuse önleme
- **Image Optimization**: WebP format desteği
- **CDN**: Static asset'ler için CDN kullanımı

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/yeni-ozellik`)
3. Commit yapın (`git commit -am 'Yeni özellik eklendi'`)
4. Push yapın (`git push origin feature/yeni-ozellik`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje HUDAPAR - Hür Dava Partisi tarafından geliştirilmiştir.

## 📞 İletişim

- **Web**: [hudapar.org](https://hudapar.org)
- **E-posta**: info@hudapar.org
- **Kampanya Sitesi**: [imzala.hudapar.org](https://imzala.hudapar.org)

## 🙏 Teşekkürler

Bu projeyi geliştirirken kullanılan açık kaynak projelere teşekkürler:
- [SvelteKit](https://kit.svelte.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)

---

**"Ülkemde Siyonist İstemiyorum!"** - Adalet için birlikte duruyoruz.