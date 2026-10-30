# Singer Munna Kumar Nirala — Official Website & Admin CMS
> **गायक मुन्ना कुमार निराला जी की आधिकारिक वेबसाइट एवं एडमिन कंट्रोल पैनल (CMS)**

---

## 🌐 Live Website & Links (लाइव वेबसाइट लिंक्स)

- **GitHub Repository:** [https://github.com/hireready-ai/Singer-Munna-](https://github.com/hireready-ai/Singer-Munna-)
- **Cloudflare Live URL:** [https://comedy-duration-selection-regular.trycloudflare.com](https://comedy-duration-selection-regular.trycloudflare.com)
- **Local URL:** [http://localhost:3000](http://localhost:3000)
- **Direct Admin Login:** [https://comedy-duration-selection-regular.trycloudflare.com/admin/login](https://comedy-duration-selection-regular.trycloudflare.com/admin/login) (नोट: ग्राहकों के फुटर से एडमिन लिंक हटा दिया गया है, एडमिन केवल इसी डायरेक्ट लिंक से खुलेगा)

---

## 🔑 एडमिन लॉगिन एवं सुरक्षा (Admin Login & Security)

- **Login URL:** `/admin/login` (अब लॉगिन स्क्रीन पर कोई पासवर्ड नहीं दिखता, पूरी तरह सुरक्षित है)
- **शुरुआती डिफ़ॉल्ट यूज़रनेम (Default Username):** `admin`
- **शुरुआती डिफ़ॉल्ट पासवर्ड (Initial Password):** `nirala@admin2026`
- **सुरक्षा सेटिंग्स व पासवर्ड बदलना (Security & Change Password):** एडमिन पैनल में लॉगिन करने के बाद **"सुरक्षा व पासवर्ड (Security & Password)"** मेनू या सेटिंग्स पेज में जाकर तुरंत अपना नया निजी पासवर्ड सेट करें। वेबसाइट लाइव करने से पहले पासवर्ड बदलना अनिवार्य सुरक्षा नियम है।

---

## ☁️ Custom Domain Mapping (singermunna.com) on Cloudflare

1. Cloudflare Zero Trust / Cloudflare Dashboard में जाएँ।
2. **Networks -> Tunnels** पर जाएँ।
3. **Add a Public Hostname** पर क्लिक करें।
4. **Domain:** `singermunna.com` (या Subdomain) चुनें।
5. **Service Type:** `HTTP` और **URL:** `localhost:3000` सेट करें।
6. सेव करते ही `singermunna.com` सीधा आपकी लाइव वेबसाइट से कनेक्ट हो जाएगा!

---

## 🌟 Admin Panel Image & Video Upload Guidelines (फोटो एवं वीडियो साइज़ निर्देश)

एडमिन पैनल में हर सेक्शन में अब सीधा कंप्यूटर/फ़ोन से फोटो और वीडियो अपलोड करने का बटन दिया गया है, साथ ही सही साइज़ भी लिख दिया गया है:

| वेबसाइट का सेक्शन (Section) | कहाँ दिखेगा (Where it appears) | अनुशंसित साइज़ (Recommended Dimensions) | प्रकार (Aspect Ratio / Format) |
|---|---|---|---|
| **१. होमपेज मुख्य फोटो (Hero Banner)** | होमपेज खुलते ही सबसे ऊपर बड़े पर्दे पर | **1920 × 1080 पिक्सल** (16:9 Landscape) | आड़ा फोटो (Landscape), अधिकतम 5MB |
| **२. बैकग्राउंड वीडियो (Hero Video)** | होमपेज हीरो में फोटो की जगह वीडियो | **1920 × 1080 पिक्सल** (16:9 MP4) | MP4 वीडियो फ़ाइल, अधिकतम 25MB |
| **३. पापा की प्रोफाइल फोटो (Biography)** | About पेज और होमपेज परिचय में | **1200 × 1600 पिक्सल** (3:4 Portrait) | सीधा / खड़ा पोर्ट्रेट फोटो, अधिकतम 5MB |
| **४. भजन कवर आर्ट (Music Artwork)** | Music पेज और ऑडियो प्लेयर में | **1000 × 1000 पिक्सल** (1:1 Square) | चौकोर एल्बम फोटो, अधिकतम 5MB |
| **५. ऑडियो भजन (Music Audio Track)** | वेबसाइट पर बजने वाला भजन | **MP3 / WAV फ़ाइल** | अधिकतम 50MB |
| **६. वीडियो थंबनेल (Video Thumbnail)** | Videos पेज और होमपेज वीडियो में | **1280 × 720 पिक्सल** (16:9 Landscape) | आड़ा वीडियो पोस्टर, अधिकतम 5MB |
| **७. फोटो गैलरी (Photo Gallery)** | Gallery पेज और परफॉर्मेंस हाइलाइट्स में | **1200 × 900 पिक्सल** (4:3) या **1200 × 1200 पिक्सल** | आड़ा या चौकोर फोटो, अधिकतम 5MB |
| **८. कार्यक्रम पोस्टर (Event Poster)** | Events पेज और आगामी कार्यक्रमों में | **800 × 1000 पिक्सल** (खड़ा पोस्टर) या चौकोर | डिजिटल आमंत्रण पत्र / पोस्टर, अधिकतम 5MB |

---

## 🔒 एडमिन लॉगिन पोर्टल (Admin Portal)

- **Login URL:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **नोट:** स्क्रीन पर पासवर्ड नहीं दिखाया जाता। अपना यूज़रनेम और पासवर्ड डालकर लॉगिन करें। अंदर जाकर **"सुरक्षा व पासवर्ड"** से जब चाहें पासवर्ड बदल सकते हैं।

---

## ⚡ उपयोग करने का आसान तरीका (How to Use)
1. **फोटो बदलने के लिए:**
   - एडमिन में संबंधित पेज (जैसे *होमपेज हीरो बैनर* या *फोटो गैलरी*) पर जाएँ।
   - **"कंप्यूटर/फ़ोन से चुनें (Upload File)"** वाले सुनहरे बटन पर क्लिक करें।
   - अपनी फोटो चुनें। फोटो तुरंत अपलोड होकर स्क्रीन पर दिखने लगेगी।
   - नीचे दिए गए **"बदलाव सेव करें (Save Changes)"** बटन पर क्लिक करें।
   - फोटो तुरंत मुख्य वेबसाइट पर **लाइव** हो जाएगी!

2. **एक साथ कई फोटो अपलोड करने के लिए:**
   - *फोटो गैलरी (Photo Gallery)* में जाएँ।
   - ऊपर हरे रंग के **"+ एक साथ कई फोटो अपलोड करें (Bulk Upload)"** बटन पर क्लिक करें और 5, 10 या जितनी चाहें उतनी तस्वीरें एक साथ चुन लें! सारी तस्वीरें एक साथ अपलोड होकर गैलरी में जुड़ जाएंगी।

3. **कैलेंडर में तारीख बुक या खाली करने के लिए:**
   - *प्रोग्राम व कैलेंडर (Events & Calendar)* में जाएँ।
   - **"उपलब्धता कैलेंडर स्लॉट्स (Free/Booked Dates)"** टैब पर क्लिक करें।
   - **"+ तारीख का स्टेटस तय करें"** दबाएँ और तारीख चुनकर उसे 🔴 Booked या 🟢 Available सेट कर दें।
