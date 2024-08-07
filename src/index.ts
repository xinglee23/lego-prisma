import Koa from 'koa';
import Cors from '@koa/cors';
import Router from '@koa/router';
import { Prisma, PrismaClient } from '@prisma/client';
import { koaBody } from 'koa-body';
import { OSS_REGION, OSS_BUCKET } from './constant';

const fs = require('fs');
const path = require('path');
const OSS = require('ali-oss');

const app = new Koa();
const router = new Router();
const prisma = new PrismaClient();

app.use(koaBody());
app.use(
	Cors({
		origin: '*',
		allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
		allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
		credentials: true
	})
);

const client = new OSS({
	region: OSS_REGION,
	accessKeyId: process.env.OSS_ACCESS_KEY_ID,
	accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
	bucket: OSS_BUCKET
});

async function uploadToAliyun(
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

router.post('/file/upload', koaBody({ multipart: true }), async (ctx) => {
	try {
		const request = ctx.request as any;
		const file = request.files?.file;

		if (!file) {
			ctx.status = 400;
			ctx.body = { error: 'No file uploaded' };
			return;
		}

		const uploadedFile = Array.isArray(file) ? file[0] : file;
		const uploadDir = path.join(__dirname, 'uploads');
		// if the directory doesn't exist, create it
		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir, { recursive: true });
		}

		const filePath = path.join(uploadDir, uploadedFile.newFilename);
		const reader = fs.createReadStream(uploadedFile.filepath);
		const stream = fs.createWriteStream(filePath);

		await new Promise((resolve, reject) => {
			reader.pipe(stream);
			stream.on('finish', resolve);
			stream.on('error', reject);
		});

		const fileExt = path.extname(uploadedFile.originalFilename);
		const filename = `${uploadedFile.newFilename}${fileExt}`;
		const url = await uploadToAliyun(filePath, filename);

		await prisma.file.create({
			data: {
				url,
				filename
			}
		});

		ctx.body = [
			{
				file: {
					url,
					size: uploadedFile.size,
					hash: uploadedFile.hash,
					mimetype: uploadedFile.mimetype,
					name: uploadedFile.originalFilename,
					lastModified: uploadedFile.lastModified
				},
				response: {
					file_name: filename,
					is_finished: true
				}
			}
		];
	} catch (error) {
		console.error('Error processing file upload:', error);
		ctx.status = 500;
		ctx.body = { error: 'Failed to upload file' };
	}
});

router.post('/activity/create', async (ctx) => {
	const { user_name, user_cname, activity } = ctx.request.body;

	try {
		const newActivity = await prisma.creator.create({
			data: {
				user_name,
				user_cname,
				activity: {
					create: {
						update_time: new Date(),
						name: activity.name,
						activity_show_name: activity.activity_show_name,
						type: activity.type, // 根据 ActivityTypeEnum 的枚举值
						source: activity.source,
						work_status: activity.work_status,
						url: activity.url,
						second_work_status: activity.second_work_status,
						template_config: activity.template_config, // 根据需要设置 JSON 数据
						setting_config: {
							create: {
								...activity.setting_config,
								take_part_in_config: {
									create: {
										...activity.setting_config.take_part_in_config
									}
								},
								rewards_list: {
									create: {
										...activity.setting_config.rewards_list
									}
								}
							}
						}
					}
				}
			}
		});

		ctx.status = 201;
		ctx.body = newActivity;
	} catch (error) {
		console.error('Error creating activity:', error);
		ctx.status = 500;
		ctx.body = { error: 'Internal Server Error' };
	}
});

router.post('/activity/update', async (ctx) => {
	const { activity_id, activity } = ctx.request.body;

	try {
		const updatedActivity = await prisma.activity.update({
			where: {
				activity_id
			},
			data: {
				update_time: new Date(),
				name: activity.name,
				activity_show_name: activity.activity_show_name,
				type: activity.type, // 根据 ActivityTypeEnum 的枚举值
				source: activity.source,
				work_status: activity.work_status,
				url: activity.url,
				second_work_status: activity.second_work_status,
				template_config: activity.template_config, // 根据需要设置 JSON 数据
				setting_config: {
					update: {
						...activity.setting_config,
						take_part_in_config: {
							update: {
								...(activity.setting_config?.take_part_in_config || {})
							}
						},
						rewards_list: {
							update: {
								...(activity.setting_config?.rewards_list || {})
							}
						}
					}
				}
			}
		});

		ctx.status = 201;
		ctx.body = updatedActivity;
	} catch (error) {
		console.error('Error updating activity:', error);
		ctx.status = 500;
		ctx.body = { error: 'Internal Server Error' };
	}
});

// 获取所有活动
router.get('/activity/all', async (ctx) => {
	const activityList = await prisma.activity.findMany();
	ctx.body = activityList;
});

router.get('/activity/preview', async (ctx) => {
	const activityList = await prisma.activity.findMany();
	ctx.body = activityList;
});

router.get('/user/all', async (ctx) => {
	const activityList = await prisma.creator.findMany();
	ctx.body = activityList;
});

// 获取编辑页面作品详情信息
router.get('/activity/edit_info/:id', async (ctx) => {
	const { id } = ctx.params;
	try {
		const activity = await prisma.activity.findUnique({
			where: {
				activity_id: id
			}
		});

		const user_id = activity?.creator_id;
		const setting_config_id = activity?.setting_config_id;

		const creator = await prisma.creator.findUnique({
			where: {
				user_id
			}
		});

		const settingConfig = await prisma.settingConfig.findUnique({
			where: { id: setting_config_id }
		});

		ctx.body = {
			...activity,
			setting_config: settingConfig,
			creator
		};
	} catch (error) {
		console.error('Error getting activity:', error);
		ctx.status = 500;
		ctx.body = { error: 'Internal Server Error' };
	}
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(8000, () =>
	console.log(`
🚀 Server ready at: http://localhost:8000
⭐️ See sample requests: http://pris.ly/e/ts/rest-koa#3-using-the-rest-api`)
);
