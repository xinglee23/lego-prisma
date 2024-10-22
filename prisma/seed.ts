import { PrismaClient } from '@prisma/client';
import { generateId } from '../src/utils/generateId';

const prisma = new PrismaClient();

async function main() {
  // Create a folder
  const folder = await prisma.folder.create({
    data: {
      folder_id: generateId(),
      folder_name: 'Sample Folder',
    },
  });

  // Create some tags
  const tag1 = await prisma.tag.create({
    data: {
      name: 'Tag 1',
    },
  });

  const tag2 = await prisma.tag.create({
    data: {
      name: 'Tag 2',
    },
  });

  // Create an activity
  const activity = await prisma.activity.create({
    data: {
      activity_id: generateId(),
      name: 'Sample Activity',
      activity_show_name: 'Sample Activity Display Name',
      type: 'ACTIVITY_H5',
      source: 'SYSTEM_CREATE',
      work_status: 'ACTIVITY_DRAFT',
      url: 'https://example.com/activity',
      creator_id: 'system',
      create_time: new Date(),
      update_time: new Date(),
      template_config: {},
      setting_config: {},
      validated: false,
      folder: {
        connect: { id: folder.id },
      },
      tags: {
        create: [
          { tag: { connect: { id: tag1.id } } },
          { tag: { connect: { id: tag2.id } } },
        ],
      },
    },
  });

  console.log({ activity, folder, tag1, tag2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });