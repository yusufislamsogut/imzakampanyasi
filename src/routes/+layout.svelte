<script>
	import '../app.css';
	import { onMount } from 'svelte';

	// Mobile menu toggle
	onMount(() => {
		const mobileMenuBtn = document.getElementById('mobile-menu-btn');
		const mobileMenu = document.getElementById('mobile-menu');
		
		if (mobileMenuBtn && mobileMenu) {
			mobileMenuBtn.addEventListener('click', () => {
				mobileMenu.classList.toggle('hidden');
			});
		}
	});
</script>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
<header class="bg-green-700 text-white shadow-lg">
		<div class="container mx-auto px-4">
			<nav class="flex items-center justify-between py-4">
				<div class="flex items-center space-x-3">
					<img src="/images/logo.png" alt="HÜDA PAR" class="w-9 h-9 rounded-full bg-white p-1 object-contain" />
					<div>
						<h1 class="text-xl font-bold leading-5">HÜDA PAR</h1>
						<p class="text-green-200 text-xs">İmza Kampanyası</p>
					</div>
				</div>
				
				<div class="hidden md:flex items-center space-x-6">
					<a href="/kanun-teklifimiz" class="hover:text-green-200 transition-colors duration-200">
						Kanun Teklifimiz
					</a>
					<a href="/" class="hover:text-green-200 transition-colors duration-200">
						İmzala
					</a>
					<a href="/iletisim" class="hover:text-green-200 transition-colors duration-200">
						İletişim
					</a>
				</div>

				<!-- Mobile menu button -->
				<button class="md:hidden text-white" id="mobile-menu-btn">
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
					</svg>
				</button>
			</nav>

			<!-- Mobile menu -->
			<div class="md:hidden hidden" id="mobile-menu">
				<div class="py-2 space-y-2">
					<a href="/kanun-teklifimiz" class="block py-2 hover:text-green-200 transition-colors duration-200">
						Kanun Teklifimiz
					</a>
					<a href="/" class="block py-2 hover:text-green-200 transition-colors duration-200">
						İmzala
					</a>
					<a href="/iletisim" class="block py-2 hover:text-green-200 transition-colors duration-200">
						İletişim
					</a>
				</div>
			</div>
		</div>
	</header>

	<!-- Main content -->
	<main class="container mx-auto px-4 py-8">
		<slot />
	</main>

	<!-- Footer -->
	<footer class="bg-green-800 text-white py-6 mt-auto">
		<div class="container mx-auto px-4 flex flex-col items-center gap-2 text-center">
			<img src="/images/logo.png" alt="HÜDA PAR" class="w-8 h-8 rounded-full bg-white p-1 object-contain" />
			<p class="text-sm">© 2025 HÜDA PAR - Hür Dava Partisi</p>
			<p class="text-xs text-green-200">Ülkemde Siyonist İstemiyorum Kampanyası</p>
		</div>
	</footer>
</div>