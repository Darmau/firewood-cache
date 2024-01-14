# Firewood Cache

This project is a sinple cache API using Cloudflare Workers and KV.

When user visit [Firewood](https://firewood.news), the SvelteKit will
request this workers url, and the workers will check if the cache is existed
in KV. If not, will fetch the data from original API and save it to KV.

You can also use it as a simple cache API for your own project.

## Usage

The query string will be used as the key, and the key will be sent in the
body using POST method.

If the original API is `https://api.example.com/v1/abc?name=foo`, and the
cache URL is `https://cache.example/`, you can send the `v1/abc?name=foo`
inside body to `https://cache.example/` using POST method, like:

``` http
POST https://cache.example
Content-Type: application/json
{
	"key": "/v1/abc?name=foo"
}
```

You can easily modify the code for your own usage.
