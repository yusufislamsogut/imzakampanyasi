<svelte:head>
	<title>İletişim - Ülkemde Siyonist İstemiyorum</title>
	<meta name="description" content="HUDAPAR imza kampanyası ile ilgili sorularınız için iletişim bilgileri." />
</svelte:head>

<div class="max-w-4xl mx-auto">
	<div class="bg-white rounded-lg shadow-lg p-8">
		<h1 class="text-3xl font-bold text-gray-800 mb-6">İletişim</h1>
		
		<div class="grid md:grid-cols-2 gap-8">
			<!-- İletişim Bilgileri -->
			<div>
				<h2 class="text-2xl font-semibold text-green-700 mb-4">HUDAPAR - Hür Dava Partisi</h2>
				
				<div class="space-y-4">
					<div class="flex items-start space-x-3">
						<svg class="w-6 h-6 text-green-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
						</svg>
						<div>
							<h3 class="font-semibold text-gray-800">Adres</h3>
							<p class="text-gray-600">
								Merkez Ofis<br>
								Ankara, Türkiye
							</p>
						</div>
					</div>

					<div class="flex items-start space-x-3">
						<svg class="w-6 h-6 text-green-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
						</svg>
						<div>
							<h3 class="font-semibold text-gray-800">E-posta</h3>
							<p class="text-gray-600">
								<a href="mailto:info@hudapar.org" class="text-green-600 hover:text-green-700">
									info@hudapar.org
								</a>
							</p>
						</div>
					</div>

					<div class="flex items-start space-x-3">
						<svg class="w-6 h-6 text-green-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9"></path>
						</svg>
						<div>
							<h3 class="font-semibold text-gray-800">Web Sitesi</h3>
							<p class="text-gray-600">
								<a href="https://hudapar.org" target="_blank" class="text-green-600 hover:text-green-700">
									www.hudapar.org
								</a>
							</p>
						</div>
					</div>
				</div>

				<div class="mt-8">
					<h3 class="text-xl font-semibold text-gray-800 mb-4">Sosyal Medya</h3>
					<div class="flex space-x-4">
						<a href="#" class="text-blue-600 hover:text-blue-700">
							<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
								<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
							</svg>
						</a>
						<a href="#" class="text-blue-400 hover:text-blue-500">
							<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
								<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
							</svg>
						</a>
						<a href="#" class="text-red-600 hover:text-red-700">
							<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
								<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
							</svg>
						</a>
					</div>
				</div>
			</div>

			<!-- İletişim Formu -->
			<div>
				<h2 class="text-2xl font-semibold text-green-700 mb-4">Bize Ulaşın</h2>
				
				<form class="space-y-4">
					<div>
						<label for="name" class="block text-sm font-medium text-gray-700 mb-2">
							Ad Soyad
						</label>
						<input
							type="text"
							id="name"
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
							placeholder="Adınız ve soyadınız"
						/>
					</div>

					<div>
						<label for="contact-email" class="block text-sm font-medium text-gray-700 mb-2">
							E-posta
						</label>
						<input
							type="email"
							id="contact-email"
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
							placeholder="ornek@email.com"
						/>
					</div>

					<div>
						<label for="subject" class="block text-sm font-medium text-gray-700 mb-2">
							Konu
						</label>
						<input
							type="text"
							id="subject"
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
							placeholder="Mesajınızın konusu"
						/>
					</div>

					<div>
						<label for="message" class="block text-sm font-medium text-gray-700 mb-2">
							Mesaj
						</label>
						<textarea
							id="message"
							rows="5"
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
							placeholder="Mesajınızı buraya yazın..."
						></textarea>
					</div>

					<button
						type="submit"
						class="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
					>
						Mesaj Gönder
					</button>
				</form>
			</div>
		</div>

		<div class="mt-12 bg-green-50 rounded-lg p-6">
			<h3 class="text-xl font-semibold text-gray-800 mb-4">Sıkça Sorulan Sorular</h3>
			
			<div class="space-y-4">
				<div>
					<h4 class="font-semibold text-gray-800">İmzam güvenli mi?</h4>
					<p class="text-gray-600 text-sm mt-1">
						Evet, tüm kişisel verileriniz güvenli bir şekilde şifrelenerek saklanmakta ve 
						sadece bu kampanya için kullanılmaktadır.
					</p>
				</div>

				<div>
					<h4 class="font-semibold text-gray-800">E-posta doğrulama neden gerekli?</h4>
					<p class="text-gray-600 text-sm mt-1">
						E-posta doğrulama, mükerrer imzaların önüne geçmek ve kampanyanın 
						güvenilirliğini sağlamak için gereklidir.
					</p>
				</div>

				<div>
					<h4 class="font-semibold text-gray-800">İmzamı nasıl geri çekebilirim?</h4>
					<p class="text-gray-600 text-sm mt-1">
						İmzanızı geri çekmek için yukarıdaki iletişim bilgilerinden bize ulaşabilirsiniz.
					</p>
				</div>
			</div>
		</div>
	</div>
</div>
