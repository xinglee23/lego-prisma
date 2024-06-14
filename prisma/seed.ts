import { PrismaClient, ActivityTypeEnum } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const newUser = await prisma.user.create({
    data: {
      userName: 'testUser',
      userCname: 'testUserCname',
    },
  })

  const newActivity = await prisma.activity.create({
    data: {
      type: ActivityTypeEnum.ACTIVITY_COMBO,
      name: 'testActivity',
      activityShowName: 'testActivityShowName',
      source: 'testSource',
      workStatus: 'testWorkStatus',
      url: 'testUrl',
      secondWorkStatus: 'testSecondWorkStatus',
      createTime: new Date(),
      updateTime: new Date(),
      validated: true,
      user: {
        connect: { id: newUser.id },
      },
      templateConfig: {},
    },
  })

  await prisma.componentList.create({
    data: {
      componentCode: 'testComponentCode',
      componentName: 'testComponentName',
      Activity: {
        connect: { activityId: newActivity.activityId },
      },
    },
  })
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })