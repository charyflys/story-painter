import { put } from "@vercel/blob";
import { kv } from '@vercel/kv'
import querystring from 'querystring'

const fronturl = process.env.WEBSITE_URL as string||'https://painter.firehomework.top/'
const filesizelimit = 2
export async function GET(req: Request) {
	const { key, password } = querystring.parse(req.url.replace(/^.+?\?/, ''))
	const res = await fetch(await kv.get(`${key}#${password}`)||'').then(res=>res.json())
	return Response.json(res)
}
export async function PUT(req: Request) {

	const obj = await req.formData()
	const file = obj.get('file') as File
	if (!file) {
		return Response.json({
			data: 'no file error'
		}, { status: 400 })
	}
	const name = obj.get('name')
	const uniform_id = obj.get('uniform_id')
	const client = obj.get('client')


	if (file.size > filesizelimit * 1024 * 1024) {
		return Response.json({
			data: "Size is too big!",
		}, { status: 400 })
	}


	const bufferBase64 = Buffer.from(await file.arrayBuffer()).toString('base64')
	const key = generateRandomString(4);
	const password = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);

	const { url: fileUrl } = await put(`${uniform_id}/${name}/${Math.floor(Date.now()/1000)}`, JSON.stringify(generateStorageData(bufferBase64, name as string)), { access: 'public' });
	// const filePath = fileUrl.replace(`https://uxle9woampkgealk.public.blob.vercel-storage.com/`, '')
	await kv.set(`${key}#${password}`,fileUrl)
	// 返回log地址
	return Response.json({
		url: fronturl + '?key=' + key + '#' + password,
	})
	// }
}

function generateRandomString(length: number) {
	let result = "";
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		const randomChar = characters.charAt(randomIndex);
		result += randomChar;
	}

	return result;
}
function generateStorageData(data: any, name: string) {
	return {
		client: "SealDice",
		created_at: new Date().toISOString(),
		data: data,
		name: name,
		note: "",
		updated_at: new Date().toISOString(),
	};
}
