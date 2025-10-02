# Ülkemde Siyonist İstemiyorum - İmza Kampanyası

Bu repo, HÜDA PAR tarafından yürütülen "Ülkemde Siyonist İstemiyorum" kampanyası için hazırlanmış, SvelteKit tabanlı, modern ve performanslı bir web uygulamasıdır. Aşağıdaki dokümantasyon; mimariyi, iş kurallarını, akışları, API sözleşmelerini ve dağıtım süreçlerini ayrıntılı olarak açıklar.

## 🎯 Amaç ve Kapsam

- Kampanyaya destek imzalarının toplanması
- E-posta doğrulamasıyla imzaların geçerliliğinin teyidi
- Toplam imza sayısının anlık gösterimi ve paylaşım akışlarının kolaylaştırılması

## 🧭 Mimari Genel Bakış

- Framework: SvelteKit 2.x (Svelte 5 peer)
- Styling: Tailwind CSS 4.x (`@tailwindcss/vite` eklentisi ile)
- Build: Vite 7
- Adaptör: `@sveltejs/adapter-vercel` (Vercel uyumlu)
- Dil/Tipler: JS (TS ayak izi mevcut: `app.d.ts`) ve `svelte-check` desteği

### Proje Yapısı (Gerçek Dosya Hiyerarşisi)

```
src/
├── app.css               # Tailwind giriş noktası (@import 'tailwindcss')
├── app.html              # HTML template (meta/OG/Twitter kartları)
├── app.d.ts              # SvelteKit tür bildirimleri
├── lib/
│   ├── database.js       # In-memory imza depolama ve iş kuralları
│   └── index.js          # (boş) yeniden ihracat noktası
└── routes/
    ├── +layout.svelte    # Üst seviye layout: header/footer, nav, responsive menü
    ├── +page.svelte      # Ana sayfa: imza formu, sayaç, paylaşım akışları
    ├── kanun-teklifimiz/
    │   └── +page.svelte  # Bilgilendirme sayfası
    ├── dogrula/
    │   └── [kod]/
    │       └── +page.svelte  # E-posta doğrulama geri dönüş sayfası
    └── api/
        ├── imza-ekle/
        │   └── +server.js    # POST /api/imza-ekle
        ├── imza-sayisi/
        │   └── +server.js    # GET /api/imza-sayisi
        └── dogrula/
            └── [kod]/
                └── +server.js# GET /api/dogrula/[kod]

static/
└── images/
    ├── logo.png
    ├── gaza.png
    └── favicon.png
```

### Yapılandırmalar

- `svelte.config.js`: Vercel adaptörü etkin.
- `vite.config.js`: `@tailwindcss/vite` ve `@sveltejs/kit/vite` eklentileri birlikte çalışır.
- `package.json` önemli scriptler:
  - `dev`, `build`, `preview`
  - `check` (svelte-check), `format`, `lint`
  - Paketleme için `prepack`: `svelte-package` ve `publint` içerir.

## 🧩 İş Kuralları ve Uygulama Akışları

### 1) İmza Oluşturma Akışı

- Kullanıcı ana sayfadaki formu doldurur: `adSoyad` (zorunlu), `email` (zorunlu), `sehir` (opsiyonel), `cinsiyet` (opsiyonel).
- İstemci tarafı validasyonları:
  - Boş alan kontrolü (adSoyad/email)
  - E-posta regex kontrolü
- Sunucu tarafı (POST `/api/imza-ekle`):
  - Zorunlu alan kontrolü ve e-posta format kontrolü
  - Mükerrer e-posta kontrolü: `findImzaByEmail`
  - Yeni imza `addImza` ile eklenir (in-memory)
  - Doğrulama kodu (`dogrulamaKodu`) üretilir ve loglanır (gerçek uygulamada e-posta gönderilir)
  - Başarılı cevap döner ve istemci paylaşım modalını gösterir

Notlar:
- Şu an veriler RAM üzerindedir. Uygulama yeniden başlatıldığında imzalar sıfırlanır.
- E-posta gönderimi henüz gerçek bir servisle entegre değildir (logda simüle edilir).

### 2) E-posta Doğrulama Akışı

- Kullanıcı e-posta ile iletilen linke tıklar: `/dogrula/[kod]` sayfası açılır.
- Sayfa, API çağrısı yapar: GET `/api/dogrula/[kod]`
- Sunucu tarafı:
  - `findImzaByDogrulamaKodu` ile kayıt bulunur
  - Zaten doğrulanmışsa bilgi mesajı verir
  - Değilse, `dogrulaImza` ile işaretlenir
  - Başarılı/başarısız durumlar uygun HTTP kodlarıyla döner

### 3) İmza Sayacı

- GET `/api/imza-sayisi` sonucu:
  - `toplam`: 1247 başlangıç değeri + doğrulanmış imzaların sayısı
  - `hedef`: 10000
  - `yuzde`: `min(toplam/hedef*100, 100)`
  - `son24Saat`: son 24 saatte doğrulanan imza sayısı

