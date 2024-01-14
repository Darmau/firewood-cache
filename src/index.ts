export interface Env {
	KV: KVNamespace;
	API: string;
}

export interface Body {
	key: string;
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const body: Body = await request.json();
		if (request.method === 'POST') {

			// 从 KV 中读取数据
			const cachedData = await env.KV.get(body.key);

			if (cachedData) {
				// 如果存在缓存数据，直接返回
				console.log('Cache hit');
				return new Response(cachedData, { status: 200 });
			} else {
				// 不存在缓存数据，则请求 API
				const apiUrl = `${env.API}${body.key}`;
				const data = await fetch(apiUrl).then((res) => res.json());

				if (!data) {
					// 如果 API 返回空数据，则返回错误消息
					console.log('No response data from remote API');
					return new Response('Invalid API response', { status: 400 });
				}

				// 将结果存入 KV
				await env.KV.put(body.key, JSON.stringify(data), { expirationTtl: 900 });
				const dataFromCache = await env.KV.get(body.key) as string;

				// 返回结果
				return new Response(dataFromCache, { status: 200 });
			}
		} else if (request.method === 'DELETE') {
			// 列出 KV 中所有的 key
			const caches = await env.KV.list();
			console.log(`Ready to delete ${caches.keys.length} keys`);
			// 删除所有 key
			await Promise.all(caches.keys.map((key) => env.KV.delete(key.name)));

			// 返回成功消息
			console.log('KV reset');
			return new Response('KV reset', { status: 200 });
		}

		// 如果请求方法不是 POST 或 DELETE，则返回错误消息
		return new Response('Invalid request method', { status: 400 });
	}
};
