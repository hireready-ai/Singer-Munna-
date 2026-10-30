const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed process for Singer Munna Kumar Nirala website...');

  // 1. Admin User (preserves custom credentials once created)
  const existingAdmin = await prisma.adminUser.findFirst();
  if (!existingAdmin) {
    const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'nirala@admin2026';
    const passwordHash = await bcrypt.hash(defaultPassword, 10);
    await prisma.adminUser.create({
      data: {
        username: process.env.ADMIN_DEFAULT_USERNAME || 'admin',
        passwordHash,
        name: 'Munna Kumar Nirala (Admin)',
        role: 'SUPER_ADMIN',
      },
    });
    console.log('✓ Initial Admin user created');
  } else {
    console.log(`✓ Admin user exists (${existingAdmin.username}) — custom credentials preserved safely`);
  }

  // 2. Site Settings
  await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: {
      artistName: 'Singer Munna Kumar Nirala',
      artistNameHi: 'गायक मुन्ना कुमार निराला',
      tagline: 'Renowned Devotional & Cultural Vocalist | Shree Sundarkand Path, Mata Jagran, Khatu Shyam Sandhya & Rangarang Karyakram',
      taglineHi: 'सुप्रसिद्ध भजन एवं शास्त्रीय गायक | श्री सुंदरकांड पाठ, माता का जागरण, खाटू श्याम संध्या एवं रंगारंग कार्यक्रम',
      shortBio: 'With divine melody and unwavering devotion, Singer Munna Kumar Nirala transforms spiritual gatherings into ecstatic devotional celebrations across India and abroad.',
      shortBioHi: 'भक्ति, संगीत और आध्यात्मिक आनंद के पावन संगम में, गायक मुन्ना कुमार निराला अपने सुरीले कंठ और समर्पित भाव से श्री सुंदरकांड पाठ, माता जागरण, अखंड अष्टयाम व मांगलिक आयोजनों को भक्तिमय बनाते हैं।',
      heroHeading: 'Spiritual Bliss & Soulful Melodies',
      heroHeadingHi: 'सुर, साधना और भक्ति का पावन संगम',
      heroSubheading: 'Official Website & Booking Portal of Singer Munna Kumar Nirala',
      heroSubheadingHi: 'गायक मुन्ना कुमार निराला की आधिकारिक वेबसाइट एवं कार्यक्रम बुकिंग',
      heroImage: '/images/munna_nirala_hero.jpg',
      primaryPhone: '9990739614',
      whatsappNumber: '9990739614',
      secondaryWhatsapp: '7484004540',
      email: 'singermunnakumarnirala@gmail.com',
      address: 'Delhi NCR & Bihar, India (Available across India & Worldwide)',
      addressHi: 'दिल्ली एनसीआर एवं बिहार, भारत (संपूर्ण भारत एवं विदेशों में सेवा उपलब्ध)',
      youtubeUrl: 'https://www.youtube.com/@SingerMunnaKumarNirala',
      instagramUrl: 'https://www.instagram.com/singermunnakumarnirala',
      facebookUrl: 'https://www.facebook.com/singermunnakumarnirala',
    },
    create: {
      id: 'default',
      artistName: 'Singer Munna Kumar Nirala',
      artistNameHi: 'गायक मुन्ना कुमार निराला',
      tagline: 'Renowned Devotional & Cultural Vocalist | Shree Sundarkand Path, Mata Jagran, Khatu Shyam Sandhya & Rangarang Karyakram',
      taglineHi: 'सुप्रसिद्ध भजन एवं शास्त्रीय गायक | श्री सुंदरकांड पाठ, माता का जागरण, खाटू श्याम संध्या एवं रंगारंग कार्यक्रम',
      shortBio: 'With divine melody and unwavering devotion, Singer Munna Kumar Nirala transforms spiritual gatherings into ecstatic devotional celebrations across India and abroad.',
      shortBioHi: 'भक्ति, संगीत और आध्यात्मिक आनंद के पावन संगम में, गायक मुन्ना कुमार निराला अपने सुरीले कंठ और समर्पित भाव से श्री सुंदरकांड पाठ, माता जागरण, अखंड अष्टयाम व मांगलिक आयोजनों को भक्तिमय बनाते हैं।',
      heroHeading: 'Spiritual Bliss & Soulful Melodies',
      heroHeadingHi: 'सुर, साधना और भक्ति का पावन संगम',
      heroSubheading: 'Official Website & Booking Portal of Singer Munna Kumar Nirala',
      heroSubheadingHi: 'गायक मुन्ना कुमार निराला की आधिकारिक वेबसाइट एवं कार्यक्रम बुकिंग',
      heroImage: '/images/munna_nirala_hero.jpg',
      primaryPhone: '9990739614',
      whatsappNumber: '9990739614',
      secondaryWhatsapp: '7484004540',
      email: 'singermunnakumarnirala@gmail.com',
      address: 'Delhi NCR & Bihar, India (Available across India & Worldwide)',
      addressHi: 'दिल्ली एनसीआर एवं बिहार, भारत (संपूर्ण भारत एवं विदेशों में सेवा उपलब्ध)',
      youtubeUrl: 'https://www.youtube.com/@SingerMunnaKumarNirala',
      instagramUrl: 'https://www.instagram.com/singermunnakumarnirala',
      facebookUrl: 'https://www.facebook.com/singermunnakumarnirala',
    },
  });
  console.log('✓ Site settings seeded');

  // 3. Biography
  await prisma.biography.upsert({
    where: { id: 'default' },
    update: {
      introduction: 'Singer Munna Kumar Nirala is an acclaimed devotional, cultural, and spiritual vocalist revered for his mesmerizing renditions of Shree Sundarkand Path, Mata Jagran, Khatu Shyam Bhajan, and festive musical events.',
      introductionHi: 'गायक मुन्ना कुमार निराला भारत के जाने-माने सुप्रसिद्ध भजन, भक्ति एवं सांस्कृतिक गायक हैं, जो श्री सुंदरकांड पाठ, माता रानी का जागरण, खाटू श्याम संकीर्तन, साईं संध्या और रंगारंग कार्यक्रमों में अपने भावपूर्ण गायन के लिए जाने जाते हैं।',
      fullBio: `With over two decades of dedicated musical sadhana, Singer Munna Kumar Nirala has touched countless souls across temples, cultural auditoriums, and community celebrations throughout Delhi NCR, Uttar Pradesh, Bihar, Rajasthan, and beyond. His command over classical ragas, traditional folk bhajan styles, and high-energy devotional performance creates an atmosphere charged with spiritual devotion and divinity.\n\nWhether invoking Lord Rama's grace through complete Sangeetmay Sundarkand, celebrating Navratri with Mata Ki Chowki, or performing soulful Shyam Bhajans with full live orchestra and divine Jhanki performances, Munna Kumar Nirala brings authenticity, discipline, and infectious spiritual joy.`,
      fullBioHi: `दो दशकों से भी अधिक समय की निरंतर संगीत साधना के साथ, मुन्ना कुमार निराला जी ने दिल्ली एनसीआर, बिहार, उत्तर प्रदेश, राजस्थान सहित देश-विदेश के अनगिनत धार्मिक एवं सांस्कृतिक मंचों पर अपनी गायकी का परचम लहराया है। शास्त्रीय सुरों का ज्ञान, पारंपरिक लोक-भजन की मिठास और मंच पर भक्तों को झूमने पर मजबूर कर देने वाला ऊर्जावान गायन उनकी पहचान है।\n\nप्रभु श्री राम की कृपा का आह्वान करने वाला 'संगीतमय सुंदरकांड पाठ', माता रानी का भव्य जागरण व चौकी, बाबा खाटू श्याम जी का गुणगान अथवा सजीव झांकियों के साथ रंगारंग कार्यक्रम—मुन्ना कुमार निराला जी का हर आयोजन श्रोताओं को भक्ति के परमानंद से सराबोर कर देता है।`,
      musicalJourney: `Born with an innate gift for melody, Munna Kumar Nirala began his musical voyage under the guidance of accomplished classical maestros. Over the years, he developed a unique presentation style that combines classical purity with traditional folk fervor, making sacred verses easily accessible and deeply moving for devotees of all generations.`,
      musicalJourneyHi: `बचपन से ही संगीत और भक्ति के प्रति अगाध निष्ठा रखने वाले मुन्ना कुमार निराला जी ने प्रख्यात संगीत गुरुओं के सानिध्य में शास्त्रीय संगीत की बारीकियां सीखीं। वर्षों के रियाज के बाद उन्होंने एक ऐसी अनूठी गायन शैली विकसित की, जिसमें शास्त्र की शुद्धता भी है और जन-जन को जोड़ने वाली लोक-भावना भी।`,
      musicalStyles: 'Shree Sundarkand Path, Mata Jagran & Chowki, Khatu Shyam Bhajan, Sai Sandhya, Akhand Ashtayam, Traditional Folk & Rangarang Karyakram',
      musicalStylesHi: 'श्री सुंदरकांड पाठ, माता का जागरण एवं चौकी, खाटू श्याम संध्या, साईं संध्या, अखंड अष्टयाम, लोकगीत एवं रंगारंग कार्यक्रम',
      portraitImage: '/images/munna_nirala_portrait.jpg',
    },
    create: {
      id: 'default',
      introduction: 'Singer Munna Kumar Nirala is an acclaimed devotional, cultural, and spiritual vocalist revered for his mesmerizing renditions of Shree Sundarkand Path, Mata Jagran, Khatu Shyam Bhajan, and festive musical events.',
      introductionHi: 'गायक मुन्ना कुमार निराला भारत के जाने-माने सुप्रसिद्ध भजन, भक्ति एवं सांस्कृतिक गायक हैं, जो श्री सुंदरकांड पाठ, माता रानी का जागरण, खाटू श्याम संकीर्तन, साईं संध्या और रंगारंग कार्यक्रमों में अपने भावपूर्ण गायन के लिए जाने जाते हैं।',
      fullBio: `With over two decades of dedicated musical sadhana, Singer Munna Kumar Nirala has touched countless souls across temples, cultural auditoriums, and community celebrations throughout Delhi NCR, Uttar Pradesh, Bihar, Rajasthan, and beyond. His command over classical ragas, traditional folk bhajan styles, and high-energy devotional performance creates an atmosphere charged with spiritual devotion and divinity.\n\nWhether invoking Lord Rama's grace through complete Sangeetmay Sundarkand, celebrating Navratri with Mata Ki Chowki, or performing soulful Shyam Bhajans with full live orchestra and divine Jhanki performances, Munna Kumar Nirala brings authenticity, discipline, and infectious spiritual joy.`,
      fullBioHi: `दो दशकों से भी अधिक समय की निरंतर संगीत साधना के साथ, मुन्ना कुमार निराला जी ने दिल्ली एनसीआर, बिहार, उत्तर प्रदेश, राजस्थान सहित देश-विदेश के अनगिनत धार्मिक एवं सांस्कृतिक मंचों पर अपनी गायकी का परचम लहराया है। शास्त्रीय सुरों का ज्ञान, पारंपरिक लोक-भजन की मिठास और मंच पर भक्तों को झूमने पर मजबूर कर देने वाला ऊर्जावान गायन उनकी पहचान है।\n\nप्रभु श्री राम की कृपा का आह्वान करने वाला 'संगीतमय सुंदरकांड पाठ', माता रानी का भव्य जागरण व चौकी, बाबा खाटू श्याम जी का गुणगान अथवा सजीव झांकियों के साथ रंगारंग कार्यक्रम—मुन्ना कुमार निराला जी का हर आयोजन श्रोताओं को भक्ति के परमानंद से सराबोर कर देता है।`,
      musicalJourney: `Born with an innate gift for melody, Munna Kumar Nirala began his musical voyage under the guidance of accomplished classical maestros. Over the years, he developed a unique presentation style that combines classical purity with traditional folk fervor, making sacred verses easily accessible and deeply moving for devotees of all generations.`,
      musicalJourneyHi: `बचपन से ही संगीत और भक्ति के प्रति अगाध निष्ठा रखने वाले मुन्ना कुमार निराला जी ने प्रख्यात संगीत गुरुओं के सानिध्य में शास्त्रीय संगीत की बारीकियां सीखीं। वर्षों के रियाज के बाद उन्होंने एक ऐसी अनूठी गायन शैली विकसित की, जिसमें शास्त्र की शुद्धता भी है और जन-जन को जोड़ने वाली लोक-भावना भी।`,
      musicalStyles: 'Shree Sundarkand Path, Mata Jagran & Chowki, Khatu Shyam Bhajan, Sai Sandhya, Akhand Ashtayam, Traditional Folk & Rangarang Karyakram',
      musicalStylesHi: 'श्री सुंदरकांड पाठ, माता का जागरण एवं चौकी, खाटू श्याम संध्या, साईं संध्या, अखंड अष्टयाम, लोकगीत एवं रंगारंग कार्यक्रम',
      portraitImage: '/images/munna_nirala_portrait.jpg',
    },
  });
  console.log('✓ Biography seeded');

  // 4. Music Tracks
  const tracks = [
    {
      title: 'Mangal Bhavan Amangal Hari - Sundarkand Sampoorna',
      titleHi: 'मंगल भवन अमंगल हारी - सुंदरकांड सम्पूर्ण दोहा चौपाई',
      album: 'Sundarkand Mahamantra Vol. 1',
      albumHi: 'सुंदरकांड महामंत्र भाग १',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      coverImage: '/images/munna_nirala_bhajan.jpg',
      duration: '07:45',
      releaseDate: '2025-01-15',
      category: 'Sundarkand',
      categoryHi: 'सुंदरकांड',
      isFeatured: true,
      order: 1,
    },
    {
      title: 'Mata Ka Jagran - Chalo Bulawa Aaya Hai',
      titleHi: 'माता का जागरण - चलो बुलावा आया है माता ने बुलाया है',
      album: 'Maa Ki Mahima',
      albumHi: 'माँ की महिमा',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      coverImage: '/images/munna_nirala_stage.jpg',
      duration: '06:30',
      releaseDate: '2024-10-10',
      category: 'Mata Jagran',
      categoryHi: 'माता जागरण',
      isFeatured: true,
      order: 2,
    },
    {
      title: 'Khatu Shyam Ji Ke Charno Mein - Sanware',
      titleHi: 'खाटू श्याम जी के चरणों में - हारे के सहारे आजा सांवरे',
      album: 'Shyam Kripa',
      albumHi: 'श्याम कृपा',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      coverImage: '/images/munna_nirala_portrait.jpg',
      duration: '05:50',
      releaseDate: '2024-11-20',
      category: 'Khatu Shyam Sandhya',
      categoryHi: 'खाटू श्याम संध्या',
      isFeatured: true,
      order: 3,
    },
    {
      title: 'Sai Baba Ki Paawan Aarti & Bhajan',
      titleHi: 'साईं बाबा की पावन आरती एवं अमृतमयी भजन',
      album: 'Shraddha Aur Saburi',
      albumHi: 'श्रद्धा और सबूरी',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
      coverImage: '/images/munna_nirala_hero.jpg',
      duration: '06:15',
      releaseDate: '2024-12-05',
      category: 'Sai Sandhya',
      categoryHi: 'साईं संध्या',
      isFeatured: false,
      order: 4,
    },
    {
      title: 'Akhand Ashtayam Sankirtan - Hare Rama Hare Krishna',
      titleHi: 'अखंड अष्टयाम संकीर्तन - हरे राम हरे कृष्ण महामंत्र',
      album: 'Divya Naam Sankirtan',
      albumHi: 'दिव्य नाम संकीर्तन',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
      coverImage: '/images/munna_nirala_stage.jpg',
      duration: '08:20',
      releaseDate: '2025-02-01',
      category: 'Akhand Ashtayam',
      categoryHi: 'अखंड अष्टयाम',
      isFeatured: false,
      order: 5,
    },
    {
      title: 'Rangarang Karyakram - Lok Sangeet & Utsav Melodies',
      titleHi: 'रंगारंग कार्यक्रम - मांगलिक उत्सव एवं लोकगीत संध्या',
      album: 'Utsav Tarang',
      albumHi: 'उत्सव तरंग',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
      coverImage: '/images/munna_nirala_portrait.jpg',
      duration: '05:40',
      releaseDate: '2025-03-10',
      category: 'Rangarang',
      categoryHi: 'रंगारंग कार्यक्रम',
      isFeatured: false,
      order: 6,
    },
  ];

  await prisma.musicTrack.deleteMany({});
  for (const t of tracks) {
    await prisma.musicTrack.create({ data: t });
  }
  console.log(`✓ Seeded ${tracks.length} music tracks`);

  // 5. Videos
  const videos = [
    {
      title: 'Grand Mata Ki Chowki & Jagran Live | Singer Munna Kumar Nirala',
      titleHi: 'भव्य माता की चौकी एवं जागरण लाइव | गायक मुन्ना कुमार निराला',
      description: 'Devotional highlights from Delhi NCR Navratri Mahotsav with live orchestra and audience devotion.',
      descriptionHi: 'दिल्ली एनसीआर में आयोजित भव्य माता की चौकी का जीवंत प्रसारण, भक्तों का अपार उत्साह एवं भक्तिरस।',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnail: '/images/munna_nirala_stage.jpg',
      category: 'Mata Jagran',
      categoryHi: 'माता जागरण एवं चौकी',
      duration: '12:35',
      isFeatured: true,
      order: 1,
    },
    {
      title: 'Sangeetmay Shree Sundarkand Path | Complete Chaupaiyan',
      titleHi: 'संगीतमय श्री सुंदरकांड पाठ | संपूर्ण दोहा व चौपाइयां',
      description: 'Soulful recitation of Sundarkand by Singer Munna Kumar Nirala invoke blessings of Lord Hanuman.',
      descriptionHi: 'प्रभु श्री हनुमान जी की कृपा प्राप्ति हेतु संगीतमय सुंदरकांड पाठ का दिव्य गायन।',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnail: '/images/munna_nirala_bhajan.jpg',
      category: 'Sundarkand',
      categoryHi: 'श्री सुंदरकांड पाठ',
      duration: '24:10',
      isFeatured: true,
      order: 2,
    },
    {
      title: 'Shree Khatu Shyam Sandhya Bhajan Pravah | Live Kirtan',
      titleHi: 'श्री खाटू श्याम संध्या भजन प्रवाह | लाइव कीर्तन व अखंड ज्योत',
      description: 'Mesmerizing Shyam Bhajan night with thousands of devotees singing in ecstatic harmony.',
      descriptionHi: 'खाटू नरेश के पावन भजनों की रसधार, जिसमें श्रोता भावविभोर होकर झूम उठे।',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnail: '/images/munna_nirala_portrait.jpg',
      category: 'Khatu Shyam Sandhya',
      categoryHi: 'खाटू श्याम संध्या',
      duration: '15:40',
      isFeatured: false,
      order: 3,
    },
    {
      title: 'Divya Jhanki Prastuti | Radha Krishna & Shiv Tandav',
      titleHi: 'भव्य सजीव झांकी प्रस्तुति | श्री राधा कृष्ण एवं शिव तांडव',
      description: 'Special theatrical Jhanki presentation alongside live devotional musical performance.',
      descriptionHi: 'संगीतमय भजनों के साथ मंच पर सजीव झांकियों की मनमोहक व अलौकिक प्रस्तुति।',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnail: '/images/munna_nirala_hero.jpg',
      category: 'Jhanki',
      categoryHi: 'झाँकी कार्यक्रम',
      duration: '09:50',
      isFeatured: false,
      order: 4,
    },
  ];

  await prisma.video.deleteMany({});
  for (const v of videos) {
    await prisma.video.create({ data: v });
  }
  console.log(`✓ Seeded ${videos.length} videos`);

  // 6. Gallery Images
  const gallery = [
    {
      title: 'Devotional Aura - Stage Concert',
      titleHi: 'भक्तिमय मंच प्रस्तुति',
      caption: 'Singing with devotional fervour during Mahashivratri Mahotsav.',
      captionHi: 'महाशिवरात्रि महोत्सव में मंच से भजनों की अविरल धारा बहाते मुन्ना कुमार निराला।',
      imageUrl: '/images/munna_nirala_stage.jpg',
      category: 'Stage Performances',
      categoryHi: 'मंच प्रदर्शन',
      altText: 'Singer Munna Kumar Nirala on live stage',
      showOnHome: true,
      order: 1,
    },
    {
      title: 'Mata Ki Chowki Mahotsav',
      titleHi: 'माता की चौकी महोत्सव',
      caption: 'Blessing the devotees with traditional bhents and aarti.',
      captionHi: 'पारंपरिक भेंटों व आरती के साथ माता रानी का गुणगान।',
      imageUrl: '/images/munna_nirala_bhajan.jpg',
      category: 'Devotional Events',
      categoryHi: 'धार्मिक अनुष्ठान',
      altText: 'Singer Munna Kumar Nirala in devotional attire',
      showOnHome: true,
      order: 2,
    },
    {
      title: 'Studio Portrait & Sadhana',
      titleHi: 'स्टूडियो साधना एवं पोर्ट्रेट',
      caption: 'A moment of musical meditation during recording sessions.',
      captionHi: 'रिकॉर्डिंग सत्र के दौरान संगीत साधना का पावन क्षण।',
      imageUrl: '/images/munna_nirala_portrait.jpg',
      category: 'Portraits',
      categoryHi: 'पोर्ट्रेट्स',
      altText: 'Portrait of Singer Munna Kumar Nirala',
      showOnHome: true,
      order: 3,
    },
    {
      title: 'Grand Musical Utsav',
      titleHi: 'भव्य संगीतमय उत्सव',
      caption: 'Harmonious celebrations at a grand family auspicious event.',
      captionHi: 'मांगलिक कार्यक्रम एवं जन्मोत्सव पर संगीत की मनोहारी प्रस्तुति।',
      imageUrl: '/images/munna_nirala_hero.jpg',
      category: 'Cultural Events',
      categoryHi: 'सांस्कृतिक कार्यक्रम',
      altText: 'Singer Munna Kumar Nirala official portrait',
      showOnHome: true,
      order: 4,
    },
  ];

  await prisma.galleryImage.deleteMany({});
  for (const g of gallery) {
    await prisma.galleryImage.create({ data: g });
  }
  console.log(`✓ Seeded ${gallery.length} gallery images`);

  // 7. Events (Upcoming & Past)
  const events = [
    {
      title: 'Grand Mata Ka Jagran & Divya Chowki',
      titleHi: 'विशाल माता का जागरण एवं दिव्य चौकी',
      eventDate: new Date('2026-11-15T19:30:00Z'),
      time: '08:00 PM to Morning 05:00 AM',
      venue: 'Shri Ram Mandir Parisar, Rohini Sector 14',
      venueHi: 'श्री राम मंदिर परिसर, रोहिणी सेक्टर १४',
      city: 'Delhi',
      cityHi: 'दिल्ली',
      description: 'Sampoorna Mata Ki Bhenten, Tara Rani Ki Katha, Aarti & Chhappan Bhog with full musical orchestra.',
      descriptionHi: 'माता रानी की भेंटें, तारा रानी की कथा, आरती एवं छप्पन भोग का पावन आयोजन।',
      posterImage: '/images/munna_nirala_bhajan.jpg',
      bookingUrl: '/contact',
      status: 'UPCOMING',
      order: 1,
    },
    {
      title: 'Sangeetmay Shree Sundarkand Path',
      titleHi: 'संगीतमय श्री सुंदरकांड पाठ',
      eventDate: new Date('2026-11-22T16:00:00Z'),
      time: '04:30 PM to 08:30 PM',
      venue: 'Hanuman Mandir Dham, Kankarbagh',
      venueHi: 'हनुमान मंदिर धाम, कंकड़बाग',
      city: 'Patna',
      cityHi: 'पटना',
      description: 'Devotional chanting of Shri Ramcharitmanas Sundarkand with dholak, tabla, harmonium and devotees chorus.',
      descriptionHi: 'श्री रामचरितमानस के सुंदरकांड का वाद्ययंत्रों व सामूहिक संकीर्तन के साथ भव्य गायन।',
      posterImage: '/images/munna_nirala_stage.jpg',
      bookingUrl: '/contact',
      status: 'UPCOMING',
      order: 2,
    },
    {
      title: 'Ek Shaam Baba Khatu Shyam Ke Naam',
      titleHi: 'एक शाम बाबा खाटू श्याम के नाम',
      eventDate: new Date('2026-12-05T19:00:00Z'),
      time: '07:30 PM onwards',
      venue: 'Shyam Utsav Bhawan, Indirapuram',
      venueHi: 'श्याम उत्सव भवन, इंदिरापुरम',
      city: 'Ghaziabad',
      cityHi: 'गाजियाबाद',
      description: 'Grand Khatu Shyam Bhajan Sandhya, Akhand Jyot, Phoolon Ki Holi & Prasad distribution.',
      descriptionHi: 'भव्य श्याम संकीर्तन, अखंड पावन ज्योत एवं फूलों की होली के साथ मनमोहक प्रस्तुति।',
      posterImage: '/images/munna_nirala_portrait.jpg',
      bookingUrl: '/contact',
      status: 'UPCOMING',
      order: 3,
    },
    {
      title: 'Mahashivratri Sangeet Utsav & Bhajan',
      titleHi: 'महाशिवरात्रि संगीत उत्सव एवं शिव भजन संध्या',
      eventDate: new Date('2026-03-08T18:00:00Z'),
      time: '06:00 PM to 12:00 Midnight',
      venue: 'Shiv Mandir Trust Hall',
      venueHi: 'शिव मंदिर ट्रस्ट हॉल',
      city: 'Noida',
      cityHi: 'नोएडा',
      description: 'Memorable night of Shiv tandav stotram, bhajans and spiritual bliss.',
      descriptionHi: 'शिव तांडव स्तोत्र, शिव भजनों और आरती से सजी अविस्मरणीय भक्तिमयी रात्रि।',
      posterImage: '/images/munna_nirala_hero.jpg',
      status: 'COMPLETED',
      order: 4,
    },
  ];

  await prisma.event.deleteMany({});
  for (const e of events) {
    await prisma.event.create({ data: e });
  }
  console.log(`✓ Seeded ${events.length} events`);

  // 8. Calendar Schedule (Availability / Program dates requested by user)
  const schedules = [
    {
      dateString: '2026-11-15',
      status: 'BOOKED',
      programTitle: 'माता का जागरण (Mata Ka Jagran)',
      city: 'Delhi',
      note: 'Night program (रोहिणी, दिल्ली)',
    },
    {
      dateString: '2026-11-16',
      status: 'AVAILABLE',
      programTitle: null,
      city: null,
      note: 'Available for Booking',
    },
    {
      dateString: '2026-11-22',
      status: 'BOOKED',
      programTitle: 'संगीतमय सुंदरकांड पाठ (Sundarkand Path)',
      city: 'Patna',
      note: 'Evening slot booked',
    },
    {
      dateString: '2026-11-23',
      status: 'AVAILABLE',
      programTitle: null,
      city: null,
      note: 'Available for Booking',
    },
    {
      dateString: '2026-12-05',
      status: 'BOOKED',
      programTitle: 'खाटू श्याम संध्या (Khatu Shyam Sandhya)',
      city: 'Ghaziabad',
      note: 'Evening sandhya booked',
    },
    {
      dateString: '2026-12-06',
      status: 'TENTATIVE',
      programTitle: 'मांगलिक कार्यक्रम (Enquiry Under Confirmation)',
      city: 'Noida',
      note: 'Slot on hold for confirmation',
    },
  ];

  await prisma.calendarSchedule.deleteMany({});
  for (const s of schedules) {
    await prisma.calendarSchedule.create({ data: s });
  }
  console.log(`✓ Seeded ${schedules.length} calendar schedule slots`);

  // 9. Awards
  const awards = [
    {
      title: 'Bhakti Sangeet Ratna Samman',
      titleHi: 'भक्ति संगीत रत्न सम्मान',
      organization: 'Dharmik Kala Evam Sanskriti Manch',
      year: '2024',
      description: 'Awarded for extraordinary contribution to Indian devotional music and preserving sacred Sundarkand traditions.',
      descriptionHi: 'भारतीय भक्ति संगीत एवं पारंपरिक सुंदरकांड गायन के संरक्षण में अमूल्य योगदान हेतु प्रदान किया गया।',
      order: 1,
    },
    {
      title: 'Devotional Vocalist of the Year',
      titleHi: 'सर्वश्रेष्ठ भक्ति गायक सम्मान',
      organization: 'Delhi Cultural & Spiritual Music Federation',
      year: '2023',
      description: 'Honored for exceptional stage excellence in Mata Jagran and public spiritual outreach.',
      descriptionHi: 'माता जागरण एवं आध्यात्मिक संगीत में जन-जन को भक्तिरस से जोड़ने के उत्कृष्ट प्रदर्शन हेतु।',
      order: 2,
    },
    {
      title: 'Shri Ram Kripa Samman',
      titleHi: 'श्री राम कृपा सम्मान',
      organization: 'Sanatan Dharma Seva Parishad',
      year: '2022',
      description: 'Conferred for continuous dedication towards Ram Bhakti and Akhand Ashtayam Sankirtan.',
      descriptionHi: 'राम भक्ति प्रचार एवं अखंड हरिनाम संकीर्तन की अविरल सेवा के उपलक्ष्य में।',
      order: 3,
    },
  ];

  await prisma.award.deleteMany({});
  for (const a of awards) {
    await prisma.award.create({ data: a });
  }
  console.log(`✓ Seeded ${awards.length} awards`);

  // 10. Press Items
  const press = [
    {
      title: 'Munna Kumar Nirala mesmerizes thousands at Annual Navratri Jagran',
      titleHi: 'नवरात्रि जागरण में मुन्ना कुमार निराला के भजनों पर झूमे हजारों श्रद्धालु',
      publisher: 'Dainik Jagran / Amar Ujala Coverage',
      publishDate: 'October 2024',
      summary: 'With soulful voice and divine surrender, Singer Munna Kumar Nirala enthralled devotees until the morning aarti.',
      summaryHi: 'भक्तिभाव और सुरीले कंठ से सजी रात में गायक मुन्ना कुमार निराला ने भोर तक श्रद्धालुओं को बांधे रखा।',
      order: 1,
    },
    {
      title: 'The Art of Devotion: Munna Kumar Nirala on Preserving Musical Heritage',
      titleHi: 'भक्ति और सुर की साधना: लोक परंपरा को संजोते मुन्ना कुमार निराला',
      publisher: 'Spiritual Times Cultural Magazine',
      publishDate: 'December 2023',
      summary: 'A feature interview covering his early training, devotion to classical purity, and popularizing Sundarkand.',
      summaryHi: 'शास्त्रीय संगीत की शुद्धता और सुंदरकांड के अध्यात्म पर एक विस्तृत साक्षात्कार।',
      order: 2,
    },
  ];

  await prisma.pressItem.deleteMany({});
  for (const p of press) {
    await prisma.pressItem.create({ data: p });
  }
  console.log(`✓ Seeded ${press.length} press articles`);

  // 11. Initial Media Assets for Media Library
  const media = [
    {
      title: 'Singer Munna Kumar Nirala - Hero Banner',
      filename: 'munna_nirala_hero.jpg',
      fileUrl: '/images/munna_nirala_hero.jpg',
      fileType: 'IMAGE',
      fileSize: 207977,
      category: 'Hero / Profile',
      altText: 'Singer Munna Kumar Nirala Hero Image',
      usedIn: 'Homepage Hero, Site Settings',
    },
    {
      title: 'Singer Munna Kumar Nirala - Biography Portrait',
      filename: 'munna_nirala_portrait.jpg',
      fileUrl: '/images/munna_nirala_portrait.jpg',
      fileType: 'IMAGE',
      fileSize: 141855,
      category: 'Biography',
      altText: 'Singer Munna Kumar Nirala Portrait',
      usedIn: 'About Page, Biography Section',
    },
    {
      title: 'Live Stage Performance',
      filename: 'munna_nirala_stage.jpg',
      fileUrl: '/images/munna_nirala_stage.jpg',
      fileType: 'IMAGE',
      fileSize: 67616,
      category: 'Concert / Stage',
      altText: 'Live stage performance',
      usedIn: 'Gallery, Featured Video',
    },
    {
      title: 'Mata Jagran Devotional Session',
      filename: 'munna_nirala_bhajan.jpg',
      fileUrl: '/images/munna_nirala_bhajan.jpg',
      fileType: 'IMAGE',
      fileSize: 63882,
      category: 'Devotional',
      altText: 'Devotional session',
      usedIn: 'Gallery, Event Poster',
    },
  ];

  await prisma.mediaAsset.deleteMany({});
  for (const m of media) {
    await prisma.mediaAsset.create({ data: m });
  }
  console.log(`✓ Seeded ${media.length} media assets into Media Library`);

  // 12. Sample Booking Enquiry
  await prisma.bookingEnquiry.upsert({
    where: { referenceId: 'MKN-2026-DEMO1' },
    update: {},
    create: {
      referenceId: 'MKN-2026-DEMO1',
      fullName: 'Ramesh Sharma',
      phone: '9811223344',
      whatsapp: '9811223344',
      email: 'ramesh.sharma@example.com',
      eventType: 'श्री सुंदरकांड पाठ (Sundarkand Path)',
      eventDate: '2026-11-28',
      city: 'Delhi',
      venue: 'Community Hall, Sector 9',
      audienceSize: '300-500',
      budget: 'Standard Mandir Package',
      specialRequirements: 'Full orchestra with live sound and jhanki',
      status: 'CONTACTED',
      adminNotes: 'Spoke on phone, confirmed availability, sending quote on WhatsApp.',
    },
  });
  console.log('✓ Demo booking enquiry created');

  console.log('=== All Database Models Successfully Seeded! ===');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

