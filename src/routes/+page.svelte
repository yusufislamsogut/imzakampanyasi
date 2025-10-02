<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	// Server'dan gelen veriler
	export let data;

	let formData = {
		adSoyad: '',
		email: '',
		sehir: '',
		cinsiyet: ''
	};

	let isSubmitting = false;
	let showSuccess = false;
	let errorMessage = '';
	let errorType = '';
	let existingImza = null;
	let showShareButtons = false;

	// Paylaşım modali
	let showShareModal = false;

	$: shareMessage = data.ayarlar.paylasim_mesaji;

	async function performSubmit() {
		errorMessage = '';
		errorType = '';
		existingImza = null;

		// Form validasyonu
		if (!formData.adSoyad.trim() || !formData.email.trim()) {
			errorMessage = 'Ad-Soyad ve E-posta alanları zorunludur.';
			return;
		}

		// Email format kontrolü
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(formData.email)) {
			errorMessage = 'Geçerli bir e-posta adresi giriniz.';
			return;
		}

		isSubmitting = true;

		try {
			// API'ye gönderme işlemi
			const response = await fetch('/api/imza-ekle', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ...formData })
			});

			const data = await response.json();

			if (response.ok) {
				showSuccess = true;
				showShareButtons = false;
				showShareModal = true;

				// İmza eklendikten sonra sayfayı yenile
				setTimeout(() => {
					window.location.reload();
				}, 2000);

				// Formu temizle
				formData = {
					adSoyad: '',
					email: '',
					sehir: '',
					cinsiyet: ''
				};
			} else {
				errorMessage = data.error || 'İmza eklenirken bir hata oluştu.';
				errorType = data.errorType || '';
				existingImza = data.existingImza || null;
			}
		} catch (error) {
			errorMessage = 'İmza eklenirken bir hata oluştu. Lütfen tekrar deneyin.';
		} finally {
			isSubmitting = false;
		}
	}

	function shareOnFacebook() {
		if (browser) {
			const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://imzala.hudapar.org')}&quote=${encodeURIComponent(shareMessage)}`;
			window.open(url, '_blank', 'width=600,height=400');
		}
	}

	function shareOnWhatsApp() {
		if (browser) {
			const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
			window.open(url, '_blank');
		}
	}

	function shareOnTwitter() {
		if (browser) {
			const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`;
			window.open(url, '_blank', 'width=600,height=400');
		}
	}

	function scrollToForm() {
		const el = document.getElementById('imza-formu');
		if (el) {
			el.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}
</script>

<svelte:head>
	<title>{data.ayarlar.baslik} - İmza Kampanyası</title>
	<meta
		name="description"
		content="Meclis'e sunulan kanun teklifini destekle, soykırımcıların yargılanması için imzala!"
	/>
</svelte:head>

<div class="mx-auto max-w-5xl">
	<!-- Hero Section -->
	<section
		class="relative mb-8 h-[320px] overflow-hidden rounded-2xl bg-black shadow-2xl md:h-[380px]"
	>
		{#if data.ayarlar.hero_gorsel}
			<img
				src="http://localhost:2357/assets/{data.ayarlar.hero_gorsel.id}"
				alt="{data.ayarlar.baslik}"
				class="absolute inset-0 h-full w-full object-cover"
			/>
		{:else}
			<img
				src="/images/gaza.png"
				alt="Gazze için Açlığı Durdurun"
				class="absolute inset-0 h-full w-full object-cover"
			/>
		{/if}
		<div
			class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent md:bg-gradient-to-r md:from-black/70 md:via-black/40 md:to-transparent"
		></div>
		<div class="absolute inset-0 flex items-center">
			<div
				class="mx-auto w-full max-w-2xl px-5 text-center text-white md:mx-0 md:px-10 md:text-left"
			>
				<div class="mb-3 flex items-center justify-center gap-2 md:mb-4 md:justify-start md:gap-3">
					<img
						src="/images/logo.png"
						alt="HÜDA PAR"
						class="h-8 w-8 rounded-full bg-white object-contain p-1 md:h-10 md:w-10"
					/>
					<span class="text-[10px] tracking-widest text-green-200 uppercase md:text-xs"
						>İmza Kampanyası</span
					>
				</div>
				<h1 class="text-[26px] leading-tight font-extrabold md:text-5xl">
					{data.ayarlar.baslik}!
				</h1>
				<p class="mt-2 text-sm text-green-100 md:mt-4 md:text-xl">
					{data.ayarlar.aciklama}
				</p>
				<div class="mt-4 flex flex-col gap-2 sm:flex-row sm:gap-3 md:mt-6">
					{#if data.kampanyaAktif}
						<button
							type="button"
							on:click={scrollToForm}
							class="inline-flex w-full cursor-pointer items-center justify-center rounded-lg bg-green-600 px-5 py-3 font-semibold text-white shadow hover:bg-green-700 sm:w-auto"
						>
							Hemen İmzala
						</button>
					{:else}
						<button
							type="button"
							disabled
							class="inline-flex w-full cursor-not-allowed items-center justify-center rounded-lg bg-gray-500 px-5 py-3 font-semibold text-white shadow sm:w-auto"
						>
							Kampanya Bitti
						</button>
					{/if}
					<a
						href="/kanun-teklifimiz"
						class="inline-flex w-full items-center justify-center rounded-lg border border-white/20 bg-white/10 px-5 py-3 font-semibold text-white hover:bg-white/20 sm:w-auto"
					>
						Kanun Teklifini Oku
					</a>
				</div>
			</div>
		</div>
	</section>

	<!-- İmza Sayacı -->
	<div
		class="mb-8 rounded-xl bg-white/90 p-6 text-center shadow-xl ring-1 ring-green-100 backdrop-blur"
	>
		<div class="mb-1 text-3xl font-extrabold text-green-700 md:text-4xl">
			{data.imzaSayisi.toLocaleString('tr-TR')}
		</div>
		<div class="text-gray-600">kişi şimdiye kadar imzaladı</div>
		<div class="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-200/70">
			<div
				class="h-2 rounded-full bg-gradient-to-r from-green-600 to-emerald-500"
				style="width: {Math.min((data.imzaSayisi / data.hedefSayi) * 100, 100)}%"
			></div>
		</div>
		<div class="mt-2 text-sm text-gray-500">Hedef: {data.hedefSayi.toLocaleString('tr-TR')} imza</div>
	</div>

	{#if showShareModal}
		<!-- Paylaşım Modalı -->
		<div class="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
			<div class="absolute inset-0 bg-black/60"></div>
			<div
				class="animate-in fade-in slide-in-from-bottom-4 relative mx-auto w-full max-w-md rounded-t-2xl bg-white p-6 shadow-2xl sm:w-11/12 sm:rounded-2xl sm:p-7"
			>
				<div class="flex items-start justify-between gap-4">
					<div>
						<h3 class="text-xl font-semibold text-gray-900">Teşekkürler! İmzan Kaydedildi</h3>
						<p class="mt-1 text-sm text-gray-600">
							E-postana doğrulama linki gönderdik. İmzanı tamamlamak için bağlantıya tıkla.
						</p>
						<p class="mt-3 text-sm text-gray-700">
							Kampanyanın daha çok kişiye ulaşması için paylaşabilirsin:
						</p>
					</div>
					<button
						on:click={() => (showShareModal = false)}
						class="cursor-pointer text-gray-400 hover:text-gray-600"
						aria-label="Modalı kapat"
					>
						<svg
							class="h-5 w-5"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"
							></line></svg
						>
					</button>
				</div>
				<div class="mt-4 space-y-2">
					<button
						on:click={shareOnFacebook}
						class="flex w-full cursor-pointer items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-white hover:bg-blue-700"
					>
						<svg class="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24"
							><path
								d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
							/></svg
						>
						Facebook'ta Paylaş
					</button>
					<button
						on:click={shareOnWhatsApp}
						class="flex w-full cursor-pointer items-center justify-center rounded-md bg-green-500 px-4 py-2.5 text-white hover:bg-green-600"
					>
						<svg class="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24"
							><path
								d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.520-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884"
							/></svg
						>
						WhatsApp'ta Paylaş
					</button>
					<button
						on:click={shareOnTwitter}
						class="flex w-full cursor-pointer items-center justify-center rounded-md bg-black px-4 py-2.5 text-white hover:bg-gray-800"
					>
						<svg class="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24"
							><path
								d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
							/></svg
						>
						X'te Paylaş
					</button>
				</div>
				<div class="mt-5 text-center">
					<button
						on:click={() => (showShareModal = false)}
						class="cursor-pointer text-sm text-gray-600 hover:text-gray-800">Kapat</button
					>
				</div>
			</div>
		</div>
	{/if}

	<div class="grid gap-8 md:grid-cols-2">
		<!-- İmza Formu -->
		<div id="imza-formu" class="rounded-xl bg-white p-6 shadow-xl ring-1 ring-gray-100">
			<h2 class="mb-6 text-2xl font-bold text-gray-800">İmzala</h2>
			{#if !data.kampanyaAktif}
				<!-- Kampanya Kapalı Durumu -->
				<div class="mb-6 rounded-lg border border-red-200 bg-red-50 p-6 text-red-800">
					<div class="flex items-start gap-3">
						<svg class="h-6 w-6 flex-none mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
						</svg>
						<div>
							<p class="font-semibold text-lg">Kampanya Sona Erdi</p>
							<p class="mt-2 text-sm">
								Bu kampanya artık aktif değildir. Gösterdiğiniz ilgi için teşekkür ederiz.
							</p>
						</div>
					</div>
				</div>
			{:else if showSuccess}
				<div class="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-5 text-amber-800">
					<div class="flex items-start gap-3">
						<svg
							class="h-6 w-6 flex-none"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							><path d="M9 12l2 2 4-4"></path><path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
							></path></svg
						>
						<div>
							<p class="font-semibold">İmzan alındı!</p>
							<p class="mt-1 text-sm">
								Lütfen e‑posta gelen kutunu kontrol et ve imzanı tamamlamak için doğrulama
								bağlantısına tıkla. (Spam/Junk klasörünü de kontrol etmeyi unutma.)
							</p>
						</div>
					</div>
					<div class="mt-4 flex flex-col gap-2 sm:flex-row sm:gap-3">
						<button
							type="button"
							on:click={() => (showShareModal = true)}
							class="inline-flex w-full cursor-pointer items-center justify-center rounded-lg bg-green-600 px-5 py-3 font-semibold text-white shadow hover:bg-green-700 sm:w-auto"
							>Kampanyayı Paylaş</button
						>
						<a
							href="/"
							data-sveltekit-reload
							class="inline-flex w-full items-center justify-center rounded-lg border border-amber-200 bg-white px-5 py-3 font-semibold text-amber-700 hover:bg-amber-50 sm:w-auto"
							>Ana Sayfa</a
						>
					</div>
				</div>
			{:else if data.kampanyaAktif}
				<form on:submit|preventDefault={performSubmit} class="space-y-4">
					{#if errorMessage}
						{#if errorType === 'email_exists'}
							<!-- E-posta zaten mevcut - Formun en üstünde -->
							<div class="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
								<div class="flex items-start gap-3">
									<svg class="h-5 w-5 flex-none mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<path d="M9 12l2 2 4-4"></path>
										<path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path>
									</svg>
									<div>
										<p class="font-semibold">Bu e-posta adresi ile zaten imza verilmiş!</p>
										<p class="mt-1 text-sm">
											{existingImza?.ad_soyad} adına kayıtlı e-posta adresi ile daha önce imza verilmiş. 
											Aynı e-posta ile birden fazla imza atılamaz.
										</p>
										{#if existingImza?.dogrulanmis}
											<p class="mt-2 text-sm font-medium text-green-700">
												✓ Bu imza doğrulanmış durumda.
											</p>
										{:else}
											<p class="mt-2 text-sm font-medium text-amber-700">
												⚠ Bu imza henüz doğrulanmamış.
											</p>
										{/if}
									</div>
								</div>
							</div>
						{:else}
							<!-- Genel hata -->
							<div class="text-sm text-red-600">{errorMessage}</div>
						{/if}
					{/if}

					<div>
						<label for="adSoyad" class="mb-2 block text-sm font-medium text-gray-700">
							Ad Soyad <span class="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="adSoyad"
							bind:value={formData.adSoyad}
							class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500 focus:outline-none"
							placeholder="Adınız ve soyadınız"
							required
						/>
					</div>

					<div>
						<label for="email" class="mb-2 block text-sm font-medium text-gray-700">
							E-posta <span class="text-red-500">*</span>
						</label>
						<input
							type="email"
							id="email"
							bind:value={formData.email}
							class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500 focus:outline-none"
							placeholder="ornek@email.com"
							required
						/>
					</div>

					<div>
						<label for="sehir" class="mb-2 block text-sm font-medium text-gray-700"> Şehir </label>
						<select
							id="sehir"
							bind:value={formData.sehir}
							class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500 focus:outline-none"
						>
							<option value="">Seçiniz (opsiyonel)</option>
							<option value="Adana">Adana</option>
							<option value="Adıyaman">Adıyaman</option>
							<option value="Afyonkarahisar">Afyonkarahisar</option>
							<option value="Ağrı">Ağrı</option>
							<option value="Amasya">Amasya</option>
							<option value="Ankara">Ankara</option>
							<option value="Antalya">Antalya</option>
							<option value="Artvin">Artvin</option>
							<option value="Aydın">Aydın</option>
							<option value="Balıkesir">Balıkesir</option>
							<option value="Bilecik">Bilecik</option>
							<option value="Bingöl">Bingöl</option>
							<option value="Bitlis">Bitlis</option>
							<option value="Bolu">Bolu</option>
							<option value="Burdur">Burdur</option>
							<option value="Bursa">Bursa</option>
							<option value="Çanakkale">Çanakkale</option>
							<option value="Çankırı">Çankırı</option>
							<option value="Çorum">Çorum</option>
							<option value="Denizli">Denizli</option>
							<option value="Diyarbakır">Diyarbakır</option>
							<option value="Edirne">Edirne</option>
							<option value="Elazığ">Elazığ</option>
							<option value="Erzincan">Erzincan</option>
							<option value="Erzurum">Erzurum</option>
							<option value="Eskişehir">Eskişehir</option>
							<option value="Gaziantep">Gaziantep</option>
							<option value="Giresun">Giresun</option>
							<option value="Gümüşhane">Gümüşhane</option>
							<option value="Hakkari">Hakkari</option>
							<option value="Hatay">Hatay</option>
							<option value="Isparta">Isparta</option>
							<option value="Mersin">Mersin</option>
							<option value="İstanbul">İstanbul</option>
							<option value="İzmir">İzmir</option>
							<option value="Kars">Kars</option>
							<option value="Kastamonu">Kastamonu</option>
							<option value="Kayseri">Kayseri</option>
							<option value="Kırklareli">Kırklareli</option>
							<option value="Kırşehir">Kırşehir</option>
							<option value="Kocaeli">Kocaeli</option>
							<option value="Konya">Konya</option>
							<option value="Kütahya">Kütahya</option>
							<option value="Malatya">Malatya</option>
							<option value="Manisa">Manisa</option>
							<option value="Kahramanmaraş">Kahramanmaraş</option>
							<option value="Mardin">Mardin</option>
							<option value="Muğla">Muğla</option>
							<option value="Muş">Muş</option>
							<option value="Nevşehir">Nevşehir</option>
							<option value="Niğde">Niğde</option>
							<option value="Ordu">Ordu</option>
							<option value="Rize">Rize</option>
							<option value="Sakarya">Sakarya</option>
							<option value="Samsun">Samsun</option>
							<option value="Siirt">Siirt</option>
							<option value="Sinop">Sinop</option>
							<option value="Sivas">Sivas</option>
							<option value="Tekirdağ">Tekirdağ</option>
							<option value="Tokat">Tokat</option>
							<option value="Trabzon">Trabzon</option>
							<option value="Tunceli">Tunceli</option>
							<option value="Şanlıurfa">Şanlıurfa</option>
							<option value="Uşak">Uşak</option>
							<option value="Van">Van</option>
							<option value="Yozgat">Yozgat</option>
							<option value="Zonguldak">Zonguldak</option>
							<option value="Aksaray">Aksaray</option>
							<option value="Bayburt">Bayburt</option>
							<option value="Karaman">Karaman</option>
							<option value="Kırıkkale">Kırıkkale</option>
							<option value="Batman">Batman</option>
							<option value="Şırnak">Şırnak</option>
							<option value="Bartın">Bartın</option>
							<option value="Ardahan">Ardahan</option>
							<option value="Iğdır">Iğdır</option>
							<option value="Yalova">Yalova</option>
							<option value="Karabük">Karabük</option>
							<option value="Kilis">Kilis</option>
							<option value="Osmaniye">Osmaniye</option>
							<option value="Düzce">Düzce</option>
						</select>
					</div>

					<div>
						<label for="cinsiyet" class="mb-2 block text-sm font-medium text-gray-700">
							Cinsiyet
						</label>
						<select
							id="cinsiyet"
							bind:value={formData.cinsiyet}
							class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500 focus:outline-none"
						>
							<option value="">Seçiniz (opsiyonel)</option>
							<option value="erkek">Erkek</option>
							<option value="kadin">Kadın</option>
						</select>
					</div>


					<button
						type="submit"
						disabled={isSubmitting}
						class="w-full cursor-pointer rounded-lg bg-green-600 px-4 py-3 text-white shadow transition-colors duration-200 hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
					>
						{#if isSubmitting}
							<div class="flex items-center justify-center">
								<svg
									class="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										class="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										stroke-width="4"
									></circle>
									<path
										class="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
								İmzalanıyor...
							</div>
						{:else}
							İmzala
						{/if}
					</button>
				</form>

				<p class="mt-4 text-xs text-gray-500">
					* İmzanızı tamamladıktan sonra e-posta adresinize bir doğrulama linki gönderilecektir.
				</p>
			{/if}
		</div>

		<!-- Kampanya Bilgileri -->
		<div class="space-y-6">
			<div class="rounded-xl bg-white p-6 shadow-xl ring-1 ring-gray-100">
				<h3 class="mb-4 text-xl font-bold text-gray-800">Kampanya Hakkında</h3>
				<p class="mb-4 text-gray-600">
					Bu kampanya, ülkemizde Siyonist faaliyetlerin yasaklanması ve soykırım suçlularının
					yargılanması için Meclis'e sunulan kanun teklifini desteklemek amacıyla başlatılmıştır.
				</p>
				<p class="mb-4 text-gray-600">
					İmzanızla bu önemli adımın parçası olun ve adalet için sesimizi yükseltelim.
				</p>
				<div class="rounded-lg bg-green-50 p-4">
					<p class="text-sm text-green-800">
						<strong>Not:</strong> Tüm kişisel verileriniz güvenli bir şekilde saklanmakta ve sadece bu
						kampanya için kullanılmaktadır.
					</p>
				</div>
			</div>

			{#if showShareButtons}
				<div class="rounded-xl bg-white p-6 shadow-xl ring-1 ring-gray-100">
					<h3 class="mb-4 text-xl font-bold text-gray-800">Kampanyayı Paylaş</h3>
					<p class="mb-4 text-gray-600">İmzanı tamamladın! Şimdi arkadaşlarınla paylaş:</p>

					<div class="space-y-3">
						<button
							on:click={shareOnFacebook}
							class="flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-700"
						>
							<svg class="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
								<path
									d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
								/>
							</svg>
							Facebook'ta Paylaş
						</button>

						<button
							on:click={shareOnWhatsApp}
							class="flex w-full items-center justify-center rounded-md bg-green-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-green-600"
						>
							<svg class="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
								<path
									d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.520-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"
								/>
							</svg>
							WhatsApp'ta Paylaş
						</button>

						<button
							on:click={shareOnTwitter}
							class="flex w-full items-center justify-center rounded-md bg-black px-4 py-2 text-white transition-colors duration-200 hover:bg-gray-800"
						>
							<svg class="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
								<path
									d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
								/>
							</svg>
							X'te Paylaş
						</button>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
