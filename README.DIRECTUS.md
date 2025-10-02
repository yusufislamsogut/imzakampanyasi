# Directus Kurulum ve Yapılandırma (İmza Kampanyası)

Bu doküman, kampanya verilerini kalıcı ve güvenli biçimde yönetmek için Directus üzerinde ihtiyaç duyulan koleksiyon şemalarını, izinleri, flow (otomasyon) kurgusunu ve e‑posta gönderimi için SMTP yapılandırmasını açıklar. Ayrıca istemci (SvelteKit) ve sunucu (Directus) arasındaki entegrasyon değişkenleri listelenir.

## İçindekiler

- 1. Mimaride Directus'un Konumu
- 2. Koleksiyonlar ve Alanlar (Şema)
- 3. Roller ve İzinler
- 4. Flow'lar ve Otomasyonlar
- 5. E‑posta (SMTP) Yapılandırması
- 6. Ortam Değişkenleri ve Entegrasyon
- 7. Yedekleme, Günlüğe Alma ve Gözlemlenebilirlik
- 8. Gelecek İyileştirmeler (Öneriler)

---

## 1) Mimaride Directus'un Konumu

- Directus; imzaların, doğrulama durumlarının ve istatistiklerin saklandığı bir Headless CMS/API katmanıdır.
- SvelteKit uygulaması, imza ekleme ve doğrulama isteklerini sunucu tarafında Directus'a iletir (kamuya açık bir token kullanılmaz; sunucu tarafında Static Token/Personal Token kullanılır).
- E‑posta gönderimleri, Directus flow'ları üzerinden tetiklenerek SMTP ile yapılır.

Basit veri akışı:

```
Kullanıcı → SvelteKit (POST /api/imza-ekle) → Directus (create: imzalar)
                                               └─(Flow) SMTP ile doğrulama e-postası

Kullanıcı (doğrulama linki) → SvelteKit (GET /api/dogrula/[kod]) → Directus (update: dogrulanmis)

Sayaç → SvelteKit (GET /api/imza-sayisi) → Directus (aggregate: imzalar)
```

---

## 2) Koleksiyonlar ve Alanlar (Şema)

### 2.1) `imzalar` (Ana koleksiyon)

- Amaç: İmza kayıtlarını saklamak.
- İlkeler: E‑posta benzersiz olmalı (aynı e‑posta ile birden fazla imza engellenir), doğrulama kodu ile doğrulama tamamlanır.

Alanlar:

- `id` (primary key, integer/autoincrement)
- `ad_soyad` (string, required, max 150)
- `email` (string, required, unique, max 190, lowercase normalize önerilir)
- `sehir` (string, optional, max 60)
- `cinsiyet` (string, optional, enum: `erkek`, `kadin`, `belirtmek-istemiyorum`)
- `tarih` (datetime, required, default: now)
- `dogrulanmis` (boolean, required, default: false)
- `dogrulama_kodu` (string, required, unique, max 64)
- `dogrulama_tarihi` (datetime, optional)

İndeksler:

- Unique index: `email`
- Unique index: `dogrulama_kodu`
- Non-unique index: `tarih`

Validasyon kuralları (öneri):

- `email` RFC-5322 pattern; Directus validation regex: `^[^\s@]+@[^\s@]+\.[^\s@]+$`
- `ad_soyad` min length 3, sadece harf/boşluk kontrollü (opsiyonel regex)

Örnek kayıt:

```json
{
  "ad_soyad": "Ahmet Yılmaz",
  "email": "ahmet@example.com",
  "sehir": "İstanbul",
  "cinsiyet": "erkek",
  "dogrulama_kodu": "a1b2c3d4e"
}
```

### 2.2) `email_sablonlari` (İsteğe bağlı, yönetilebilir şablonlar)

- Amaç: Doğrulama ve bilgilendirme e‑postalarının içeriklerini admin panelinden yönetmek.

Alanlar:

- `id` (primary key)
- `ad` (string, unique, örn: `dogrulama-eposta`)
- `konu` (string)
- `govde_html` (text, HTML)
- `govde_text` (text, plain fallback)
- `aktif` (boolean, default true)

Değişkenler (öneri): `{{ad_soyad}}`, `{{dogrulama_linki}}`, `{{kampanya_adi}}`

### 2.3) `ayarlar` (İsteğe bağlı, site/genel ayarlar)

- `id` (singleton önerilir)
- `kampanya_adi` (string)
- `hedef_sayi` (integer, default: 10000)
- `baslangic_sayaci` (integer, default: 1247)
- `paylasim_mesaji` (text)

Not: Sayaç hesabı için SvelteKit `GET /api/imza-sayisi` uç noktası; `baslangic_sayaci + doğrulanmış imza` formülünü Directus değerlerinden okuyabilir.


---

## 3) Roller ve İzinler

Önerilen roller:

- `public` (anonim istekler)
  - `imzalar`: create (sadece belirli alanlar: ad_soyad, email, sehir, cinsiyet)
  - `imzalar`: read yok (mahremiyet)
  - `email_sablonlari`/`ayarlar`: read yok

- `server` (SvelteKit sunucusunda kullanılan Static Token)
  - `imzalar`: create/read/update (email/dogrulama alanlarına erişim)
  - `email_sablonlari`: read
  - `ayarlar`: read

