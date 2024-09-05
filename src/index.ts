import Koa from 'koa';
import Cors from '@koa/cors';
import Router from '@koa/router';
import { Prisma, PrismaClient } from '@prisma/client';
import { koaBody } from 'koa-body';
import { uploadToAliyun } from './utils/upload';

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
	const { type, creator_id, version, activity_start_time, activity_end_time } =
		ctx.request.body;
	console.log('create id', creator_id);
	const activityTypeList = ['ACTIVITY_COMBO', 'ACTIVITY_H5', 'ACTIVITY_FORM'];

	if (!activityTypeList.includes(type)) {
		let errorMsg = 'please input right activity type';
		if (!activity_start_time || activity_end_time) {
			errorMsg = 'activity time is necessary';
		}

		ctx.status = 400;
		ctx.body = { error: errorMsg };
		return;
	}

	try {
		// 创建新的 Activity 和 SettingConfig
		const newActivity = await prisma.activity.create({
			data: {
				type,
				name: 'new activity',
				activity_show_name: 'new activity',
				source: '',
				work_status: 'ACTIVITY_DRAFT',
				url: '',
				second_work_status: '',
				template_config: {}, // 根据需要设置 JSON 数据
				setting_config: {
					create: {
						// 使用 create 创建新的 SettingConfig
						version,
						activity_start_time,
						activity_end_time,
						take_part_in_config: {
							create: {
								user_group: '',
								user_group_cname: ''
							}
						}, // 假设有预先定义的参与配置
						rewards_list: {
							create: {}
						}
					}
				},
				creator: {
					connect: { user_id: '667280e30a0bfe48ec9e90f2' } // 连接到一个现有的 Creator
				},
				create_time: new Date(),
				update_time: new Date(),
				validated: false
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
				setting_config: activity.setting_config
					? {
							update: {
								version: activity.setting_config.version,
								activity_start_time:
									activity.setting_config.activity_start_time,
								activity_end_time: activity.setting_config.activity_end_time,
								activity_param_config:
									activity.setting_config.activity_param_config,
								take_part_in_config: activity.setting_config.take_part_in_config
									? {
											update: {
												user_group:
													activity.setting_config.take_part_in_config
														.user_group,
												user_group_cname:
													activity.setting_config.take_part_in_config
														.user_group_cname
											}
										}
									: undefined,
								rewards_list: activity.setting_config.rewards_list
									? {
											update: {
												reward_json:
													activity.setting_config.rewards_list.reward_json
											}
										}
									: undefined
							}
						}
					: undefined
			},
			include: {
				setting_config: {
					include: {
						take_part_in_config: true,
						rewards_list: true
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

router.post('/activity/save', async (ctx) => {
	const { activity_id, ...rest } = ctx.request.body;
	const activity = rest;

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
				template_config: JSON.stringify(activity.template_config), // 根据需要设置 JSON 数据
				setting_config: {
					update: {
						version: activity?.setting_config.version,
						activity_param_config:
							activity?.setting_config.activity_param_config,
						activity_start_time: activity.setting_config.activity_start_time,
						activity_end_time: activity.setting_config.activity_end_time,
						take_part_in_config: activity?.setting_config?.take_part_in_config
						// rewards_list: {
						// 	update: {
						// 		where: {
						// 			reward_info_id: activity.setting_config.reward_id
						// 		},
						// 		data: {
						// 			reward_json: activity.setting_config.rewards_list.reward_json
						// 		}
						// 	}
						// }
					}
				}
			},
			include: {
				setting_config: {
					include: {
						take_part_in_config: true
						// rewards_list: true
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

router.get('/activity/preview/:id', async (ctx) => {
	const { id } = ctx.params;
	const previewUrl = await prisma.preview.findUnique({
		where: {
			id: id
		}
	});

	ctx.body = {
		url: previewUrl?.url
	};
});

router.get('/activity/edit/:id', async (ctx) => {
	const { id } = ctx.params;
	try {
		const activity = await prisma.activity.findUnique({
			where: {
				activity_id: id
			},
			include: {
				setting_config: {
					include: {
						take_part_in_config: true,
						rewards_list: true
					}
				}
			}
		});

		const user_id = activity?.creator_id;
		// const setting_config_id = activity?.setting_config_id;

		const creator = await prisma.creator.findUnique({
			where: {
				user_id
			}
		});

		console.log('activity', activity);

		// const settingConfig = await prisma.settingConfig.findUnique({
		// 	where: { id: setting_config_id },
		// 	select: {
		// 		id: false,
		// 		version: true,
		// 		activity_param_config: true,
		// 		activity_start_time: true,
		// 		activity_end_time: true,
		// 		take_part_in_config_id: true,
		// 		reward_id: true,
		// 		rewards_list: true,
		// 		activity: false
		// 	}
		// });

		ctx.body = {
			...activity,
			// setting_config: settingConfig,
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
