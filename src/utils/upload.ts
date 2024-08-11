const fs = require('fs');
const OSS = require('ali-oss');
import { OSS_REGION, OSS_BUCKET } from '../constant';

const client = new OSS({
	region: OSS_REGION,
	accessKeyId: process.env.OSS_ACCESS_KEY_ID,
	accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
	bucket: OSS_BUCKET
});

export async function uploadToAliyun(
	filePath: string,
	filename: string
): Promise<string> {
	try {
		const result = await client.put(filename, filePath, {
			headers: {
				'x-oss-object-acl': 'public-read'
			}
		});
		// clear file in uploadDir
		fs.unlinkSync(filePath);
		return result.url;
	} catch (error) {
		console.error('Error uploading to Aliyun:', error);
		throw error;
	}
}
