const messages = {
  bm: {
    nav: { home: 'Utama', courses: 'Kursus', articles: 'Artikel', resources: 'Sumber', products: 'Kedai', login: 'Log Masuk', signup: 'Daftar', account: 'Akaun', admin: 'Admin', logout: 'Log keluar', menu: 'Menu' },
    hero: {
      eyebrow: 'Akses awal — Bina kemahiran AI anda',
      titleA: 'Belajar AI,',
      titleB: 'Cara Mudah',
      script: 'Mudah untuk semua.',
      subtitle: 'Panduan, tools dan idea AI untuk semua.',
      primary: 'Mula belajar',
      secondary: 'Lihat produk'
    },
    chips: { tools: 'Alat AI', courses: 'Kursus AI', prompts: 'Prompt AI', guides: 'Panduan AI', news: 'Berita AI' },
    rail: {
      getStarted: 'Mula sekarang',
      tools: 'Alat AI', toolsCaption: 'Pilih alat yang sesuai',
      courses: 'Kursus', coursesCaption: 'Belajar langkah demi langkah',
      prompts: 'Prompt', promptsCaption: 'Arahan yang boleh digunakan',
      guides: 'Panduan', guidesCaption: 'Idea untuk kerja harian',
      news: 'Berita', newsCaption: 'Apa yang patut ditahu'
    },
    home: {
      campaign: 'Halaman jualan',
      valuesTitle: 'Belajar, bina, kemudian guna',
      value1Title: 'Panduan yang jelas', value1Text: 'Artikel dan pelajaran pendek, tanpa jargon yang tidak perlu.',
      value2Title: 'Produk digital', value2Text: 'Beli toolkit dan kursus. Bayaran disahkan melalui ToyyibPay.',
      value3Title: 'Sumber percuma', value3Text: 'Prompt, senarai semak, dan idea untuk mula minggu ini.',
      courses: 'Kursus', articles: 'Artikel', resources: 'Sumber percuma', products: 'Produk digital',
      leadTitle: 'Nak idea AI untuk pasukan anda?',
      leadText: 'Tinggalkan nama anda. Pasukan Abang AI akan hubungi tentang kelas dan bahan baharu.',
      viewAll: 'Lihat semua'
    },
    lead: { name: 'Nama', email: 'E-mel', phone: 'Telefon', message: 'Mesej', submit: 'Hantar', success: 'Terima kasih. Kami telah simpan maklumat anda.' },
    catalog: { free: 'Percuma', buy: 'Beli sekarang', download: 'Muat turun', details: 'Butiran', empty: 'Belum ada item di sini.', lessons: 'Pelajaran', owned: 'Anda sudah memiliki item ini.', phone: 'Telefon untuk resit bayaran', pay: 'Terus ke bayaran', fileSoon: 'Fail belum dimuat naik.' },
    auth: { loginTitle: 'Log masuk', signupTitle: 'Daftar akaun', name: 'Nama', email: 'E-mel', password: 'Kata laluan', passwordHint: 'Sekurang-kurangnya 8 aksara.', submitLogin: 'Log masuk', submitSignup: 'Daftar', google: 'Teruskan dengan Google', noAccount: 'Belum ada akaun?', hasAccount: 'Sudah ada akaun?', googleError: 'Log masuk Google tidak berjaya. Cuba lagi.' },
    account: { title: 'Akaun anda', orders: 'Pesanan', noOrders: 'Belum ada pesanan.', save: 'Simpan profil', saved: 'Profil dikemas kini.' },
    checkout: { title: 'Status bayaran', confirming: 'Kami sedang sahkan bayaran dengan ToyyibPay. Pesanan hanya ditanda berbayar selepas pengesahan.', paid: 'Bayaran disahkan. Terima kasih.', pending: 'Bayaran masih diproses.', failed: 'Bayaran tidak berjaya.', missing: 'Nombor pesanan tidak dijumpai.', shop: 'Kembali ke kedai' },
    footer: { blurb: 'Platform pembelajaran, produk digital, dan kandungan AI.', rights: 'Abang AI' },
    admin: {
      portal: 'Portal admin', dashboard: 'Papan jualan', leads: 'Borang & lead', products: 'Produk', orders: 'Jualan & pesanan', pages: 'Halaman jualan', threads: 'Draf Threads',
      revenue: 'Hasil dibayar', paid: 'Pesanan dibayar', pending: 'Menunggu', failed: 'Gagal', leadCount: 'Lead', productCount: 'Produk',
      last7: '7 hari lepas', status: 'Status', cancel: 'Batal', save: 'Simpan', create: 'Cipta', delete: 'Padam', upload: 'Muat naik fail',
      published: 'Terbit', draft: 'Draf', review: 'Semakan', schedule: 'Jadual', publish: 'Terbit ke Threads',
      strapi: 'Artikel, pelajaran, dan sumber disunting dalam Strapi.', openStrapi: 'Buka Strapi',
      notReady: 'Integrasi ini belum dikonfigurasi.', scheduleAt: 'Masa jadual'
    },
    common: { offline: 'Pelayan belum bersedia. Semak API dan pangkalan data.', loading: 'Memuatkan...', error: 'Ada masalah. Cuba lagi.' }
  },
  en: {
    nav: { home: 'Home', courses: 'Courses', articles: 'Articles', resources: 'Resources', products: 'Shop', login: 'Login', signup: 'Sign Up', account: 'Account', admin: 'Admin', logout: 'Log out', menu: 'Menu' },
    hero: {
      eyebrow: 'Early access — Build your AI skills',
      titleA: 'Learn AI,',
      titleB: 'The Easy Way',
      script: 'Made for everyone.',
      subtitle: 'Guides, tools, and AI ideas for everyone.',
      primary: 'Start learning',
      secondary: 'Browse products'
    },
    chips: { tools: 'AI Tools', courses: 'AI Courses', prompts: 'AI Prompts', guides: 'AI Guides', news: 'AI News' },
    rail: {
      getStarted: 'Get Started',
      tools: 'AI Tools', toolsCaption: 'Pick the right tool',
      courses: 'Courses', coursesCaption: 'Learn step by step',
      prompts: 'Prompts', promptsCaption: 'Instructions you can use',
      guides: 'Guides', guidesCaption: 'Ideas for daily work',
      news: 'News', newsCaption: 'What is worth knowing'
    },
    home: {
      campaign: 'Sales page',
      valuesTitle: 'Learn it, build it, then use it',
      value1Title: 'Clear guides', value1Text: 'Short articles and lessons, without extra jargon.',
      value2Title: 'Digital products', value2Text: 'Buy toolkits and courses. Payment is confirmed through ToyyibPay.',
      value3Title: 'Free resources', value3Text: 'Prompts, checklists, and ideas to start this week.',
      courses: 'Courses', articles: 'Articles', resources: 'Free resources', products: 'Digital products',
      leadTitle: 'Want AI ideas for your team?',
      leadText: 'Leave your name. Abang AI will follow up about classes and new material.',
      viewAll: 'View all'
    },
    lead: { name: 'Name', email: 'Email', phone: 'Phone', message: 'Message', submit: 'Send', success: 'Thank you. We have saved your details.' },
    catalog: { free: 'Free', buy: 'Buy now', download: 'Download', details: 'Details', empty: 'Nothing is listed here yet.', lessons: 'Lessons', owned: 'You already own this item.', phone: 'Phone for the payment receipt', pay: 'Continue to payment', fileSoon: 'The file has not been uploaded yet.' },
    auth: { loginTitle: 'Log in', signupTitle: 'Create an account', name: 'Name', email: 'Email', password: 'Password', passwordHint: 'At least 8 characters.', submitLogin: 'Log in', submitSignup: 'Sign up', google: 'Continue with Google', noAccount: 'No account yet?', hasAccount: 'Already have an account?', googleError: 'Google sign-in did not complete. Please try again.' },
    account: { title: 'Your account', orders: 'Orders', noOrders: 'No orders yet.', save: 'Save profile', saved: 'Profile updated.' },
    checkout: { title: 'Payment status', confirming: 'We are verifying the payment with ToyyibPay. An order is marked paid only after that check.', paid: 'Payment verified. Thank you.', pending: 'The payment is still processing.', failed: 'The payment did not go through.', missing: 'We could not find that order.', shop: 'Back to the shop' },
    footer: { blurb: 'A learning platform for AI guides, digital products, and content.', rights: 'Abang AI' },
    admin: {
      portal: 'Admin portal', dashboard: 'Sales dashboard', leads: 'Forms & leads', products: 'Products', orders: 'Sales & orders', pages: 'Sales pages', threads: 'Threads drafts',
      revenue: 'Paid revenue', paid: 'Paid orders', pending: 'Pending', failed: 'Failed', leadCount: 'Leads', productCount: 'Products',
      last7: 'Last 7 days', status: 'Status', cancel: 'Cancel', save: 'Save', create: 'Create', delete: 'Delete', upload: 'Upload file',
      published: 'Publish', draft: 'Draft', review: 'Review', schedule: 'Schedule', publish: 'Publish to Threads',
      strapi: 'Articles, lessons, and resources are edited in Strapi.', openStrapi: 'Open Strapi',
      notReady: 'This integration is not configured yet.', scheduleAt: 'Schedule time'
    },
    common: { offline: 'The server is not ready. Check the API and database.', loading: 'Loading...', error: 'Something went wrong. Please try again.' }
  }
}

export function useLocale() {
  const locale = useCookie('abang_locale', {
    default: () => 'bm',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    path: '/'
  })

  function t(key) {
    const parts = key.split('.')
    let node = messages[locale.value] || messages.bm
    for (const part of parts) node = node?.[part]
    return typeof node === 'string' ? node : key
  }

  function setLocale(next) {
    locale.value = next === 'en' ? 'en' : 'bm'
  }

  function pick(item, field) {
    if (!item) return ''
    const suffix = locale.value === 'en' ? 'En' : 'Bm'
    return item[`${field}${suffix}`] || item[`${field}Bm`] || item[field] || ''
  }

  return { locale, t, setLocale, pick }
}
