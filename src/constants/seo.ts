export type SEOData = {
  supportLanguages: string[];
  fallbackLanguage: string;
  languages: Record<
    string,
    { title: string; description: string; image: string }
  >;
};

export const SEO_DATA: SEOData = {
  // TODO: Change to your own support languages
  supportLanguages: ["zh", "en", "ja"],
  fallbackLanguage: "en",
  // TODO: Change to your own SEO data
  languages: {
    zh: {
      title: "视频竞技场",
      description: "AI模型视频生成能力大比拼",
      image: "/images/global/desc_zh.png",
    },
    en: {
      title: "Video Arena",
      description: "AI Model Video Generation Ability Competition",
      image: "/images/global/desc_en.png",
    },
    ja: {
      title: "動画リスト",
      description: "AIモデルのビデオ生成能力の大比較",
      image: "/images/global/desc_ja.png",
    },
  },
};
