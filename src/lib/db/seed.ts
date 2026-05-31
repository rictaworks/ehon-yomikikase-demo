import { getDb } from "./index"

type CategoryRow = { count: number }

export function seed(): void {
  const db = getDb()

  const existing = db
    .prepare("SELECT COUNT(*) as count FROM categories WHERE is_master = 1")
    .get() as CategoryRow

  if (existing.count > 0) {
    return
  }

  const insertCategory = db.prepare(
    "INSERT INTO categories (id, name, priority, is_master) VALUES (?, ?, ?, 1)"
  )
  const insertKeyword = db.prepare(
    "INSERT INTO category_keywords (category_id, keyword, is_master) VALUES (?, ?, 1)"
  )
  const insertBook = db.prepare(
    `INSERT INTO books (id, title, author, cover_image, age_min, age_max, category_id, total_pages, is_master)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`
  )
  const insertPage = db.prepare(
    `INSERT INTO pages (book_id, page_number, image_path, text_content, is_master)
     VALUES (?, ?, ?, ?, 1)`
  )

  const seedAll = db.transaction(() => {
    insertCategory.run(1, "どうぶつ", 1)
    insertCategory.run(2, "自然", 2)
    insertCategory.run(3, "家族", 3)
    insertCategory.run(4, "乗り物", 4)
    insertCategory.run(5, "その他", 5)

    insertKeyword.run(1, "ライオン")
    insertKeyword.run(1, "ゾウ")
    insertKeyword.run(1, "クマ")
    insertKeyword.run(1, "ウサギ")
    insertKeyword.run(1, "キリン")

    insertKeyword.run(2, "森")
    insertKeyword.run(2, "海")
    insertKeyword.run(2, "山")
    insertKeyword.run(2, "川")
    insertKeyword.run(2, "空")

    insertKeyword.run(3, "おかあさん")
    insertKeyword.run(3, "おとうさん")
    insertKeyword.run(3, "かぞく")
    insertKeyword.run(3, "いもうと")
    insertKeyword.run(3, "おにいさん")

    insertKeyword.run(4, "バス")
    insertKeyword.run(4, "でんしゃ")
    insertKeyword.run(4, "くるま")
    insertKeyword.run(4, "ひこうき")
    insertKeyword.run(4, "ふね")

    insertKeyword.run(5, "まほう")
    insertKeyword.run(5, "たび")
    insertKeyword.run(5, "ゆめ")
    insertKeyword.run(5, "ともだち")
    insertKeyword.run(5, "いえ")

    insertBook.run(
      1,
      "ライオンのルーくん",
      "田中はな",
      "/images/lion-cover.svg",
      3,
      5,
      1,
      5
    )
    insertBook.run(
      2,
      "おかあさんとぼく",
      "山田みこ",
      "/images/mother-cover.svg",
      2,
      4,
      3,
      5
    )
    insertBook.run(
      3,
      "ぶんぶんバス",
      "鈴木たろう",
      "/images/bus-cover.svg",
      3,
      6,
      4,
      5
    )

    // Pages for book 1: ライオンのルーくん
    insertPage.run(
      1,
      1,
      "/images/lion-cover.svg",
      "むかしむかし、大きな草原に、ルーくんというライオンの子どもが いました。"
    )
    insertPage.run(
      1,
      2,
      "/images/lion-cover.svg",
      "ルーくんは毎朝、ほかのどうぶつたちに「おはようございます」と 元気よく あいさつしました。"
    )
    insertPage.run(
      1,
      3,
      "/images/lion-cover.svg",
      "ある日、小さなうさぎが泣いていました。「どうしたの？」とルーくんが やさしく 聞きました。"
    )
    insertPage.run(
      1,
      4,
      "/images/lion-cover.svg",
      "うさぎは「おうちへの道がわからなくなってしまったの」と言いました。ルーくんは「いっしょに探そう」と言いました。"
    )
    insertPage.run(
      1,
      5,
      "/images/lion-cover.svg",
      "ふたりは力を合わせて、うさぎのおうちを見つけました。「ありがとう、ルーくん」。ルーくんはとても うれしい気持ちに なりました。おわり。"
    )

    // Pages for book 2: おかあさんとぼく
    insertPage.run(
      2,
      1,
      "/images/mother-cover.svg",
      "ぼくのおかあさんは、世界でいちばんやさしいひとです。"
    )
    insertPage.run(
      2,
      2,
      "/images/mother-cover.svg",
      "あさごはんのとき、おかあさんはいつもにこにこ笑っています。「たくさん食べてね」と言います。"
    )
    insertPage.run(
      2,
      3,
      "/images/mother-cover.svg",
      "ぼくが転んで泣いたとき、おかあさんはすぐにとんできて、「だいじょうぶ？」とやさしく声をかけてくれました。"
    )
    insertPage.run(
      2,
      4,
      "/images/mother-cover.svg",
      "よるになると、おかあさんはぼくに絵本を読んでくれます。おかあさんの声は、とても温かくてやさしいです。"
    )
    insertPage.run(
      2,
      5,
      "/images/mother-cover.svg",
      "「おかあさん、だいすき」とぼくが言うと、おかあさんはぎゅっとだきしめてくれました。「ぼくもだいすきよ」。おわり。"
    )

    // Pages for book 3: ぶんぶんバス
    insertPage.run(
      3,
      1,
      "/images/bus-cover.svg",
      "まちの中を、大きな黄色いバスが走っています。名前は「ぶんぶん」といいます。"
    )
    insertPage.run(
      3,
      2,
      "/images/bus-cover.svg",
      "ぶんぶんは朝早くから夜おそくまで、まちのひとたちを乗せて走ります。「ぶんぶん、ぶーん！」"
    )
    insertPage.run(
      3,
      3,
      "/images/bus-cover.svg",
      "今日はこうえんのまえで止まりました。小さな女の子がお母さんと手をつないで乗ってきました。"
    )
    insertPage.run(
      3,
      4,
      "/images/bus-cover.svg",
      "「つぎはえきまえです」ぶんぶんはみんなに知らせます。乗客たちは「ありがとう」と言ってバスをおります。"
    )
    insertPage.run(
      3,
      5,
      "/images/bus-cover.svg",
      "一日のおしごとを終えたぶんぶんは、車庫に帰ります。「また明日もみんなを乗せてはしるぞ！」おわり。"
    )
  })

  seedAll()
}
