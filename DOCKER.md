# Docker ile İmza Kampanyası Uygulaması

Bu dokümantasyon, SvelteKit tabanlı İmza Kampanyası uygulamasını Docker ile nasıl çalıştıracağınızı açıklar.

## Gereksinimler

- Docker
- Docker Compose (opsiyonel)

## Hızlı Başlangıç

### Docker Compose ile (Önerilen)

```bash
# Uygulamayı build et ve çalıştır
docker-compose up --build

# Arka planda çalıştır
docker-compose up -d --build
```

### Docker ile

```bash
# Docker image'ı build et
docker build -t imza-kampanyasi .

# Container'ı çalıştır
docker run -p 3000:3000 imza-kampanyasi
```

## Erişim

Uygulama şu adreste erişilebilir: http://localhost:3000

## Environment Değişkenleri

Uygulama aşağıdaki environment değişkenlerini kullanır:

- `BASE_URL`: http://localhost:2357
- `DIRECTUS_TOKEN`: 0R4bhkloS7M8mr7mwMq8L-hmnJPzoVVa
- `ORIGIN`: http://localhost:3000

## Docker Compose Komutları

```bash
# Uygulamayı durdur
docker-compose down

# Logları görüntüle
docker-compose logs -f

# Container'ı yeniden başlat
docker-compose restart

# Image'ı yeniden build et
docker-compose build --no-cache
```

## Production için Öneriler

1. **Environment Değişkenleri**: Production'da gerçek değerleri kullanın
2. **HTTPS**: Reverse proxy (nginx) kullanın
3. **Monitoring**: Health check endpoint'i kullanılabilir
4. **Security**: Non-root user kullanılıyor

## Sorun Giderme

### Port Zaten Kullanımda
```bash
# Farklı port kullan
docker run -p 3001:3000 imza-kampanyasi
```

### Build Hatası
```bash
# Cache olmadan build et
docker build --no-cache -t imza-kampanyasi .
```

### Logları Kontrol Et
```bash
# Container logları
docker logs imza-kampanyasi-app

# Docker Compose logları
docker-compose logs imza-kampanyasi
```

