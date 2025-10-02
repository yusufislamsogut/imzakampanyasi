import { directus, readSingleton } from '$lib/directus/directus.js';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	try {
		// Kampanya ayarlarını al
		const ayarlar = await directus.request(readSingleton('ayarlar', {
			fields: ['*', 'kampanya_aktif']
		}));
		
		return {
			kampanyaAktif: ayarlar?.kampanya_aktif !== false,
			ayarlar: {
				baslik: ayarlar?.baslik || 'Ülkemde Siyonist İstemiyorum',
				aciklama: ayarlar?.aciklama || "Meclis'e sunulan kanun teklifini destekliyorum. Soykırımcıların yargılanması için sen de imzala!",
				paylasim_mesaji: ayarlar?.paylasim_mesaji || 'Ben imzamı verdim! Sen de "Ülkemde Siyonist İstemiyorum" kampanyasına destek ol. Birlikte sesimizi büyütelim: https://imzala.hudapar.org',
				kampanya_aktif: ayarlar?.kampanya_aktif !== false
			}
		};
	} catch (error) {
		console.error('Doğrulama sayfası verileri yüklenirken hata:', error);
		
		// Hata durumunda varsayılan değerler
		return {
			kampanyaAktif: true,
			ayarlar: {
				baslik: 'Ülkemde Siyonist İstemiyorum',
				aciklama: "Meclis'e sunulan kanun teklifini destekliyorum. Soykırımcıların yargılanması için sen de imzala!",
				paylasim_mesaji: 'Ben imzamı verdim! Sen de "Ülkemde Siyonist İstemiyorum" kampanyasına destek ol. Birlikte sesimizi büyütelim: https://imzala.hudapar.org',
				kampanya_aktif: true
			}
		};
	}
}
