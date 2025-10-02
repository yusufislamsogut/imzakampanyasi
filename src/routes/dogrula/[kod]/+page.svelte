<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	
	// Server'dan gelen veriler
	export let data;
	
	let dogrulamaStatus = 'loading'; // loading, success, error
	let message = '';
	let zatenDogrulanmis = false;

	// Paylaşım mesajı
	$: shareMessage = data.ayarlar.paylasim_mesaji;

	onMount(async () => {
		const kod = $page.params.kod;
		
		try {
			const response = await fetch(`/api/dogrula/${kod}`);
			const data = await response.json();
			
			if (response.ok) {
				dogrulamaStatus = 'success';
				message = data.message;
				zatenDogrulanmis = data.zatenDogrulanmis || false;
			} else {
				dogrulamaStatus = 'error';
				message = data.error || 'Doğrulama işlemi başarısız.';
			}
		} catch (error) {
			dogrulamaStatus = 'error';
			message = 'Sunucu hatası. Lütfen tekrar deneyin.';
		}
	});

	function shareOnFacebook() {
		const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://imzala.hudapar.org')}&quote=${encodeURIComponent(shareMessage)}`;
		window.open(url, '_blank', 'width=600,height=400');
	}

	function shareOnWhatsApp() {
		const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
		window.open(url, '_blank');
	}

	function shareOnTwitter() {
		const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`;
		window.open(url, '_blank', 'width=600,height=400');
	}
</script>

<svelte:head>
	<title>E-posta Doğrulama - {data.ayarlar.baslik}</title>
	<meta name="description" content="E-posta doğrulama işlemi - {data.ayarlar.aciklama}" />
</svelte:head>

<div class="max-w-4xl mx-auto">
	<div class="bg-white rounded-xl shadow-2xl p-8 md:p-12 text-center">
		{#if !data.kampanyaAktif}
			<!-- Kampanya Kapalı Durumu -->
			<div class="flex flex-col items-center">
				<div class="bg-red-100 rounded-full p-6 mb-6">
					<svg class="h-20 w-20 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
					</svg>
				</div>
				
				<h1 class="text-3xl md:text-4xl font-bold text-red-700 mb-4">
					Kampanya Sona Erdi
				</h1>
				
				<p class="text-lg text-gray-600 mb-8 max-w-2xl">
					Bu kampanya artık aktif değildir. Gösterdiğiniz ilgi için teşekkür ederiz.
				</p>
				
				<div class="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-8 max-w-2xl">
					<div class="flex items-center justify-center mb-4">
						<div class="bg-red-600 rounded-full p-3 mr-3">
							<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
							</svg>
						</div>
						<h3 class="text-xl font-semibold text-red-800">Bilgilendirme</h3>
					</div>
					<p class="text-red-700 text-center">
						Kampanya süresi dolmuştur. Yeni imza kabul edilmemektedir.
					</p>
				</div>

				<div class="flex flex-col gap-4 sm:flex-row sm:justify-center">
					<a 
						href="/" 
						class="inline-flex items-center justify-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold"
					>
						Ana Sayfaya Dön
					</a>
				</div>
			</div>
		{:else if dogrulamaStatus === 'loading'}
			<div class="flex flex-col items-center">
				<svg class="animate-spin h-12 w-12 text-green-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
				<h1 class="text-2xl font-bold text-gray-800 mb-2">{data.ayarlar.baslik} - E-posta Doğrulanıyor...</h1>
				<p class="text-gray-600">Lütfen bekleyiniz.</p>
			</div>
		{:else if dogrulamaStatus === 'success'}
			{#if zatenDogrulanmis}
				<!-- Zaten Doğrulanmış Durumu -->
				<div class="flex flex-col items-center">
					<div class="bg-green-100 rounded-full p-6 mb-6">
						<svg class="h-20 w-20 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
						</svg>
					</div>
					
					<h1 class="text-3xl md:text-4xl font-bold text-green-700 mb-4">
						Zaten Doğrulanmış
					</h1>
					
					<p class="text-lg text-gray-600 mb-8 max-w-2xl">
						{message}
					</p>
					
					<div class="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-8 max-w-2xl">
						<div class="flex items-center justify-center mb-4">
							<div class="bg-green-600 rounded-full p-3 mr-3">
								<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
								</svg>
							</div>
							<h3 class="text-xl font-semibold text-green-800">Bilgilendirme</h3>
						</div>
						<p class="text-green-700 text-center">
							Bu e-posta adresi ile daha önce imza verilmiş ve doğrulanmış. 
							İmzanız kampanyamızda zaten sayılıyor.
						</p>
					</div>
				</div>
			{:else}
				<!-- Yeni Doğrulanmış Durumu -->
				<div class="flex flex-col items-center">
					<div class="bg-green-100 rounded-full p-6 mb-6">
						<svg class="h-20 w-20 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
						</svg>
					</div>
					
					<h1 class="text-3xl md:text-4xl font-bold text-green-700 mb-4">
						Doğrulama Başarılı!
					</h1>
					
					<p class="text-lg text-gray-600 mb-8 max-w-2xl">
						{message}
					</p>
					
					<div class="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-8 max-w-2xl">
						<div class="flex items-center justify-center mb-4">
							<div class="bg-green-600 rounded-full p-3 mr-3">
								<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
								</svg>
							</div>
							<h3 class="text-xl font-semibold text-green-800">Tebrikler!</h3>
						</div>
						<p class="text-green-700 text-center">
							İmzanız artık kampanyamızda sayılıyor. Desteğiniz için teşekkür ederiz!
						</p>
					</div>
				</div>
			{/if}

			<!-- Sosyal Medya Paylaşım Butonları -->
			<div class="mb-6">
				<p class="text-sm text-gray-600 mb-4">Kampanyayı paylaşarak daha fazla kişiye ulaşmasına yardımcı olun:</p>
				<div class="flex flex-col gap-3 sm:flex-row sm:justify-center">
					<button
						on:click={shareOnFacebook}
						class="flex items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-white hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
					>
						<svg class="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
							<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
						</svg>
						Facebook'ta Paylaş
					</button>
					
					<button
						on:click={shareOnWhatsApp}
						class="flex items-center justify-center rounded-md bg-green-500 px-4 py-2.5 text-white hover:bg-green-600 transition-colors duration-200 cursor-pointer"
					>
						<svg class="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
							<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.520-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884"/>
						</svg>
						WhatsApp'ta Paylaş
					</button>
					
					<button
						on:click={shareOnTwitter}
						class="flex items-center justify-center rounded-md bg-black px-4 py-2.5 text-white hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
					>
						<svg class="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
							<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
						</svg>
						X'te Paylaş
					</button>
				</div>
			</div>
		{:else}
			<!-- Doğrulama Başarısız Durumu -->
			<div class="flex flex-col items-center">
				<div class="bg-red-100 rounded-full p-6 mb-6">
					<svg class="h-20 w-20 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
					</svg>
				</div>
				
				<h1 class="text-3xl md:text-4xl font-bold text-red-700 mb-4">
					Doğrulama Başarısız
				</h1>
				
				<p class="text-lg text-gray-600 mb-8 max-w-2xl">
					{message}
				</p>
				
				<div class="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-8 max-w-2xl">
					<div class="flex items-center justify-center mb-4">
						<div class="bg-red-600 rounded-full p-3 mr-3">
							<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
							</svg>
						</div>
						<h3 class="text-xl font-semibold text-red-800">Olası Nedenler</h3>
					</div>
					<ul class="text-red-700 text-center space-y-2">
						<li>• Doğrulama linki geçersiz veya süresi dolmuş</li>
						<li>• Link daha önce kullanılmış</li>
						<li>• Teknik bir sorun oluşmuş</li>
					</ul>
				</div>

				<div class="flex flex-col gap-4 sm:flex-row sm:justify-center">
					<a 
						href="/" 
						class="inline-flex items-center justify-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold"
					>
						Tekrar İmzala
					</a>
					
					<a 
						href="https://hudapar.org/iletisim" 
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center justify-center border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-6 py-3 rounded-lg transition-colors duration-200 font-semibold"
					>
						Yardım için iletişime geçin
					</a>
				</div>
			</div>
		{/if}
	</div>
</div>