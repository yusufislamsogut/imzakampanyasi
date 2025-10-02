
import { createDirectus,
	readItems,
	readSingleton,
	rest,
	createItem,
	updateItem,
	aggregate,
	withToken,
    authentication} from '@directus/sdk';

const directus = createDirectus('http://localhost:2357')
  .with(rest())
  .with(authentication());

// Static token ile kimlik doğrulama
directus.setToken('0R4bhkloS7M8mr7mwMq8L-hmnJPzoVVa');

export { directus, readItems, readSingleton, createItem, updateItem, withToken, aggregate };