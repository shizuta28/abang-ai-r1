const fallbackArticles = [
  {
    slug: 'mula-belajar-ai',
    titleBm: 'Cara mula belajar AI minggu ini',
    titleEn: 'How to start learning AI this week',
    excerptBm: 'Pilih satu tugas kerja, uji satu alat, dan simpan apa yang berjaya.',
    excerptEn: 'Pick one work task, try one tool, and keep what works.',
    bodyBm: 'Mula kecil. Pilih e-mel, laporan, atau idea kandungan yang anda sudah buat setiap minggu.\n\nTulis arahan yang ada konteks, format, dan had. Kemudian semak fakta sebelum digunakan.\n\n**Ulang proses yang sama tiga kali.** Itulah latihan.',
    bodyEn: 'Start small. Pick an email, a report, or a content idea you already make every week.\n\nWrite an instruction that includes context, format, and limits. Then check the facts before you use it.\n\n**Repeat the same process three times.** That is the practice.'
  },
  {
    slug: 'prompt-yang-jelas',
    titleBm: 'Prompt yang jelas, hasil yang lebih berguna',
    titleEn: 'Clear prompts, more useful results',
    excerptBm: 'Empat bahagian yang patut ada dalam setiap arahan.',
    excerptEn: 'Four parts worth putting in every instruction.',
    bodyBm: 'Nyatakan peranan, tugas, bahan sumber, dan bentuk jawapan.\n\nContoh: "Anda pembantu kedai. Ringkaskan aduan ini dalam lima poin dan cadangkan balasan yang sopan."\n\nKalau jawapan terlalu umum, tambah contoh, bukan ayat yang lebih panjang.',
    bodyEn: 'State the role, the task, the source material, and the shape of the answer.\n\nExample: "You are a shop assistant. Summarise this complaint in five bullets and suggest a polite reply."\n\nIf the answer is too vague, add an example instead of a longer sentence.'
  },
  {
    slug: 'ai-untuk-kerja',
    titleBm: 'AI untuk kerja, bukan untuk ganti fikiran',
    titleEn: 'AI for the work, not a replacement for judgment',
    excerptBm: 'Gunakan AI untuk draf. Keputusan kekal pada anda.',
    excerptEn: 'Use AI for the draft. The decision stays with you.',
    bodyBm: 'AI boleh cadangkan draf, senarai, dan variasi.\n\nAnda tetap semak nombor, nama, dan nada. Jangan terbitkan apa-apa yang anda tidak boleh jelaskan.\n\nSimpan versi akhir supaya pasukan belajar daripada kerja sebenar.',
    bodyEn: 'AI can suggest a draft, a list, and a few variations.\n\nYou still check the numbers, names, and tone. Do not publish anything you cannot explain.\n\nKeep the final version so the team learns from real work.'
  }
]

const fallbackLessons = [
  {
    slug: 'struktur-arahan',
    courseSlug: 'asas-prompt',
    position: 1,
    titleBm: 'Struktur arahan',
    titleEn: 'Instruction structure',
    bodyBm: 'Setiap prompt dalam kursus ini ada empat baris: peranan, tugas, konteks, dan format.',
    bodyEn: 'Every prompt in this course has four lines: role, task, context, and format.'
  },
  {
    slug: 'contoh-kerja',
    courseSlug: 'asas-prompt',
    position: 2,
    titleBm: 'Beri satu contoh',
    titleEn: 'Give one example',
    bodyBm: 'Satu contoh jawapan yang baik lebih berguna daripada sepuluh ayat arahan.',
    bodyEn: 'One example of a good answer is more useful than ten sentences of instruction.'
  },
  {
    slug: 'semak-hasil',
    courseSlug: 'asas-prompt',
    position: 3,
    titleBm: 'Semak hasil',
    titleEn: 'Review the result',
    bodyBm: 'Tandakan fakta, nada, dan apa yang perlu dibuang sebelum digunakan.',
    bodyEn: 'Mark the facts, the tone, and what should be removed before you use it.'
  },
  {
    slug: 'aliran-bisnes',
    courseSlug: 'ai-bisnes',
    position: 1,
    titleBm: 'Pilih satu aliran',
    titleEn: 'Pick one workflow',
    bodyBm: 'Mula dengan kandungan, perkhidmatan pelanggan, atau laporan. Jangan ketiga-tiganya serentak.',
    bodyEn: 'Start with content, customer service, or reporting. Not all three at once.'
  }
]

