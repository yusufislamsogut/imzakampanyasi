<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	
	let dogrulamaStatus = 'loading'; // loading, success, error
	let message = '';
	let zatenDogrulanmis = false;

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
</script>

<svelte:head>
	<title>E-posta Doğrulama - Ülkemde Siyonist İstemiyorum</title>
	<meta name="description" content="E-posta doğrulama işlemi" />
</svelte:head>

<div class="max-w-2xl mx-auto">
	<div class="bg-white rounded-lg shadow-lg p-8 text-center">
		{#if dogrulamaStatus === 'loading'}
			<div class="flex flex-col items-center">
				<svg class="animate-spin h-12 w-12 text-green-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
				<h1 class="text-2xl font-bold text-gray-800 mb-2">E-posta Doğrulanıyor...</h1>
				<p class="text-gray-600">Lütfen bekleyiniz.</p>
			</div>
		{:else if dogrulamaStatus === 'success'}
			<div class="flex flex-col items-center">
				<svg class="h-16 w-16 text-green-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
				</svg>
				<h1 class="text-2xl font-bold text-green-700 mb-4">
					{zatenDogrulanmis ? 'Zaten Doğrulanmış' : 'Doğrulama Başarılı!'}
				</h1>
				<p class="text-gray-600 mb-6">{message}</p>
				
				{#if !zatenDogrulanmis}
					<div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
						<p class="text-green-800 font-medium">🎉 Tebrikler!</p>
						<p class="text-green-700 text-sm mt-1">
							İmzanız artık kampanyamızda sayılıyor. Teşekkür ederiz!
						</p>
					</div>
				{/if}

				<div class="space-y-3">
					<a 
						href="/" 
						class="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold"
					>
						Ana Sayfaya Dön
					</a>
					
					<div class="text-sm text-gray-500">
						<p>Kampanyayı sosyal medyada paylaşmayı unutmayın!</p>
					</div>
				</div>
			</div>
		{:else}
			<div class="flex flex-col items-center">
				<svg class="h-16 w-16 text-red-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
				</svg>
				<h1 class="text-2xl font-bold text-red-600 mb-4">Doğrulama Başarısız</h1>
				<p class="text-gray-600 mb-6">{message}</p>
				
				<div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
					<p class="text-red-800 font-medium">Olası nedenler:</p>
					<ul class="text-red-700 text-sm mt-1 list-disc list-inside">
						<li>Doğrulama linki geçersiz veya süresi dolmuş</li>
						<li>Link daha önce kullanılmış</li>
						<li>Teknik bir sorun oluşmuş</li>
					</ul>
				</div>

				<div class="space-y-3">
					<a 
						href="/" 
						class="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold"
					>
						Tekrar İmzala
					</a>
					
					<a 
						href="/iletisim" 
						class="inline-block text-green-600 hover:text-green-700 underline"
					>
						Yardım için iletişime geçin
					</a>
				</div>
			</div>
		{/if}
	</div>
</div>
