import { PrismaClient, ActivityTypeEnum } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	// 创建 Creator
	const creator = await prisma.creator.create({
		data: {
			user_name: 'Test User',
			user_cname: '测试用户'
		}
	});

	// 创建 TakePartInConfig
	const takePartInConfig = await prisma.takePartInConfig.create({
		data: {
			user_group: 'Test Group',
			user_group_cname: '测试组'
		}
	});

	// 创建 RewardsList
	const rewardsList = await prisma.rewardsList.create({
		data: {
			reward_json: {}
		}
	});

	// 创建 Activity
	await prisma.activity.create({
		data: {
			name: 'Test Activity',
			activity_show_name: '测试活动',
			type: ActivityTypeEnum.ACTIVITY_COMBO,
			source: 'Test Source',
			work_status: 'ACTIVITY_DRAFT',
			url: 'https://example.com',
			second_work_status: 'APPROVAL_REJECTED',
			creator_id: creator.user_id,
			create_time: new Date(),
			update_time: new Date(),
			template_config: {},
			validated: true
		}
	});
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
