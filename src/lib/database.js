// Basit in-memory storage - gerçek uygulamada veritabanı kullanılacak
let imzalar = [];
let imzaIdCounter = 1;

export function getImzalar() {
	return imzalar;
}

export function addImza(imzaData) {
	const yeniImza = {
		id: imzaIdCounter++,
		adSoyad: imzaData.adSoyad.trim(),
		email: imzaData.email.toLowerCase().trim(),
		sehir: imzaData.sehir?.trim() || '',
		cinsiyet: imzaData.cinsiyet || '',
		tarih: new Date().toISOString(),
		dogrulanmis: false,
		dogrulamaKodu: Math.random().toString(36).substr(2, 9)
	};

	imzalar.push(yeniImza);
	return yeniImza;
}

export function findImzaByEmail(email) {
	return imzalar.find(imza => imza.email.toLowerCase() === email.toLowerCase());
}

export function findImzaByDogrulamaKodu(kod) {
	return imzalar.find(imza => imza.dogrulamaKodu === kod);
}

export function dogrulaImza(imza) {
	imza.dogrulanmis = true;
	imza.dogrulamaTarihi = new Date().toISOString();
	return imza;
}

export function getDogrulanmisImzalar() {
	return imzalar.filter(imza => imza.dogrulanmis);
}

export function getImzaSayisi() {
	const dogrulanmisImzalar = getDogrulanmisImzalar();
	return {
		toplam: dogrulanmisImzalar.length + 1247, // Başlangıç değeri ekliyoruz
		hedef: 10000,
		son24Saat: dogrulanmisImzalar.filter(imza => {
			const imzaTarihi = new Date(imza.tarih);
			const son24Saat = new Date();
			son24Saat.setHours(son24Saat.getHours() - 24);
			return imzaTarihi > son24Saat;
		}).length
	};
}
