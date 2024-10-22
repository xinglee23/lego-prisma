import Koa from 'koa';
import Cors from '@koa/cors';
import Router from '@koa/router';
import { PrismaClient } from '@prisma/client';
import { koaBody } from 'koa-body';
import { uploadToAliyun, generateId } from './utils';

const fs = require('fs');
const path = require('path');

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

		const { id } = await prisma.file.create({
			data: {
				url,
				filename
			}
		});

		console.log('prisma file', id);

		ctx.body = {
			file: {
				url,
				size: uploadedFile.size,
				hash: uploadedFile.hash,
				material_id: id,
				mimetype: uploadedFile.mimetype,
				name: uploadedFile.originalFilename,
				lastModified: uploadedFile.lastModified
			},
			response: {
				file_name: filename,
				is_finished: true
			}
		};
	} catch (error) {
		console.error('Error processing file upload:', error);
		ctx.status = 500;
		ctx.body = { error: 'Failed to upload file' };
	}
});

router.get('/activity/edit/:id', async (ctx) => {
	const { id } = ctx.params;
	try {
		const activity = await prisma.activity.findUnique({
			where: {
				activity_id: id
			},
			include: {
				tags: {
					include: {
						tag: true
					}
				},
				folder: true
			}
		});

		if (!activity) {
			ctx.status = 404;
			ctx.body = { error: 'Activity not found' };
			return;
		}

		// 构造响应体
		ctx.body = {
			...activity,
			creator: {
				user_id: activity.creator_id
			}
		};
	} catch (error) {
		console.error('Error getting activity:', error);
		ctx.status = 500;
		ctx.body = { error: 'Internal Server Error' };
	}
});

router.post('/activity/edit/:id', async (ctx) => {
	const { id: activity_id } = ctx.params;
	const { activity } = ctx.request.body;

	if (!activity_id) {
		throw Error('activity_id can`t be empty');
	}

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

router.get('/activity/list', async (ctx) => {
	const activityList = await prisma.activity.findMany();
	ctx.body = activityList;
});

router.post('/activity/create', async (ctx) => {
	const { user_name = 'admin', activity } = ctx.request.body;

	try {
		const newActivity = await prisma.activity.create({
			data: {
				activity_id: generateId(),
				name: activity.name,
				activity_show_name: activity.activity_show_name,
				type: activity.type,
				source: activity.source,
				work_status: activity.work_status,
				url: activity.url,
				second_work_status: activity.second_work_status,
				creator_id: user_name,
				create_time: new Date(),
				update_time: new Date(),
				template_config: activity.template_config,
				setting_config: activity.setting_config,
				validated: activity.validated,
				preview_url: activity.preview_url,
				plugin_type: activity.plugin_type,
				poster_url: activity.poster_url
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

router.get('/activity/detail/:activity_id', async (ctx) => {
	const { activity_id } = ctx.params;
	const activity = await prisma.activity.findUnique({
		where: { activity_id },
		include: {
			tags: {
				include: {
					tag: true
				}
			},
			folder: true
		}
	});
	if (!activity) {
		ctx.status = 404;
		ctx.body = { error: 'Activity not found' };
		return;
	}
	ctx.body = activity;
});

router.post('/activity/save', async (ctx) => {
	const { activity_id, ...activityData } = ctx.request.body;

	console.log('activityData', activityData, activity_id);

	if (!activity_id) {
		ctx.status = 400;
		ctx.body = { error: 'activity_id is required' };
		return;
	}

	// 首先尝试查找活动
	const existingActivity = await prisma.activity.findUnique({
		where: { activity_id }
	});

	if (!existingActivity) {
		ctx.status = 404;
		ctx.body = { error: `Activity with id ${activity_id} not found` };
		return;
	}

	const updatedActivity = await prisma.activity.update({
		where: { activity_id },
		data: {
			name: activityData.name,
			activity_show_name: activityData.activity_show_name,
			type: activityData.type,
			source: activityData.source,
			work_status: activityData.work_status,
			url: activityData.url,
			second_work_status: activityData.second_work_status,
			template_config: activityData.template_config,
			setting_config: activityData.setting_config,
			validated: activityData.validated,
			preview_url: activityData.preview_url,
			plugin_type: activityData.plugin_type,
			poster_url: activityData.poster_url,
			update_time: new Date()
		}
	});
	ctx.body = updatedActivity;
});

router.post('/template/create', async (ctx) => {
	const {
		name,
		description,
		type,
		scene_code,
		template_config,
		plugin_config,
		scene_config,
		setting_config
	} = ctx.request.body;
	const template = await prisma.template.create({
		data: {
			template_id: generateId(), // Generate a unique ID
			name,
			description,
			type,
			scene_code,
			template_config,
			plugin_config,
			scene_config,
			setting_config,
			work_status: 'UNPUBLISHED',
			creator_id: 'system', // You might want to get this from authentication
			create_time: new Date(),
			update_time: new Date()
		}
	});
	ctx.body = { id: template.template_id };
});

router.get('/template/detail/:template_id', async (ctx) => {
	const { template_id } = ctx.params;
	const template = await prisma.template.findUnique({
		where: { template_id }
	});
	if (!template) {
		ctx.status = 404;
		ctx.body = { error: 'Template not found' };
		return;
	}
	ctx.body = template;
});

router.post('/question/suit/list', async (ctx) => {
	const { id, suit_name, page_info } = ctx.request.body;
	const where: any = {};
	if (id) where.id = id;
	if (suit_name) where.question_suit_name = { contains: suit_name };

	const questionSuits = await prisma.questionSuit.findMany({
		where,
		skip: page_info.page_num * page_info.page_size,
		take: page_info.page_size
	});

	const totalCount = await prisma.questionSuit.count({ where });

	ctx.body = {
		page_info: {
			page_num: page_info.page_num,
			page_size: page_info.page_size,
			total_data_num: totalCount,
			total_page_num: Math.ceil(totalCount / page_info.page_size)
		},
		data_list: questionSuits
	};
});

app.use(router.routes()).use(router.allowedMethods());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
