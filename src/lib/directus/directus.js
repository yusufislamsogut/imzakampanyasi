
import {
	createDirectus,
	readItems,
	readSingleton,
	rest,
	createItem,
	updateItem,
	aggregate,
	withToken,
	authentication,
	readAssetRaw
} from '@directus/sdk';
import { env } from '$env/dynamic/private';

// Environment değişkenlerini al, yoksa default değerleri kullan
const BASE_URL = env.BASE_URL;
const DIRECTUS_TOKEN = env.DIRECTUS_TOKEN;

const directus = createDirectus(BASE_URL)
	.with(rest())
	.with(authentication());

// Static token ile kimlik doğrulama
directus.setToken(DIRECTUS_TOKEN);

export { directus, readItems, readSingleton, createItem, updateItem, withToken, aggregate, readAssetRaw };