- `admin`
  - Tüm koleksiyonlarda full erişim

İzin prensipleri:

- E‑posta alanı ve kişisel veriler anonim kullanıcılara asla okunmamalıdır.
- Doğrulama ve sayaç uçları sunucu tarafında `server` rolü ile çağrılmalıdır.

---

## 4) Flow'lar ve Otomasyonlar

### 4.1) "İmza oluşturulduğunda doğrulama e‑postası gönder"

- Tetikleyici: Event → On Create → `imzalar`
- Filtre: `dogrulanmis == false`
- Adımlar:
  1. Doğrulama linkini oluştur: `${FRONTEND_BASE_URL}/dogrula/${dogrulama_kodu}`
  2. `email_sablonlari`ndan `dogrulama-eposta`yı çek veya sabit şablon kullan
  3. SMTP ile e‑posta gönder (Directus Mail step)

Örnek konu/gövde:

- Konu: `İmzanızı tamamlayın: E‑posta doğrulama`
- HTML: `Merhaba {{ad_soyad}}, imzanızı tamamlamak için <a href="{{dogrulama_linki}}">bu bağlantıya</a> tıklayın.`

### 4.2) (Opsiyonel) "Doğrulama başarısız/tekrar gönder"

- Manuel tetiklenebilir flow: `imza_id` girilerek doğrulama e‑postası tekrar gönderilir.

### 4.3) (Opsiyonel) "Günlük istatistik özeti"

- Zamanlanmış (CRON) flow: Son 24 saatteki doğrulanmış imzaları say, yöneticilere rapor e‑postası gönder.

---

## 5) E‑posta (SMTP) Yapılandırması

Directus sunucusunda `.env`:

```
# SMTP
EMAIL_TRANSPORT=smtp
EMAIL_SMTP_HOST=smtp.example.com
EMAIL_SMTP_PORT=587
EMAIL_SMTP_USER=apikey_veya_kullanici
EMAIL_SMTP_PASSWORD=parola_veya_api_key
EMAIL_SMTP_SECURE=false           # 587 için false, 465 için true
EMAIL_FROM="HÜDA PAR <no-reply@hudapar.org>"

# Genel
PUBLIC_URL=https://directus.example.com
KEY=complex-secret-key
SECRET=complex-secret-key
```

Notlar:

- DMARC/DKIM/SPF kayıtlarınızı DNS üzerinde sağlayın.
- Giden e‑postalar için `From` ve `Reply-To` değerlerini politika ve itibar için dikkatle seçin.

---

## 6) Ortam Değişkenleri ve Entegrasyon

SvelteKit tarafında `.env`:

```
VITE_DIRECTUS_URL=https://directus.example.com
DIRECTUS_STATIC_TOKEN=server_role_static_token
FRONTEND_BASE_URL=https://imzala.hudapar.org

# Sayaç opsiyonları (Directus ayarları yerine istemci .env kullanacaksanız)
IMZA_HEDEF=10000
BASLANGIC_SAYACI=1247
```

Kullanım:

- SvelteKit API route'ları (`/api/imza-ekle`, `/api/dogrula/[kod]`, `/api/imza-sayisi`), Directus REST/GraphQL üzerinden `DIRECTUS_STATIC_TOKEN` ile yetkili çağrı yapar.
- `public` token kullanılmaz; kullanıcı verisi mahremdir.

---

## 7) Yedekleme, Günlüğe Alma ve Gözlemlenebilirlik

- Veritabanı yedekleri (günlük) otomatik alınmalıdır.
- Oran sınırlama (rate limiting) uygulamada veya reverse proxy katmanında yapılmalıdır.
- Directus Audit Log (Enterprise) ile temel olaylar takip edilebilir.

---

## 8) Gelecek İyileştirmeler (Öneriler)

- Rehberli Onboarding: Directus Collections ve Flow'ların bir CLI betiği ile kurulum otomasyonu
- KVKK/Rıza: İmza formuna açık rıza metinlerinin eklenmesi ve saklanması (`riza_kabul` alanı, zaman damgası)
- İptal Mekanizması: "Verimi sil" talebi için ayrı uç ve flow
- Analitik: Privacy-first analitik (ör. Plausible/Matomo) ve raporlama panosu

---

## Ek: Koleksiyon Oluşturma Özetleri (İpuçları)

`imzalar` alan tipleri (Directus arayüzünden):

- ad_soyad → Text (string)
- email → Email (string), unique
- sehir → Text (string)
- cinsiyet → Dropdown/Select (string), seçenekler: `erkek`, `kadin`, `belirtmek-istemiyorum`
- tarih → DateTime, default: `CURRENT_TIMESTAMP`
- dogrulanmis → Boolean, default: false
- dogrulama_kodu → Text (string), unique
- dogrulama_tarihi → DateTime (nullable)

Flow e‑posta adımı için şablon örneği:

```
Konu: İmzanızı doğrulayın

Merhaba {{ad_soyad}},

İmzanızı tamamlamak için aşağıdaki bağlantıya tıklayın:
{{dogrulama_linki}}

Teşekkürler,
HÜDA PAR
```