const fallbackResources = [
  {
    slug: 'glosari-ai',
    titleBm: 'Glosari ringkas AI',
    titleEn: 'A short AI glossary',
    summaryBm: 'Istilah yang cukup untuk baca artikel dan pilih alat.',
    summaryEn: 'Enough terms to read an article and choose a tool.',
    bodyBm: 'Model, prompt, konteks, dan halusinasi. Gunakan glosari ini sebagai rujukan, bukan sebagai silibus.',
    bodyEn: 'Model, prompt, context, and hallucination. Use this glossary as a reference, not a syllabus.'
  },
  {
    slug: 'idea-mingguan',
    titleBm: '10 idea latihan mingguan',
    titleEn: '10 weekly practice ideas',
    summaryBm: 'Latihan 20 minit yang boleh dibuat selepas kerja.',
    summaryEn: 'Twenty-minute exercises you can do after work.',
    bodyBm: 'Ringkaskan mesyuarat, tulis tiga tajuk, tukar nada e-mel, dan semak senarai semak.',
    bodyEn: 'Summarise a meeting, write three headlines, change an email tone, and review a checklist.'
  }
]

function mapEntry(entry) {
  return {
    slug: entry.slug || entry.attributes?.slug,
    titleBm: entry.titleBm || entry.title_bm || entry.title || entry.attributes?.title || '',
    titleEn: entry.titleEn || entry.title_en || entry.title || entry.attributes?.title || '',
    excerptBm: entry.excerptBm || entry.excerpt || entry.attributes?.excerpt || entry.summaryBm || entry.summary || '',
    excerptEn: entry.excerptEn || entry.excerpt || entry.attributes?.excerpt || entry.summaryEn || entry.summary || '',
    summaryBm: entry.summaryBm || entry.summary || entry.attributes?.summary || entry.excerpt || '',
    summaryEn: entry.summaryEn || entry.summary || entry.attributes?.summary || entry.excerpt || '',
    bodyBm: entry.bodyBm || entry.body || entry.attributes?.body || '',
    bodyEn: entry.bodyEn || entry.body || entry.attributes?.body || '',
    courseSlug: entry.courseSlug || entry.course_slug || entry.attributes?.courseSlug || entry.attributes?.course_slug || null,
    position: entry.position || entry.attributes?.position || 0
  }
}

function unwrap(payload) {
  const rows = payload?.data || payload || []
  if (!Array.isArray(rows)) return []
  return rows.map((row) => mapEntry(row.attributes ? { id: row.id, ...row.attributes } : row))
}

async function readCollection(baseUrl, token, collection) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  const response = await fetch(`${baseUrl}/api/${collection}?pagination[pageSize]=100&sort=publishedAt:desc`, {
    headers,
    signal: AbortSignal.timeout(12000)
  })
  if (!response.ok) {
    const error = new Error(`Strapi ${collection} request failed.`)
    error.code = 'strapi_http'
    throw error
  }
  return unwrap(await response.json())
}

export function createStrapi(config) {
  const baseUrl = String(config.url || '').replace(/\/$/, '')
  const enabled = Boolean(baseUrl)
  return {
    enabled,
    async articles() {
      if (!enabled) return { source: 'fallback', items: fallbackArticles.map(mapEntry) }
      try {
        return { source: 'strapi', items: await readCollection(baseUrl, config.token, 'articles') }
      } catch {
        return { source: 'fallback', items: fallbackArticles.map(mapEntry) }
      }
    },
    async lessons(courseSlug) {
      const load = async () => {
        if (!enabled) return fallbackLessons.map(mapEntry)
        return readCollection(baseUrl, config.token, 'lessons')
      }
      try {
        const items = (await load()).filter((lesson) => !courseSlug || lesson.courseSlug === courseSlug)
        items.sort((a, b) => a.position - b.position)
        return { source: enabled ? 'strapi' : 'fallback', items }
      } catch {
        const items = fallbackLessons.map(mapEntry).filter((lesson) => !courseSlug || lesson.courseSlug === courseSlug)
        return { source: 'fallback', items }
      }
    },
    async resources() {
      if (!enabled) return { source: 'fallback', items: fallbackResources.map(mapEntry) }
      try {
        return { source: 'strapi', items: await readCollection(baseUrl, config.token, 'resources') }
      } catch {
        return { source: 'fallback', items: fallbackResources.map(mapEntry) }
      }
    },
    async findArticle(slug) {
      const { source, items } = await this.articles()
      return { source, item: items.find((item) => item.slug === slug) || null }
    }
  }
}
