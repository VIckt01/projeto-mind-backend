import { PrismaClient } from "@prisma/client";
import { imageBufferToFormat } from "../../utils";

const prisma = new PrismaClient();

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

  // Formata o Artigo, convertendo os buffers binários de imagens (Banner, Autor e Comentaristas)
  private formatArticle = (article: any) => {
    if (!article) return null;

    const formattedBanner = imageBufferToFormat(article.banner);

    let formattedAuthor = article.author;
    if (article.author) {
      formattedAuthor = {
        ...article.author,
        profileImg: imageBufferToFormat(article.author.profileImg),
      };
    }

    let formattedComments = [];
    if (article.comments && article.comments.length > 0) {
      formattedComments = article.comments.map((comment: any) => ({
        ...comment,
        author: {
          ...comment.author,
          profileImg: imageBufferToFormat(comment.author.profileImg),
        },
      }));
    }

    return {
      ...article,
      banner: formattedBanner,
      author: formattedAuthor,
      comments: formattedComments,
    };
  };

  async createArticle({
    title,
    content,
    authorId,
    bannerBuffer,
  }: ICreateArticle) {
    const articleExists = await prisma.article.findUnique({ where: { title } });
    if (articleExists)
      throw new Error("Já existe um artigo publicado com este título.");

    const slug = this.generateSlug(title);
    const excerpt = content ? content.substring(0, 120) + "..." : "";
    const imageBytes = bannerBuffer ? Uint8Array.from(bannerBuffer) : undefined;

    const newArticle = await prisma.article.create({
      data: { title, slug, excerpt, content, banner: imageBytes, authorId },
    });

    return {
      message: "Artigo publicado com sucesso!",
      article: this.formatArticle(newArticle),
    };
  }

  async updateArticle({
    id,
    userId,
    title,
    content,
    bannerBuffer,
  }: IUpdateArticle) {
    const article = await prisma.article.findUnique({ where: { id } });
    if (!article) throw new Error("Artigo não encontrado.");
    if (article.authorId !== userId)
      throw new Error(
        "Acesso negado: Você só pode editar os seus próprios artigos.",
      );

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
      message: "Artigo updated com sucesso!",
      article: this.formatArticle(updated),
    };
  }

  async deleteArticle(id: string, userId: string) {
    const article = await prisma.article.findUnique({ where: { id } });
    if (!article) throw new Error("Artigo não encontrado.");
    if (article.authorId !== userId)
      throw new Error(
        "Acesso negado: Você só pode excluir os seus próprios artigos.",
      );

    await prisma.article.delete({ where: { id } });
    return { message: "Artigo removido com sucesso!" };
  }

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

  async getAllArticles() {
    const articles = await prisma.article.findMany({
      include: {
        author: { select: { name: true, email: true, profileImg: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return articles.map(this.formatArticle);
  }

  async getArticleBySlug(slug: string) {
    const article = await prisma.article.update({
      where: { slug },
      data: { views: { increment: 1 } },
      include: {
        author: { select: { name: true, profileImg: true } },
        // Injeção e ordenação dos comentários vinculados ao slug
        comments: {
          orderBy: { createdAt: "desc" },
          include: {
            author: { select: { id: true, name: true, profileImg: true } },
          },
        },
      },
    });
    return this.formatArticle(article);
  }

  async getArticlesByUserId(userId: string) {
    const articles = await prisma.article.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: "desc" },
    });
    return articles.map(this.formatArticle);
  }

  async getArticleById(id: string) {
    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        author: { select: { name: true, profileImg: true } },
        // Injeção e ordenação dos comentários vinculados ao ID
        comments: {
          orderBy: { createdAt: "desc" },
          include: {
            author: { select: { id: true, name: true, profileImg: true } },
          },
        },
      },
    });
    if (!article) throw new Error("Artigo não encontrado.");
    return this.formatArticle(article);
  }
}
