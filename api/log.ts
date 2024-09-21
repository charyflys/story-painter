import { put } from "@vercel/blob";
import querystring from 'querystring'
// export const runtime = 'edge';
// const { url } = await put('articles/blob.txt', 'Hello World!', { access: 'public' });
const fronturl = 'https://story-painter-theta.vercel.app/'
const filesizelimit = 2
export async function GET(req: Request) {
	const { key, password } = querystring.parse(req.url.replace(/^.+?\?/, ''))
	return Response.redirect('https://uxle9woampkgealk.public.blob.vercel-storage.com/' + key + '-' + password)
}
export async function PUT(req: Request) {

	const obj = await req.formData()
	const file = obj.get('file') as File
	if (!file) {
		return Response.json({
			data: 'no file error'
		}, { status: 400 })
	}
	const { name, uniform_id, client } = querystring.parse(req.url.replace(/^.+?\?/, ''))


	//检验uniform_id的正确性
	// var patt1 = /^[^:]+:\d+$/;
	// if (!patt1.test(uniform_id as string)) {
	// 	//返回未能通过的信息：uniform_id field did not pass validation
	// 	return Response.json({
	// 		data: "uniform_id field did not pass validation",
	// 	}, { status: 400 })
	// }

	//检验file文件的大小
	if (file.size > filesizelimit * 1024 * 1024) {
		return Response.json({
			data: "Size is too big!",
		}, { status: 400 })
	}


	//转base64
	// let logdata = "";

	const logdata = new TextDecoder().decode(new Uint8Array(await file.arrayBuffer()))
	// logdata = btoa(logdata);
	// const logdata = await encodeToBase64(file)
	let key = generateRandomString(4);


	const { url: fileUrl } = await put(`${key}`, JSON.stringify(generateStorageData(logdata, name as string)), { access: 'public' });
	// 返回log地址
	return Response.json({
		url: fronturl + '?key=' + key + '#' + fileUrl.replace(`https://uxle9woampkgealk.public.blob.vercel-storage.com/${key}-`, ''),
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
function encodeToBase64(file:Blob) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
            const base64Data = reader.result.split(',')[1];
            resolve(base64Data);
        } else {
            reject()
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }