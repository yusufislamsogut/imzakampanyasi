import { json } from '@sveltejs/kit';
import { getImzaSayisi } from '$lib/database.js';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	try {
		const sayilar = getImzaSayisi();
		
		return json({
			toplam: sayilar.toplam,
			hedef: sayilar.hedef,
			yuzde: Math.min((sayilar.toplam / sayilar.hedef) * 100, 100),
			son24Saat: sayilar.son24Saat
		});

	} catch (error) {
		console.error('İmza sayısı alma hatası:', error);
		return json(
			{ error: 'Sunucu hatası' },
			{ status: 500 }
		);
	}
}
