/** @format */

import Koa from 'koa';
import Router from '@koa/router';
import { Prisma, PrismaClient } from '@prisma/client';
import { koaBody } from 'koa-body';

const app = new Koa();
const router = new Router();
const prisma = new PrismaClient();

app.use(koaBody());

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
                    ...activity.setting_config.take_part_in_config,
                  },
                },
                rewards_list: {
                  create: {
                    ...activity.setting_config.rewards_list,
                  },
                },
              },
            },
          },
        },
      },
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
        activity_id,
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
                ...(activity.setting_config?.take_part_in_config || {}),
              },
            },
            rewards_list: {
              update: {
                ...(activity.setting_config?.rewards_list || {}),
              },
            },
          },
        },
      },
    });

    ctx.status = 201;
    ctx.body = updatedActivity;
  } catch (error) {
    console.error('Error updating activity:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error' };
  }
})

// 获取所有活动
router.get('/activity/all', async (ctx) => {
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
  const activity = await prisma.activity.findUnique({
    where: {
      activity_id: id,
    },
  });

  const user_id = activity?.creator_id;

  const creator = await prisma.creator.findUnique({
    where: {
      user_id,
    },
  });

  ctx.body = {
    ...activity,
    creator,
  };
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(8000, () =>
  console.log(`
🚀 Server ready at: http://localhost:8000
⭐️ See sample requests: http://pris.ly/e/ts/rest-koa#3-using-the-rest-api`)
);
