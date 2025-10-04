import { directus, readAssetRaw } from '$lib/directus/directus.js';

/**
 * Assets proxy endpoint - Directus'tan görselleri güvenli bir şekilde servis eder
 * Directus SDK ile backoffice URL'ini gizler
 */

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, url }) {
    const { id } = params;

    // Güvenlik kontrolü: ID sadece UUID veya alphanumeric olmalı
    if (!id || !/^[a-zA-Z0-9-]+$/.test(id)) {
        return new Response('Geçersiz asset ID', { status: 400 });
    }

	try {
		// readAssetRaw ile asset'i al
		const result = await directus.request(readAssetRaw(id));
		
		// Response'u döndür
		return new Response(result, {
			status: 200,
			headers: {
				'Content-Type': 'image/jpeg',
				'Cache-Control': 'public, max-age=86400, s-maxage=86400',
				'X-Content-Type-Options': 'nosniff'
			}
		});
		
	} catch (error) {
		console.error('Asset proxy hatası:', error);
		
		// 404 hatasını yakalayalım
		const err = /** @type {any} */ (error);
		if (err?.response?.status === 404 || err?.message?.includes('not found')) {
			return new Response('Görsel bulunamadı', { status: 404 });
		}
		
		return new Response('Görsel yüklenirken hata oluştu', { status: 500 });
	}
}

