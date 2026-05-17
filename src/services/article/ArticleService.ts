import { PrismaClient } from "@prisma/client";
import { imageBufferToFormat } from "../../utils";

const prisma = new PrismaClient();

// Interfaces para tipagem
export interface ICreateArticle {
  title: string;
  content: string;
  authorId: string;
  bannerBuffer?: Buffer;
}

export interface IUpdateArticle {
  id: string;
  userId: string;
  title?: string;
  content?: string;
  bannerBuffer?: Buffer;
}

export class ArticleService {
  // FUNÇÃO AUXILIAR: Geração de Slug
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  // FUNÇÃO AUXILIAR: Formatar o Artigo e a Imagem do Autor (Converter Buffer para Base64)
  private formatArticle = (article: any) => {
    if (!article) return null;

    // Converte o banner do artigo se ele existir
    const formattedBanner = imageBufferToFormat(article.banner);

    // Se o artigo incluiu dados do autor, precisamos formatar a foto dele também
    let formattedAuthor = article.author;
    if (article.author) {
      formattedAuthor = {
        ...article.author,
        profileImg: imageBufferToFormat(article.author.profileImg),
      };
    }

    return {
      ...article,
      banner: formattedBanner,
      author: formattedAuthor,
    };
  };

  // 1. CRIAR ARTIGO
  async createArticle({
    title,
    content,
    authorId,
    bannerBuffer,
  }: ICreateArticle) {
    const articleExists = await prisma.article.findUnique({ where: { title } });
    if (articleExists) {
      throw new Error("Já existe um artigo publicado com este título.");
    }

    const slug = this.generateSlug(title);
    const excerpt = content ? content.substring(0, 120) + "..." : "";
    const imageBytes = bannerBuffer ? Uint8Array.from(bannerBuffer) : undefined;

    const newArticle = await prisma.article.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        banner: imageBytes,
        authorId,
      },
    });

    return {
      message: "Artigo publicado com sucesso!",
      article: this.formatArticle(newArticle),
    };
  }

  // 2. EDITAR ARTIGO (Regra de Dono)
  async updateArticle({
    id,
    userId,
    title,
    content,
    bannerBuffer,
  }: IUpdateArticle) {
    const article = await prisma.article.findUnique({ where: { id } });

    if (!article) throw new Error("Artigo não encontrado.");

    if (article.authorId !== userId) {
      throw new Error(
        "Acesso negado: Você só pode editar os seus próprios artigos.",
      );
    }

    const dataUpdate: any = { content };

    if (title && title !== article.title) {
      const titleInUse = await prisma.article.findUnique({ where: { title } });
      if (titleInUse)
        throw new Error("Este título já está em uso por outro artigo.");

      dataUpdate.title = title;
      dataUpdate.slug = this.generateSlug(title);
    }

    if (content) dataUpdate.excerpt = content.substring(0, 120) + "...";
    if (bannerBuffer) dataUpdate.banner = Uint8Array.from(bannerBuffer);

    const updated = await prisma.article.update({
      where: { id },
      data: dataUpdate,
    });

    return {
      message: "Artigo atualizado com sucesso!",
      article: this.formatArticle(updated),
    };
  }

  // 3. DELETAR ARTIGO (Regra de Dono)
  async deleteArticle(id: string, userId: string) {
    const article = await prisma.article.findUnique({ where: { id } });

    if (!article) throw new Error("Artigo não encontrado.");

    if (article.authorId !== userId) {
      throw new Error(
        "Acesso negado: Você só pode excluir os seus próprios artigos.",
      );
    }

    await prisma.article.delete({ where: { id } });

    return { message: "Artigo removido com sucesso!" };
  }

  // 4. DESTAQUES E RECENTES (2 em 1)
  async getHighlightsAndRecent() {
    const highlights = await prisma.article.findMany({
      take: 4,
      orderBy: [{ views: "desc" }, { likes: "desc" }],
      include: { author: { select: { name: true, profileImg: true } } },
    });

    const recent = await prisma.article.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
      include: { author: { select: { name: true, profileImg: true } } },
    });

    return {
      destaques: highlights.map(this.formatArticle),
      recentes: recent.map(this.formatArticle),
    };
  }

  // 5. LISTAR TODOS OS ARTIGOS (Público)
  async getAllArticles() {
    const articles = await prisma.article.findMany({
      include: {
        author: { select: { name: true, email: true, profileImg: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return articles.map(this.formatArticle);
  }

  // 6. BUSCAR UM ARTIGO POR SLUG (Incrementa a view)
  async getArticleBySlug(slug: string) {
    const article = await prisma.article.update({
      where: { slug },
      data: { views: { increment: 1 } },
      include: { author: { select: { name: true, profileImg: true } } },
    });

    return this.formatArticle(article);
  }

  // 7. LISTAR ARTIGOS DE UM USUÁRIO ESPECÍFICO
  async getArticlesByUserId(userId: string) {
    const articles = await prisma.article.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: "desc" },
    });

    return articles.map(this.formatArticle);
  }

  // 8. BUSCAR UM ARTIGO POR ID
  async getArticleById(id: string) {
    const article = await prisma.article.findUnique({
      where: { id },
      include: { author: { select: { name: true, profileImg: true } } },
    });

    if (!article) throw new Error("Artigo não encontrado.");

    return this.formatArticle(article);
  }
}
