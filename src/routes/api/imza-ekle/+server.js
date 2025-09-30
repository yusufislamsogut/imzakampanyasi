import { json } from '@sveltejs/kit';
import { addImza, findImzaByEmail, getImzaSayisi } from '$lib/database.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	try {
		const data = await request.json();
		
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

		// Mükerrer e-posta kontrolü
		const mevcutImza = findImzaByEmail(data.email);
		if (mevcutImza) {
			return json(
				{ error: 'Bu e-posta adresi ile daha önce imza verilmiş.' },
				{ status: 400 }
			);
		}

		// Yeni imza oluştur
		const yeniImza = addImza(data);

		// Burada e-posta doğrulama linki gönderilecek
		console.log(`E-posta doğrulama kodu: ${yeniImza.dogrulamaKodu} - ${yeniImza.email}`);

		return json({
			success: true,
			message: 'İmzanız kaydedildi. E-posta adresinize doğrulama linki gönderildi.',
			imzaId: yeniImza.id
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
	// İmza sayısı bilgisi
	const sayilar = getImzaSayisi();
	return json(sayilar);
}