### 4) Sosyal Paylaşım

- Başarılı imza sonrası modal üzerinden Facebook/WhatsApp/X paylaşım linkleri yeni pencerede açılır.

## 🔌 API Sözleşmeleri

### POST `/api/imza-ekle`

İstek gövdesi:

```json
{
  "adSoyad": "Ahmet Yılmaz",
  "email": "ahmet@example.com",
  "sehir": "İstanbul",
  "cinsiyet": "erkek"
}
```

Başarılı cevap:

```json
{
  "success": true,
  "message": "İmzanız kaydedildi. E-posta adresinize doğrulama linki gönderildi.",
  "imzaId": 2
}
```

Hata örnekleri (HTTP 400):

```json
{ "error": "Ad-Soyad ve e-posta alanları zorunludur." }
```

```json
{ "error": "Geçerli bir e-posta adresi giriniz." }
```

```json
{ "error": "Bu e-posta adresi ile daha önce imza verilmiş." }
```

Sunucu hatası (HTTP 500): `{ "error": "Sunucu hatası. Lütfen tekrar deneyin." }`

### GET `/api/imza-sayisi`

Örnek cevap:

```json
{
  "toplam": 1305,
  "hedef": 10000,
  "yuzde": 13.05,
  "son24Saat": 58
}
```

### GET `/api/dogrula/[kod]`

Başarılı doğrulama:

```json
{
  "success": true,
  "message": "E-posta adresiniz başarıyla doğrulandı. İmzanız artık geçerli!",
  "imzaId": 2
}
```

Zaten doğrulanmış:

```json
{
  "success": true,
  "message": "Bu e-posta adresi zaten doğrulanmış.",
  "zatenDogrulanmis": true
}
```

Geçersiz kod (HTTP 404): `{ "error": "Geçersiz doğrulama kodu." }`

## 🔒 Güvenlik ve Gizlilik

- İstemci ve sunucu tarafı form validasyonları mevcuttur.
- CSRF/XSS: SvelteKit’in varsayılan korumaları faydalanılır.
- Mükerrer imza önleme: e-posta bazlı kontrol ile sağlanır.
- Gizlilik: Veriler sadece kampanya amacıyla işlenmelidir. Şu an kalıcı depolama yoktur.

## ⚠️ Bilinen Kısıtlar ve Riskler

- Kalıcı depolama yok (in-memory). Uygulama yeniden başlatıldığında tüm imzalar silinir.
- E-posta doğrulama gerçekten gönderilmez; log ile simüle edilir.
- Rate limiting yok. Spam ve kötüye kullanımı engellemek için eklenmelidir.

## 🔮 Yol Haritası (Öneriler)

- Kalıcı DB (PostgreSQL/MySQL) ve migration stratejisi
- SMTP/Transactional e-posta entegrasyonu (Mailgun, SES, Postmark)
- Yönetim paneli (doğrulanmış imzalar listesi/istatistikler/eksport)
- Rate limiting (IP/e-posta bazlı), reCAPTCHA/Turnstile
- Kişisel Verilerin Korunması (KVKK) metinleri ve açık rıza akışları
- Telemetri/Analitik (Privacy-first, self-hosted önerilir)
- PWA ve önbellekleme stratejileri

## 🛠️ Kurulum

### Gereksinimler

- Node.js ≥ 18
- npm ≥ 9

### Adımlar

1) Depoyu klonlayın ve dizine geçin:

```bash
git clone <repository-url>
cd hudapar-imza-kampanyasi
```

2) Bağımlılıkları yükleyin:

```bash
npm install
```

3) Geliştirme sunucusunu başlatın:

```bash
npm run dev
```

4) Tarayıcıda açın: `http://localhost:5173`

### Kalite Kontrolleri

```bash
npm run check   # svelte-check
npm run format  # prettier --write
npm run lint    # prettier --check
```

## 🚀 Build ve Dağıtım

### Production build

```bash
npm run build
```

### Önizleme

```bash
npm run preview
```

### Vercel (önerilen)

- Projeyi Vercel’e içe aktarın, adaptör otomatik uyumludur.
- Ortam değişkeni gereksinimi yoktur (şu anki sürüm).

> Not: Kalıcı veritabanı ve e-posta servisleri eklendiğinde ilgili ortam değişkenlerini tanımlayın.

## 🎨 UI/UX Notları

- Renk paleti: green-700/600 ağırlıklı; arka plan `gray-50`, metin `gray-800`.
- Tipografi: Sistem fontları, başlıklar `font-bold`.
- Responsive kırılımlar: mobile (<768), tablet (768-1024), desktop (>1024).

## 🙌 Katkı ve İletişim

Katkı akışı:

1. Fork
2. Branch açın: `git checkout -b feature/x`
3. Commit: `git commit -m "Açıklayıcı mesaj"`
4. Push ve PR oluşturun

İletişim:

- Web: `https://hudapar.org`
- E-posta: `info@hudapar.org`

---

"Ülkemde Siyonist İstemiyorum" – Adalet için birlikte duruyoruz.