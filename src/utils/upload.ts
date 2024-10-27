const fs = require('fs');
const OSS = require('ali-oss');
const sharp = require('sharp');

import { OSS_REGION, OSS_BUCKET } from '../constant';

export const ossClient = new OSS({
	region: OSS_REGION,
	accessKeyId: process.env.OSS_ACCESS_KEY_ID,
	accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
	bucket: OSS_BUCKET
});

export async function cutImageWithAliyun(
	material: {
		id: string;
		filename: string;
		url: string;
	},
	cutConfig: string
) {
	const objectKey = new URL(material.url).pathname.replace(/^\//, '');
	const result = await ossClient.get(objectKey);
	const [x, y, width, height] = cutConfig.split(',').map(Number);
	const buffer = await sharp(result.content)
		.extract({ left: x, top: y, width, height })
		.toBuffer();

	const newFileName = `${material.id}_${Date.now()}_cropped.jpg`;
	const data = await ossClient.put(newFileName, buffer);

	return data;
}

export async function uploadToAliyun(
	filePath: string,
	filename: string
): Promise<string> {
	try {
		const result = await ossClient.put(filename, filePath, {
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
