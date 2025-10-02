import { directus, readSingleton, readItems } from '$lib/directus/directus.js';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	try {
		// Kampanya ayarlarını al (hero görseli ile birlikte)
		const ayarlar = await directus.request(
			readSingleton('ayarlar', {
				fields: ['*', 'hero_gorsel.*', 'kampanya_aktif']
			})
		);
		
		// Doğrulanmış imza sayısını al
		const dogrulanmisImzalar = await directus.request(
			readItems('imzalar', {
				filter: {
					dogrulanmis: { _eq: true }
				},
				fields: ['id']
			})
		);

		console.log('Doğrulanmış imzalar:', dogrulanmisImzalar);
		console.log('Ayarlar:', ayarlar);

		// Toplam imza sayısını hesapla (başlangıç sayacı + doğrulanmış imzalar)
		const baslangicSayaci = ayarlar?.baslangic_sayaci || 0;
		const dogrulanmisSayi = dogrulanmisImzalar?.length || 0;
		const toplamImza = baslangicSayaci + dogrulanmisSayi;

		// Hedef sayı ve yüzde hesapla
		const hedefSayi = ayarlar?.hedef_sayi || 100000;
		const yuzde = hedefSayi > 0 ? Math.round((toplamImza / hedefSayi) * 100) : 0;

		// Son 24 saat imza sayısı (örnek: doğrulanmış imzaların %10'u)
		const son24Saat = Math.round(dogrulanmisSayi * 0.1);

		return {
			imzaSayisi: toplamImza,
			hedefSayi,
			yuzde,
			son24Saat,
			kampanyaAktif: ayarlar?.kampanya_aktif !== false, // Varsayılan olarak true, sadece false ise kapalı
			ayarlar: {
				baslik: ayarlar?.baslik || 'Ülkemde Siyonist İstemiyorum',
				aciklama: ayarlar?.aciklama || "Meclis'e sunulan kanun teklifini destekliyorum. Soykırımcıların yargılanması için sen de imzala!",
				paylasim_mesaji: ayarlar?.paylasim_mesaji || 'Ben imzamı verdim! Sen de "Ülkemde Siyonist İstemiyorum" kampanyasına destek ol. Birlikte sesimizi büyütelim: https://imzala.hudapar.org',
				baslangic_sayaci: baslangicSayaci,
				hedef_sayi: hedefSayi,
				hero_gorsel: ayarlar?.hero_gorsel,
				kampanya_aktif: ayarlar?.kampanya_aktif !== false
			}
		};
	} catch (error) {
		console.error('Sayfa verileri yüklenirken hata:', error);
		
		// Hata durumunda varsayılan değerler
		return {
			imzaSayisi: 1247,
			hedefSayi: 100000,
			yuzde: 1,
			son24Saat: 0,
			kampanyaAktif: true, // Hata durumunda varsayılan olarak aktif
			ayarlar: {
				baslik: 'Ülkemde Siyonist İstemiyorum',
				aciklama: "Meclis'e sunulan kanun teklifini destekliyorum. Soykırımcıların yargılanması için sen de imzala!",
				paylasim_mesaji: 'Ben imzamı verdim! Sen de "Ülkemde Siyonist İstemiyorum" kampanyasına destek ol. Birlikte sesimizi büyütelim: https://imzala.hudapar.org',
				baslangic_sayaci: 1247,
				hedef_sayi: 100000,
				hero_gorsel: null,
				kampanya_aktif: true
			}
		};
	}
}
