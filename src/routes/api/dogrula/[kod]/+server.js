import { json } from '@sveltejs/kit';
import { directus, readItems, updateItem, readSingleton } from '$lib/directus/directus.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {
	try {
		const { kod } = params;
		
		if (!kod) {
			return json(
				{ error: 'Doğrulama kodu gerekli.' },
				{ status: 400 }
			);
		}

		// Kampanya durumunu kontrol et
		const ayarlar = await directus.request(
			readSingleton('ayarlar', {
				fields: ['kampanya_aktif']
			})
		);
		
		if (ayarlar?.kampanya_aktif === false) {
			return json(
				{ error: 'Kampanya sona ermiştir. Doğrulama işlemi yapılamaz.' },
				{ status: 403 }
			);
		}

		// Doğrulama kodunu bul
		const imzaResult = await directus.request(readItems('imzalar', {
			filter: {
				dogrulama_kodu: { _eq: kod }
			},
			limit: 1
		}));

		// Directus'tan gelen veri yapısını kontrol et
		const imzalar = Array.isArray(imzaResult) ? imzaResult : (imzaResult?.data || []);
		
		if (!Array.isArray(imzalar) || imzalar.length === 0) {
			return json(
				{ error: 'Geçersiz doğrulama kodu.' },
				{ status: 404 }
			);
		}

		const imza = imzalar[0];

		if (imza.dogrulanmis) {
			return json({
				success: true,
				message: 'Bu e-posta adresi zaten doğrulanmış.',
				zatenDogrulanmis: true
			});
		}

		// İmzayı doğrulanmış olarak işaretle
		await directus.request(updateItem('imzalar', imza.id, {
			dogrulanmis: true,
			dogrulama_tarihi: new Date().toISOString()
		}));

		return json({
			success: true,
			message: 'E-posta adresiniz başarıyla doğrulandı. İmzanız artık geçerli!',
			imzaId: imza.id,
			ad_soyad: imza.ad_soyad,
			sehir: imza.sehir,
			dogrulama_tarihi: new Date().toISOString()
		});

	} catch (error) {
		console.error('E-posta doğrulama hatası:', error);
		return json(
			{ error: 'Sunucu hatası. Lütfen tekrar deneyin.' },
			{ status: 500 }
		);
	}
}
