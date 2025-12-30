# LoveFilm Player

Bu proje, seçilebilir seslendirme ve arka plan müziği parçalarına sahip, özelleştirilebilir bir video oynatıcı sunan, Next.js tabanlı modern bir web uygulamasıdır. Kullanıcıların video izleme deneyimini kişiselleştirmelerine olanak tanır ve özellikle iOS cihazlarda karşılaşılan ses çalma kısıtlamalarını ele alan özel bir çözüm içerir.

## ✨ Özellikler

- **Gelişmiş Oynatma Kontrolleri:** Oynatma, duraklatma, sessize alma ve zaman çizgisinde gezinme.
- **Çoklu Ses Parçası Desteği:**
  - Farklı diller veya anlatımlar için birden fazla **seslendirme** parçası seçebilme.
  - Videoya eşlik edecek çeşitli **arka plan müziği** seçenekleri.
- **Ayrı Ses Ayarları:** Seslendirme ve arka plan müziği için ayrı ses seviyesi kontrolleri.
- **Tam Ekran Modu:** Dikkat dağıtmayan, sürükleyici bir izleme deneyimi.
- **Duyarlı Tasarım:** Mobil ve masaüstü cihazlarda sorunsuz bir şekilde çalışır.
- **iOS Uyumluluğu:** Apple'ın mobil cihazlardaki otomatik ses çalma kısıtlamalarını aşmak için özel bir çözüm içerir.

## 🚀 Teknolojiler

- **Framework:** [Next.js](https://nextjs.org/)
- **Dil:** [TypeScript](https://www.typescriptlang.org/)
- **Stil:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Kütüphanesi:** [shadcn/ui](https://ui.shadcn.com/)
- **İkonlar:** [Lucide React](https://lucide.dev/)

## 📂 Proje Yapısı

Projenin temel dosyaları ve dizinleri aşağıda açıklanmıştır:

```
/
├── public/
│   ├── video.mp4         # Ana video dosyası
│   ├── trses.mp4         # Türkçe seslendirme
│   ├── enses.mp4         # İngilizce seslendirme
│   ├── basgaza.mp3       # Arka plan müziği 1
│   └── ...               # Diğer medya dosyaları
├── src/
│   ├── app/
│   │   ├── page.tsx      # Ana sayfa ve oynatıcının render edildiği yer
│   │   └── layout.tsx    # Genel sayfa düzeni
│   ├── components/
│   │   ├── lovefilm-player.tsx # Projenin ana video oynatıcı bileşeni
│   │   └── ui/             # shadcn/ui tarafından sağlanan UI bileşenleri
│   └── lib/
│       └── utils.ts      # Yardımcı fonksiyonlar
└── README.md             # Bu dosya
```

## 🏁 Başlarken

Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin.

### Gereksinimler

- [Node.js](https://nodejs.org/en/) (v18 veya üstü)
- [npm](https://www.npmjs.com/) veya [yarn](https://yarnpkg.com/)

### Kurulum

1.  **Projeyi klonlayın:**
    ```bash
    git clone https://github.com/kullanici/lovefilm-player.git
    cd lovefilm-player
    ```

2.  **Bağımlılıkları yükleyin:**
    ```bash
    npm install
    ```

3.  **Geliştirme sunucusunu başlatın:**
    ```bash
    npm run dev
    ```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açarak uygulamayı görüntüleyebilirsiniz.

##  kullanımı

`LoveFilmPlayer` bileşenini uygulamanızın herhangi bir yerine ekleyebilir ve gerekli `props`'ları sağlayarak kullanabilirsiniz.

### Örnek Kullanım

`src/app/page.tsx` dosyasında bileşenin nasıl kullanıldığına dair bir örnek bulunmaktadır:

```tsx
import LoveFilmPlayer from "@/components/lovefilm-player";

export default function Home() {
  const videoUrl = "/video.mp4";

  const voiceoverSources = [
    { name: "Türkçe", url: "/trses.mp4" },
    { name: "İngilizce", url: "/enses.mp4" },
  ];

  const backgroundMusicSources = [
    { name: "Bas Gaza", url: "/basgaza.mp3" },
    { name: "Disfruto", url: "/disfruto.mp3" },
    { name: "Whenever", url: "/whenever.mp3" },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <LoveFilmPlayer
        videoUrl={videoUrl}
        voiceoverSources={voiceoverSources}
        backgroundMusicSources={backgroundMusicSources}
      />
    </main>
  );
}
```

### iOS Uyumluluğu Notu

iOS cihazlar, bir kullanıcı etkileşimi (örneğin tıklama) olmadan sesin programatik olarak başlatılmasını engeller. Bu projede, kullanıcı oynat düğmesine ilk kez bastığında tüm ses kanallarının "kilidini açan" bir mekanizma uygulanmıştır. Bu sayede, parça değişimlerinde veya diğer etkileşimlerde sesler sorunsuz bir şekilde çalınır. Bu işlem, yalnızca iOS cihazlarda bir kez gerçekleştirilir.
