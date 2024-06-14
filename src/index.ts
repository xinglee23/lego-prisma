/** @format */

import Koa from 'koa';
import Router from '@koa/router';
import { Prisma, PrismaClient } from '@prisma/client';
import { koaBody } from 'koa-body';

const app = new Koa();
const router = new Router();
const prisma = new PrismaClient();

app.use(koaBody());

router.post('/create/activity', async (ctx) => {
  const { userName, userCname, activity } = ctx.request.body;

  try {
    const newActivity = await prisma.user.create({
      data: {
        userName,
        userCname,
        activity: {
          create: {
            type: activity.type,
            name: activity.name,
            activityShowName: activity.activityShowName,
            source: activity.source,
            workStatus: activity.workStatus,
            url: activity.url,
            secondWorkStatus: activity.secondWorkStatus,
            validated: activity.validated,
            templateConfig: activity.templateConfig,
            createTime: new Date(),
            updateTime: new Date(),
            componentList: {
              create: [
                {
                  componentCode: 'APP',
                  componentName: 'APP',
                },
                {
                  componentCode: 'TEXT',
                  componentName: '文字 8',
                },
                { 
                  componentCode: 'TEXT',
                  componentName: '文字 9',
                },
              ],
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

// 获取所有活动
router.get('/activity/all', async (ctx) => {
  const activityList = await prisma.activity.findMany();
  ctx.body = activityList;
});

router.get('/user/all', async (ctx) => {
  const activityList = await prisma.user.findMany();
  ctx.body = activityList;
});

router.get('/activity/:id', async (ctx) => {
  const { id } = ctx.params;
  console.log('params', ctx.params);
  const activityList = await prisma.activity.findUnique({
    where: {
      activityId: id,
    },
  });

  ctx.body = activityList;
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000
⭐️ See sample requests: http://pris.ly/e/ts/rest-koa#3-using-the-rest-api`)
);
