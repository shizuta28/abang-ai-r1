import dotenv from 'dotenv'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/password.js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
dotenv.config({ path: resolve(root, '.env') })

const prisma = new PrismaClient()

const products = [
  {
    slug: 'asas-prompt',
    titleBm: 'Kursus Asas Prompt',
    titleEn: 'Prompt Basics Course',
    summaryBm: 'Belajar tulis arahan AI yang jelas untuk kerja harian.',
    summaryEn: 'Learn to write clear AI instructions for everyday work.',
    descriptionBm: 'Empat pelajaran pendek: struktur prompt, contoh, semakan, dan latihan.',
    descriptionEn: 'Four short lessons: prompt structure, examples, review, and practice.',
    priceCents: 4900,
    type: 'COURSE',
    published: true
  },
  {
    slug: 'ai-bisnes',
    titleBm: 'AI untuk Bisnes Kecil',
    titleEn: 'AI for Small Business',
    summaryBm: 'Guna AI untuk kandungan, pelanggan, dan operasi tanpa jargon.',
    summaryEn: 'Use AI for content, customers, and operations without the jargon.',
    descriptionBm: 'Sesuai untuk pemilik bisnes yang mahu mula dengan aliran kerja yang praktikal.',
    descriptionEn: 'For owners who want a practical workflow, not a technical lecture.',
    priceCents: 7900,
    type: 'COURSE',
    published: true
  },
  {
    slug: 'toolkit-kandungan',
    titleBm: 'Toolkit Kandungan AI',
    titleEn: 'AI Content Toolkit',
    summaryBm: 'Templat siaran, idea kalendar, dan senarai semak penyuntingan.',
    summaryEn: 'Post templates, a content calendar, and an editing checklist.',
    descriptionBm: 'Produk digital untuk pasukan kecil yang menerbitkan kandungan setiap minggu.',
    descriptionEn: 'A digital product for small teams publishing every week.',
    priceCents: 2900,
    type: 'DIGITAL',
    published: true
  },
  {
    slug: 'pek-threads',
    titleBm: 'Pek Siaran Threads',
    titleEn: 'Threads Post Pack',
    summaryBm: '20 draf siaran yang boleh diubah suai untuk jenama anda.',
    summaryEn: '20 editable post drafts for your brand.',
    descriptionBm: 'Mulakan aliran Threads: draf, semak, kemudian jadualkan dalam portal admin.',
    descriptionEn: 'Start a Threads workflow: draft, review, then schedule in the admin portal.',
    priceCents: 1900,
    type: 'DIGITAL',
    published: true
  },
  {
    slug: 'prompt-percuma',
    titleBm: 'Pek Prompt Percuma',
    titleEn: 'Free Prompt Pack',
    summaryBm: 'Sepuluh prompt permulaan untuk belajar, menulis, dan merancang.',
    summaryEn: 'Ten starter prompts for learning, writing, and planning.',
    descriptionBm: 'Sumber percuma. Muat turun dibuka selepas log masuk.',
    descriptionEn: 'A free resource. Download opens after you log in.',
    priceCents: 0,
    type: 'RESOURCE',
    published: true
  },
  {
    slug: 'senarai-semak-ai',
    titleBm: 'Senarai Semak Mula AI',
    titleEn: 'AI Starter Checklist',
    summaryBm: 'Langkah ringkas untuk pilih alat, uji idea, dan semak hasil.',
    summaryEn: 'A short checklist for choosing tools, testing ideas, and reviewing output.',
    descriptionBm: 'Sesuai dicetak atau disimpan sebagai PDF.',
    descriptionEn: 'Print it or keep it as a PDF.',
    priceCents: 0,
    type: 'RESOURCE',
    published: true
  }
]

async function main() {
  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product
    })
  }

  await prisma.salesPage.upsert({
    where: { slug: 'kelas-ai' },
    update: {},
    create: {
      slug: 'kelas-ai',
      titleBm: 'Kelas AI untuk pemula',
      titleEn: 'An AI class for beginners',
      bodyBm: 'Kelas ini untuk orang yang sibuk.\n\nAnda akan belajar cara bertanya, menyemak jawapan, dan menggunakan AI untuk kerja sebenar.\n\n**Mula dengan satu tugas kecil minggu ini.**',
      bodyEn: 'This class is for busy people.\n\nYou will learn how to ask, check the answer, and use AI on real work.\n\n**Start with one small task this week.**',
      published: true
    }
  })

  await prisma.threadPost.upsert({
    where: { id: 'seed-thread-draft' },
    update: {},
    create: {
      id: 'seed-thread-draft',
      body: 'AI bukan pengganti fikiran anda. Ia alat untuk draf pertama. Semak fakta, kemudian barulah terbitkan.',
      status: 'DRAFT'
    }
  })

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const adminPassword = process.env.ADMIN_PASSWORD
  if (adminEmail && adminPassword) {
    const existing = await prisma.user.findUnique({ where: { email: adminEmail } })
    if (!existing) {
      await prisma.user.create({
        data: {
          email: adminEmail,
          name: 'Admin',
          role: 'ADMIN',
          passwordHash: await hashPassword(adminPassword),
          locale: 'bm'
        }
      })
      console.log(`Created admin ${adminEmail}`)
    } else if (existing.role !== 'ADMIN') {
      await prisma.user.update({ where: { id: existing.id }, data: { role: 'ADMIN' } })
      console.log(`Promoted ${adminEmail} to admin`)
    }
  } else {
    console.log('Skipped admin user. Set ADMIN_EMAIL and ADMIN_PASSWORD to create one.')
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
