import { 
  Source, Manga, Chapter, ChapterDetails, SearchRequest, PagedResults, SourceInfo, MangaStatus, ContentRating
} from "paperback-extensions-common";

export const PizzariaScanInfo: SourceInfo = {
  version: '1.0.0',
  name: 'Pizzaria Scan',
  icon: 'icon.png',
  author: 'Jhoorodr',
  authorWebsite: 'https://github.com/Jhoorodre',
  description: 'Extensão nativa do Pizzaria Scan',
  contentRating: ContentRating.MATURE,
  websiteBaseURL: 'https://pizzariacomics.com',
};

export class PizzariaScan extends Source {
  // @ts-ignore: Conflito de tipos entre @paperback/types e paperback-extensions-common
  requestManager = (App as any).createRequestManager({
    requestsPerSecond: 3,
    requestTimeout: 15000,
  });

  async getHomePageSections(sectionCallback: (section: any) => void): Promise<void> {
    // Retorna vazio por padrão para não quebrar a página de discover do proxy
  }

  async getMangaDetails(mangaId: string): Promise<Manga> {
    const request = (App as any).createRequest({
      url: `https://pizzariacomics.com/manga/${mangaId}/`,
      method: "GET",
    });

    const response = await this.requestManager.schedule(request, 1);
    const $ = this.cheerio.load((response.data as string) || "");

    let title = $("h1").first().text().trim();
    let image = $("img.wp-post-image").first().attr("src") || "";
    let desc = $(".summary__content").text().trim();

    return (App as any).createManga({
      id: mangaId,
      titles: [title],
      image: image,
      status: MangaStatus.ONGOING,
      desc: desc,
    });
  }

  async getChapters(mangaId: string): Promise<Chapter[]> {
    const request = (App as any).createRequest({
      url: `https://pizzariacomics.com/manga/${mangaId}/`,
      method: "GET",
    });

    const response = await this.requestManager.schedule(request, 1);
    const $ = this.cheerio.load((response.data as string) || "");
    const chapters: Chapter[] = [];

    $("#chapter_list a").each((i: number, el: any) => {
      const url = $(el).attr("href");
      let title = $(el).find("span.text-xs").text().trim();
      if (!title) {
        title = $(el).text().trim();
      }

      if (url) {
        let chapterId = url.replace("https://pizzariacomics.com/", "").replace(/\//g, "");
        
        let chapterNum = 0;
        const match = title.match(/(\d+(\.\d+)?)/);
        if (match) {
          chapterNum = parseFloat(match[1]);
        }

        chapters.push((App as any).createChapter({
          id: chapterId,
          mangaId: mangaId,
          name: title,
          chapNum: chapterNum,
          langCode: "pt-br",
        }));
      }
    });

    return chapters;
  }

  async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
    const request = (App as any).createRequest({
      url: `https://pizzariacomics.com/${chapterId}/`,
      method: "GET",
    });

    const response = await this.requestManager.schedule(request, 1);
    const $ = this.cheerio.load((response.data as string) || "");
    const pages: string[] = [];

    $("img#imagech").each((i: number, el: any) => {
      const src = $(el).attr("src") || $(el).attr("data-src");
      if (src) {
        pages.push(src);
      }
    });

    return (App as any).createChapterDetails({
      id: chapterId,
      mangaId: mangaId,
      pages: pages,
      longStrip: true,
    });
  }

  async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
    const request = (App as any).createRequest({
      url: `https://pizzariacomics.com/?s=${encodeURIComponent(query.title || "")}`,
      method: "GET",
    });

    const response = await this.requestManager.schedule(request, 1);
    const $ = this.cheerio.load((response.data as string) || "");
    const results: any[] = [];

    $("a[href*='/manga/']").each((i: number, el: any) => {
      const url = $(el).attr("href");
      let title = $(el).find("h1").text().trim() || $(el).attr("title");
      let image = $(el).find("img").attr("src");

      if (url && title) {
        const parts = url.split("/manga/");
        let id = "";
        if (parts.length > 1 && parts[1]) {
          id = parts[1].replace(/\//g, "");
        }

        if (id && !results.some(r => r.id === id)) {
          results.push((App as any).createMangaTile({
            id: id,
            title: (App as any).createIconText({ text: title }),
            image: image || "",
          }));
        }
      }
    });

    return (App as any).createPagedResults({
      results: results,
    });
  }
}
