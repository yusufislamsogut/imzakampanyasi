import { json } from '@sveltejs/kit';
import { directus, createItem, readItems, readSingleton } from '$lib/directus/directus.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	try {
		const data = await request.json();
		
		// Kampanya durumunu kontrol et
		const ayarlar = await directus.request(
			readSingleton('ayarlar', {
				fields: ['kampanya_aktif']
			})
		);
		
		if (ayarlar?.kampanya_aktif === false) {
			return json(
				{ error: 'Kampanya sona ermiştir. Yeni imza kabul edilmemektedir.' },
				{ status: 403 }
			);
		}
		
		// Validasyon
		if (!data.adSoyad || !data.email) {
			return json(
				{ error: 'Ad-Soyad ve e-posta alanları zorunludur.' },
				{ status: 400 }
			);
		}

		// Email format kontrolü
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(data.email)) {
			return json(
				{ error: 'Geçerli bir e-posta adresi giriniz.' },
				{ status: 400 }
			);
		}

		// E-posta adresini normalize et
		const normalizedEmail = data.email.toLowerCase().trim();
		
		// Mükerrer e-posta kontrolü - Mevcut e-posta ile kayıt var mı?
		console.log('E-posta kontrolü yapılıyor:', normalizedEmail);
		
		const existingImzalar = await directus.request(readItems('imzalar', {
			filter: {
				email: { _eq: normalizedEmail }
			},
			limit: 1,
			fields: ['id', 'ad_soyad', 'email', 'dogrulanmis', 'dogrulama_kodu', 'date_created', 'dogrulama_tarihi']
		}));

		console.log('Mevcut imzalar:', existingImzalar);

		// Eğer bu e-posta ile herhangi bir kayıt varsa yeni kayıt oluşturma
		// Directus'tan gelen veri yapısını kontrol et
		const imzalar = Array.isArray(existingImzalar) ? existingImzalar : (existingImzalar?.data || []);
		console.log('İşlenen imzalar:', imzalar);
		
		if (Array.isArray(imzalar) && imzalar.length > 0) {
			const mevcutImza = imzalar[0];
			console.log('Mevcut imza bulundu - yeni kayıt oluşturulmayacak:', mevcutImza);
			
			// Basit hata mesajı - mevcut e-posta ile kayıt var
			return json(
				{ 
					error: 'Bu e-posta adresi ile daha önce imza verilmiş. Aynı e-posta ile birden fazla imza atılamaz.',
					errorType: 'email_exists',
					existingImza: {
						ad_soyad: mevcutImza.ad_soyad,
						email: mevcutImza.email,
						dogrulanmis: mevcutImza.dogrulanmis,
						date_created: mevcutImza.date_created
					}
				},
				{ status: 400 }
			);
		}

		// Doğrulama kodu oluştur
		const dogrulama_kodu = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

		// İmza verisi hazırla
		const imzaData = {
			ad_soyad: data.adSoyad.trim(),
			email: normalizedEmail, // Normalize edilmiş e-posta kullan
			sehir: data.sehir?.trim() || null,
			cinsiyet: data.cinsiyet || null,
			dogrulama_kodu: dogrulama_kodu,
			dogrulanmis: false
		};

		console.log('Gönderilen imza verisi:', imzaData);

		// Directus'ta imza oluştur
		const yeniImza = await directus.request(createItem('imzalar', imzaData));

		// Burada e-posta doğrulama linki gönderilecek
		console.log(`E-posta doğrulama kodu: ${dogrulama_kodu} - ${data.email}`);

		return json({
			success: true,
			message: 'İmzanız kaydedildi. E-posta adresinize doğrulama linki gönderildi.',
			imzaId: yeniImza.id,
			dogrulama_kodu: dogrulama_kodu // Geliştirme için
		});

	} catch (error) {
		console.error('İmza ekleme hatası:', error);
		return json(
			{ error: 'Sunucu hatası. Lütfen tekrar deneyin.' },
			{ status: 500 }
		);
	}
}

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	// Bu endpoint artık imza-sayisi endpoint'inde kullanılıyor
	return json({ message: 'Bu endpoint POST için kullanılır' });
}
