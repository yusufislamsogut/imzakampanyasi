import { json } from '@sveltejs/kit';
import { findImzaByDogrulamaKodu, dogrulaImza } from '$lib/database.js';

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

		// Doğrulama kodunu bul
		const imza = findImzaByDogrulamaKodu(kod);
		
		if (!imza) {
			return json(
				{ error: 'Geçersiz doğrulama kodu.' },
				{ status: 404 }
			);
		}

		if (imza.dogrulanmis) {
			return json({
				success: true,
				message: 'Bu e-posta adresi zaten doğrulanmış.',
				zatenDogrulanmis: true
			});
		}

		// İmzayı doğrulanmış olarak işaretle
		dogrulaImza(imza);

		return json({
			success: true,
			message: 'E-posta adresiniz başarıyla doğrulandı. İmzanız artık geçerli!',
			imzaId: imza.id
		});

	} catch (error) {
		console.error('E-posta doğrulama hatası:', error);
		return json(
			{ error: 'Sunucu hatası. Lütfen tekrar deneyin.' },
			{ status: 500 }
		);
	}
}
