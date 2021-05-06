/* eslint-disable camelcase, @typescript-eslint/explicit-module-boundary-types, radix, eqeqeq, no-loop-func, no-useless-escape */
import {
    PagedResults,
    Manga,
    Chapter,
    ChapterDetails,
    HomeSection,
    SearchRequest,
    SourceInfo,
    LanguageCode,
    TagType,
    MangaUpdates,
    MangaStatus,
    MangaTile,
    Tag
  } from 'paperback-extensions-common'
import { CubariSource } from '../CubariSource'
  
  const MANGADEX_DOMAIN = 'https://mangadex.org'
  const MANGADEX_API = 'https://api.mangadex.org'
  
  export const MangaDexInfo: SourceInfo = {
    author: 'nar1n',
    description: 'Extension that pulls manga from MangaDex"',
    icon: 'icon.png',
    name: 'MangaDex',
    version: '1.0.0',
    authorWebsite: 'https://github.com/nar1n',
    websiteBaseURL: MANGADEX_DOMAIN,
    hentaiSource: false,
    language: LanguageCode.ENGLISH,
    sourceTags: [
      {
        text: 'Recommended',
        type: TagType.BLUE,
      },
      {
        text: "Notifications",
        type: TagType.GREEN
      }
    ],
  }
  
  export class MangaDex extends CubariSource {
  
    languageMapping: any = {
      'en': 'gb',
      'pt-br': 'pt',
      'ru': 'ru',
      'fr': 'fr',
      'es-la': 'es',
      'pl': 'pl',
      'tr': 'tr',
      'it': 'it',
      'es': 'es',
      'id': 'id',
      'vi': 'vn',
      'hu': 'hu',
      'zh': 'cn',
      // 'ar': '', // Arabic
      'de': 'de',
      'zh-hk': 'hk',
      // 'ca': '', // Catalan
      'th': 'th',
      'bg': 'bg',
      // 'fa': '', // Faroese
      'uk': 'ua',
      'mn': 'mn',
      // 'he': '', // Hebrew
      'ro': 'ro',
      'ms': 'my',
      // 'tl': '', // Tagalog
      'ja': 'jp',
      'ko': 'kr',
      // 'hi': '', // Hindi
      // 'my': '', // Malaysian
      'cs': 'cz',
      'pt': 'pt',
      'nl': 'nl',
      // 'sv': '', // Swedish
      // 'bn': '', // Bengali
      'no': 'no',
      'lt': 'lt',
      // 'sr': '', // Serbian
      'da': 'dk',
      'fi': 'fi',
    }
  
    getMangaShareUrl(mangaId: string): string {
      return `${MANGADEX_DOMAIN}/manga/${mangaId}`
    }

    getMangaUrl(slug: string): string {
        return `https://cubari.moe/read/mangadex/${slug}`;
      }
      getSourceDetails(): SourceInfo {
        return MangaDexInfo;
      }
  
    async getMangaUUIDs(numericIds: string[], type: string = 'manga'): Promise<{[id: string]: string}> {
      const length = numericIds.length
      let offset = 0
      const UUIDsDict:{[id: string]: string} = {}
  
      while (true) {
        const request = createRequestObject({
          url: `${MANGADEX_API}/legacy/mapping`,
          method: 'POST',
          headers: {'content-type': 'application/json'},
          data: {
            'type': 'manga',
            'ids': numericIds.slice(offset, offset + 500).map(x => Number(x))
          }
        })
        offset += 500
      
        const response = await this.requestManager.schedule(request, 1)
        const json = typeof response.data === "string" ? JSON.parse(response.data) : response.data
  
        for (const mapping of json) {
          UUIDsDict[mapping.data.attributes.legacyId] = mapping.data.attributes.newId
        }
  
        if (offset >= length) {
          break
        }
      }
  
      return UUIDsDict
    }
  
    async getAuthors(authorIds: string[]): Promise<{[id: string]: string}> {
      let url = `${MANGADEX_API}/author/?limit=100`
      let index = 0
      for (const author of authorIds) {
        url += `&ids[${index}]=${author}`
        index += 1
      }
  
      const request = createRequestObject({
        url,
        method: 'GET',
      })
  
      const response = await this.requestManager.schedule(request, 1)
      const json = typeof response.data === "string" ? JSON.parse(response.data) : response.data
  
      let authorsDict:{[id: string]: string} = {}
      for (const entry of json.results) {
        authorsDict[entry.data.id] = entry.data.attributes.name
      }
  
      return authorsDict
    }
  
    async getGroups(groupIds: string[]): Promise<{[id: string]: string}> {
      const length = groupIds.length
      let offset = 0
      let groupsDict:{[id: string]: string} = {}
  
      while (true) {
        let url = `${MANGADEX_API}/group/?limit=100&offset=${offset}`
        let index = 0
        for (const group of groupIds.slice(offset, offset + 100)) {
          url += `&ids[${index}]=${group}`
          index += 1
        }
        offset += 100
  
        const request = createRequestObject({
          url,
          method: 'GET',
        })
  
        const response = await this.requestManager.schedule(request, 1)
        const json = typeof response.data === "string" ? JSON.parse(response.data) : response.data
  
        for (const entry of json.results) {
          groupsDict[entry.data.id] = entry.data.attributes.name
        }
  
        if (offset >= length) {
          break
        }
      }
  
      return groupsDict
    }
  
    async getMDHNodeURL(chapterId: string): Promise<string> {
      const request = createRequestObject({
        url: `${MANGADEX_API}/at-home/server/${chapterId}`,
        method: 'GET',
      })
      
      const response = await this.requestManager.schedule(request, 1)
      const json = typeof response.data === "string" ? JSON.parse(response.data) : response.data
  
      return json.baseUrl
    }
  
    async getMangaDetails(mangaId: string): Promise<Manga> {
      let newMangaId: string
      if (!mangaId.includes('-')) {
        // Legacy Id
        const UUIDsDict = await this.getMangaUUIDs([mangaId])
        newMangaId = UUIDsDict[mangaId]
      } else {
        newMangaId = mangaId
      }
  
      const request = createRequestObject({
        url: `${MANGADEX_API}/manga/${newMangaId}`,
        method: 'GET',
      })
      
      const response = await this.requestManager.schedule(request, 1)
      const json = typeof response.data === "string" ? JSON.parse(response.data) : response.data
  
      const mangaDetails = json.data.attributes
      const titles = [mangaDetails.title[Object.keys(mangaDetails.title)[0]]].concat(mangaDetails.altTitles.map((x: any)  => this.decodeHTMLEntity(x[Object.keys(x)[0]])))
      const desc = this.decodeHTMLEntity(mangaDetails.description.en)
  
      let status = MangaStatus.COMPLETED
      if (mangaDetails.status == 'ongoing') {
        status = MangaStatus.ONGOING
      }
      const tags: Tag[] = []
      for (const tag of mangaDetails.tags) {
        const tagName: {[index: string]: string} = tag.attributes.name
        tags.push(createTag({
          id: tag.id,
          label: Object.keys(tagName).map(keys => tagName[keys])[0]
        }))
      }
      
      let author = json.relationships.filter((x: any) => x.type == 'author').map((x: any) => x.id)
      let artist = json.relationships.filter((x: any) => x.type == 'artist').map((x: any) => x.id)
  
      const authors = author.concat(artist)
      if (authors.length != 0) {
        const authorsDict = await this.getAuthors(authors)
        author = author.map((x: any) => this.decodeHTMLEntity(authorsDict[x])).join(', ')
        artist = artist.map((x: any) => this.decodeHTMLEntity(authorsDict[x])).join(', ')
      }
  
      return createManga({
        id: mangaId,
        titles,
        image: 'https://i.imgur.com/6TrIues.jpg',
        author,
        artist,
        desc,
        rating: 5,
        status,
        tags: [createTagSection({
          id: "tags",
          label: "Tags",
          tags: tags
        })]
      })
    }
  
    async getChapters(mangaId: string): Promise<Chapter[]> {
      let newMangaId: string
      if (!mangaId.includes('-')) {
        // Legacy Id
        const UUIDsDict = await this.getMangaUUIDs([mangaId])
        newMangaId = UUIDsDict[mangaId]
      } else {
        newMangaId = mangaId
      }
  
      let chaptersUnparsed: any[] = []
      let offset = 0
      let groupIds: string[] = []
  
      while (true) {
        const request = createRequestObject({
        url: `${MANGADEX_API}/manga/${newMangaId}/feed?limit=500&offset=${offset}`,
        method: 'GET',
        })
        const response = await this.requestManager.schedule(request, 1)
        const json = typeof response.data === "string" ? JSON.parse(response.data) : response.data
        offset += 500
  
        for (const chapter of json.results) {
          const chapterId = chapter.data.id
          const chapterDetails = chapter.data.attributes
          const name =  this.decodeHTMLEntity(chapterDetails.title)
          const chapNum = Number(chapterDetails?.chapter)
          const volume = Number(chapterDetails?.volume)
          let langCode: string = chapterDetails.translatedLanguage
          if (Object.keys(this.languageMapping).includes(langCode)) {
            langCode = this.languageMapping[chapterDetails.translatedLanguage]
          } else {
            langCode = '_unkown'
          }
  
          const time = new Date(chapterDetails.publishAt)
  
          let groups = chapter.relationships.filter((x: any) => x.type == 'scanlation_group').map((x: any) => x.id)
          for (const groupId of groups) {
            if (!groupIds.includes(groupId)) {
              groupIds.push(groupId)
            }
          }
  
          chaptersUnparsed.push({
            id: chapterId,
            mangaId: mangaId,
            name,
            chapNum,
            volume,
            langCode,
            groups,
            time
          })
        }
  
        if (json.total <= offset) {
          break
        }
      }
      const groupDict = await this.getGroups(groupIds)
      const chapters: Chapter[] = chaptersUnparsed.map((x: any) => {
        x.group = x.groups.map((x: any) => this.decodeHTMLEntity(groupDict[x])).join(', ') + ''
        delete x.groups
        return createChapter(x)
      })
  
      return chapters
    }
  
    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
      if (!chapterId.includes('-')) {
        // Numeric ID
        throw new Error('OLD ID: PLEASE REFRESH AND CLEAR ORPHANED CHAPTERS')
      }
  
      const serverUrl = await this.getMDHNodeURL(chapterId)
  
      const request = createRequestObject({
        url: `${MANGADEX_API}/chapter/${chapterId}`,
        method: 'GET',
      })
  
      const response = await this.requestManager.schedule(request, 1)
      const json = typeof response.data === "string" ? JSON.parse(response.data) : response.data
  
      const chapterDetails = json.data.attributes
      const pages = chapterDetails.data.map(
        (x: string) => `${serverUrl}/data/${chapterDetails.hash}/${x}`
      )
  
      return createChapterDetails({
        id: chapterId,
        mangaId: mangaId,
        pages,
        longStrip: false
      })
    }
  
    async searchRequest(query: SearchRequest, metadata: any): Promise<PagedResults> {
      let offset: number = metadata?.offset ?? 0
      let results: MangaTile[] = []
  
      const request = createRequestObject({
        url: `${MANGADEX_API}/manga?title=${encodeURIComponent(query.title ?? '')}&limit=100&offset=${offset}`,
        method: 'GET',
      })
  
      const response = await this.requestManager.schedule(request, 1)
      if (response.status != 200) {
        return createPagedResults({results})
      }
  
      const json = typeof response.data === "string" ? JSON.parse(response.data) : response.data
  
      for (const manga of json.results) {
        const mangaId = manga.data.id
        const mangaDetails = manga.data.attributes
        const title = this.decodeHTMLEntity(mangaDetails.title[Object.keys(mangaDetails.title)[0]])
  
        results.push(createMangaTile({
          id: mangaId,
          title: createIconText({text: title}),
          image: 'https://i.imgur.com/6TrIues.jpg'
        }))
      }
  
      return createPagedResults({
        results,
        metadata: {offset: offset + 100}
      })
    }
  
    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
      const sections = [
        {
          request: createRequestObject({
            url: `${MANGADEX_API}/manga?limit=20`,
            method: 'GET',
          }),
          section: createHomeSection({
            id: 'recently_updated',
            title: 'RECENTLY UPDATED TITLES',
            view_more: true,
          }),
        },
        {
          request: createRequestObject({
            url: `${MANGADEX_API}/manga?limit=20&publicationDemographic[0]=shounen`,
            method: 'GET',
          }),
          section: createHomeSection({
            id: 'shounen',
            title: 'UPDATED SHOUNEN TITLES',
            view_more: true,
          }),
        },
        {
          request: createRequestObject({
            url: `${MANGADEX_API}/manga?limit=20&includedTags[0]=391b0423-d847-456f-aff0-8b0cfc03066b`,
            method: 'GET',
          }),
          section: createHomeSection({
            id: 'action',
            title: 'UPDATED ACTION TITLES',
            view_more: true,
          }),
        }
      ]
      const promises: Promise<void>[] = []
  
      for (const section of sections) {
        // Let the app load empty sections
        sectionCallback(section.section)
  
        // Get the section data
        promises.push(
          this.requestManager.schedule(section.request, 1).then((response: { data: string }) => {
            const json = typeof response.data === "string" ? JSON.parse(response.data) : response.data
            let results = []
            for (const manga of json.results) {
              const mangaId = manga.data.id
              const mangaDetails = manga.data.attributes
              const title = this.decodeHTMLEntity(mangaDetails.title[Object.keys(mangaDetails.title)[0]])
  
              results.push(createMangaTile({
                id: mangaId,
                title: createIconText({text: title}),
                image: 'https://i.imgur.com/6TrIues.jpg'
              }))
            }
  
            section.section.items = results
            sectionCallback(section.section)
          }),
        )
      }
  
      // Make sure the function completes
      await Promise.all(promises)
    }
  
    async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults | null> {
      let offset: number = metadata?.offset ?? 0
      let collectedIds: string[] = metadata?.collectedIds ?? []
      let results = []
      let url: string = ''
  
      switch(homepageSectionId) {
        case 'recently_updated': {
          url = `${MANGADEX_API}/manga?limit=100&offset=${offset}`
          break
        }
        case 'shounen': {
          url = `${MANGADEX_API}/manga?limit=100&publicationDemographic[0]=shounen&offset=${offset}`
          break
        }
        case 'action': {
          url = `${MANGADEX_API}/manga?limit=100&includedTags[0]=391b0423-d847-456f-aff0-8b0cfc03066b&offset=${offset}`
          break
        }
      }
  
      const request = createRequestObject({
        url,
        method: 'GET',
      })
  
      const response = await this.requestManager.schedule(request, 1)
      const json = typeof response.data === "string" ? JSON.parse(response.data) : response.data
  
      for (const manga of json.results) {
        const mangaId = manga.data.id
        const mangaDetails = manga.data.attributes
        const title = this.decodeHTMLEntity(mangaDetails.title[Object.keys(mangaDetails.title)[0]])
  
        if (!collectedIds.includes(mangaId)) {
          results.push(createMangaTile({
            id: mangaId,
            title: createIconText({text: title}),
            image: 'https://i.imgur.com/6TrIues.jpg'
          }))
          collectedIds.push(mangaId)
        }
      }
  
      return createPagedResults({
        results,
        metadata: {offset: offset + 100, collectedIds}
    })
    }
  
    async filterUpdatedManga(mangaUpdatesFoundCallback: (updates: MangaUpdates) => void, time: Date, ids: string[]): Promise<void> {
      let legacyIds: string[] = ids.filter(x => !x.includes('-'))
      let conversionDict: {[id: string]: string} = {}
      if (legacyIds.length != 0 ) {
        conversionDict = await this.getMangaUUIDs(legacyIds)
        for (const key of Object.keys(conversionDict)) {
          conversionDict[conversionDict[key]] = key
        }
      }
  
      let offset = 0
      let loadNextPage = true
      let updatedManga: string[] = []
      while (loadNextPage) {
        const request = createRequestObject({
          url: `${MANGADEX_API}/manga?limit=100&offset=${offset}`,
          method: 'GET',
        })
  
        const response = await this.requestManager.schedule(request, 1)
  
        const json = typeof response.data === "string" ? JSON.parse(response.data) : response.data
  
        for (const manga of json.results) {
          const mangaId = manga.data.id
          const mangaTime = new Date(manga.data.attributes.updatedAt)
  
          if (mangaTime <= time) {
            loadNextPage = false
          } else if (ids.includes(mangaId)) {
            updatedManga.push(mangaId)
          } else if (ids.includes(conversionDict[mangaId])) {
            updatedManga.push(conversionDict[mangaId])
          }
        }
        if (loadNextPage) {
          offset = offset + 100
        }
      }
      if (updatedManga.length > 0) {
        mangaUpdatesFoundCallback(createMangaUpdates({
            ids: updatedManga
        }))
      }
    }
  
    decodeHTMLEntity(str: string): string {
          return str.replace(/&#(\d+);/g, function (match, dec) {
              return String.fromCharCode(dec);
          })
           .replace(/&amp;/g, '&')
           .replace(/&lt;/g, '<')
           .replace(/&gt;/g, '>')
           .replace(/&quot;/g, '\"')
           .replace(/&#039;/g, '\'');
      }
  }